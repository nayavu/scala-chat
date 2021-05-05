import { chatService } from "@/services";

function findMessageIndex(state, userId, messageId) {
    if (!state.messages[userId]) {
        console.warn(`No conversation with ${userId}`);
        return null;
    }

    // search from the tail of the array
    // this method is mainly used to confirm delivery of the message which is most likely the last message in the array
    for (let i = state.messages[userId].length - 1; i >=0; i--) {
        if (state.messages[userId][i].messageId === messageId) {
            return i;
        }
    }
    console.warn(`No message with id=${messageId} in conversation with ${userId}`);
    return null;
}

export const chatStore = {
    namespaced: true,

    state() {
        return {
            // A list of members,
            // [{ userId: "1", nickname: 'Member1', onlineSince: 123456 }]
            membersList: [],

            // Map of userId => list of Messages
            // {
            //   "1": [{
            //     "messageId": "1",
            //     "senderId": "1",
            //     "recipientId": "9",
            //     "message": "hello",
            //     "timestamp": 12345677890,
            //     "delivered": true
            //   }]
            // }

            messages: {},
            connected: false
        };
    },

    mutations: {
        // -- messages

        SET_MESSAGES(state, payload) {
            state.messages = payload;
        },

        // RECEIVE_MESSAGE is used by websocket plugin to receive chat messages
        RECEIVE_MESSAGE(state, payload) {
            // expected payload:
            // {"userId": "1", "messageId": "2", "senderId": "999", "recipientId": "1", "message": "aaa", "timestamp":"12345678", "delivered": true}
            const userId = payload.userId;
            if (!state.messages[userId]) {
                state.messages[userId] = [];
            }
            state.messages[userId].push(payload);
        },

        // ADD_MESSAGE is used by the UI to append chat messages. Also it is listened by websocket plugin
        ADD_MESSAGE(state, payload) {
            // expected payload:
            // {"userId": "1", "messageId": "2", "senderId": "999", "recipientId": "1", "message": "aaa", "timestamp":"12345678"}
            const userId = payload.userId;
            if (!state.messages[userId]) {
                state.messages[userId] = [];
            }
            state.messages[userId].push({ ...payload, delivered: false });
        },

        CONFIRM_DELIVERY(state, payload) {
            // expected payload: {"recipientId": "1", "messageId": "2", "timestamp": "123424563"}
            const userId = payload.recipientId;
            const messageIdx = findMessageIndex(state, userId, payload.messageId);
            if (messageIdx == null) {
                return;
            }
            state.messages[userId][messageIdx].delivered = true;
            state.messages[userId][messageIdx].timestamp = payload.timestamp;
        },

        DELETE_MESSAGE(state, payload) {
            // expected payload:
            // {"userId": "1", "messageId": "2"}
            const userId = payload.userId;
            const messageIdx = findMessageIndex(state, userId, payload.messageId);
            if (messageIdx == null) {
                return;
            }
            state.messages[userId].splice(messageIdx, 1);
        },

        // -- members

        SET_MEMBERS(state, payload) {
            state.membersList = payload;
        },

        UPDATE_MEMBER(state, payload) {
            // TODO use map for members
            const memberIdx = state.members.findIndex((member) => member.userId === payload.userId);
            if (memberIdx == null) {
                console.warn(`Unabled to find member with userId=${payload.userId}`);
            }
            state.members[memberIdx] = payload;
        },

        // -- socket state

        SET_CONNECTED(state, payload) {
            state.connected = payload;
        },

    },

    getters: {
        membersList(state) {
            return state.membersList;
        },
        messages(state) {
            return state.messages;
        }
    },

    actions: {
        // -- members
        async loadMembers(context) {
            const members = await chatService.loadMembers();
            context.commit('SET_MEMBERS', members);
        },

        updateMember(context, payload) {
            // payload is expected to be member object
            context.commit('UPDATE_MEMBER', payload);
        },

        // -- messages

        async loadMessages(context) {
            const messages = await chatService.loadMessages();
            context.commit('SET_MESSAGES', messages);
        },

        receiveMessage(context, payload) {
            context.commit('RECEIVE_MESSAGE', payload);
        },

        addMessage(context, payload) {
            const messagePayload = {
                ...payload,
                messageId: Date.now().toString() + window.performance.now(), // quite stupid way of generating unique id
                timestamp: Date.now()
            }

            context.commit('ADD_MESSAGE', messagePayload);
        },

        deleteMessage(context, payload) {
            context.commit('DELETE_MESSAGE', payload);
        },

        confirmDelivery(context, payload) {
            context.commit('CONFIRM_DELIVERY', payload);
        },

        // -- socket state

        setSocketConnected(context) {
            context.commit('SET_CONNECTED', true);
        },

        setSocketDisconnected(context) {
            context.commit('SET_CONNECTED', false);
        },

        // -- misc

        notifyMemberStartedTyping(_, payload) {
            // it has nothing to do with store, it just wraps service call (for code consistency)
            chatService.notifyMemberStartedTyping(payload.senderId, payload.recipientId);
        },

        notifyMemberStopperTyping(_, payload) {
            // it has nothing to do with store, it just wraps service call (for code consistency)
            chatService.notifyMemberStopperTyping(payload.senderId, payload.recipientId);
        },
    }
};
