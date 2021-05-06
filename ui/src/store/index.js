import { createStore } from "vuex";
import { authStore } from "@/store/modules/auth";
import { chatStore } from "@/store/modules/chat";
import { chatServicePlugin } from "@/store/plugins/chatservice";

const store = createStore({
    modules: {
        auth: authStore,
        chat: chatStore
    },
    plugins: [chatServicePlugin],

    // global things

    state: {
        notification: null
    },
    mutations: {
        SET_NOTIFICATION(state, payload) {
            state.notification = payload
        }
    },
    getters: {
        notification(state) {
            return state.notification;
        }
    },
    actions: {
        setNotification(context, payload) {
            context.commit('SET_NOTIFICATION', payload);
        }
    }
});

export default store;
