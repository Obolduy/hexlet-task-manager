<script setup lang="ts">
import TaskScreen from './components/TaskScreen.vue'
</script>

<template>
  <main class="app">
    <h1>Задачи</h1>
    <TaskScreen />
  </main>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}
</style>
