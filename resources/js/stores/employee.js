import { defineStore } from 'pinia'
import api from '../api/axios'

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        employees: [],
        meta: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchEmployees(page = 1) {
            this.loading = true
            try {
                const response = await api.get(`/employees?page=${page}`)
                this.employees = response.data.data
                this.meta = response.data.meta
            } catch (e) {
                this.error = 'Failed to fetch employees.'
            } finally {
                this.loading = false
            }
        },

        async createEmployee(data) {
            const response = await api.post('/employees', data)
            return response.data
        },

        async updateEmployee(id, data) {
            const response = await api.put(`/employees/${id}`, data)
            return response.data
        },

        async deleteEmployee(id) {
            await api.delete(`/employees/${id}`)
        },
    },
});