import { createRouter, createWebHistory } from "vue-router";
import UserLogin from "./components/auth/UserLogin";
import ChatBox from "./components/chat/ChatBox";
import MessagesVisualization from "./components/visualization/MessagesVisualization";
import store from "@/store";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: UserLogin, meta: { requiresNotLoggedIn: true } },
        { path: '/chat', component: ChatBox, meta: { requiresLoggedIn: true } },
        { path: '/visualization', component: MessagesVisualization, meta: { requiresLoggedIn: true } }
    ]
});

router.beforeEach(function(to, _, next) {
    if (to.meta.requiresLoggedIn && !store.getters['auth/isAuthenticated']) {
        next('/login');
    } else if (to.meta.requiresNotLoggedIn && store.getters['auth/isAuthenticated']) {
        next('/chat');
    } else {
        next();
    }
})

export default router
