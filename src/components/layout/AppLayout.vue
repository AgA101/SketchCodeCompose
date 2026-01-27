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
        <ResizeHandle
          v-if="needsResizer(index)"
          :panel-name="panelName"
        />
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
import ResizeHandle from '@/components/common/ResizeHandle.vue'
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
</style>

