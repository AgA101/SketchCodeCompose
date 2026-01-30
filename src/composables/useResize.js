import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { snapToGrid } from '@/core/utils/snap'

/**
 * Композабл для изменения размера элементов на canvas
 * Поддерживает 8 направлений resize + snap to grid
 */
export function useResize() {
  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  
  const isResizing = ref(false)
  const currentElementId = ref(null)
  const currentHandle = ref(null)
  
  // Начальные значения для расчетов
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0
  let startOffsetX = 0
  let startOffsetY = 0
  
  /**
   * Начало resize
   * @param {MouseEvent} event
   * @param {string} handlePosition - позиция handle'а (top-left, bottom-right и т.д.)
   * @param {string} elementId
   */
  function startResize(event, handlePosition, elementId) {
    const element = projectStore.getElementById(elementId)
    if (!element) return
    
    isResizing.value = true
    currentElementId.value = elementId
    currentHandle.value = handlePosition
    
    // Запоминаем начальные значения
    startX = event.clientX
    startY = event.clientY
    startWidth = element.relativePosition.width
    startHeight = element.relativePosition.height
    startOffsetX = element.relativePosition.offsetX
    startOffsetY = element.relativePosition.offsetY
    
    // Добавляем глобальные слушатели
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopResize)
    
    // Предотвращаем выделение текста
    event.preventDefault()
  }
  
  /**
   * Обработка движения мыши при resize
   */
  function handleMouseMove(event) {
    if (!isResizing.value || !currentElementId.value) return
    
    const element = projectStore.getElementById(currentElementId.value)
    if (!element) return
    
    // Вычисляем дельту движения мыши
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY
    
    // Вычисляем новые размеры и позицию в зависимости от handle'а
    const result = calculateNewDimensions(
      currentHandle.value,
      deltaX,
      deltaY,
      startWidth,
      startHeight,
      startOffsetX,
      startOffsetY
    )
    
    // Применяем snap to grid
    const snappedWidth = snapToGrid(
      Math.max(50, result.width), // Минимальная ширина 50px
      canvasStore.gridSize,
      canvasStore.snapToGrid
    )
    const snappedHeight = snapToGrid(
      Math.max(50, result.height), // Минимальная высота 50px
      canvasStore.gridSize,
      canvasStore.snapToGrid
    )
    const snappedOffsetX = snapToGrid(
      Math.max(0, result.offsetX),
      canvasStore.gridSize,
      canvasStore.snapToGrid
    )
    const snappedOffsetY = snapToGrid(
      Math.max(0, result.offsetY),
      canvasStore.gridSize,
      canvasStore.snapToGrid
    )
    
    // Обновляем элемент
    projectStore.updateElement(currentElementId.value, {
      relativePosition: {
        ...element.relativePosition,
        width: snappedWidth,
        height: snappedHeight,
        offsetX: snappedOffsetX,
        offsetY: snappedOffsetY
      }
    })
  }
  
  /**
   * Вычисление новых размеров в зависимости от handle'а
   */
  function calculateNewDimensions(handle, deltaX, deltaY, width, height, offsetX, offsetY) {
    let newWidth = width
    let newHeight = height
    let newOffsetX = offsetX
    let newOffsetY = offsetY
    
    // Определяем, является ли resize угловым (пропорциональное масштабирование)
    const isCorner = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(handle)
    
    switch (handle) {
      // Угловые handle'ы - пропорциональное масштабирование
      case 'top-left':
        if (isCorner) {
          // Берем максимальную дельту для пропорциональности
          const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY)) * (deltaX < 0 || deltaY < 0 ? 1 : -1)
          newWidth = width - delta
          newHeight = height - delta
          newOffsetX = offsetX + delta
          newOffsetY = offsetY + delta
        }
        break
        
      case 'top-right':
        if (isCorner) {
          const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY)) * (deltaX > 0 || deltaY < 0 ? 1 : -1)
          newWidth = width + delta
          newHeight = height - delta
          newOffsetY = offsetY - delta
        }
        break
        
      case 'bottom-left':
        if (isCorner) {
          const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY)) * (deltaX < 0 || deltaY > 0 ? 1 : -1)
          newWidth = width - delta
          newHeight = height + delta
          newOffsetX = offsetX + delta
        }
        break
        
      case 'bottom-right':
        if (isCorner) {
          const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY))
          newWidth = width + delta
          newHeight = height + delta
        }
        break
        
      // Боковые handle'ы - независимое изменение
      case 'top-center':
        newHeight = height - deltaY
        newOffsetY = offsetY + deltaY
        break
        
      case 'bottom-center':
        newHeight = height + deltaY
        break
        
      case 'middle-left':
        newWidth = width - deltaX
        newOffsetX = offsetX + deltaX
        break
        
      case 'middle-right':
        newWidth = width + deltaX
        break
    }
    
    return {
      width: newWidth,
      height: newHeight,
      offsetX: newOffsetX,
      offsetY: newOffsetY
    }
  }
  
  /**
   * Завершение resize
   */
  function stopResize() {
    if (isResizing.value) {
      isResizing.value = false
      currentElementId.value = null
      currentHandle.value = null
      
      // Убираем глобальные слушатели
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopResize)
    }
  }
  
  return {
    isResizing,
    startResize,
    stopResize
  }
}

