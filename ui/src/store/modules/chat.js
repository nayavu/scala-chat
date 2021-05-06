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
            // A map of userId => Member,
            // {
            //    "1" : { userId: "1", nickname: 'Member1', onlineSince: 123456 }
            // }
            members: {},

            // Member actions map
            // { "userId": "typing" }
            memberActions: {},

            // Map of userId => list of Messages
            // {
            //   "1": [{
            //     messageId: "1",
            //     senderId: "1",
            //     recipientId: "9",
            //     message: "hello",
            //     timestamp: 12345677890,
            //     delivered: true
            //   }]
            // }

            messages: {},
            connected: false
        };
    },

    mutations: {
        // -- messages

        // RECEIVE_MESSAGE is used by websocket plugin to receive chat messages
        RECEIVE_MESSAGE(state, payload) {
            // expected payload:
            // {"messageId": "2", "senderId": "999", "recipientId": "1", "message": "aaa", "timestamp":"12345678", "delivered": true}
            const userId = payload.senderId;
            if (!state.messages[userId]) {
                state.messages[userId] = [];
            }
            state.messages[userId].push(payload);
        },

        // ADD_MESSAGE is used by the UI to append chat messages. Also it is listened by websocket plugin
        ADD_MESSAGE(state, payload) {
            // expected payload:
            // {"messageId": "2", "senderId": "999", "recipientId": "1", "message": "aaa", "timestamp":"12345678"}
            const userId = payload.recipientId;
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

        // -- members

        SET_MEMBERS(state, payload) {
            state.members = payload;
        },

        UPDATE_MEMBER(state, payload) {
            state.members[payload.userId] = payload;
        },

        SET_MEMBER_ACTION(state, payload) {
            state.memberActions[payload.userId] = payload.action;
        },

        // -- socket state

        SET_CONNECTED_STATE(state, payload) {
            state.connected = payload;
        },

    },

    getters: {
        members(state) {
            return state.members;
        },
        memberActions(state) {
            return state.memberActions;
        },
        messages(state) {
            return state.messages;
        },
        connected(state) {
            return state.connected
        }
    },

    actions: {
        // -- members
        async loadMembers(context) {
            const token = context.rootGetters['auth/token'];
            const membersList = await chatService.loadMembers(token);
            const members = membersList.reduce((map, item) => { map[item.userId] = item; return map }, {});
            context.commit('SET_MEMBERS', members);
        },

        updateMember(context, payload) {
            // payload is expected to be a member object
            context.commit('UPDATE_MEMBER', payload);
        },

        memberStartedTyping(context, payload) {
            context.commit('SET_MEMBER_ACTION', { userId: payload.userId, action: 'typing' });
        },

        memberStoppedTyping(context, payload) {
            context.commit('SET_MEMBER_ACTION', { userId: payload.userId, action: null });
        },

        // -- messages

        receiveMessage(context, payload) {
            context.commit('RECEIVE_MESSAGE', payload);
            context.commit('SET_MEMBER_ACTION', { userId: payload.senderId, action: null });
        },

        addMessage(context, payload) {
            const messagePayload = {
                ...payload,
                messageId: Date.now().toString() + window.performance.now(), // quite stupid way of generating unique id
                timestamp: Date.now()
            }

            context.commit('ADD_MESSAGE', messagePayload);
        },

        confirmDelivery(context, payload) {
            context.commit('CONFIRM_DELIVERY', payload);
        },

        // -- socket state

        setSocketConnected(context) {
            context.commit('SET_CONNECTED_STATE', true);
        },

        setSocketDisconnected(context) {
            const wasConnected = context.state.connected;
            context.commit('SET_CONNECTED_STATE', false);

            if (wasConnected) {
                // seems like server shut down
                context.commit('SET_NOTIFICATION', { message: 'Server connection lost', level: 'error' }, { root: true });
            } else {
                // normally disconnected or not previously connected
                context.commit('SET_NOTIFICATION', null, { root: true });
            }
        },

        // -- misc

        notifyMemberStartedTyping(_, payload) {
            // it has nothing to do with store, it just wraps service call (for code consistency)
            chatService.notifyMemberStartedTyping(payload.senderId, payload.recipientId);
        },

        notifyMemberStoppedTyping(_, payload) {
            // it has nothing to do with store, it just wraps service call (for code consistency)
            chatService.notifyMemberStoppedTyping(payload.senderId, payload.recipientId);
        },

        socketError(context) {
            if (!context.state.connected) {
                context.dispatch('auth/logout', null, { root: true });
                // looks like there was no successful connection attempt (maybe invalid session?)

                // TODO there might be more edge cases, think of them
            }
        }
    }
};
