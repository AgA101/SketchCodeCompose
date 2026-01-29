/**
 * Snap utilities for grid and element alignment
 */

/**
 * Snap значение к сетке
 * @param {number} value - Значение для snap (px)
 * @param {number} gridSize - Размер ячейки сетки (px)
 * @param {boolean} enabled - Включён ли snap
 * @returns {number} Скорректированное значение
 */
export function snapToGrid(value, gridSize, enabled = true) {
  if (!enabled || gridSize <= 0) {
    return value
  }
  
  return Math.round(value / gridSize) * gridSize
}

/**
 * Snap позиции (x, y) к сетке
 * @param {Object} position - { x, y }
 * @param {number} gridSize - Размер ячейки сетки
 * @param {boolean} enabled - Включён ли snap
 * @returns {Object} Скорректированная позиция { x, y }
 */
export function snapPositionToGrid(position, gridSize, enabled = true) {
  return {
    x: snapToGrid(position.x, gridSize, enabled),
    y: snapToGrid(position.y, gridSize, enabled)
  }
}

/**
 * Snap размера (width, height) к сетке
 * @param {Object} size - { width, height }
 * @param {number} gridSize - Размер ячейки сетки
 * @param {boolean} enabled - Включён ли snap
 * @param {number} minSize - Минимальный размер (по умолчанию = gridSize)
 * @returns {Object} Скорректированный размер { width, height }
 */
export function snapSizeToGrid(size, gridSize, enabled = true, minSize = null) {
  const minimum = minSize || gridSize
  
  return {
    width: Math.max(minimum, snapToGrid(size.width, gridSize, enabled)),
    height: Math.max(minimum, snapToGrid(size.height, gridSize, enabled))
  }
}

/**
 * Snap к краям других элементов (для Smart Guides)
 * @param {number} value - Значение для snap
 * @param {Array<number>} snapPoints - Массив точек для прилипания
 * @param {number} threshold - Порог прилипания (px)
 * @returns {number} Скорректированное значение или исходное
 */
export function snapToPoints(value, snapPoints, threshold = 5) {
  for (const point of snapPoints) {
    if (Math.abs(value - point) <= threshold) {
      return point
    }
  }
  return value
}

/**
 * Snap прямоугольника к сетке
 * @param {Object} rect - { offsetX, offsetY, width, height }
 * @param {number} gridSize - Размер ячейки сетки
 * @param {boolean} enabled - Включён ли snap
 * @returns {Object} Скорректированный прямоугольник
 */
export function snapRectToGrid(rect, gridSize, enabled = true) {
  if (!enabled) return rect
  
  return {
    offsetX: snapToGrid(rect.offsetX, gridSize, enabled),
    offsetY: snapToGrid(rect.offsetY, gridSize, enabled),
    width: Math.max(gridSize, snapToGrid(rect.width, gridSize, enabled)),
    height: Math.max(gridSize, snapToGrid(rect.height, gridSize, enabled))
  }
}

