<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Task, User } from '../api/types'
import { fetchTask, TaskNotFoundError } from '../api/tasks'
import { fetchUsers } from '../api/users'
import StatusBadge from './StatusBadge.vue'
import { onLinkClick } from '../router'

const props = defineProps<{ id: number }>()

const task = ref<Task | null>(null)
const users = ref<User[]>([])
const isLoading = ref(true)
const isNotFound = ref(false)
const error = ref<string | null>(null)

const assigneeNameById = computed<Record<number, string>>(() =>
  Object.fromEntries(users.value.map((user) => [user.id, user.name]))
)

const assigneeName = computed<string | null>(() => {
  if (task.value === null || task.value.assigneeId === null) return null
  return assigneeNameById.value[task.value.assigneeId] ?? null
})

onMounted(async () => {
  try {
    const [loadedTask, loadedUsers] = await Promise.all([fetchTask(props.id), fetchUsers()])
    task.value = loadedTask
    users.value = loadedUsers
  } catch (err) {
    if (err instanceof TaskNotFoundError) {
      isNotFound.value = true
    } else {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить данные'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <p v-if="isLoading">Загрузка…</p>
  <template v-else-if="isNotFound">
    <p>Задача не найдена</p>
    <a href="/" @click="onLinkClick($event, '/')">Назад к списку</a>
  </template>
  <template v-else-if="error">
    <p>{{ error }}</p>
    <a href="/" @click="onLinkClick($event, '/')">Назад к списку</a>
  </template>
  <template v-else-if="task">
    <h1>{{ task.title }}</h1>
    <StatusBadge :status="task.status" />
    <p>{{ task.description ?? 'Без описания' }}</p>
    <p>{{ assigneeName ?? 'Без исполнителя' }}</p>
    <p>Создана: {{ task.createdAt }}</p>
    <p>Обновлена: {{ task.updatedAt }}</p>
    <a href="/" @click="onLinkClick($event, '/')">Назад к списку</a>
  </template>
</template>
