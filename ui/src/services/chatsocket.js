// TODO: dial with 403 and other HTTP errors

export class ChatSocketService {
    newMessageCallback = null;
    messageReadCallback = null;
    startedTypingCallback = null;
    stoppedTypingCallback = null;
    memberJoinedCallback = null;
    memberBecameAwayCallback = null;
    memberLeftCallback = null;

    newMessageTraceCallback = null;
    startedTypingTraceCallback = null;
    stoppedTypingTraceCallback = null;

    socketConnectedCallback = null;
    socketDisconnectedCallback = null;
    socketErrorCallback = null;

    socket = null;

    pingHandler = null;

    connect(chatSocketUrl, token) {
        if (chatSocketUrl == null) {
            return;
        }

        // the simplest possible authentication via 'Sec-WebSocket-Protocol' field
        this.socket = new WebSocket(chatSocketUrl, token);

        this.socket.onopen = () => {
            console.log('Chat socket connected');

            if (this.socketConnectedCallback) {
                this.socketConnectedCallback();
            }

            this.pingHandler = setInterval(() => {
                if (!this.checkSocket()) {
                    this.stopPinging();
                }

                this.socket.send('{"_type":"UpstreamPing"}');
            }, 30000);
        };

        this.socket.onclose = (event) => {
            this.stopPinging();

            if (event.wasClean) {
                console.log('Chat socket disconnected');
            } else {
                console.error('Chat socket terminated, code=' + event.code + ', reason: ' + event.reason);
            }

            if (this.socketDisconnectedCallback) {
                this.socketDisconnectedCallback();
            }
        };

        this.socket.onmessage = (message) => {
            const payload = JSON.parse(message.data);
            switch (payload['_type']) {
                case 'DownstreamNewMessage':
                    console.log('Received DownstreamNewMessage', payload);
                    if (this.newMessageCallback) {
                        this.newMessageCallback({
                            messageId: payload.messageId,
                            senderId: payload.senderId,
                            message: payload.message,
                            sentAt: payload.timestamp
                        });
                    }
                    break;

                case 'DownstreamMessageRead':
                    console.log('Received DownstreamMessageRead', payload);
                    if (this.messageReadCallback) {
                        this.messageReadCallback({
                            messageId: payload.messageId,
                            recipientId: payload.recipientId,
                            readAt: payload.timestamp,
                        })
                    }
                    break;

                case 'DownstreamStartedTyping':
                    console.log('Received DownstreamStartedTyping', payload);
                    if (this.startedTypingCallback) {
                        this.startedTypingCallback({
                            memberId: payload.memberId
                        });
                    }
                    break;

                case 'DownstreamStoppedTyping':
                    console.log('Received DownstreamStoppedTyping', payload);
                    if (this.stoppedTypingCallback) {
                        this.stoppedTypingCallback({
                            memberId: payload.memberId
                        });
                    }
                    break;

                case 'DownstreamMemberJoined':
                    console.log('Received DownstreamMemberJoined', payload);
                    if (this.memberJoinedCallback) {
                        this.memberJoinedCallback({
                            memberId: payload.memberId,
                            nickname: payload.nickname,
                            onlineSince: payload.onlineSince
                        });
                    }
                    break;

                case 'DownstreamMemberIsAway':
                    console.log('Received DownstreamMemberIsAway', payload);
                    if (this.memberBecameAwayCallback) {
                        this.memberBecameAwayCallback({
                            memberId: payload.memberId,
                        });
                    }
                    break;

                case 'DownstreamMemberLeft':
                    console.log('Received DownstreamMemberLeft', payload);
                    if (this.memberLeftCallback) {
                        this.memberLeftCallback({
                            memberId: payload.memberId,
                        });
                    }
                    break;

                case 'DownstreamNewMessageTrace':
                    console.log('Received DownstreamNewMessageTrace', payload);
                    if (this.newMessageTraceCallback) {
                        this.newMessageTraceCallback({
                            senderId: payload.senderId,
                            recipientId: payload.recipientId
                        });
                    }
                    break;

                case 'DownstreamStartedTypingTrace':
                    console.log('Received DownstreamStartedTypingTrace', payload);
                    if (this.startedTypingTraceCallback) {
                        this.startedTypingTraceCallback({
                            senderId: payload.senderId,
                            recipientId: payload.recipientId
                        });
                    }
                    break;

                case 'DownstreamStoppedTypingTrace':
                    console.log('Received DownstreamStoppedTypingTrace', payload);
                    if (this.stoppedTypingCallback) {
                        this.stoppedTypingCallback({
                            senderId: payload.senderId,
                            recipientId: payload.recipientId
                        });
                    }
                    break;

                case 'DownstreamPong':
                    // do nothing, it's keep-alive thing
                    break;

                default:
                    console.warn('Could not identify message', payload);
            }
        };

        this.socket.onerror = (error) => {
            this.stopPinging();

            console.error("Chat socket error", error);
            if (this.socketErrorCallback) {
                this.socketErrorCallback(error);
            }
        };
    }

    disconnect() {
        this.socket.close();

        console.log('Chat socket disconnected');
    }

    sendMessage({messageId, recipientId, message}) {
        if (!this.checkSocket()) {
            return;
        }

        const payload = {
            _type: 'UpstreamNewMessage',
            messageId,
            recipientId,
            message
        };

        console.log('Sending UpstreamNewMessage', payload);
        this.socket.send(JSON.stringify(payload));
    }

    confirmMessageRead(messageId, senderId) {
        if (!this.checkSocket()) {
            return;
        }

        const payload = {
            _type: 'UpstreamMessageRead',
            messageId,
            senderId
        };

        console.log('Sending UpstreamNewMessage', payload);
        this.socket.send(JSON.stringify(payload));
    }

    notifyMemberStartedTyping(memberId) {
        if (!this.checkSocket()) {
            return;
        }

        const payload = {
            _type: 'UpstreamStartedTyping',
            memberId
        };

        console.log('Sending UpstreamStartedTyping', payload);
        this.socket.send(JSON.stringify(payload));
    }

    notifyMemberStoppedTyping(memberId) {
        if (!this.checkSocket()) {
            return;
        }

        const payload = {
            _type: 'UpstreamStoppedTyping',
            memberId
        };

        console.log('Sending UpstreamStoppedTyping', payload);
        this.socket.send(JSON.stringify(payload));
    }

    checkSocket() {
        if (!this.socket || this.socket.readyState !== 1) {
            // TODO notify user
            console.error("Web socket is not opened");
            return false;
        }
        return true;
    }

    stopPinging() {
        if (this.pingHandler) {
            clearInterval(this.pingHandler);
            this.pingHandler = null;
        }
    }

    onNewMessage(callback) {
        this.newMessageCallback = callback;
        return this;
    }

    onMessageRead(callback) {
        this.messageReadCallback = callback;
        return this;
    }

    onStartedTyping(callback) {
        this.startedTypingCallback = callback;
        return this;
    }

    onStoppedTyping(callback) {
        this.stoppedTypingCallback = callback;
        return this;
    }

    onMemberJoined(callback) {
        this.memberJoinedCallback = callback;
        return this;
    }

    onMemberBecameAway(callback) {
        this.memberBecameAwayCallback = callback;
        return this;
    }

    onMemberLeft(callback) {
        this.memberLeftCallback = callback;
        return this;
    }

    onNewMessageTrace(callback) {
        this.newMessageTraceCallback = callback;
        return this;
    }

    onStartedTypingTrace(callback) {
        this.startedTypingTraceCallback = callback;
        return this;
    }

    onStoppedTypingTrace(callback) {
        this.stoppedTypingTraceCallback = callback;
        return this;
    }

    onSocketConnected(callback) {
        this.socketConnectedCallback = callback;
        return this;
    }

    onSocketDisconnected(callback) {
        this.socketDisconnectedCallback = callback;
        return this;
    }

    onSocketError(callback) {
        this.socketErrorCallback = callback;
        return this;
    }
}
