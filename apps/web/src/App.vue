<script setup lang="ts">
import TaskScreen from './components/TaskScreen.vue'
</script>

<template>
  <main class="app">
    <header class="app__header">
      <h1 class="app__title">Задачи</h1>
    </header>
    <TaskScreen />
  </main>
</template>

<style scoped>
.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}
.app__header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--ink);
}
.app__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
</style>
