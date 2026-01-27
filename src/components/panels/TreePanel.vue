<template>
  <div class="tree-panel">
    <!-- Header -->
    <div class="panel-header">
      <button class="tab-button active">📁 Tree</button>
      
      <!-- Mini Mode: Show Canvas button -->
      <button
        v-if="isMiniModeCode"
        class="mini-toggle-button"
        @click="switchToCanvas"
        title="Switch to Canvas & Properties view"
      >
        🎨 Show Canvas
      </button>
    </div>

    <!-- Content -->
    <div class="panel-content">
      <p>Tree (скоро)</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()

const isMiniModeCode = computed(() => 
  layoutStore.currentPreset === 'mini' && layoutStore.miniMode === 'code'
)

function switchToCanvas() {
  layoutStore.toggleMiniMode()
  layoutStore.saveLayout()
}
</script>

<style scoped>
.tree-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
}

.tab-button {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.tab-button.active {
  background-color: var(--color-accent);
  color: white;
}

.mini-toggle-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--color-accent);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition-fast);
  margin-left: auto;
}

.mini-toggle-button:hover {
  background-color: var(--color-accent-hover);
  transform: scale(1.05);
}

.panel-content {
  flex: 1;
  padding: var(--spacing-md);
  overflow: auto;
}
</style>

