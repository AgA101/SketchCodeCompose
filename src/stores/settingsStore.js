import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // UI
    theme: 'light', // 'light' | 'dark'
    compactMode: false,

    // Toolbar
    pinnedTools: ['semantics', 'grid', 'undo', 'redo'],
    toolbarPreset: 'default', // 'minimal' | 'designer' | 'developer' | 'default'

    // Auto-save
    autoSaveEnabled: true,
    autoSaveInterval: 30, // секунды

    // Canvas
    defaultGridSize: 8,
    snapDistance: 5, // px

    // Code generation
    cssNaming: 'kebab-case', // 'bem' | 'camelCase' | 'kebab-case'
    indentation: 2,

    // Semantics
    semanticHighlightEnabled: false,
    showSemanticLegend: true,
    showTagsOnHover: true
  }),

  getters: {
    /**
     * Темная тема активна
     */
    isDarkMode: state => state.theme === 'dark',

    /**
     * Интервал автосохранения в миллисекундах
     */
    autoSaveIntervalMs: state => state.autoSaveInterval * 1000
  },

  actions: {
    /**
     * Переключить тему
     */
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.save()
    },

    /**
     * Установить тему
     */
    setTheme(theme) {
      this.theme = theme
      this.save()
    },

    /**
     * Закрепить инструмент в toolbar
     */
    pinTool(toolId) {
      if (!this.pinnedTools.includes(toolId)) {
        this.pinnedTools.push(toolId)
        this.save()
      }
    },

    /**
     * Открепить инструмент
     */
    unpinTool(toolId) {
      this.pinnedTools = this.pinnedTools.filter(id => id !== toolId)
      this.save()
    },

    /**
     * Установить preset toolbar
     */
    setToolbarPreset(preset) {
      this.toolbarPreset = preset

      // Устанавливаем соответствующие закрепленные инструменты
      switch (preset) {
        case 'minimal':
          this.pinnedTools = []
          break
        case 'designer':
          this.pinnedTools = ['semantics', 'grid', 'rulers']
          break
        case 'developer':
          this.pinnedTools = ['undo', 'redo', 'save']
          break
        case 'default':
          this.pinnedTools = ['semantics', 'grid', 'undo', 'redo']
          break
      }

      this.save()
    },

    /**
     * Загрузить настройки
     */
    load() {
      try {
        const saved = localStorage.getItem('settings')
        if (saved) {
          const settings = JSON.parse(saved)
          Object.assign(this.$state, settings)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    },

    /**
     * Сохранить настройки
     */
    save() {
      try {
        localStorage.setItem('settings', JSON.stringify(this.$state))
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    },

    /**
     * Сбросить настройки
     */
    reset() {
      this.$reset()
      this.save()
    }
  }
})

