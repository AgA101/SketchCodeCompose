<template>
  <div class="properties-panel">
    <!-- Header с табами/кнопками в зависимости от режима -->
    <div class="panel-header">
      <!-- Mini Mode: Properties + Show Code button -->
      <template v-if="isMiniModeCanvas">
        <button class="tab-button active">📊 Properties</button>
        <button class="mini-toggle-button" @click="switchToCode" title="Switch to Code & Tree view">
          💻 Show Code
        </button>
      </template>

      <!-- Default/Custom: Properties/Tree tabs -->
      <template v-else-if="showTreeToggle">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'properties' }"
          @click="activeTab = 'properties'"
        >
          📊 Properties
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'tree' }"
          @click="activeTab = 'tree'"
        >
          📁 Tree
        </button>
      </template>

      <!-- Designer/Developer: только Properties -->
      <template v-else>
        <button class="tab-button active">📊 Properties</button>
      </template>
    </div>

    <!-- Content -->
    <div class="panel-content">
      <p v-if="activeTab === 'properties' || !showTreeToggle">Properties (скоро)</p>
      <p v-else>Tree (скоро)</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()
const activeTab = ref('properties')

// Определяем режим
const isMiniModeCanvas = computed(() => 
  layoutStore.currentPreset === 'mini' && layoutStore.miniMode === 'canvas'
)

const showTreeToggle = computed(() => 
  layoutStore.currentPreset === 'default' || layoutStore.currentPreset === 'custom'
)

function switchToCode() {
  layoutStore.toggleMiniMode()
  layoutStore.saveLayout()
}
</script>

<style scoped>
.properties-panel {
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

.tab-button:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
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

