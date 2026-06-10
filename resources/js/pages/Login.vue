<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
            <h1 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Employee Dashboard
            </h1>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        v-model="form.password"
                        type="password"
                        required
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>

                <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {{ loading ? 'Signing in...' : 'Sign in' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ email: '', password: '' })
const error = ref(null)
const loading = ref(false)

async function handleLogin() {
    error.value = null
    loading.value = true
    try {
        await auth.login(form.value)
        router.push({ name: 'Dashboard' })
    } catch (e) {
        error.value = e.response?.data?.message || 'Login failed. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>