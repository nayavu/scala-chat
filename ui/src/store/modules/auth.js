import { authService } from "@/services";

export const authStore = {
    namespaced: true,

    state() {
        return {
            userId: null,
            nickname: null,
            onlineSince: null
        };
    },

    mutations: {
        setUserDetails(state, payload) {
            state.userId = payload?.userId;
            state.nickname = payload?.nickname;
            state.onlineSince = payload?.onlineSince;
        }
    },

    actions: {
        async logout(context) {
            console.log('Logging out');

            await authService.logout();
            context.commit('setUserDetails', null);
        },

        async login(context, payload) {
            const username = payload.username;
            console.log(`Logging in as ${username}`);

            const user = await authService.login(username);
            context.commit('setUserDetails', user);
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
        }
    }
};
