<template>
  <div class="resize-handles">
    <!-- 8 круглых handle'ов для resize -->
    <div
      v-for="handle in resizeHandles"
      :key="handle.position"
      class="resize-handle resize-handle--circle"
      :class="`resize-handle--${handle.position}`"
      :style="{ cursor: handle.cursor }"
      @mousedown.stop="startResize($event, handle.position)"
    />
    
    <!-- 1 квадратный handle в центре для reparent -->
    <div
      class="resize-handle resize-handle--square resize-handle--center"
      @mousedown.stop="startReparent"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  elementId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['resize-start', 'reparent-start'])

// Конфигурация 8 resize handle'ов
const resizeHandles = [
  { position: 'top-left', cursor: 'nwse-resize' },
  { position: 'top-center', cursor: 'ns-resize' },
  { position: 'top-right', cursor: 'nesw-resize' },
  { position: 'middle-left', cursor: 'ew-resize' },
  { position: 'middle-right', cursor: 'ew-resize' },
  { position: 'bottom-left', cursor: 'nesw-resize' },
  { position: 'bottom-center', cursor: 'ns-resize' },
  { position: 'bottom-right', cursor: 'nwse-resize' }
]

function startResize(event, position) {
  emit('resize-start', { event, position, elementId: props.elementId })
}

function startReparent(event) {
  emit('reparent-start', { event, elementId: props.elementId })
}
</script>

<style scoped>
.resize-handles {
  position: absolute;
  inset: -6px;
  pointer-events: none;
  z-index: 1000;
}

.resize-handle {
  position: absolute;
  pointer-events: auto;
  background: #fff;
  border: 2px solid var(--color-accent, #2196F3);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease, background 0.15s ease;
}

.resize-handle:hover {
  transform: scale(1.2);
  background: var(--color-accent, #2196F3);
}

/* Круглые handle'ы для resize (○) */
.resize-handle--circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* Квадратный handle для reparent (■) */
.resize-handle--square {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: move;
}

/* Позиционирование handle'ов */

/* Верхний ряд */
.resize-handle--top-left {
  top: -5px;
  left: -5px;
}

.resize-handle--top-center {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.resize-handle--top-right {
  top: -5px;
  right: -5px;
}

/* Средний ряд */
.resize-handle--middle-left {
  top: 50%;
  left: -5px;
  transform: translateY(-50%);
}

.resize-handle--center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.resize-handle--middle-right {
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
}

/* Нижний ряд */
.resize-handle--bottom-left {
  bottom: -5px;
  left: -5px;
}

.resize-handle--bottom-center {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.resize-handle--bottom-right {
  bottom: -5px;
  right: -5px;
}

/* Компенсируем transform при hover для handle'ов с существующим transform */
.resize-handle--top-center:hover,
.resize-handle--bottom-center:hover {
  transform: translateX(-50%) scale(1.2);
}

.resize-handle--middle-left:hover,
.resize-handle--middle-right:hover {
  transform: translateY(-50%) scale(1.2);
}

.resize-handle--center:hover {
  transform: translate(-50%, -50%) scale(1.2);
}
</style>

