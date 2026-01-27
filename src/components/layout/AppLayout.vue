<template>
  <div class="app-layout">
    <!-- Main Content -->
    <div class="main-content">
      <!-- Canvas Panel -->
      <div
        v-if="isPanelVisible('canvas')"
        class="panel canvas-panel"
        :style="{ width: `${getPanelWidth('canvas')}%` }"
      >
        <div class="panel-content canvas-content">
          <!-- Floating Toolbar внутри canvas -->
          <FloatingToolbar />
          <p class="canvas-placeholder">Canvas Area</p>
        </div>
      </div>

      <!-- Resizer -->
      <div v-if="needsResizer('canvas')" class="resizer" @mousedown="startResize('canvas')"></div>

      <!-- Developer Mode: Separate Properties Panel -->
      <div
        v-if="isPanelVisible('properties')"
        class="panel properties-panel"
        :style="{ width: `${getPanelWidth('properties')}%` }"
      >
        <div class="panel-tabs">
          <button class="active">📊 Properties</button>
        </div>
        <div class="panel-content">
          <p>Properties (скоро)</p>
        </div>
      </div>

      <!-- Resizer for properties -->
      <div
        v-if="isPanelVisible('properties') && needsResizer('properties')"
        class="resizer"
        @mousedown="startResize('properties')"
      ></div>

      <!-- Mini Mode Code View: Code Panel идет ПЕРВЫМ -->
      <template v-if="isMiniModeCode && isPanelVisible('code')">
        <!-- Code Panel ПЕРВЫМ (слева) -->
        <div class="panel code-panel" :style="{ width: `${getPanelWidth('code')}%` }">
          
          <!-- File Tabs -->
          <FileTabs v-if="hasOpenFiles" :show-menu="true" />

          <!-- Fallback Tabs если нет открытых файлов -->
          <div v-else class="panel-tabs panel-tabs--mini">
            <!-- Menu button в mini mode -->
            <MenuButton />
            
            <button :class="{ active: activeCodeTab === 'html' }" @click="openDemoFile('html')">
              🌐 HTML
            </button>
            <button :class="{ active: activeCodeTab === 'css' }" @click="openDemoFile('css')">
              🎨 CSS
            </button>
          </div>

          <div class="panel-content code-editor">
            <div v-if="activeFile" class="file-content">
              <pre><code>{{ activeFile.content }}</code></pre>
            </div>
            <div v-else class="empty-state">
              <p class="empty-state__icon">📝</p>
              <p class="empty-state__text">Откройте файл для редактирования</p>
              <p class="empty-state__hint">или создайте новый</p>
            </div>
          </div>
        </div>

        <!-- Resizer -->
        <div class="resizer" @mousedown="startResize('code')"></div>

        <!-- Tree Panel ВТОРЫМ (справа) -->
        <div
          v-if="isPanelVisible('tree')"
          class="panel middle-panel"
          :style="{ width: `${getPanelWidth('tree')}%` }"
        >
          <div class="panel-tabs panel-tabs--mini">
            <button class="active">📁 Tree</button>
            
            <!-- Кнопка переключения на canvas -->
            <button 
              class="mini-toggle-inline"
              @click="toggleMiniMode"
              title="Switch to Canvas & Properties view"
            >
              🎨 Show Canvas
            </button>
          </div>

          <div class="panel-content">
            <p>Tree (скоро)</p>
          </div>
        </div>
      </template>

      <!-- НЕ Mini Mode: обычный порядок -->
      <template v-else>
        <!-- Middle Panel (Properties / Tree) or Tree Only -->
        <div
          v-if="isPanelVisible('middle') || isPanelVisible('tree')"
          class="panel middle-panel"
          :style="{ width: `${getMiddlePanelWidth()}%` }"
        >
          <!-- Designer Mode: только Properties -->
          <div v-if="isDesignerMode" class="panel-tabs">
            <button class="active">📊 Properties</button>
          </div>
          
          <!-- Mini Mode - Canvas View: Properties + Toggle -->
          <div v-else-if="isMiniModeCanvas" class="panel-tabs panel-tabs--mini">
            <button class="active">📊 Properties</button>
            
            <!-- Кнопка переключения на код -->
            <button 
              class="mini-toggle-inline"
              @click="toggleMiniMode"
              title="Switch to Code & Tree view"
            >
              💻 Show Code
            </button>
          </div>
          
          <!-- Default/Custom Mode: Properties/Tree с табами -->
          <div v-else-if="isPanelVisible('middle')" class="panel-tabs">
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
            <!-- Designer Mode: всегда Properties -->
            <p v-if="isDesignerMode">Properties (скоро)</p>
            <!-- Остальные режимы -->
            <p v-else-if="activeMiddleTab === 'properties' && isPanelVisible('middle')">
              Properties (скоро)
            </p>
            <p v-else>Tree (скоро)</p>
          </div>
        </div>

        <!-- Resizer -->
        <div v-if="needsResizer('middle') || needsResizer('tree')" class="resizer" @mousedown="startResize('middle')"></div>

        <!-- Code Panel (не mini mode) -->
        <div
          v-if="isPanelVisible('code')"
          class="panel code-panel"
          :style="{ width: `${getPanelWidth('code')}%` }"
        >
        
          <!-- File Tabs -->
          <FileTabs v-if="hasOpenFiles" />

          <!-- Fallback Tabs если нет открытых файлов -->
          <div v-else class="panel-tabs">
            <button :class="{ active: activeCodeTab === 'html' }" @click="openDemoFile('html')">
              🌐 HTML
            </button>
            <button :class="{ active: activeCodeTab === 'css' }" @click="openDemoFile('css')">
              🎨 CSS
            </button>
          </div>

          <div class="panel-content code-editor">
            <div v-if="activeFile" class="file-content">
              <pre><code>{{ activeFile.content }}</code></pre>
            </div>
            <div v-else class="empty-state">
              <p class="empty-state__icon">📝</p>
              <p class="empty-state__text">Откройте файл для редактирования</p>
              <p class="empty-state__hint">или создайте новый</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FloatingToolbar from '@/components/canvas/FloatingToolbar.vue'
import FileTabs from '@/components/editor/FileTabs.vue'
import MenuButton from '@/components/layout/MenuButton.vue'
import { useEditorStore } from '@/stores/editorStore'
import { useLayoutStore } from '@/stores/layoutStore'

const editorStore = useEditorStore()
const layoutStore = useLayoutStore()

onMounted(() => {
  layoutStore.loadLayout()
})

// Активные табы
const activeMiddleTab = ref('properties')
const activeCodeTab = ref('html')

// Editor
const hasOpenFiles = computed(() => editorStore.hasOpenFiles)
const activeFile = computed(() => editorStore.activeFile)

// Layout helpers
const isDesignerMode = computed(() => layoutStore.currentPreset === 'designer')
const isMiniModeCanvas = computed(() => 
  layoutStore.isMiniMode && layoutStore.miniMode === 'canvas'
)
const isMiniModeCode = computed(() => 
  layoutStore.isMiniMode && layoutStore.miniMode === 'code'
)

function toggleMiniMode() {
  layoutStore.toggleMiniMode()
  layoutStore.saveLayout()
}

function isPanelVisible(panelName) {
  return layoutStore.isPanelVisible(panelName)
}

function getPanelWidth(panelName) {
  return layoutStore.panelWidths[panelName] || 0
}

function getMiddlePanelWidth() {
  if (isPanelVisible('middle')) {
    return getPanelWidth('middle')
  } else if (isPanelVisible('tree')) {
    return getPanelWidth('tree')
  }
  return 0
}

function needsResizer(panelName) {
  const panels = layoutStore.visiblePanels
  const index = panels.indexOf(panelName)
  // Resizer нужен если это не последняя панель
  return index >= 0 && index < panels.length - 1
}

// Demo files для примера
function openDemoFile(type) {
  activeCodeTab.value = type
  
  const demoFiles = {
    html: {
      id: 'demo-html',
      name: 'index.html',
      type: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
  </header>
  
  <main>
    <section class="hero">
      <h2>Beautiful Design</h2>
      <p>Created with SketchCodeCompose</p>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2026 My Website</p>
  </footer>
</body>
</html>`,
    },
    css: {
      id: 'demo-css',
      name: 'styles.css',
      type: 'css',
      content: `/* Global Styles */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f5f5f5;
}

/* Header */
header {
  background-color: #2c3e50;
  color: white;
  padding: 2rem;
  text-align: center;
}

/* Hero Section */
.hero {
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
}

.hero h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

/* Footer */
footer {
  background-color: #34495e;
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: 4rem;
}`,
    },
  }
  
  editorStore.openFile(demoFiles[type])
}

// Resize
const isResizing = ref(false)
const resizeTarget = ref(null)
let startX = 0
let startWidths = {}

function startResize(target) {
  isResizing.value = true
  resizeTarget.value = target
  startX = 0
  
  // Сохраняем текущие ширины
  startWidths = { ...layoutStore.panelWidths }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(event) {
  if (!isResizing.value) return

  const containerWidth = window.innerWidth
  const percentage = (event.clientX / containerWidth) * 100

  const panels = layoutStore.visiblePanels
  const targetIndex = panels.indexOf(resizeTarget.value)
  
  if (targetIndex === -1) return

  const target = panels[targetIndex]
  const nextPanel = panels[targetIndex + 1]

  if (!nextPanel) return

  // Вычисляем новую ширину для текущей панели
  let newWidth = Math.max(15, Math.min(80, percentage))
  
  // Обновляем ширины в store
  const oldWidth = startWidths[target]
  const delta = newWidth - oldWidth
  
  layoutStore.updatePanelWidth(target, newWidth)
  
  // Корректируем следующую панель
  const nextOldWidth = startWidths[nextPanel] || layoutStore.panelWidths[nextPanel]
  layoutStore.updatePanelWidth(nextPanel, Math.max(15, nextOldWidth - delta))
}

function stopResize() {
  if (isResizing.value) {
    layoutStore.saveLayout()
  }
  
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

/* Code Editor */
.code-editor {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 0;
}

.file-content {
  height: 100%;
  overflow: auto;
}

.file-content pre {
  margin: 0;
  padding: var(--spacing-md);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.file-content code {
  font-family: inherit;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-tertiary);
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.empty-state__text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.empty-state__hint {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

/* Mini Mode Inline Toggle */
.panel-tabs--mini {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mini-toggle-inline {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--color-accent);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition-fast);
  margin-left: auto;
}

.mini-toggle-inline:hover {
  background-color: var(--color-accent-hover);
  transform: scale(1.05);
}
</style>

