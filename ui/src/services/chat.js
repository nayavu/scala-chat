const API_BASE_URL = '/api/members';

// TODO: dial with 403 and other HTTP errors

export class ChatService {
    newMessageCallback = null;
    messageDeliveredCallback = null;
    memberStateChangedCallback = null;
    connectedCallback = null;
    disconnectedCallback = null;

    socket = null;

    connect(chatSocketUrl, token) {
        if (chatSocketUrl == null) {
            return;
        }
        // the simplest possible authentication via 'Sec-WebSocket-Protocol' field
        // TODO: implement via the first message
        this.socket = new WebSocket(chatSocketUrl, token);

        this.socket.onopen = () => {
            console.log('Chat socket connected');

            if (this.connectedCallback) {
                this.connectedCallback();
            }
        };

        this.socket.onclose = (event) => {
            if (event.wasClean) {
                console.log('Chat socket disconnected');
            } else {
                console.error('Chat socket terminated, code=' + event.code + ', reason: ' + event.reason);
            }

            if (this.disconnectedCallback) {
                this.disconnectedCallback();
            }
        };

        this.socket.onmessage = (message) => {
            const payload = JSON.parse(message.data);
            switch (payload.type) {
                case 'NEW_MESSAGE':
                    console.log('Received NEW_MESSAGE', payload.data);
                    if (this.newMessageCallback) {
                        this.newMessageCallback({
                            messageId: payload.data.messageId,
                            senderId: payload.data.senderId,
                            recipientId: payload.data.recipientId,
                            message: payload.data.message,
                            timestamp: payload.data.timestamp,
                            delivered: payload.data.delivered,
                        });
                    }
                    break;

                case 'MESSAGE_DELIVERED':
                    console.log('Received MESSAGE_DELIVERED', payload.data);
                    if (this.messageDeliveredCallback) {
                        this.messageDeliveredCallback({
                            messageId: payload.data.messageId,
                            recipientId: payload.data.recipientId,
                            timestamp: payload.data.timestamp,
                        })
                    }
                    break;

                case 'MEMBER_CONNECTED':
                    console.log('Received MEMBER_CONNECTED', payload.data);
                    if (this.memberStateChangedCallback) {
                        this.memberStateChangedCallback({
                            userId: payload.data.userId,
                            nickname: payload.data.nickname,
                            onlineSince: payload.data.onlineSince,
                        });
                    }
                    break;

                case 'MEMBER_DISCONNECTED':
                    console.log('Received MEMBER_DISCONNECTED', + payload.data);
                    if (this.memberStateChangedCallback) {
                        this.memberStateChangedCallback({
                            userId: payload.data.userId,
                            nickname: payload.data.nickname,
                            onlineSince: null,
                        });
                    }
                    break;

                case 'MEMBER_STARTED_TYPING':
                    console.log('Received MEMBER_STARTED_TYPING', payload.data);
                    break;

                case 'MEMBER_STOPPED_TYPING':
                    console.log('Received MEMBER_STOPPED_TYPING', payload.data);
                    break;

                default:
                    console.warn('Could not identify message', payload);
            }
        };

        this.socket.onerror = (error) => {
            console.error("Chat socket failed: " + error.message);
        };
    }

    disconnect() {
        this.socket.close();

        console.log('Chat socket disconnected');
    }

    loadMembers(token) {
        console.log('Loading chat members list');

        return fetch(API_BASE_URL,
            {
                headers: {
                    'Authorization': token
                }
            }
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json()
                        .then((res) => {
                            throw new Error(res.message || 'Server communication failed');
                        });
                }
                return response.json();
            })

        // Test data
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve([
        //             {
        //                 userId: "1",
        //                 nickname: 'Member1',
        //                 onlineSince: Date.parse('2021-04-04T00:00:00Z')
        //             },
        //             {
        //                 userId: "2",
        //                 nickname: 'Member2',
        //                 onlineSince: null
        //             },
        //             {
        //                 userId: "3",
        //                 nickname: 'Member3',
        //                 onlineSince: Date.parse('2021-05-04T00:00:00Z')
        //             },
        //         ]);
        //     }, 1000);
        // });
    }

    sendMessage(message) {
        console.log(`Sending message from ${message.senderId} to ${message.recipientId}`);

        if (this.checkSocket()) {
            this.socket.send(JSON.stringify({
                type: 'SEND_MESSAGE',
                data: {
                    messageId: message.messageId,
                    senderId: message.senderId,
                    recipientId: message.recipientId,
                    message: message.message
                }
            }));
        }
    }

    notifyMemberStartedTyping(senderId, recipientId) {
        console.log(`Member ${senderId} started typing to ${recipientId}`);

        if (this.checkSocket()) {
            console.log('Sending MEMBER_STARTED_TYPING')
            this.socket.send(JSON.stringify({
                type: 'MEMBER_STARTED_TYPING',
                data: {
                    senderId: senderId,
                    recipientId: recipientId
                }
            }));
        }
    }

    notifyMemberStoppedTyping(senderId, recipientId) {
        console.log(`Member ${senderId} stopped typing to ${recipientId}`);

        if (this.checkSocket()) {
            this.socket.send(JSON.stringify({
                type: 'MEMBER_STOPPED_TYPING',
                data: {
                    senderId: senderId,
                    recipientId: recipientId
                }
            }));
        }
    }

    checkSocket() {
        if (!this.socket || this.socket.readyState !== 1) {
            // TODO notify user
            console.error("Web socket is not opened");
            return false;
        }
        return true;
    }

    onNewMessage(callback) {
        this.newMessageCallback = callback;
        return this;
    }

    onMessageDelivered(callback) {
        this.messageDeliveredCallback = callback;
        return this;
    }

    onMemberStateChanged(callback) {
        this.memberStateChangedCallback = callback;
        return this;
    }

    onConnected(callback) {
        this.connectedCallback = callback;
        return this;
    }

    onDisconnected(callback) {
        this.disconnectedCallback = callback;
        return this;
    }
}
