<template>
  <div class="canvas-panel">
    <div class="canvas-content">
      <!-- Floating Toolbar -->
      <FloatingToolbar />
      
      <!-- Canvas Area -->
      <div class="canvas-area">
        <p class="canvas-placeholder">Canvas Area</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import FloatingToolbar from '@/components/canvas/FloatingToolbar.vue'
</script>

<style scoped>
.canvas-panel {
  height: 100%;
  background-color: var(--color-bg-primary);
  position: relative;
}

.canvas-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.canvas-area {
  width: 100%;
  height: 100%;
}

.canvas-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-text-tertiary);
  font-size: 18px;
}
</style>

