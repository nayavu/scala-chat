import { createStore } from "vuex";
import { authStore } from "@/store/modules/auth";
import { chatStore } from "@/store/modules/chat";
import { chatServicePlugin } from "@/store/plugins/chatservice";

const store = createStore({
    modules: {
        auth: authStore,
        chat: chatStore
    },
    plugins: [chatServicePlugin]
});

export default store;
