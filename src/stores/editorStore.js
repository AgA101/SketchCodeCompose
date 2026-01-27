import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    openFiles: [], // Array<{ id: string, name: string, type: 'html' | 'css', content: string }>
    activeFileId: null, // string | null
  }),

  getters: {
    activeFile(state) {
      return state.openFiles.find((file) => file.id === state.activeFileId)
    },

    hasOpenFiles(state) {
      return state.openFiles.length > 0
    },
  },

  actions: {
    openFile(file) {
      // Проверяем, не открыт ли уже файл
      const existing = this.openFiles.find((f) => f.id === file.id)
      if (existing) {
        this.activeFileId = file.id
        return
      }

      // Добавляем файл
      this.openFiles.push(file)
      this.activeFileId = file.id
    },

    closeFile(fileId) {
      const index = this.openFiles.findIndex((f) => f.id === fileId)
      if (index === -1) return

      this.openFiles.splice(index, 1)

      // Если закрыли активный файл, переключаемся на соседний
      if (this.activeFileId === fileId) {
        if (this.openFiles.length > 0) {
          // Берем предыдущий файл или первый
          const newIndex = Math.max(0, index - 1)
          this.activeFileId = this.openFiles[newIndex]?.id || null
        } else {
          this.activeFileId = null
        }
      }
    },

    setActiveFile(fileId) {
      this.activeFileId = fileId
    },

    updateFileContent(fileId, content) {
      const file = this.openFiles.find((f) => f.id === fileId)
      if (file) {
        file.content = content
      }
    },

    closeAllFiles() {
      this.openFiles = []
      this.activeFileId = null
    },
  },
})

