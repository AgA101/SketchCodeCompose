<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <AppLayout />
    <Toast />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import Toast from '@/components/common/Toast.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAutoSave } from '@/composables/useAutoSave'
import { useKeyboard } from '@/composables/useKeyboard'

const projectStore = useProjectStore()
const settingsStore = useSettingsStore()
const isDarkMode = computed(() => settingsStore.theme === 'dark')

onMounted(() => {
  // Загружаем настройки
  settingsStore.load()
  
  // Создаем новый проект при первом запуске
  if (!projectStore.project) {
    projectStore.createNewProject('My First Project')
  }
  
  // Инициализируем автосохранение и горячие клавиши
  useAutoSave()
  useKeyboard()
})
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>

