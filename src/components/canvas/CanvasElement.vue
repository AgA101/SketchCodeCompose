<template>
  <div
    class="canvas-element"
    :class="{ 
      'canvas-element--selected': isSelected,
      'canvas-element--hovered': isHovered,
      'canvas-element--dragging': isDragging
    }"
    :style="elementStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @click.stop="handleClick"
    @contextmenu.stop="handleRightClick"
  >
    <!-- Контент элемента -->
    <div class="canvas-element__content">
      {{ element.attributes.textContent || element.metadata.name }}
    </div>

    <!-- Рекурсивно рендерим дочерние элементы -->
    <CanvasElement
      v-for="childId in element.children"
      :key="childId"
      :element-id="childId"
    />

    <!-- Handles для выделенного элемента (реализуем позже) -->
    <div v-if="isSelected" class="canvas-element__handles">
      <!-- TODO: Resize handles -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { Element } from '@/core/models/Element'
import { ELEMENT_TYPES } from '@/constants/elementTypes'

// Для рекурсивного рендеринга импортируем сам себя
import CanvasElement from './CanvasElement.vue'

const props = defineProps({
  elementId: {
    type: String,
    required: true,
  },
})

const projectStore = useProjectStore()
const selectionStore = useSelectionStore()
const canvasStore = useCanvasStore()

// Получаем элемент из store
const element = computed(() => projectStore.getElementById(props.elementId))

// Проверяем выделен ли элемент
const isSelected = computed(() => 
  selectionStore.selectedIds.includes(props.elementId)
)

// Проверяем наведена ли мышь
const isHovered = computed(() => 
  selectionStore.hoveredId === props.elementId
)

// Состояние для Drag & Drop
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let elementStartX = 0
let elementStartY = 0

// Вычисляем стили для позиционирования
const elementStyle = computed(() => {
  if (!element.value) return {}

  const { relativePosition, styles } = element.value
  
  // Определяем курсор в зависимости от инструмента
  let cursor = 'default'
  if (canvasStore.tool === 'block') {
    cursor = 'crosshair'
  } else if (canvasStore.tool === 'select' && isSelected.value) {
    cursor = 'grab'
  } else if (canvasStore.tool === 'select') {
    cursor = 'pointer'
  } else if (canvasStore.tool === 'delete') {
    cursor = 'not-allowed'
  }

  return {
    // Позиционирование
    position: 'absolute',
    left: `${relativePosition.offsetX}px`,
    top: `${relativePosition.offsetY}px`,
    width: `${relativePosition.width}px`,
    height: `${relativePosition.height}px`,
    
    // Курсор в зависимости от инструмента
    cursor,
    
    // Пользовательские стили
    ...styles,
  }
})

// Обработчики событий
function handleMouseEnter() {
  selectionStore.setHovered(props.elementId)
}

function handleMouseLeave() {
  selectionStore.clearHovered()
}

function handleClick(event) {
  // Если активен Block Tool - создаём дочерний элемент внутри
  if (canvasStore.tool === 'block') {
    createChildElement()
    event.stopPropagation()
    return
  }
  
  // Если активен инструмент Delete - удаляем элемент
  if (canvasStore.tool === 'delete') {
    projectStore.deleteElement(props.elementId)
    event.stopPropagation()
    return
  }
  
  // Иначе - обычное выделение
  const addToSelection = event.ctrlKey || event.metaKey
  selectionStore.select(props.elementId, addToSelection)
}

// Создание дочернего элемента внутри текущего
function createChildElement() {
  const parentWidth = element.value.relativePosition.width
  const parentHeight = element.value.relativePosition.height
  
  // Размер = 80% от родителя
  const childWidth = parentWidth * 0.8
  const childHeight = parentHeight * 0.8
  
  // Центрируем внутри родителя
  const offsetX = (parentWidth - childWidth) / 2
  const offsetY = (parentHeight - childHeight) / 2
  
  const childElement = new Element({
    type: ELEMENT_TYPES.CONTAINER,
    parentId: props.elementId,
    relativePosition: {
      offsetX: Math.max(0, offsetX),
      offsetY: Math.max(0, offsetY),
      width: Math.max(50, childWidth),
      height: Math.max(50, childHeight)
    },
    styles: {
      backgroundColor: '#f0f0f0',
      border: '2px solid #2196F3',
      borderRadius: '8px',
      padding: '8px',
    },
    attributes: {
      textContent: 'Child Block'
    },
    metadata: {
      name: 'Child Block',
      visible: true,
      locked: false
    }
  })
  
  projectStore.addElement(childElement)
}

// Правый клик - удаление в режиме Block Tool
function handleRightClick(event) {
  event.preventDefault()
  
  if (canvasStore.tool === 'block') {
    projectStore.deleteElement(props.elementId)
  }
}

// Drag & Drop
function handleMouseDown(event) {
  // Игнорируем правую кнопку
  if (event.button !== 0) return
  
  // В режиме Block - клик обработается в handleClick
  if (canvasStore.tool === 'block') {
    return
  }
  
  // Только для выделенных элементов в режиме Select
  if (!isSelected.value || canvasStore.tool !== 'select') {
    return
  }
  
  isDragging.value = true
  
  // Запоминаем начальные позиции
  dragStartX = event.clientX
  dragStartY = event.clientY
  elementStartX = element.value.relativePosition.offsetX
  elementStartY = element.value.relativePosition.offsetY
  
  // Добавляем глобальные слушатели
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  // Предотвращаем выделение текста
  event.preventDefault()
  event.stopPropagation()
}

function handleMouseMove(event) {
  if (!isDragging.value) return
  
  // Вычисляем смещение
  const deltaX = event.clientX - dragStartX
  const deltaY = event.clientY - dragStartY
  
  // Новая позиция
  const newX = elementStartX + deltaX
  const newY = elementStartY + deltaY
  
  // Обновляем позицию через store
  projectStore.updateElement(props.elementId, {
    relativePosition: {
      ...element.value.relativePosition,
      offsetX: Math.max(0, newX), // Не даем уйти в минус
      offsetY: Math.max(0, newY)
    }
  })
}

function handleMouseUp() {
  if (isDragging.value) {
    isDragging.value = false
    
    // Убираем глобальные слушатели
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
}
</script>

<style scoped>
.canvas-element {
  box-sizing: border-box;
  position: absolute;
  user-select: none;
  transition: outline 0.15s ease;
  
  /* Базовые стили по умолчанию */
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.canvas-element__content {
  padding: 8px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Состояние hover */
.canvas-element--hovered {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
  z-index: 10;
}

/* Состояние выделения */
.canvas-element--selected {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
  z-index: 20;
}

/* Состояние перетаскивания */
.canvas-element--dragging {
  cursor: grabbing !important;
  opacity: 0.8;
  z-index: 100;
}

/* Handles (пока пустой, реализуем позже) */
.canvas-element__handles {
  position: absolute;
  inset: -4px;
  pointer-events: none;
}
</style>

