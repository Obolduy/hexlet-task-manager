<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Task, TaskStatus, User } from '../api/types'
import { fetchTasks } from '../api/tasks'
import { fetchUsers } from '../api/users'
import TaskFilters from './TaskFilters.vue'
import TaskList from './TaskList.vue'

const tasks = ref<Task[]>([])
const users = ref<User[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const statusFilter = ref<TaskStatus | null>(null)
const assigneeFilter = ref<number | null>(null)

const assigneeNameById = computed<Record<number, string>>(() =>
  Object.fromEntries(users.value.map((user) => [user.id, user.name]))
)

async function loadTasks() {
  try {
    tasks.value = await fetchTasks({ status: statusFilter.value, assigneeId: assigneeFilter.value })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить данные'
  }
}

onMounted(async () => {
  try {
    const [loadedTasks, loadedUsers] = await Promise.all([
      fetchTasks({ status: statusFilter.value, assigneeId: assigneeFilter.value }),
      fetchUsers(),
    ])
    tasks.value = loadedTasks
    users.value = loadedUsers
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить данные'
  } finally {
    isLoading.value = false
  }
})

watch([statusFilter, assigneeFilter], loadTasks)
</script>

<template>
  <p v-if="isLoading">Загрузка…</p>
  <p v-else-if="error">{{ error }}</p>
  <template v-else>
    <TaskFilters
      :users="users"
      :status="statusFilter"
      :assignee-id="assigneeFilter"
      @update:status="statusFilter = $event"
      @update:assignee-id="assigneeFilter = $event"
    />
    <TaskList :tasks="tasks" :assignee-name-by-id="assigneeNameById" />
  </template>
</template>
