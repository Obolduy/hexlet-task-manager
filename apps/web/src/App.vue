<script setup lang="ts">
import TaskScreen from './components/TaskScreen.vue'
import TaskDetailScreen from './components/TaskDetailScreen.vue'
import { currentRoute } from './router'
</script>

<template>
  <main class="app">
    <TaskScreen v-if="currentRoute.name === 'list'" />
    <TaskDetailScreen v-else :id="currentRoute.id" />
  </main>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}
</style>
