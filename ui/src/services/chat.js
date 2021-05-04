import { checkResponse } from "@/services/utils";

// TODO
const API_URL = 'http://localhost:8080/api';
const WEBSOCKET_URL = 'ws://localhost:8080/ws';

export class ChatService {
    newMessageCallback = null;
    messageDeliveredCallback = null;
    updateMemberCallback = null;
    connectedCallback = null;
    disconnectedCallback = null;

    socket = null;

    connect() {
        this.socket = new WebSocket(WEBSOCKET_URL);

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

        this.socket.onmessage = (data) => {
            console.log("Socket data received: " + data);

            const payload = JSON.parse(data);
            switch (payload.type) {
                case 'NEW_MESSAGE':
                    console.log('Received NEW_MESSAGE: ' + payload.data);
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

                case 'MEMBER_CONNECTED':
                    console.log('Received MEMBER_CONNECTED: ' + payload.data);
                    if (this.updateMemberCallback) {
                        this.updateMemberCallback({
                            userId: payload.data.userId,
                            nickname: payload.data.nickname,
                            onlineSince: payload.data.onlineSince,
                        });
                    }
                    break;

                case 'MEMBER_DISCONNECTED':
                    console.log('Received MEMBER_DISCONNECTED: ' + payload.data);
                    if (this.updateMemberCallback) {
                        this.updateMemberCallback({
                            userId: payload.data.userId,
                            nickname: payload.data.nickname,
                            onlineSince: null,
                        });
                    }
                    break;

                case 'MEMBER_STARTED_TYPING':
                    console.log('Received MEMBER_STARTED_TYPING: ' + payload.data);
                    break;

                case 'MEMBER_STOPPED_TYPING':
                    console.log('Received MEMBER_STOPPED_TYPING: ' + payload.data);
                    break;

                default:
                    console.warn('Could not identify message: ' + payload);
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

    loadMembers() {
        console.log('Loading chat members list');

        return fetch(API_URL + '/chat/members')
            .then((response) => {
                return checkResponse(response);
            })
            .json();

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

    loadMessages() {
        console.log('Loading messages for the current user');

        return fetch(API_URL + '/chat/messages')
            .then((response) => {
                return checkResponse(response);
            })
            .json();

        // Test data
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve(
        //             {
        //                 "1": [
        //                     {
        //                         "messageId": "1",
        //                         "senderId": "1",
        //                         "recipientId": "9",
        //                         "message": "hello",
        //                         "timestamp": Date.parse('2021-04-04T00:00:00Z'),
        //                         "delivered": true
        //                     },
        //                     {
        //                         "messageId": "2",
        //                         "senderId": "9",
        //                         "recipientId": "1",
        //                         "message": "hello back",
        //                         "timestamp": Date.parse('2021-04-04T01:00:00Z'),
        //                         "delivered": true
        //                     },
        //                     {
        //                         "messageId": "4",
        //                         "senderId": "9",
        //                         "recipientId": "1",
        //                         "message": "hello back [2]",
        //                         "timestamp": Date.parse('2021-04-04T01:00:00Z'),
        //                         "delivered": false
        //                     }
        //                 ],
        //                 "2": [
        //                     {
        //                         "messageId": "3",
        //                         "senderId": "9",
        //                         "recipientId": "2",
        //                         "message": "hello!1111",
        //                         "timestamp": Date.parse('2021-05-04T00:00:00Z'),
        //                         "delivered": true
        //                     },
        //                 ]
        //             }
        //         );
        //     }, 1000);
        // });
    }

    sendMessage(message) {
        console.log(`Sending message ${message}`);

        if (this.socket) {
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

        if (this.socket) {
            this.socket.send(JSON.stringify({
                type: 'MEMBER_STARTED_TYPING',
                data: {
                    senderId: senderId,
                    recipientId: recipientId
                }
            }));
        }
    }

    notifyMemberStopperTyping(senderId, recipientId) {
        console.log(`Member ${senderId} stopped typing to ${recipientId}`);

        if (this.socket) {
            this.socket.send(JSON.stringify({
                type: 'MEMBER_STOPPED_TYPING',
                data: {
                    senderId: senderId,
                    recipientId: recipientId
                }
            }));
        }
    }

    onNewMessage(callback) {
        this.newMessageCallback = callback;
        return this;
    }

    onMessageDelivered(callback) {
        this.messageDeliveredCallback = callback;
        return this;
    }

    onUpdateMember(callback) {
        this.updateMemberCallback = callback;
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
