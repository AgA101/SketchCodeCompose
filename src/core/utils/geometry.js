/**
 * Утилиты для геометрических вычислений
 */

/**
 * Проверка пересечения двух прямоугольников (есть ли overlap)
 * @param {Object} rect1 - { offsetX, offsetY, width, height }
 * @param {Object} rect2 - { offsetX, offsetY, width, height }
 * @returns {boolean} true если прямоугольники пересекаются
 */
export function isOverlapping(rect1, rect2) {
  const r1Left = rect1.offsetX
  const r1Right = rect1.offsetX + rect1.width
  const r1Top = rect1.offsetY
  const r1Bottom = rect1.offsetY + rect1.height
  
  const r2Left = rect2.offsetX
  const r2Right = rect2.offsetX + rect2.width
  const r2Top = rect2.offsetY
  const r2Bottom = rect2.offsetY + rect2.height
  
  // Проверяем, есть ли пересечение
  return !(r1Right <= r2Left || 
           r1Left >= r2Right || 
           r1Bottom <= r2Top || 
           r1Top >= r2Bottom)
}

/**
 * Проверка, полностью ли один прямоугольник находится внутри другого
 * @param {Object} inner - { offsetX, offsetY, width, height } - внутренний
 * @param {Object} outer - { offsetX, offsetY, width, height } - внешний
 * @returns {boolean} true если inner полностью внутри outer
 */
export function isFullyInside(inner, outer) {
  const innerLeft = inner.offsetX
  const innerRight = inner.offsetX + inner.width
  const innerTop = inner.offsetY
  const innerBottom = inner.offsetY + inner.height
  
  const outerLeft = outer.offsetX
  const outerRight = outer.offsetX + outer.width
  const outerTop = outer.offsetY
  const outerBottom = outer.offsetY + outer.height
  
  // Проверяем, что все стороны inner внутри outer
  return innerLeft >= outerLeft &&
         innerRight <= outerRight &&
         innerTop >= outerTop &&
         innerBottom <= outerBottom
}

/**
 * Проверка, находится ли точка внутри прямоугольника
 * @param {Object} point - { x, y }
 * @param {Object} rect - { offsetX, offsetY, width, height }
 * @returns {boolean} true если точка внутри прямоугольника
 */
export function isPointInside(point, rect) {
  return point.x >= rect.offsetX &&
         point.x <= rect.offsetX + rect.width &&
         point.y >= rect.offsetY &&
         point.y <= rect.offsetY + rect.height
}

/**
 * Получить абсолютные координаты элемента на canvas
 * (с учётом всех родителей)
 * @param {Object} element - Element из projectStore
 * @param {Function} getParentFn - функция для получения родителя по ID
 * @returns {Object} { offsetX, offsetY, width, height } в абсолютных координатах
 */
export function getAbsolutePosition(element, getParentFn) {
  let absX = element.relativePosition.offsetX
  let absY = element.relativePosition.offsetY
  
  let currentParent = element.parentId ? getParentFn(element.parentId) : null
  
  while (currentParent) {
    absX += currentParent.relativePosition.offsetX
    absY += currentParent.relativePosition.offsetY
    currentParent = currentParent.parentId ? getParentFn(currentParent.parentId) : null
  }
  
  return {
    offsetX: absX,
    offsetY: absY,
    width: element.relativePosition.width,
    height: element.relativePosition.height
  }
}

/**
 * Пересчёт относительных координат элемента при смене родителя
 * @param {Object} element - Element
 * @param {Object|null} newParent - новый родитель (или null для canvas)
 * @param {Function} getParentFn - функция для получения родителя по ID
 * @returns {Object} { offsetX, offsetY } - новые относительные координаты
 */
export function recalculateRelativePosition(element, newParent, getParentFn) {
  // Получаем абсолютные координаты элемента
  const absPos = getAbsolutePosition(element, getParentFn)
  
  if (!newParent) {
    // Новый родитель - canvas, абсолютные = относительные
    return {
      offsetX: absPos.offsetX,
      offsetY: absPos.offsetY
    }
  }
  
  // Получаем абсолютные координаты нового родителя
  const parentAbsPos = getAbsolutePosition(newParent, getParentFn)
  
  // Вычисляем новые относительные координаты
  return {
    offsetX: absPos.offsetX - parentAbsPos.offsetX,
    offsetY: absPos.offsetY - parentAbsPos.offsetY
  }
}

