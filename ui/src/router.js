import { createRouter, createWebHistory } from "vue-router";
import MemberLogin from "./components/auth/MemberLogin";
import ChatBox from "./components/chat/ChatBox";
import MessagesVisualization from "./components/visualization/MessagesVisualization";
import store from "@/store";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: MemberLogin, meta: { requiresNotLoggedIn: true } },
        { path: '/chat', component: ChatBox, meta: { requiresLoggedIn: true } },
        { path: '/visualization', component: MessagesVisualization, meta: { requiresLoggedIn: true } }
    ]
});

router.beforeEach(function(to, _, next) {
    if (to.meta.requiresLoggedIn && !store.getters['chat/isAuthenticated']) {
        next('/login');
    } else if (to.meta.requiresNotLoggedIn && store.getters['chat/isAuthenticated']) {
        next('/chat');
    } else {
        next();
    }
})

export default router
