import { authService, chatService } from "@/services";

export const authStore = {
    namespaced: true,

    state() {
        return {
            userId: null,
            nickname: null,
            chatSocketUrl: null,
            token: null
        };
    },

    mutations: {
        SET_SESSION(state, payload) {
            state.userId = payload?.member?.userId;
            state.nickname = payload?.member?.nickname;
            state.token = payload?.token;
            state.chatSocketUrl = payload?.chatSocketUrl;
        }
    },

    actions: {

        async loadSession(context) {
            const userId = localStorage.getItem('userId');
            const nickname = localStorage.getItem('nickname');
            const token = localStorage.getItem('token');
            const chatSocketUrl = localStorage.getItem('chatSocketUrl');

            if (!userId || !nickname || !token || !chatSocketUrl) {
                if (userId || nickname || token || chatSocketUrl) {
                    await context.dispatch('clearSession');
                }
                return null;
            }

            context.commit('SET_SESSION', {
                member: { userId, nickname },
                token,
                chatSocketUrl
            });

            chatService.connect(context.state.chatSocketUrl, context.state.token);
            // TODO
            // there might be a case when session token is invalid
            // while establishing a WebSocket connection with it, there will be a lot of error messages in console - deal with it
        },

        clearSession() {
            localStorage.removeItem('userId');
            localStorage.removeItem('nickname');
            localStorage.removeItem('token');
            localStorage.removeItem('chatSocketUrl');
        },

        async logout(context) {
            console.log('Logging out');

            chatService.disconnect();
            await authService.logout(context.state.token);
            console.log('cleaing session');
            context.commit('SET_SESSION', null);
            await context.dispatch('clearSession');


        },

        async login(context, payload) {
            const username = payload.username;
            console.log(`Logging in as ${username}`);

            const session = await authService.login(username);
            context.commit('SET_SESSION', session);

            chatService.connect(context.state.chatSocketUrl, context.state.token);

            localStorage.setItem('userId', context.state.userId);
            localStorage.setItem('nickname', context.state.nickname);
            localStorage.setItem('token', context.state.token);
            localStorage.setItem('chatSocketUrl', context.state.chatSocketUrl);
        }
    },

    getters: {
        isAuthenticated(state) {
            return !!state.userId;
        },

        userId(state) {
            return state.userId;
        },

        nickname(state) {
            return state.nickname;
        },

        token(state) {
            return state.token;
        }
    }
};
