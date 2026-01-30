import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useCanvasStore } from '@/stores/canvasStore'

/**
 * Композабл для изменения родителя элемента (reparenting)
 * Позволяет перетаскивать элементы между родителями
 */
export function useReparent() {
  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  
  const isReparenting = ref(false)
  const currentElementId = ref(null)
  const potentialParentId = ref(null) // ID элемента, над которым сейчас находимся
  
  // Начальные значения
  let startX = 0
  let startY = 0
  let startOffsetX = 0
  let startOffsetY = 0
  
  /**
   * Начало reparenting
   * @param {MouseEvent} event
   * @param {string} elementId
   */
  function startReparent(event, elementId) {
    const element = projectStore.getElementById(elementId)
    if (!element) return
    
    isReparenting.value = true
    currentElementId.value = elementId
    
    // Запоминаем начальные значения
    startX = event.clientX
    startY = event.clientY
    startOffsetX = element.relativePosition.offsetX
    startOffsetY = element.relativePosition.offsetY
    
    // Добавляем глобальные слушатели
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopReparent)
    
    // Предотвращаем выделение текста
    event.preventDefault()
  }
  
  /**
   * Обработка движения мыши при reparenting
   */
  function handleMouseMove(event) {
    if (!isReparenting.value || !currentElementId.value) return
    
    const element = projectStore.getElementById(currentElementId.value)
    if (!element) return
    
    // Вычисляем смещение
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY
    
    // Новая позиция (пока без snap - это сделаем при отпускании)
    const newOffsetX = Math.max(0, startOffsetX + deltaX)
    const newOffsetY = Math.max(0, startOffsetY + deltaY)
    
    // Обновляем позицию элемента
    projectStore.updateElement(currentElementId.value, {
      relativePosition: {
        ...element.relativePosition,
        offsetX: newOffsetX,
        offsetY: newOffsetY
      }
    })
    
    // Определяем потенциального нового родителя
    // TODO: Реализовать логику определения элемента под курсором
    detectPotentialParent(event)
  }
  
  /**
   * Определение элемента, над которым находится центральная точка (■)
   * Выбираем самый глубокий элемент под точкой
   */
  function detectPotentialParent(event) {
    const elements = document.elementsFromPoint(event.clientX, event.clientY)
    
    // Собираем все canvas элементы под курсором (кроме текущего)
    const canvasElements = elements.filter(el => {
      return el instanceof HTMLElement &&
             el.classList.contains('canvas-element') && 
             el.dataset.elementId && 
             el.dataset.elementId !== currentElementId.value
    })
    
    if (canvasElements.length === 0) {
      potentialParentId.value = null
      return
    }
    
    // Выбираем самый глубокий (последний в DOM = самый вложенный)
    // Последний элемент в массиве = самый глубокий по иерархии
    const deepestElement = canvasElements[canvasElements.length - 1]
    if (deepestElement instanceof HTMLElement && deepestElement.dataset.elementId) {
      potentialParentId.value = deepestElement.dataset.elementId
    } else {
      potentialParentId.value = null
    }
  }
  
  /**
   * Проверка, может ли элемент стать дочерним для нового родителя
   */
  function canReparent(childId, newParentId) {
    // Нельзя сделать родителем самого себя
    if (childId === newParentId) return false
    
    // Нельзя сделать родителем своего потомка (циклическая зависимость)
    const isDescendant = checkIsDescendant(childId, newParentId)
    if (isDescendant) return false
    
    // TODO: Проверить, полностью ли элемент помещается в нового родителя
    // TODO: Проверить, не пересекается ли с другими элементами внутри родителя
    
    return true
  }
  
  /**
   * Проверка, является ли potentialChild потомком ancestor
   */
  function checkIsDescendant(ancestorId, potentialChildId) {
    let current = projectStore.getElementById(potentialChildId)
    
    while (current && current.parentId) {
      if (current.parentId === ancestorId) return true
      current = projectStore.getElementById(current.parentId)
    }
    
    return false
  }
  
  /**
   * Завершение reparenting
   * Явно меняем родителя на элемент под точкой (или null если нет элемента)
   */
  function stopReparent() {
    if (isReparenting.value && currentElementId.value) {
      const element = projectStore.getElementById(currentElementId.value)
      if (!element) return
      
      // Определяем нового родителя
      // potentialParentId.value может быть:
      // - ID элемента (если точка над элементом)
      // - null (если точка над пустым canvas)
      const newParentId = potentialParentId.value
      
      // Проверяем, что не пытаемся сделать родителем самого себя или своего потомка
      if (newParentId && !canReparent(currentElementId.value, newParentId)) {
        // Недопустимая операция - не меняем родителя
        isReparenting.value = false
        currentElementId.value = null
        potentialParentId.value = null
        
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', stopReparent)
        return
      }
      
      // Меняем родителя (может быть null для canvas)
      // TODO: Пересчитать относительные координаты при смене родителя
      projectStore.updateElement(currentElementId.value, {
        parentId: newParentId
      })
      
      isReparenting.value = false
      currentElementId.value = null
      potentialParentId.value = null
      
      // Убираем глобальные слушатели
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopReparent)
    }
  }
  
  return {
    isReparenting,
    potentialParentId,
    startReparent,
    stopReparent
  }
}

