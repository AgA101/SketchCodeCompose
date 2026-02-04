<template>
  <svg
    class="smart-guides"
    :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1000
    }"
  >
    <!-- Вертикальные направляющие -->
    <line
      v-for="guide in verticalGuides"
      :key="`v-${guide.position}-${guide.type}`"
      :x1="guide.position"
      :y1="0"
      :x2="guide.position"
      :y2="canvasHeight"
      class="guide-line"
      :class="`guide-line--${guide.type}`"
    />

    <!-- Горизонтальные направляющие -->
    <line
      v-for="guide in horizontalGuides"
      :key="`h-${guide.position}-${guide.type}`"
      :x1="0"
      :y1="guide.position"
      :x2="canvasWidth"
      :y2="guide.position"
      class="guide-line"
      :class="`guide-line--${guide.type}`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'

interface Guide {
  position: number
  type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  elementId?: string
}

const props = defineProps({
  /**
   * Массив направляющих от canvasStore
   */
  guides: {
    type: Array as PropType<Guide[]>,
    default: () => []
  },
  /**
   * Размеры canvas для отрисовки линий
   */
  canvasWidth: {
    type: Number,
    required: true
  },
  canvasHeight: {
    type: Number,
    required: true
  }
})

// Разделяем направляющие на вертикальные и горизонтальные
const verticalGuides = computed(() =>
  props.guides.filter(g => ['left', 'center', 'right'].includes(g.type))
)

const horizontalGuides = computed(() =>
  props.guides.filter(g => ['top', 'middle', 'bottom'].includes(g.type))
)
</script>

<style scoped>
.smart-guides {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.guide-line {
  stroke: #000000;
  stroke-width: 1;
  stroke-dasharray: none;
  opacity: 0.8;
}

/* Центральные линии - пунктиром */
.guide-line--center,
.guide-line--middle {
  stroke: #000000;
  stroke-width: 1;
  stroke-dasharray: 4 4;
  opacity: 0.8;
}
</style>

