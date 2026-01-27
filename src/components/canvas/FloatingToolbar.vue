<template>
  <div class="floating-toolbar-container">
    <!-- Toolbar Block - расширяемый блок -->
    <div class="toolbar-block">
      <!-- Logo Button -->
      <button class="logo-button" @click="toggleMenu" title="Menu">
        <span class="logo-icon">📱</span>
      </button>

      <!-- Pinned Tools (расширяют блок) -->
      <div v-if="pinnedTools.length > 0" class="pinned-tools">
        <button
          v-for="tool in pinnedTools"
          :key="tool.id"
          class="tool-button"
          :title="tool.label"
          @click="tool.action"
        >
          {{ tool.icon }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useCanvasStore } from '@/stores/canvasStore'

const { toggleMenu } = useMenu()
const canvasStore = useCanvasStore()

// Закрепленные инструменты (для демонстрации)
const pinnedTools = ref([
  {
    id: 'semantics',
    icon: '🎨',
    label: 'Semantic Mode',
    action: () => canvasStore.toggleSemanticHighlight?.() || console.log('Toggle Semantics')
  },
  {
    id: 'grid',
    icon: '⊞',
    label: 'Grid',
    action: () => canvasStore.toggleGrid()
  },
  { id: 'undo', icon: '↶', label: 'Undo', action: () => console.log('Undo') },
  { id: 'redo', icon: '↷', label: 'Redo', action: () => console.log('Redo') }
])
</script>

<style scoped>
/* Container - плавающий внутри canvas */
.floating-toolbar-container {
  position: absolute;
  top: 6px;
  left: var(--spacing-md);
  z-index: 100;
}

/* Toolbar Block - расширяемый блок */
.toolbar-block {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: #1e1e1e; /* Темный цвет */
  border: 1px solid #3e3e3e;
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: all var(--transition-base);
}

/* Logo Button - квадрат */
.logo-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-accent);
  border-radius: var(--radius-md);
  font-size: 20px;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.logo-button:hover {
  background-color: var(--color-accent-hover);
  transform: scale(1.05);
}

.logo-button:active {
  transform: scale(0.95);
}

/* Pinned Tools - появляются справа от логотипа */
.pinned-tools {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  padding-left: var(--spacing-xs);
  border-left: 1px solid var(--color-border);
}

.tool-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 18px;
  transition: all var(--transition-fast);
  color: #e0e0e0;
}

.tool-button:hover {
  background-color: #2d2d2d;
}

/* Все стили меню удалены - теперь используется общий BurgerMenu */
</style>

