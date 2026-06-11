import { defineStore } from 'pinia'
import api from '../api/axios'

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        employees: [],
        meta: null,
        loading: false,
        error: null,
        search: '',
        sortBy: 'created_at',
        sortDir: 'desc',
    }),

    actions: {
        async fetchEmployees(page = 1) {
            this.loading = true
            try {
                const response = await api.get('/employees', {
                    params: {
                        page,
                        search: this.search || undefined,
                        sort_by: this.sortBy,
                        sort_dir: this.sortDir,
                    }
                })
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

        setSearch(value) {
            this.search = value
            this.fetchEmployees(1)
        },

        setSort(field) {
            if (this.sortBy === field) {
                this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
            } else {
                this.sortBy = field
                this.sortDir = 'asc'
            }
            this.fetchEmployees(1)
        },
    },
});