import { authService, chatService } from "@/services";

export const authStore = {
    namespaced: true,

    state() {
        return {
            userId: null,
            nickname: null,
            onlineSince: null,
            chatSocketUrl: null,
            token: null
        };
    },

    mutations: {
        setUserDetails(state, payload) {
            state.userId = payload?.member?.userId;
            state.nickname = payload?.member?.nickname;
            state.onlineSince = payload?.member?.onlineSince;
            state.token = payload?.token;
            state.chatSocketUrl = payload?.chatSocketUrl;
        }
    },

    actions: {
        async logout(context) {
            console.log('Logging out');

            chatService.disconnect();
            await authService.logout(context.state.token);
            context.commit('setUserDetails', null);
        },

        async login(context, payload) {
            const username = payload.username;
            console.log(`Logging in as ${username}`);

            const user = await authService.login(username);
            context.commit('setUserDetails', user);

            chatService.connect(context.state.chatSocketUrl, context.state.token);
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
