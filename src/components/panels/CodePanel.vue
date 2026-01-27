<template>
  <div class="code-panel">
    <!-- Header with tabs -->
    <div class="panel-header">
      <!-- Mini Mode: Menu button -->
      <MenuButton v-if="isMiniModeCode" />
      
      <!-- File Tabs -->
      <FileTabs v-if="hasOpenFiles" :show-menu="false" />
      
      <!-- Fallback tabs -->
      <template v-else>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'html' }"
          @click="openDemoFile('html')"
        >
          🌐 HTML
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'css' }"
          @click="openDemoFile('css')"
        >
          🎨 CSS
        </button>
      </template>
    </div>

    <!-- Content -->
    <div class="panel-content">
      <div v-if="activeFile" class="file-content">
        <pre><code>{{ activeFile.content }}</code></pre>
      </div>
      <div v-else class="empty-state">
        <p class="empty-state__icon">📝</p>
        <p class="empty-state__text">Откройте файл для редактирования</p>
        <p class="empty-state__hint">или создайте новый</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FileTabs from '@/components/editor/FileTabs.vue'
import MenuButton from '@/components/layout/MenuButton.vue'
import { useEditorStore } from '@/stores/editorStore'
import { useLayoutStore } from '@/stores/layoutStore'

const editorStore = useEditorStore()
const layoutStore = useLayoutStore()
const activeTab = ref('html')

const hasOpenFiles = computed(() => editorStore.hasOpenFiles)
const activeFile = computed(() => editorStore.activeFile)

const isMiniModeCode = computed(() => 
  layoutStore.currentPreset === 'mini' && layoutStore.miniMode === 'code'
)

// Demo files
function openDemoFile(type) {
  activeTab.value = type
  
  const demoFiles = {
    html: {
      id: 'demo-html',
      name: 'index.html',
      type: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
  </header>
  
  <main>
    <section class="hero">
      <h2>Beautiful Design</h2>
      <p>Created with SketchCodeCompose</p>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2026 My Website</p>
  </footer>
</body>
</html>`,
    },
    css: {
      id: 'demo-css',
      name: 'styles.css',
      type: 'css',
      content: `/* Global Styles */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f5f5f5;
}

/* Header */
header {
  background-color: #2c3e50;
  color: white;
  padding: 2rem;
  text-align: center;
}

/* Hero Section */
.hero {
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
}

.hero h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

/* Footer */
footer {
  background-color: #34495e;
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: 4rem;
}`,
    },
  }
  
  editorStore.openFile(demoFiles[type])
}
</script>

<style scoped>
.code-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
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

.panel-content {
  flex: 1;
  background-color: #1e1e1e;
  color: #d4d4d4;
  overflow: auto;
}

.file-content {
  height: 100%;
}

.file-content pre {
  margin: 0;
  padding: var(--spacing-md);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-tertiary);
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.empty-state__text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.empty-state__hint {
  font-size: 14px;
  color: var(--color-text-tertiary);
}
</style>

