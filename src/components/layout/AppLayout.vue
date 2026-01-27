<template>
  <div class="app-layout">
    <!-- Main Content (без TopBar) -->
    <div class="main-content">
      <!-- Canvas Panel -->
      <div class="panel canvas-panel" :style="{ width: `${canvasWidth}%` }">
        <div class="panel-content canvas-content">
          <!-- Floating Toolbar внутри canvas -->
          <FloatingToolbar />
          <p class="canvas-placeholder">Canvas Area</p>
        </div>
      </div>

      <!-- Resizer -->
      <div class="resizer" @mousedown="startResize('canvas')"></div>

      <!-- Middle Panel (Properties / Tree) -->
      <div class="panel middle-panel" :style="{ width: `${middleWidth}%` }">
        <div class="panel-tabs">
          <button
            :class="{ active: activeMiddleTab === 'properties' }"
            @click="activeMiddleTab = 'properties'"
          >
            📊 Properties
          </button>
          <button :class="{ active: activeMiddleTab === 'tree' }" @click="activeMiddleTab = 'tree'">
            📁 Tree
          </button>
        </div>
        <div class="panel-content">
          <p v-if="activeMiddleTab === 'properties'">Properties (скоро)</p>
          <p v-else>Tree (скоро)</p>
        </div>
      </div>

      <!-- Resizer -->
      <div class="resizer" @mousedown="startResize('middle')"></div>

      <!-- Code Panel -->
      <div class="panel code-panel" :style="{ width: `${codeWidth}%` }">
        <div class="panel-tabs">
          <button :class="{ active: activeCodeTab === 'html' }" @click="activeCodeTab = 'html'">
            HTML
          </button>
          <button :class="{ active: activeCodeTab === 'css' }" @click="activeCodeTab = 'css'">
            CSS
          </button>
        </div>
        <div class="panel-content">
          <p v-if="activeCodeTab === 'html'">HTML (скоро)</p>
          <p v-else>CSS (скоро)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FloatingToolbar from '@/components/canvas/FloatingToolbar.vue'

// Ширины панелей
const canvasWidth = ref(45)
const middleWidth = ref(15)
const codeWidth = ref(40)

// Активные табы
const activeMiddleTab = ref('properties')
const activeCodeTab = ref('html')

// Resize
const isResizing = ref(false)
const resizeTarget = ref(null)

function startResize(target) {
  isResizing.value = true
  resizeTarget.value = target
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(event) {
  if (!isResizing.value) return

  // TODO: реализовать resize логику
  console.log('Resizing...', event)
}

function stopResize() {
  isResizing.value = false
  resizeTarget.value = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.app-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
}

.panel:last-child {
  border-right: none;
}

.panel-tabs {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
}

.panel-tabs button {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.panel-tabs button:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.panel-tabs button.active {
  background-color: var(--color-accent);
  color: white;
}

.panel-content {
  flex: 1;
  padding: var(--spacing-md);
  overflow: auto;
}

.canvas-content {
  position: relative;
  padding: 0;
}

.canvas-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-text-tertiary);
  font-size: 18px;
}

.resizer {
  width: 4px;
  cursor: col-resize;
  background-color: var(--color-border);
  transition: background-color var(--transition-fast);
}

.resizer:hover {
  background-color: var(--color-accent);
}
</style>

