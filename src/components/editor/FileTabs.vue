<template>
  <div class="file-tabs" :class="{ 'file-tabs--with-menu': showMenu }">
    <!-- Menu Button для mini mode -->
    <MenuButton v-if="showMenu" class="file-tabs__menu" />
    
    <div class="file-tabs__list">
      <div
        v-for="file in openFiles"
        :key="file.id"
        class="file-tab"
        :class="{ 'file-tab--active': file.id === activeFileId }"
        @click="setActiveFile(file.id)"
      >
        <span class="file-tab__icon">{{ getFileIcon(file.type) }}</span>
        <span class="file-tab__name">{{ file.name }}</span>
        <button
          class="file-tab__close"
          @click.stop="closeFile(file.id)"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editorStore'
import MenuButton from '@/components/layout/MenuButton.vue'

const props = defineProps({
  showMenu: {
    type: Boolean,
    default: false,
  },
})

const editorStore = useEditorStore()

const openFiles = computed(() => editorStore.openFiles)
const activeFileId = computed(() => editorStore.activeFileId)

function setActiveFile(fileId) {
  editorStore.setActiveFile(fileId)
}

function closeFile(fileId) {
  editorStore.closeFile(fileId)
}

function getFileIcon(type) {
  const icons = {
    html: '🌐',
    css: '🎨',
    js: '⚡',
    json: '📋',
    default: '📄',
  }
  return icons[type] || icons.default
}
</script>

<style scoped>
.file-tabs {
  background-color: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
}

.file-tabs--with-menu {
  gap: var(--spacing-sm);
  padding-left: var(--spacing-sm);
}

.file-tabs__menu {
  flex-shrink: 0;
}

.file-tabs__list {
  display: flex;
  gap: 0;
  min-height: 36px;
  flex: 1;
}

.file-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: transparent;
  border-right: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
  transition: all var(--transition-fast);
  cursor: pointer;
  flex-shrink: 0;
  max-width: 200px;
}

.file-tab:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.file-tab--active {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-accent);
}

.file-tab__icon {
  font-size: 14px;
  flex-shrink: 0;
}

.file-tab__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-tab__close {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 16px;
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.file-tab:hover .file-tab__close {
  opacity: 1;
}

.file-tab__close:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

/* Scrollbar styling */
.file-tabs::-webkit-scrollbar {
  height: 4px;
}

.file-tabs::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 2px;
}

.file-tabs::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-text-tertiary);
}
</style>

