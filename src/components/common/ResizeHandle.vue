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
import { ref, computed } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'

const props = defineProps({
  panelName: {
    type: String,
    required: true,
  },
})

const layoutStore = useLayoutStore()
const isDragging = ref(false)

let startX = 0
let startWidth = 0

// Находим следующую панель
const nextPanelName = computed(() => {
  const panels = layoutStore.visiblePanels
  const currentIndex = panels.indexOf(props.panelName)
  return panels[currentIndex + 1] || null
})

function startDrag(e) {
  if (!nextPanelName.value) return

  isDragging.value = true
  startX = e.clientX

  // Получаем ширину текущей панели
  const panel = e.target.previousElementSibling
  if (panel) {
    startWidth = panel.offsetWidth
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  
  e.preventDefault()
}

function onDrag(e) {
  if (!isDragging.value || !nextPanelName.value) return

  const containerWidth = window.innerWidth
  const deltaX = e.clientX - startX
  const newWidthPx = startWidth + deltaX
  const newWidthPercent = (newWidthPx / containerWidth) * 100

  // Получаем текущие ширины
  const currentWidth = layoutStore.panelWidths[props.panelName]
  const nextWidth = layoutStore.panelWidths[nextPanelName.value]
  
  // Сумма ширин двух панелей (константа)
  const totalWidth = currentWidth + nextWidth
  
  // Минимальная ширина
  const MIN_WIDTH = 15
  
  // Ограничиваем ширину
  const clampedWidth = Math.max(MIN_WIDTH, Math.min(totalWidth - MIN_WIDTH, newWidthPercent))
  const clampedNextWidth = totalWidth - clampedWidth
  
  // Обновляем store напрямую
  layoutStore.updatePanelWidth(props.panelName, clampedWidth)
  layoutStore.updatePanelWidth(nextPanelName.value, clampedNextWidth)
}

function stopDrag() {
  if (isDragging.value) {
    layoutStore.saveLayout()
  }
  
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

