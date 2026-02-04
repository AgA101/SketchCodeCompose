<template>
  <div class="distance-indicators">
    <!-- Top Distance -->
    <div v-if="distances.top !== null" class="distance-line distance-line--vertical distance-line--top" :style="topStyle">
      <div class="distance-arrow distance-arrow--up"></div>
      <div class="distance-value">{{ Math.round(distances.top) }}</div>
    </div>

    <!-- Right Distance -->
    <div v-if="distances.right !== null" class="distance-line distance-line--horizontal distance-line--right" :style="rightStyle">
      <div class="distance-arrow distance-arrow--right"></div>
      <div class="distance-value">{{ Math.round(distances.right) }}</div>
    </div>

    <!-- Bottom Distance -->
    <div v-if="distances.bottom !== null" class="distance-line distance-line--vertical distance-line--bottom" :style="bottomStyle">
      <div class="distance-arrow distance-arrow--down"></div>
      <div class="distance-value">{{ Math.round(distances.bottom) }}</div>
    </div>

    <!-- Left Distance -->
    <div v-if="distances.left !== null" class="distance-line distance-line--horizontal distance-line--left" :style="leftStyle">
      <div class="distance-arrow distance-arrow--left"></div>
      <div class="distance-value">{{ Math.round(distances.left) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { getAbsolutePosition } from '@/core/utils/geometry'
import { Element } from '@/core/models/Element'

const props = defineProps({
  /**
   * Элемент для которого показываем расстояния
   */
  element: {
    type: Object as PropType<Element>,
    required: true
  },
  /**
   * Все элементы проекта для поиска ближайших
   */
  allElements: {
    type: Array as PropType<Element[]>,
    required: true
  },
  /**
   * Функция для получения элемента по ID
   */
  getElementById: {
    type: Function,
    required: true
  }
})

/**
 * Вычисляем расстояния до ближайших объектов
 */
const distances = computed(() => {
  const element = props.element
  const absPos = getAbsolutePosition(element, props.getElementById)
  
  // Минимальное расстояние для показа (px)
  const MIN_DISTANCE = 2
  
  const centerX = absPos.offsetX + absPos.width / 2
  const centerY = absPos.offsetY + absPos.height / 2
  const left = absPos.offsetX
  const right = absPos.offsetX + absPos.width
  const top = absPos.offsetY
  const bottom = absPos.offsetY + absPos.height
  
  // Получаем всех соседей (на том же уровне иерархии, исключая себя)
  const siblings = props.allElements.filter(el => {
    if (!el || !el.id) return false
    if (el.id === element.id) return false
    if (el.parentId !== element.parentId) return false
    
    // Исключаем Virtual Root и другие служебные элементы
    if (el.metadata?.name === 'Virtual Root') return false
    if (el.type === 'virtual-root') return false
    
    return true
  })
  
  let nearestTop = null
  let nearestRight = null
  let nearestBottom = null
  let nearestLeft = null
  
  // Ищем ближайшие объекты в каждом направлении
  // Показываем только если есть пересечение по перпендикулярной оси
  for (const sibling of siblings) {
    const siblingPos = getAbsolutePosition(sibling, props.getElementById)
    const siblingLeft = siblingPos.offsetX
    const siblingRight = siblingPos.offsetX + siblingPos.width
    const siblingTop = siblingPos.offsetY
    const siblingBottom = siblingPos.offsetY + siblingPos.height
    
    // Проверяем пересечение по горизонтали (для вертикальных стрелочек)
    const horizontalOverlap = !(right < siblingLeft || left > siblingRight)
    
    // Проверяем пересечение по вертикали (для горизонтальных стрелочек)
    const verticalOverlap = !(bottom < siblingTop || top > siblingBottom)
    
    // Top - объект выше текущего И пересекается по горизонтали
    if (siblingBottom <= top && horizontalOverlap) {
      const distance = top - siblingBottom
      if (nearestTop === null || distance < nearestTop) {
        nearestTop = distance
      }
    }
    
    // Bottom - объект ниже текущего И пересекается по горизонтали
    if (siblingTop >= bottom && horizontalOverlap) {
      const distance = siblingTop - bottom
      if (nearestBottom === null || distance < nearestBottom) {
        nearestBottom = distance
      }
    }
    
    // Left - объект слева от текущего И пересекается по вертикали
    if (siblingRight <= left && verticalOverlap) {
      const distance = left - siblingRight
      if (nearestLeft === null || distance < nearestLeft) {
        nearestLeft = distance
      }
    }
    
    // Right - объект справа от текущего И пересекается по вертикали
    if (siblingLeft >= right && verticalOverlap) {
      const distance = siblingLeft - right
      if (nearestRight === null || distance < nearestRight) {
        nearestRight = distance
      }
    }
  }
  
  // Если есть родитель и нет соседа в каком-то направлении - показываем расстояние до края родителя
  if (element.parentId) {
    const parent = props.getElementById(element.parentId)
    if (parent && parent.metadata?.name !== 'Virtual Root') {
      const parentPos = getAbsolutePosition(parent, props.getElementById)
      const parentLeft = parentPos.offsetX
      const parentRight = parentPos.offsetX + parentPos.width
      const parentTop = parentPos.offsetY
      const parentBottom = parentPos.offsetY + parentPos.height
      
      // Расстояние до верхнего края родителя (если нет соседа сверху)
      if (nearestTop === null && top > parentTop) {
        nearestTop = top - parentTop
      }
      
      // Расстояние до нижнего края родителя (если нет соседа снизу)
      if (nearestBottom === null && bottom < parentBottom) {
        nearestBottom = parentBottom - bottom
      }
      
      // Расстояние до левого края родителя (если нет соседа слева)
      if (nearestLeft === null && left > parentLeft) {
        nearestLeft = left - parentLeft
      }
      
      // Расстояние до правого края родителя (если нет соседа справа)
      if (nearestRight === null && right < parentRight) {
        nearestRight = parentRight - right
      }
    }
  }
  
  // Применяем минимальный порог
  return {
    top: nearestTop !== null && nearestTop >= MIN_DISTANCE ? nearestTop : null,
    right: nearestRight !== null && nearestRight >= MIN_DISTANCE ? nearestRight : null,
    bottom: nearestBottom !== null && nearestBottom >= MIN_DISTANCE ? nearestBottom : null,
    left: nearestLeft !== null && nearestLeft >= MIN_DISTANCE ? nearestLeft : null
  }
})

/**
 * Стили для линий
 */
const topStyle = computed(() => {
  if (distances.value.top === null) return {}
  return {
    left: `${props.element.relativePosition.width / 2}px`,
    bottom: `${props.element.relativePosition.height}px`,
    height: `${distances.value.top}px`
  }
})

const rightStyle = computed(() => {
  if (distances.value.right === null) return {}
  return {
    left: `${props.element.relativePosition.width}px`,
    top: `${props.element.relativePosition.height / 2}px`,
    width: `${distances.value.right}px`
  }
})

const bottomStyle = computed(() => {
  if (distances.value.bottom === null) return {}
  return {
    left: `${props.element.relativePosition.width / 2}px`,
    top: `${props.element.relativePosition.height}px`,
    height: `${distances.value.bottom}px`
  }
})

const leftStyle = computed(() => {
  if (distances.value.left === null) return {}
  return {
    right: `${props.element.relativePosition.width}px`,
    top: `${props.element.relativePosition.height / 2}px`,
    width: `${distances.value.left}px`
  }
})
</script>

<style scoped>
.distance-indicators {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
}

.distance-line {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background-color: #000000;
}

/* Вертикальные линии (top, bottom) */
.distance-line--vertical {
  width: 1px;
  flex-direction: column;
}

.distance-line--top {
  transform: translateX(-0.5px);
  justify-content: flex-start;
}

.distance-line--bottom {
  transform: translateX(-0.5px);
  justify-content: flex-end;
}

/* Горизонтальные линии (left, right) */
.distance-line--horizontal {
  height: 1px;
  flex-direction: row;
}

.distance-line--left {
  transform: translateY(-0.5px);
  justify-content: flex-start;
}

.distance-line--right {
  transform: translateY(-0.5px);
  justify-content: flex-end;
}

/* Стрелочки */
.distance-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.distance-arrow--up {
  border-width: 0 4px 6px 4px;
  border-color: transparent transparent #000000 transparent;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.distance-arrow--down {
  border-width: 6px 4px 0 4px;
  border-color: #000000 transparent transparent transparent;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.distance-arrow--left {
  border-width: 4px 6px 4px 0;
  border-color: transparent #000000 transparent transparent;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.distance-arrow--right {
  border-width: 4px 0 4px 6px;
  border-color: transparent transparent transparent #000000;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

/* Значения расстояний */
.distance-value {
  background-color: #000000;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  line-height: 1;
}

/* Позиционирование значений для вертикальных стрелок - слева снизу */
.distance-line--vertical .distance-value {
  position: absolute;
  left: 8px;
  bottom: 2px;
}

/* Позиционирование значений для горизонтальных стрелок - снизу */
.distance-line--horizontal .distance-value {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

