<template>
  <div
    class="resize-handle"
    :class="{ 'resize-handle--dragging': isDragging }"
    @mousedown="startDrag"
  >
    <div class="resize-handle__line"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['resize'])

const isDragging = ref(false)
let startX = 0
let startWidth = 0

function startDrag(e) {
  isDragging.value = true
  startX = e.clientX

  // Получаем ширину предыдущей панели
  const panel = e.target.previousElementSibling
  if (panel) {
    startWidth = panel.offsetWidth
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  
  // Предотвращаем выделение текста
  e.preventDefault()
}

function onDrag(e) {
  if (!isDragging.value) return

  const deltaX = e.clientX - startX
  const newWidth = startWidth + deltaX

  emit('resize', newWidth)
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped>
.resize-handle {
  width: 4px;
  height: 100%;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  background-color: transparent;
  transition: background-color 0.2s;
  user-select: none;
}

.resize-handle:hover {
  background-color: var(--color-accent);
}

.resize-handle--dragging {
  background-color: var(--color-accent);
}

.resize-handle__line {
  position: absolute;
  top: 0;
  left: 1px;
  width: 2px;
  height: 100%;
  background-color: transparent;
}

/* Активная область для клика (шире чем видимая линия) */
.resize-handle::before {
  content: '';
  position: absolute;
  top: 0;
  left: -4px;
  right: -4px;
  height: 100%;
}
</style>

