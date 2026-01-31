<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <AppLayout />
    <Toast />
    <BurgerMenu />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import Toast from '@/components/common/Toast.vue'
import BurgerMenu from '@/components/common/BurgerMenu.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { useAutoSave } from '@/composables/useAutoSave'
import { useKeyboard } from '@/composables/useKeyboard'

const projectStore = useProjectStore()
const settingsStore = useSettingsStore()
const selectionStore = useSelectionStore()
const canvasStore = useCanvasStore()
const isDarkMode = computed(() => settingsStore.theme === 'dark')

// Инициализируем горячие клавиши (на верхнем уровне setup!)
const keyboard = useKeyboard()

onMounted(() => {
  // Загружаем настройки
  settingsStore.load()
  
  // Создаем новый проект при первом запуске
  if (!projectStore.project) {
    projectStore.createNewProject('My First Project')
    
    // НЕ добавляем тестовые элементы - пользователь создаст их сам через "+"
  }
  
  // Инициализируем автосохранение
  useAutoSave()
  
  // Регистрируем горячие клавиши
  setupHotkeys()
})

// Настройка горячих клавиш
function setupHotkeys() {
  
  // Сохранение проекта
  keyboard.register('ctrl+s', () => {
    projectStore.save()
  })
  
  // Инструменты
  keyboard.register('v', () => {
    canvasStore.setTool('select')
  })
  
  keyboard.register('h', () => {
    canvasStore.setTool('hand')
  })
  
  keyboard.register('z', () => {
    canvasStore.setTool('zoom')
  })
  
  keyboard.register('ctrl+n', () => {
    canvasStore.setTool('block') // Новый объединённый инструмент
  })
  
  keyboard.register('escape', () => {
    canvasStore.setTool('select')
  })
  
  // Удаление выделенных элементов (работает в режиме Select)
  keyboard.register('delete', () => {
    const selected = selectionStore.selectedIds
    if (selected.length > 0) {
      selected.forEach(id => projectStore.deleteElement(id))
      selectionStore.deselect()
    }
  })
  
  keyboard.register('backspace', () => {
    const selected = selectionStore.selectedIds
    if (selected.length > 0) {
      selected.forEach(id => projectStore.deleteElement(id))
      selectionStore.deselect()
    }
  })
  
  // Grid (без Ctrl, чтобы избежать конфликтов с браузером)
  keyboard.register('g', () => {
    canvasStore.toggleGrid()
  })
  
  keyboard.register('shift+g', () => {
    canvasStore.toggleSnapToGrid()
  })
  
  // Pan со стрелочками (работает в любом режиме)
  keyboard.register('arrowup', () => {
    canvasStore.panBy(0, 50) // Двигаем вверх
  })
  
  keyboard.register('arrowdown', () => {
    canvasStore.panBy(0, -50) // Двигаем вниз
  })
  
  keyboard.register('arrowleft', () => {
    canvasStore.panBy(50, 0) // Двигаем влево
  })
  
  keyboard.register('arrowright', () => {
    canvasStore.panBy(-50, 0) // Двигаем вправо
  })
  
  // Undo/Redo (заглушки)
  keyboard.register('ctrl+z', () => {
    console.log('Undo (TODO)')
  })
  
  keyboard.register('ctrl+shift+z', () => {
    console.log('Redo (TODO)')
  })
}
</script>

<style>
@import '@/assets/styles/main.css';

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>

