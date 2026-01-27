<template>
  <div class="app-layout">
    <div class="main-content">
      <!-- Динамически рендерим панели в нужном порядке -->
      <template v-for="(panelName, index) in visiblePanels" :key="panelName">
        <!-- Панель -->
        <component
          :is="getPanelComponent(panelName)"
          class="panel"
          :style="{ width: `${getPanelWidth(panelName)}%` }"
        />

        <!-- Resizer между панелями -->
        <div
          v-if="needsResizer(index)"
          class="resizer"
          @mousedown="startResize(panelName, $event)"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import CanvasPanel from '@/components/panels/CanvasPanel.vue'
import PropertiesPanel from '@/components/panels/PropertiesPanel.vue'
import TreePanel from '@/components/panels/TreePanel.vue'
import CodePanel from '@/components/panels/CodePanel.vue'
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()

onMounted(() => {
  layoutStore.loadLayout()
})

// Определяем какие панели показывать
const visiblePanels = computed(() => layoutStore.visiblePanels)

function getPanelComponent(panelName) {
  const components = {
    canvas: CanvasPanel,
    middle: PropertiesPanel, // В default/custom mode Properties показывает оба таба
    properties: PropertiesPanel,
    tree: TreePanel,
    code: CodePanel,
  }
  return components[panelName] || 'div'
}

function getPanelWidth(panelName) {
  return layoutStore.panelWidths[panelName] || 0
}

function needsResizer(index) {
  // Resizer нужен если это не последняя панель
  return index < visiblePanels.value.length - 1
}

// Resize logic
let isResizing = false
let resizeTarget = null
let startWidths = {}

function startResize(panelName, event) {
  isResizing = true
  resizeTarget = panelName
  startWidths = { ...layoutStore.panelWidths }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  event.preventDefault()
}

function handleResize(event) {
  if (!isResizing) return

  const containerWidth = window.innerWidth
  const percentage = (event.clientX / containerWidth) * 100

  const panels = visiblePanels.value
  const targetIndex = panels.indexOf(resizeTarget)
  
  if (targetIndex === -1) return

  const target = panels[targetIndex]
  const nextPanel = panels[targetIndex + 1]

  if (!nextPanel) return

  // Вычисляем новую ширину
  let newWidth = Math.max(15, Math.min(80, percentage))
  
  const oldWidth = startWidths[target]
  const delta = newWidth - oldWidth
  
  layoutStore.updatePanelWidth(target, newWidth)
  
  const nextOldWidth = startWidths[nextPanel] || layoutStore.panelWidths[nextPanel]
  layoutStore.updatePanelWidth(nextPanel, Math.max(15, nextOldWidth - delta))
}

function stopResize() {
  if (isResizing) {
    layoutStore.saveLayout()
  }
  
  isResizing = false
  resizeTarget = null
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
  flex-shrink: 0;
}

.resizer {
  width: 4px;
  cursor: col-resize;
  background-color: var(--color-border);
  transition: background-color var(--transition-fast);
  flex-shrink: 0;
}

.resizer:hover {
  background-color: var(--color-accent);
}
</style>

