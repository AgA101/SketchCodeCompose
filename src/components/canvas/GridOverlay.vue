<template>
  <div 
    v-if="canvasStore.showGrid" 
    class="grid-overlay"
    :style="gridStyle"
  ></div>
</template>

<script setup>
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'

const canvasStore = useCanvasStore()

// Стили для точечной сетки (Figma-style)
const gridStyle = computed(() => {
  const size = canvasStore.gridSize
  
  return {
    backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.15) 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: '0 0'
  }
})
</script>

<style scoped>
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Не блокируем клики по canvas */
  z-index: 1;
}
</style>

