<template>
  <div class="canvas-panel">
    <div class="canvas-content">
      <!-- Floating Toolbar -->
      <FloatingToolbar />
      
      <!-- Canvas Viewport (область для рендеринга элементов) -->
      <div 
        ref="viewportRef"
        class="canvas-viewport"
        :style="viewportStyle"
        :class="{ [`canvas-viewport--${canvasStore.tool}`]: true }"
        @click="handleCanvasClick"
        @contextmenu="handleContextMenu"
      >
        <!-- Рендерим все root элементы -->
        <CanvasElement
          v-for="elementId in rootElements"
          :key="elementId"
          :element-id="elementId"
        />

        <!-- Placeholder если нет элементов -->
        <div v-if="rootElements.length === 0" class="canvas-placeholder">
          <p class="canvas-placeholder__text">Нажмите "Add Block" чтобы создать элемент</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FloatingToolbar from '@/components/canvas/FloatingToolbar.vue'
import CanvasElement from '@/components/canvas/CanvasElement.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { Element } from '@/core/models/Element'
import { ELEMENT_TYPES } from '@/constants/elementTypes'

const projectStore = useProjectStore()
const canvasStore = useCanvasStore()
const selectionStore = useSelectionStore()

const viewportRef = ref(null)
const toolbarRef = ref(null)

// Получаем root элементы из проекта
const rootElements = computed(() => {
  if (!projectStore.project) return []
  return projectStore.rootElements.map(el => el.id)
})

// Стили для viewport (zoom, pan)
const viewportStyle = computed(() => ({
  transform: `scale(${canvasStore.zoom}) translate(${canvasStore.pan.x}px, ${canvasStore.pan.y}px)`,
  transformOrigin: 'top left',
}))

// Обработка левого клика
function handleCanvasClick(event) {
  const rect = viewportRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  switch (canvasStore.tool) {
    case 'block':
      createNewBlockAt(x, y)
      break
      
    case 'select':
    default:
      // Снимаем выделение только если кликнули по пустому месту
      if (event.target === viewportRef.value) {
        selectionStore.deselect()
      }
      break
  }
}

// Обработка правого клика
function handleContextMenu(event) {
  event.preventDefault()
}

// Создание нового Block элемента
function createNewBlockAt(x, y) {
  const newElement = new Element({
    type: ELEMENT_TYPES.CONTAINER,
    relativePosition: {
      offsetX: Math.max(0, x - 100), // Центрируем относительно клика
      offsetY: Math.max(0, y - 75),
      width: 200,
      height: 150
    },
    styles: {
      backgroundColor: '#ffffff',
      border: '2px solid #9e9e9e', // Серая рамка
      borderRadius: '8px',
      padding: '16px',
    },
    attributes: {
      textContent: 'New Block'
    },
    metadata: {
      name: 'Block',
      visible: true,
      locked: false
    }
  })
  
  projectStore.addElement(newElement)
  
  // НЕ переключаем режим - инструмент остаётся активным!
  // Пользователь может создать много блоков подряд
}
</script>

<style scoped>
.canvas-panel {
  height: 100%;
  background-color: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
}

.canvas-content {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Canvas Viewport - область где рендерятся элементы */
.canvas-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  background-color: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  cursor: default;
  transition: transform 0.15s ease-out;
}

/* Курсоры для разных инструментов */
.canvas-viewport--select {
  cursor: default;
}

.canvas-viewport--block {
  cursor: crosshair;
}

.canvas-viewport--delete {
  cursor: not-allowed;
}

/* Placeholder */
.canvas-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.canvas-placeholder__text {
  color: var(--color-text-tertiary);
  font-size: 16px;
  margin: 0;
}
</style>

