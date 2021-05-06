function findMessageIndex(state, memberId, messageId) {
    if (!state.messages[memberId]) {
        console.warn(`No conversation with ${memberId}`);
        return null;
    }

    // search from the tail of the array
    // this method is mainly used to set read flag of the message (most likely the last message in the array)
    for (let i = state.messages[memberId].length - 1; i >=0; i--) {
        if (state.messages[memberId][i].messageId === messageId) {
            return i;
        }
    }
    console.warn(`No message with id=${messageId} in conversation with ${memberId}`);
    return null;
}

export const messagesStore = {
    namespaced: true,

    state() {
        return {
            // Map of memberId => list of Messages
            // {
            //   "1": [{
            //     messageId: "1",
            //     senderId: "1",
            //     recipientId: "9",
            //     message: "hello",
            //     sentAt: 12345677890,
            //     readAt: null
            //   }]
            // }
            messages: {},

            // Map of memberId => idx of the last read (by current member) message
            lastReadMessage: {},
        };
    },

    mutations: {
        RECEIVE_MESSAGE(state, { messageId, senderId, recipientId, message, sentAt, readAt }) {
            if (!state.messages[senderId]) {
                state.messages[senderId] = [];
            }
            state.messages[senderId].push({messageId, senderId, recipientId, message, sentAt, readAt, isOur: false});
        },

        ADD_MESSAGE(state, { messageId, senderId, recipientId, message, sentAt, readAt }) {
            if (!state.messages[recipientId]) {
                state.messages[recipientId] = [];
            }
            state.messages[recipientId].push({messageId, senderId, recipientId, message, sentAt, readAt, isOur: true});
        },

        MARK_SENT_MESSAGE_AS_READ(state, { messageId, recipientId, readAt }) {
            const messageIdx = findMessageIndex(state, recipientId, messageId);
            if (messageIdx == null) {
                return;
            }

            state.messages[recipientId][messageIdx].readAt = readAt;
        },

        MARK_RECEIVED_MESSAGE_AS_READ(state, { messageId, senderId }) {
            const messageIdx = findMessageIndex(state, senderId, messageId);
            if (messageIdx == null) {
                return;
            }

            state.messages[senderId][messageIdx].readAt = Date.now()

            state.lastReadMessage[senderId] = messageIdx;
        }
    },

    getters: {
        messages: (state) => (memberId) => {
            return state.messages[memberId];
        },
        lastReadMessage: (state) => (memberId) => {
            return state.lastReadMessage[memberId];
        }
    },

    actions: {
        receiveMessage(context, {messageId, senderId, message, sentAt}) {
            const recipientId = context.rootGetters['chat/memberId'];

            context.commit('RECEIVE_MESSAGE', {
                messageId,
                senderId,
                recipientId,
                message,
                sentAt,
                readAt: null
            });
        },

        addMessage(context, {recipientId, message}) {
            const senderId = context.rootGetters['chat/memberId'];

            context.commit('ADD_MESSAGE', {
                messageId: senderId + '-' + recipientId + '-' + Date.now().toString(), // quite stupid way of generating unique id,
                senderId,
                recipientId,
                message,
                sentAt: Date.now(),
                readAt: null
            });
        },

        markSentMessageAsRead(context, {messageId, recipientId, readAt}) {
            context.commit('MARK_SENT_MESSAGE_AS_READ', {messageId, recipientId, readAt});
        },

        markReceivedMessageAsRead(context, {messageId, senderId}) {
            context.commit('MARK_RECEIVED_MESSAGE_AS_READ', {messageId, senderId});
        },
    }
};
