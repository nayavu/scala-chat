import { createStore } from "vuex";
import { chatStore } from "@/store/modules/chat";
import { chatServicePlugin } from "@/store/plugins/chatservice";
import { messagesStore } from "@/store/modules/messages";
import { membersStore } from "@/store/modules/members";
import { visualizationStore } from "@/store/modules/visualization";

const store = createStore({
    modules: {
        chat: chatStore,
        messages: messagesStore,
        members: membersStore,
        visualization: visualizationStore
    },
    plugins: [chatServicePlugin],
});

export default store;
