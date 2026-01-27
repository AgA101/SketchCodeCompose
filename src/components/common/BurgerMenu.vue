<template>
  <!-- Burger Menu (единственный экземпляр) -->
  <transition name="slide">
    <div v-if="isMenuOpen" class="burger-menu-overlay" @click="closeMenu">
      <div class="burger-menu" @click.stop>
        <div class="menu-header" @click="closeMenu">
          <h2>SketchCodeCompose</h2>
          <span class="close-button">×</span>
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
            <h3>🖥️ Layout Mode</h3>
            <button
              v-for="preset in presets"
              :key="preset.id"
              class="menu-item"
              :class="{ 'menu-item--active': isActivePreset(preset.id) }"
              @click="selectPreset(preset.id)"
            >
              <span class="menu-item__icon">{{ preset.icon }}</span>
              <span>{{ preset.name }}</span>
            </button>
            <p class="menu-hint">{{ currentPresetDescription }}</p>
          </div>

          <div class="menu-section">
            <h3>📌 Customize Toolbar</h3>
            <p class="menu-hint">Pin tools to quick access</p>
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
</template>

<script setup>
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useCanvasStore } from '@/stores/canvasStore'
import { useLayoutStore } from '@/stores/layoutStore'

const { isMenuOpen, closeMenu } = useMenu()
const canvasStore = useCanvasStore()
const layoutStore = useLayoutStore()

// Layout presets
const presets = computed(() => layoutStore.availablePresets)
const currentPreset = computed(() => layoutStore.currentPreset)
const currentPresetDescription = computed(() => {
  const preset = layoutStore.activePresetConfig
  return preset?.description || ''
})

function isActivePreset(presetId) {
  return currentPreset.value === presetId
}

function selectPreset(presetId) {
  layoutStore.setPreset(presetId)
  layoutStore.saveLayout()
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
/* Меню Overlay */
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

/* Burger Menu */
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
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.menu-header:hover {
  background-color: var(--color-bg-secondary);
}

.menu-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 22px;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.close-button:hover {
  background-color: var(--color-bg-tertiary);
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

.menu-item--active {
  background-color: var(--color-accent);
  color: white;
}

.menu-item--active:hover {
  background-color: var(--color-accent-hover);
}

.menu-item__icon {
  font-size: 16px;
  margin-right: var(--spacing-xs);
}

.shortcut {
  font-size: 12px;
  color: var(--color-text-tertiary);
  background-color: var(--color-bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.menu-item--active .shortcut {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
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

