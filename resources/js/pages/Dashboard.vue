<template>
    <div class="min-h-screen bg-gray-50">

        <!-- Navbar -->
        <nav class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
            <h1 class="text-lg font-semibold text-gray-800">Employee Dashboard</h1>
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500">{{ auth.user?.name }}</span>
                <button
                    @click="handleLogout"
                    class="text-sm text-red-500 hover:text-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </nav>

        <!-- Main content -->
        <div class="p-6">

            <!-- Header row -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-700">Employees</h2>
                <button
                    @click="openCreateModal"
                    class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Add Employee
                </button>
            </div>

            <!-- Loading -->
            <div v-if="store.loading" class="text-center py-12 text-gray-400">
                Loading...
            </div>

            <!-- Table -->
            <div v-else class="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th class="px-6 py-3">Name</th>
                            <th class="px-6 py-3">Email</th>
                            <th class="px-6 py-3">Position</th>
                            <th class="px-6 py-3">Department</th>
                            <th class="px-6 py-3">Status</th>
                            <th class="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="employee in store.employees"
                            :key="employee.id"
                            class="hover:bg-gray-50 transition"
                        >
                            <td class="px-6 py-4 font-medium text-gray-800">
                                {{ employee.name }}
                            </td>
                            <td class="px-6 py-4 text-gray-500">{{ employee.email }}</td>
                            <td class="px-6 py-4 text-gray-500">{{ employee.position }}</td>
                            <td class="px-6 py-4 text-gray-500">{{ employee.department }}</td>
                            <td class="px-6 py-4">
                                <span
                                    :class="employee.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'"
                                    class="px-2 py-1 rounded-full text-xs font-medium"
                                >
                                    {{ employee.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 flex gap-2">
                                <button
                                    @click="openEditModal(employee)"
                                    class="text-blue-500 hover:text-blue-700 transition text-xs font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="confirmDelete(employee)"
                                    class="text-red-500 hover:text-red-700 transition text-xs font-medium"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Empty state -->
                <div v-if="store.employees.length === 0" class="text-center py-12 text-gray-400">
                    No employees found.
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="store.meta" class="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>
                    Showing {{ store.meta.from }}–{{ store.meta.to }} of {{ store.meta.total }}
                </span>
                <div class="flex gap-2">
                    <button
                        v-for="page in store.meta.last_page"
                        :key="page"
                        @click="store.fetchEmployees(page)"
                        :class="page === store.meta.current_page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'"
                        class="px-3 py-1 rounded-lg border transition"
                    >
                        {{ page }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Create / Edit Modal -->
        <div
            v-if="showModal"
            class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            @click.self="closeModal"
        >
            <div class="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    {{ isEditing ? 'Edit Employee' : 'Add Employee' }}
                </h3>

                <form @submit.prevent="handleSubmit" class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
                            <input
                                v-model="form.name"
                                type="text"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
                            <input
                                v-model="form.email"
                                type="email"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                            <input
                                v-model="form.phone"
                                type="text"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Position</label>
                            <input
                                v-model="form.position"
                                type="text"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Department</label>
                            <input
                                v-model="form.department"
                                type="text"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Salary</label>
                            <input
                                v-model="form.salary"
                                type="number"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Hire Date</label>
                            <input
                                v-model="form.hired_at"
                                type="date"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
                            <select
                                v-model="form.status"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <p v-if="formError" class="text-red-500 text-xs">{{ formError }}</p>

                    <div class="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            @click="closeModal"
                            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="submitting"
                            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {{ submitting ? 'Saving...' : isEditing ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
            v-if="showDeleteModal"
            class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            @click.self="showDeleteModal = false"
        >
            <div class="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 text-center">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Delete Employee</h3>
                <p class="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete
                    <span class="font-medium text-gray-700">{{ selectedEmployee?.name }}</span>?
                    This cannot be undone.
                </p>
                <div class="flex justify-center gap-3">
                    <button
                        @click="showDeleteModal = false"
                        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        @click="handleDelete"
                        :disabled="submitting"
                        class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {{ submitting ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useEmployeeStore } from '../stores/employee'

const router = useRouter()
const auth = useAuthStore()
const store = useEmployeeStore()

// Modal state
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedEmployee = ref(null)
const submitting = ref(false)
const formError = ref(null)

// Form state
const emptyForm = {
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    hired_at: '',
    status: 'active',
}
const form = ref({ ...emptyForm })

onMounted(async () => {
    if (!auth.user) await auth.fetchUser()
    await store.fetchEmployees()
})

function openCreateModal() {
    isEditing.value = false
    form.value = { ...emptyForm }
    formError.value = null
    showModal.value = true
}

function openEditModal(employee) {
    isEditing.value = true
    selectedEmployee.value = employee
    form.value = {
        name: employee.name,
        email: employee.email,
        phone: employee.phone ?? '',
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        hired_at: employee.hired_at,
        status: employee.status,
    }
    formError.value = null
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    selectedEmployee.value = null
}

function confirmDelete(employee) {
    selectedEmployee.value = employee
    showDeleteModal.value = true
}

async function handleSubmit() {
    submitting.value = true
    formError.value = null
    try {
        if (isEditing.value) {
            await store.updateEmployee(selectedEmployee.value.id, form.value)
        } else {
            await store.createEmployee(form.value)
        }
        closeModal()
        await store.fetchEmployees(store.meta?.current_page ?? 1)
    } catch (e) {
        formError.value = e.response?.data?.message || 'Something went wrong.'
    } finally {
        submitting.value = false
    }
}

async function handleDelete() {
    submitting.value = true
    try {
        await store.deleteEmployee(selectedEmployee.value.id)
        showDeleteModal.value = false
        selectedEmployee.value = null
        await store.fetchEmployees(store.meta?.current_page ?? 1)
    } catch (e) {
        showDeleteModal.value = false
    } finally {
        submitting.value = false
    }
}

async function handleLogout() {
    await auth.logout()
    router.push({ name: 'Login' })
}
</script>