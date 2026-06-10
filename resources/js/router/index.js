import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "../stores/auth";

import login from '../pages/Login.vue'
import dashboard from '../pages/Dashboard.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: login,
        meta: { requiresGuest: true },
    },
    {
        path: '/',
        name: 'Dashboard',
        component: dashboard,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.meta.requiresGuest && auth.isAuthenticated) {
        next({ name: 'Dashboard' });
    } else {
        next();
    }
});

export default router
