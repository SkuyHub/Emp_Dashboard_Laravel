import { defineStore } from 'pinia'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(credentials) {
            const response = await api.post('/login', credentials);
            this.token = response.data.access_token;
            this.user = response.data.user;
            localStorage.setItem('token', this.token);
        },

        async logout() {
            try {
                await api.post('/logout');
            } finally {
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
            }
        },

        async fetchUser() {
            const response = await api.get('/me');
            this.user = response.data;
        },
    },
});