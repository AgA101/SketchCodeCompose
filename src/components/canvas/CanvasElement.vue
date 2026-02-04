<template>
  <div
    class="canvas-element"
    :class="{ 
      'canvas-element--selected': isSelected,
      'canvas-element--hovered': isHovered,
      'canvas-element--dragging': isDragging,
      'canvas-element--drop-target': isDropTarget
    }"
    :style="elementStyle"
    :data-element-id="elementId"
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

    <!-- Handles для выделенного элемента -->
    <ResizeHandles
      v-if="isSelected"
      :element-id="elementId"
      @resize-start="handleResizeStart"
      @reparent-start="handleReparentStart"
    />

    <!-- Distance Indicators для выделенного или перемещаемого элемента -->
    <DistanceIndicators
      v-if="isSelected || isDragging"
      :element="element"
      :all-elements="allElements"
      :get-element-by-id="projectStore.getElementById"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { Element } from '@/core/models/Element'
import { ELEMENT_TYPES } from '@/constants/elementTypes'
import { snapToGrid } from '@/core/utils/snap'
import { useResize } from '@/composables/useResize'
import { useReparent } from '@/composables/useReparent'
import { isOverlapping, isFullyInside, getAbsolutePosition } from '@/core/utils/geometry'

// Для рекурсивного рендеринга импортируем сам себя
import CanvasElement from './CanvasElement.vue'
import ResizeHandles from './ResizeHandles.vue'
import DistanceIndicators from './DistanceIndicators.vue'

const props = defineProps({
  elementId: {
    type: String,
    required: true,
  },
})

const projectStore = useProjectStore()
const selectionStore = useSelectionStore()
const canvasStore = useCanvasStore()

// Композаблы для resize и reparent
const { startResize } = useResize()
const { startReparent, potentialParentId } = useReparent()

// Проверяем, является ли текущий элемент потенциальной целью для drop
const isDropTarget = computed(() => 
  potentialParentId.value === props.elementId
)

// Получаем элемент из store
const element = computed(() => projectStore.getElementById(props.elementId))

// Получаем все элементы для Distance Indicators
const allElements = computed(() => {
  if (!projectStore.project) return []
  return Array.from(projectStore.project.elements.values())
})

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
  
  // Новая позиция (без ограничений - элемент может выходить за границы родителя)
  const rawX = elementStartX + deltaX
  const rawY = elementStartY + deltaY
  
  // Snap к сетке (разрешаем отрицательные значения)
  const snappedX = snapToGrid(
    rawX,
    canvasStore.gridSize,
    canvasStore.snapToGrid
  )
  const snappedY = snapToGrid(
    rawY,
    canvasStore.gridSize,
    canvasStore.snapToGrid
  )
  
  // Обновляем позицию через store (БЕЗ ограничений Math.max)
  // Дочерние элементы могут иметь отрицательный offset (выходить за границы родителя)
  projectStore.updateElement(props.elementId, {
    relativePosition: {
      ...element.value.relativePosition,
      offsetX: snappedX,
      offsetY: snappedY
    }
  })
}

function handleMouseUp() {
  if (isDragging.value) {
    isDragging.value = false
    
    // Убираем глобальные слушатели
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    
    // Проверяем автоматический reparent (если элемент перестал пересекаться с родителем)
    checkAutoReparent()
  }
}

/**
 * Автоматическая проверка и смена родителя
 * Вызывается при завершении обычного drag
 */
function checkAutoReparent() {
  const currentElement = element.value
  if (!currentElement) return
  
  // Если есть текущий родитель - проверяем пересечение с ним
  if (currentElement.parentId) {
    const currentParent = projectStore.getElementById(currentElement.parentId)
    if (!currentParent) return
    
    // Проверяем, пересекается ли элемент с текущим родителем
    // Родитель в своей системе координат находится в (0, 0)
    const parentRect = {
      offsetX: 0,
      offsetY: 0,
      width: currentParent.relativePosition.width,
      height: currentParent.relativePosition.height
    }
    
    const hasOverlap = isOverlapping(
      currentElement.relativePosition,
      parentRect
    )
    
    console.log('🔍 Auto reparent check (has parent):', {
      elementId: currentElement.id,
      currentParentId: currentElement.parentId,
      hasOverlap,
      elementPos: currentElement.relativePosition
    })
    
    // Если есть пересечение - проверяем, может есть более глубокий родитель
    if (hasOverlap) {
      const deeperParent = findDeepestContainingParent(currentElement)
      // Меняем только если нашли более глубокого родителя
      if (deeperParent && deeperParent.id !== currentElement.parentId) {
        console.log('🔄 Found deeper parent:', {
          oldParentId: currentElement.parentId,
          newParentId: deeperParent.id
        })
        projectStore.updateElement(currentElement.id, {
          parentId: deeperParent.id
        })
      }
      return
    }
  }
  
  // Нет родителя ИЛИ нет пересечения с текущим родителем
  // Ищем нового подходящего родителя
  const newParent = findDeepestContainingParent(currentElement)
  
  console.log('🔄 Changing parent:', {
    oldParentId: currentElement.parentId,
    newParentId: newParent ? newParent.id : null,
    newParentName: newParent ? newParent.metadata.name : 'Canvas (root)'
  })
  
  // Если новый родитель отличается от текущего - меняем
  const newParentId = newParent ? newParent.id : null
  if (newParentId !== currentElement.parentId) {
    projectStore.updateElement(currentElement.id, {
      parentId: newParentId
    })
  }
}

/**
 * Поиск самого глубокого элемента, который ПОЛНОСТЬЮ содержит данный элемент
 * @param {Object} targetElement - элемент, для которого ищем родителя
 * @returns {Object|null} - найденный элемент-родитель или null
 */
function findDeepestContainingParent(targetElement) {
  // Получаем абсолютные координаты целевого элемента
  const targetAbsPos = getAbsolutePosition(targetElement, projectStore.getElementById)
  
  // Получаем все элементы кроме самого targetElement и его потомков
  // project.elements это Map, нужно получить массив значений
  const allElements = Array.from(projectStore.project.elements.values())
  const candidateElements = allElements.filter(el => {
    // Исключаем сам элемент
    if (el.id === targetElement.id) return false
    
    // Исключаем потомков targetElement
    if (isDescendant(el, targetElement.id)) return false
    
    return true
  })
  
  // Ищем элементы, которые ПОЛНОСТЬЮ содержат targetElement
  const containingElements = candidateElements.filter(el => {
    const elAbsPos = getAbsolutePosition(el, projectStore.getElementById)
    return isFullyInside(targetAbsPos, elAbsPos)
  })
  
  // Из всех содержащих выбираем самый глубокий (с максимальной глубиной в иерархии)
  if (containingElements.length === 0) return null
  
  let deepest = containingElements[0]
  let maxDepth = getElementDepth(deepest)
  
  for (const el of containingElements) {
    const depth = getElementDepth(el)
    if (depth > maxDepth) {
      maxDepth = depth
      deepest = el
    }
  }
  
  return deepest
}

/**
 * Получить глубину элемента в иерархии
 * @param {Object} element
 * @returns {number} - глубина (0 для корневых элементов)
 */
function getElementDepth(element) {
  let depth = 0
  let current = element
  
  while (current.parentId) {
    depth++
    current = projectStore.getElementById(current.parentId)
    if (!current) break
  }
  
  return depth
}

/**
 * Проверка, является ли element потомком ancestor
 * @param {Object} element - проверяемый элемент
 * @param {string} ancestorId - ID предполагаемого предка
 * @returns {boolean}
 */
function isDescendant(element, ancestorId) {
  let current = element
  
  while (current.parentId) {
    if (current.parentId === ancestorId) return true
    current = projectStore.getElementById(current.parentId)
    if (!current) break
  }
  
  return false
}

// Обработчики для ResizeHandles
function handleResizeStart({ event, position, elementId }) {
  startResize(event, position, elementId)
}

function handleReparentStart({ event, elementId }) {
  startReparent(event, elementId)
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

/* Drop target для reparenting */
.canvas-element--drop-target {
  outline: 3px dashed var(--color-success, #4CAF50) !important;
  outline-offset: -3px;
  background-color: rgba(76, 175, 80, 0.1) !important;
}
</style>

