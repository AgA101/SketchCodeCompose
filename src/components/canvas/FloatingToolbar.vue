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

    <!-- Burger Menu (выезжает слева) -->
    <transition name="slide">
      <div v-if="showMenu" class="burger-menu-overlay" @click="closeMenu">
        <div class="burger-menu" @click.stop>
          <div class="menu-header">
            <h2>SketchCodeCompose</h2>
            <button class="close-button" @click="closeMenu">×</button>
          </div>

          <div class="menu-content">
            <div class="menu-section">
              <h3>📁 File</h3>
              <button class="menu-item" @click="handleMenuAction('new')">New Project</button>
              <button class="menu-item" @click="handleMenuAction('open')">Open...</button>
              <button class="menu-item" @click="handleMenuAction('export')">Export...</button>
            </div>

            <div class="menu-section">
              <h3>✏️ Edit</h3>
              <button class="menu-item">
                <span>Undo</span>
                <span class="shortcut">Ctrl+Z</span>
              </button>
              <button class="menu-item">
                <span>Redo</span>
                <span class="shortcut">Ctrl+Shift+Z</span>
              </button>
            </div>

            <div class="menu-section">
              <h3>👁️ View</h3>
              <button class="menu-item" @click="handleMenuAction('toggleGrid')">
                <span>Show Grid</span>
                <span class="shortcut">Ctrl+G</span>
              </button>
              <button class="menu-item" @click="handleMenuAction('toggleSemantics')">
                <span>Semantic Mode</span>
                <span class="shortcut">Ctrl+M</span>
              </button>
            </div>

            <div class="menu-section">
              <h3>📌 Customize Toolbar</h3>
              <p class="menu-hint">Pin tools to quick access</p>
              <!-- TODO: список инструментов для закрепления -->
            </div>
          </div>

          <div class="menu-footer">
            <div class="save-status">
              <span class="status-icon">✓</span>
              <span>Auto-save enabled</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'

const canvasStore = useCanvasStore()
const showMenu = ref(false)

// Закрепленные инструменты (для демонстрации)
const pinnedTools = ref([
  {
    id: 'semantics',
    icon: '🎨',
    label: 'Semantic Mode',
    action: () => handleMenuAction('toggleSemantics')
  },
  { id: 'grid', icon: '⊞', label: 'Grid', action: () => handleMenuAction('toggleGrid') },
  { id: 'undo', icon: '↶', label: 'Undo', action: () => console.log('Undo') },
  { id: 'redo', icon: '↷', label: 'Redo', action: () => console.log('Redo') }
])

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}

function handleMenuAction(action) {
  console.log('Menu action:', action)

  switch (action) {
    case 'toggleGrid':
      canvasStore.toggleGrid()
      break
    case 'toggleSemantics':
      canvasStore.toggleSemanticHighlight()
      break
    default:
      console.log('Action not implemented:', action)
  }

  closeMenu()
}
</script>

<style scoped>
/* Container - плавающий внутри canvas */
.floating-toolbar-container {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 100;
}

/* Toolbar Block - расширяемый блок */
.toolbar-block {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-md);
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

.logo-icon {
  filter: brightness(0) invert(1);
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
}

.tool-button:hover {
  background-color: var(--color-bg-secondary);
}

/* Burger Menu Overlay */
.burger-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: stretch;
}

/* Burger Menu - выезжает слева */
.burger-menu {
  width: 320px;
  height: 100vh;
  background-color: var(--color-bg-tertiary);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Menu Header */
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.menu-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 24px;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.close-button:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

/* Menu Content */
.menu-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.menu-section {
  margin-bottom: var(--spacing-lg);
}

.menu-section h3 {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-primary);
  text-align: left;
  transition: background-color var(--transition-fast);
  margin-bottom: var(--spacing-xs);
}

.menu-item:hover {
  background-color: var(--color-bg-secondary);
}

.shortcut {
  font-size: 12px;
  color: var(--color-text-tertiary);
  background-color: var(--color-bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.menu-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
}

/* Menu Footer */
.menu-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.save-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.status-icon {
  color: var(--color-success);
}

/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: opacity var(--transition-base);
}

.slide-enter-active .burger-menu,
.slide-leave-active .burger-menu {
  transition: transform var(--transition-base);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .burger-menu {
  transform: translateX(-100%);
}

.slide-leave-to .burger-menu {
  transform: translateX(-100%);
}
</style>

