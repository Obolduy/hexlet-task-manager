<script setup lang="ts">
import { computed } from 'vue'
import TaskScreen from './components/TaskScreen.vue'
import TaskDetailScreen from './components/TaskDetailScreen.vue'
import { currentRoute } from './router'

const taskId = computed(() => (currentRoute.value.name === 'task-detail' ? currentRoute.value.id : null))
</script>

<template>
  <main class="app">
    <TaskScreen v-if="taskId === null" />
    <TaskDetailScreen v-else :id="taskId!" />
  </main>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}
</style>
