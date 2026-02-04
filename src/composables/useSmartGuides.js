import { computed } from 'vue'
import { getAbsolutePosition } from '@/core/utils/geometry'

/**
 * Composable для расчёта Smart Guides (направляющих для выравнивания)
 * 
 * @param {Object} params
 * @param {Object} params.draggedElement - Перетаскиваемый элемент
 * @param {Array} params.allElements - Все элементы на canvas
 * @param {Function} params.getElementById - Функция для получения элемента по ID
 * @param {Number} params.snapThreshold - Порог срабатывания snap (в пикселях)
 * @returns {Object} { guides, snapPosition }
 */
export function useSmartGuides({
  draggedElement,
  allElements,
  getElementById,
  snapThreshold = 5
}) {
  /**
   * Находит все потенциальные направляющие от других элементов
   */
  const calculateGuides = (currentElement, currentAbsPos) => {
    if (!currentElement || !currentAbsPos) return []

    const guides = []

    // Координаты текущего элемента
    const currentLeft = currentAbsPos.offsetX
    const currentRight = currentAbsPos.offsetX + currentAbsPos.width
    const currentCenterX = currentAbsPos.offsetX + currentAbsPos.width / 2
    const currentTop = currentAbsPos.offsetY
    const currentBottom = currentAbsPos.offsetY + currentAbsPos.height
    const currentCenterY = currentAbsPos.offsetY + currentAbsPos.height / 2

    // Получаем актуальные значения (поддержка computed refs и обычных значений)
    const elements = (allElements && typeof allElements === 'object' && 'value' in allElements) 
      ? allElements.value 
      : allElements
    
    // Проверяем getElementById
    if (!getElementById) return []
    
    // @ts-ignore - проверили выше что getElementById не null
    const getElementFn = (typeof getElementById === 'object' && 'value' in getElementById)
      // @ts-ignore
      ? (getElementById.value || getElementById)
      : getElementById

    // Проверяем все другие элементы
    if (!elements || !Array.isArray(elements) || !getElementFn) return []
    
    elements.forEach(el => {
      if (!el || el.id === currentElement.id) return
      
      // Исключаем Virtual Root и служебные элементы
      if (el.metadata?.name === 'Virtual Root') return
      if (el.type === 'virtual-root') return

      const elAbsPos = getAbsolutePosition(el, getElementFn)
      if (!elAbsPos) return

      const elLeft = elAbsPos.offsetX
      const elRight = elAbsPos.offsetX + elAbsPos.width
      const elCenterX = elAbsPos.offsetX + elAbsPos.width / 2
      const elTop = elAbsPos.offsetY
      const elBottom = elAbsPos.offsetY + elAbsPos.height
      const elCenterY = elAbsPos.offsetY + elAbsPos.height / 2

      // Вертикальные направляющие (выравнивание по X)
      // Left to Left
      if (Math.abs(currentLeft - elLeft) <= snapThreshold) {
        guides.push({ position: elLeft, type: 'left', elementId: el.id, axis: 'x' })
      }
      // Center to Center
      if (Math.abs(currentCenterX - elCenterX) <= snapThreshold) {
        guides.push({ position: elCenterX, type: 'center', elementId: el.id, axis: 'x' })
      }
      // Right to Right
      if (Math.abs(currentRight - elRight) <= snapThreshold) {
        guides.push({ position: elRight, type: 'right', elementId: el.id, axis: 'x' })
      }
      // Left to Right (выравнивание края к краю)
      if (Math.abs(currentLeft - elRight) <= snapThreshold) {
        guides.push({ position: elRight, type: 'right', elementId: el.id, axis: 'x' })
      }
      // Right to Left
      if (Math.abs(currentRight - elLeft) <= snapThreshold) {
        guides.push({ position: elLeft, type: 'left', elementId: el.id, axis: 'x' })
      }

      // Горизонтальные направляющие (выравнивание по Y)
      // Top to Top
      if (Math.abs(currentTop - elTop) <= snapThreshold) {
        guides.push({ position: elTop, type: 'top', elementId: el.id, axis: 'y' })
      }
      // Middle to Middle
      if (Math.abs(currentCenterY - elCenterY) <= snapThreshold) {
        guides.push({ position: elCenterY, type: 'middle', elementId: el.id, axis: 'y' })
      }
      // Bottom to Bottom
      if (Math.abs(currentBottom - elBottom) <= snapThreshold) {
        guides.push({ position: elBottom, type: 'bottom', elementId: el.id, axis: 'y' })
      }
      // Top to Bottom
      if (Math.abs(currentTop - elBottom) <= snapThreshold) {
        guides.push({ position: elBottom, type: 'bottom', elementId: el.id, axis: 'y' })
      }
      // Bottom to Top
      if (Math.abs(currentBottom - elTop) <= snapThreshold) {
        guides.push({ position: elTop, type: 'top', elementId: el.id, axis: 'y' })
      }
    })

    return guides
  }

  /**
   * Вычисляет скорректированную позицию с учётом snap к направляющим
   */
  const snapToGuides = (position, guides, currentAbsPos) => {
    if (!guides || guides.length === 0 || !currentAbsPos) return position

    let snappedX = position.offsetX
    let snappedY = position.offsetY

    // Ищем ближайшую направляющую по X
    const xGuides = guides.filter(g => g.axis === 'x')
    if (xGuides.length > 0) {
      const currentLeft = currentAbsPos.offsetX
      const currentCenterX = currentAbsPos.offsetX + currentAbsPos.width / 2
      const currentRight = currentAbsPos.offsetX + currentAbsPos.width

      for (const guide of xGuides) {
        if (guide.type === 'left' && Math.abs(currentLeft - guide.position) <= snapThreshold) {
          snappedX = guide.position
          break
        }
        if (guide.type === 'center' && Math.abs(currentCenterX - guide.position) <= snapThreshold) {
          snappedX = guide.position - currentAbsPos.width / 2
          break
        }
        if (guide.type === 'right' && Math.abs(currentRight - guide.position) <= snapThreshold) {
          snappedX = guide.position - currentAbsPos.width
          break
        }
      }
    }

    // Ищем ближайшую направляющую по Y
    const yGuides = guides.filter(g => g.axis === 'y')
    if (yGuides.length > 0) {
      const currentTop = currentAbsPos.offsetY
      const currentCenterY = currentAbsPos.offsetY + currentAbsPos.height / 2
      const currentBottom = currentAbsPos.offsetY + currentAbsPos.height

      for (const guide of yGuides) {
        if (guide.type === 'top' && Math.abs(currentTop - guide.position) <= snapThreshold) {
          snappedY = guide.position
          break
        }
        if (guide.type === 'middle' && Math.abs(currentCenterY - guide.position) <= snapThreshold) {
          snappedY = guide.position - currentAbsPos.height / 2
          break
        }
        if (guide.type === 'bottom' && Math.abs(currentBottom - guide.position) <= snapThreshold) {
          snappedY = guide.position - currentAbsPos.height
          break
        }
      }
    }

    return {
      offsetX: snappedX,
      offsetY: snappedY
    }
  }

  return {
    calculateGuides,
    snapToGuides
  }
}

