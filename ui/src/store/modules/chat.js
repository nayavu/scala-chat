import { memberService, chatSocketService } from "@/services";

export const chatStore = {
    namespaced: true,

    state() {
        return {
            memberId: null,
            nickname: null,
            chatSocketUrl: null,
            sessionToken: null,

            connected: false,

            notification: {
                text: null,
                level: null
            }
        };
    },

    mutations: {
        SET_SESSION(state, payload) {
            state.memberId = payload?.member?.memberId;
            state.nickname = payload?.member?.nickname;
            state.sessionToken = payload?.sessionToken;
            state.chatSocketUrl = payload?.chatSocketUrl;
        },

        SET_CONNECTED(state, connected) {
            state.connected = connected;
        },

        SET_NOTIFICATION(state, payload) {
            state.notification = payload;
        }
    },

    actions: {
        async loadSession(context) {
            const memberId = localStorage.getItem('memberId');
            const nickname = localStorage.getItem('nickname');
            const sessionToken = localStorage.getItem('sessionToken');
            const chatSocketUrl = localStorage.getItem('chatSocketUrl');

            if (!memberId || !nickname || !sessionToken || !chatSocketUrl) {
                if (memberId || nickname || sessionToken || chatSocketUrl) {
                    await context.dispatch('clearSession');
                }
                return null;
            }

            context.commit('SET_SESSION', {
                member: { memberId, nickname },
                sessionToken,
                chatSocketUrl
            });

            chatSocketService.connect(context.state.chatSocketUrl, context.state.sessionToken);
            // TODO
            // there might be a case when session sessionToken is invalid
            // while establishing a WebSocket connection with it, there will be a lot of error messages in console
        },

        clearSession() {
            localStorage.removeItem('memberId');
            localStorage.removeItem('nickname');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('chatSocketUrl');
        },

        async join(context, payload) {
            const nickname = payload.nickname;
            console.log(`Joining the chat as ${nickname}`);

            const session = await memberService.join(nickname);
            context.commit('SET_SESSION', session);

            chatSocketService.connect(context.state.chatSocketUrl, context.state.sessionToken);

            localStorage.setItem('memberId', context.state.memberId);
            localStorage.setItem('nickname', context.state.nickname);
            localStorage.setItem('sessionToken', context.state.sessionToken);
            localStorage.setItem('chatSocketUrl', context.state.chatSocketUrl);
        },

        async leave(context) {
            console.log('Leaving the chat');

            chatSocketService.disconnect();
            await memberService.leave(context.state.sessionToken);

            context.commit('SET_SESSION', null);
            await context.dispatch('clearSession');
        },

        setSocketConnected(context) {
            context.commit('SET_CONNECTED', true);
        },

        setSocketDisconnected(context) {
            const wasConnected = context.state.connected;
            context.commit('SET_CONNECTED', false);

            if (wasConnected) {
                // seems like server shut down
                context.commit('SET_NOTIFICATION', { text: 'Server connection lost', level: 'error' });
            } else {
                // normally disconnected or not previously connected
                context.commit('SET_NOTIFICATION', null);
            }
        },

        setSocketError(context) {
            if (!context.state.connected) {
                context.dispatch('leave', null);
                // looks like there was no successful connection attempt (maybe invalid session?)

                // TODO there might be more edge cases, think of them
            }
        },

        notifyMemberStartedTyping(_, recipientId) {
            chatSocketService.notifyMemberStartedTyping(recipientId);
        },

        notifyMemberStoppedTyping(_, recipientId) {
            // it has nothing to do with store, it just wraps service call (for code consistency)
            chatSocketService.notifyMemberStoppedTyping(recipientId);
        },
    },

    getters: {
        isAuthenticated(state) {
            return !!state.sessionToken;
        },

        memberId(state) {
            return state.memberId;
        },

        nickname(state) {
            return state.nickname;
        },

        sessionToken(state) {
            return state.sessionToken;
        },

        connected(state) {
            return state.connected;
        }
    }
};
