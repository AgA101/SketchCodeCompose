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
        :class="{ 
          [`canvas-viewport--${canvasStore.tool}`]: true,
          'canvas-viewport--panning': isPanning
        }"
        @click="handleCanvasClick"
        @contextmenu="handleContextMenu"
        @mousedown="handleMouseDown"
      >
        <!-- Grid Overlay -->
        <GridOverlay />
        
        <!-- Smart Guides -->
        <SmartGuides
          :guides="canvasStore.guides"
          :canvas-width="10000"
          :canvas-height="10000"
        />
        
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FloatingToolbar from '@/components/canvas/FloatingToolbar.vue'
import CanvasElement from '@/components/canvas/CanvasElement.vue'
import GridOverlay from '@/components/canvas/GridOverlay.vue'
import SmartGuides from '@/components/canvas/SmartGuides.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { Element } from '@/core/models/Element'
import { ELEMENT_TYPES } from '@/constants/elementTypes'
import { snapToGrid } from '@/core/utils/snap'

const projectStore = useProjectStore()
const canvasStore = useCanvasStore()
const selectionStore = useSelectionStore()

const viewportRef = ref(null)
const toolbarRef = ref(null)

// Pan состояние
const isPanning = ref(false)
const isSpacePressed = ref(false)
let panStartX = 0
let panStartY = 0
let panInitialX = 0
let panInitialY = 0

// Получаем root элементы из виртуального корня
const rootElements = computed(() => {
  if (!projectStore.project) return []
  return projectStore.project.virtualRoot?.children || []
})

// Стили для viewport (zoom, pan)
const viewportStyle = computed(() => ({
  transform: `scale(${canvasStore.zoom}) translate(${canvasStore.pan.x}px, ${canvasStore.pan.y}px)`,
  transformOrigin: 'top left',
}))

// Обработка левого клика
function handleCanvasClick(event) {
  const rect = viewportRef.value.getBoundingClientRect()
  
  // Учитываем zoom при преобразовании координат
  const x = (event.clientX - rect.left) / canvasStore.zoom
  const y = (event.clientY - rect.top) / canvasStore.zoom
  
  switch (canvasStore.tool) {
    case 'block':
      createNewBlockAt(x, y)
      break
    
    case 'zoom':
      // Левый клик = Zoom In (+10%)
      canvasStore.zoomIn()
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
  // Если активен Zoom Tool, правый клик = Zoom Out
  if (canvasStore.tool === 'zoom') {
    event.preventDefault()
    canvasStore.zoomOut()
    return
  }
  
  event.preventDefault()
}

// Создание нового Block элемента
function createNewBlockAt(x, y) {
  // Snap координат к сетке
  const snappedX = snapToGrid(
    Math.max(0, x - 100),
    canvasStore.gridSize,
    canvasStore.snapToGrid
  )
  const snappedY = snapToGrid(
    Math.max(0, y - 75),
    canvasStore.gridSize,
    canvasStore.snapToGrid
  )
  
  // Snap размеров к сетке
  const snappedWidth = snapToGrid(200, canvasStore.gridSize, canvasStore.snapToGrid)
  const snappedHeight = snapToGrid(150, canvasStore.gridSize, canvasStore.snapToGrid)
  
  const newElement = new Element({
    type: ELEMENT_TYPES.CONTAINER,
    relativePosition: {
      offsetX: snappedX,
      offsetY: snappedY,
      width: snappedWidth,
      height: snappedHeight
    },
    styles: {
      backgroundColor: '#ffffff',
      border: '2px solid #9e9e9e',
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
}

// Mouse Down - начало pan или других действий
function handleMouseDown(event) {
  // Средняя кнопка мыши (колесико) - всегда pan
  if (event.button === 1) {
    event.preventDefault()
    startPan(event)
    return
  }
  
  // Левая кнопка + Hand tool
  if (event.button === 0 && canvasStore.tool === 'hand') {
    event.preventDefault()
    startPan(event)
    return
  }
  
  // Левая кнопка + Space (временная рука)
  if (event.button === 0 && isSpacePressed.value) {
    event.preventDefault()
    startPan(event)
    return
  }
}

// Начало pan
function startPan(event) {
  isPanning.value = true
  panStartX = event.clientX
  panStartY = event.clientY
  panInitialX = canvasStore.pan.x
  panInitialY = canvasStore.pan.y
  
  document.addEventListener('mousemove', handlePanMove)
  document.addEventListener('mouseup', handlePanEnd)
}

// Pan движение
function handlePanMove(event) {
  if (!isPanning.value) return
  
  const deltaX = (event.clientX - panStartX) / canvasStore.zoom
  const deltaY = (event.clientY - panStartY) / canvasStore.zoom
  
  canvasStore.setPan(
    panInitialX + deltaX,
    panInitialY + deltaY
  )
}

// Конец pan
function handlePanEnd() {
  isPanning.value = false
  document.removeEventListener('mousemove', handlePanMove)
  document.removeEventListener('mouseup', handlePanEnd)
}

// Keyboard - Space для временной руки, стрелочки для zoom
function handleKeyDown(event) {
  if (event.code === 'Space' && !isSpacePressed.value) {
    isSpacePressed.value = true
    event.preventDefault()
  }
  
  // Стрелочки вверх/вниз для zoom (только если активен Zoom Tool)
  if (canvasStore.tool === 'zoom') {
    if (event.code === 'ArrowUp') {
      event.preventDefault()
      canvasStore.zoomIn()
    } else if (event.code === 'ArrowDown') {
      event.preventDefault()
      canvasStore.zoomOut()
    }
  }
}

function handleKeyUp(event) {
  if (event.code === 'Space') {
    isSpacePressed.value = false
  }
}

// Zoom с Ctrl+Scroll
function handleWheel(event) {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault() // Блокируем zoom браузера
    event.stopPropagation()
    
    const delta = -event.deltaY
    const zoomFactor = delta > 0 ? 1.1 : 0.9
    
    const newZoom = Math.max(0.1, Math.min(5, canvasStore.zoom * zoomFactor))
    canvasStore.setZoom(newZoom)
  } else {
    // Тачпад (двухпальцевый свайп) - панорамирование
    // event.deltaX и event.deltaY содержат смещение
    event.preventDefault() // Предотвращаем прокрутку страницы
    
    const deltaX = -event.deltaX / canvasStore.zoom
    const deltaY = -event.deltaY / canvasStore.zoom
    
    canvasStore.panBy(deltaX, deltaY)
  }
}

// Lifecycle
onMounted(() => {
  if (viewportRef.value) {
    // Добавляем обработчик с passive: false для preventDefault
    viewportRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
  
  // Keyboard listeners для Space
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  if (viewportRef.value) {
    viewportRef.value.removeEventListener('wheel', handleWheel)
  }
  
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  
  // Cleanup pan listeners
  document.removeEventListener('mousemove', handlePanMove)
  document.removeEventListener('mouseup', handlePanEnd)
})
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
  /* Огромный размер для "бесконечного" canvas */
  width: 10000px;
  height: 10000px;
  position: relative;
  background-color: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  cursor: default;
  /* transform наследуется из :style */
}

/* Курсоры для разных инструментов */
.canvas-viewport--select {
  cursor: default;
}

.canvas-viewport--hand {
  cursor: grab;
}

.canvas-viewport--hand:active,
.canvas-viewport--panning {
  cursor: grabbing !important;
}

.canvas-viewport--block {
  cursor: crosshair;
}

.canvas-viewport--zoom {
  cursor: zoom-in;
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

