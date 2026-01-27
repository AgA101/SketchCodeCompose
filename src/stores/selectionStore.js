import { defineStore } from 'pinia'
import { useProjectStore } from './projectStore'

export const useSelectionStore = defineStore('selection', {
  state: () => ({
    selectedIds: [],
    hoveredId: null
  }),

  getters: {
    /**
     * Выбранные элементы
     */
    selectedElements: state => {
      const projectStore = useProjectStore()
      return state.selectedIds
        .map(id => projectStore.getElementById(id))
        .filter(Boolean)
    },

    /**
     * Один выбранный элемент
     */
    singleSelection: state => {
      if (state.selectedIds.length !== 1) return null
      
      const projectStore = useProjectStore()
      return projectStore.getElementById(state.selectedIds[0])
    },

    /**
     * Есть ли выделение
     */
    hasSelection: state => state.selectedIds.length > 0,

    /**
     * Множественное выделение
     */
    isMultipleSelection: state => state.selectedIds.length > 1,

    /**
     * Выбран ли элемент
     */
    isSelected: state => id => state.selectedIds.includes(id),

    /**
     * Наведен ли курсор на элемент
     */
    isHovered: state => id => state.hoveredId === id
  },

  actions: {
    /**
     * Выбрать элемент
     */
    select(id, addToSelection = false) {
      if (addToSelection) {
        // Добавляем к текущему выделению
        if (!this.selectedIds.includes(id)) {
          this.selectedIds.push(id)
        }
      } else {
        // Заменяем выделение
        this.selectedIds = [id]
      }
    },

    /**
     * Выбрать несколько элементов
     */
    selectMultiple(ids) {
      this.selectedIds = [...new Set(ids)]
    },

    /**
     * Снять выделение
     */
    deselect(id) {
      if (id) {
        this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id)
      } else {
        this.selectedIds = []
      }
    },

    /**
     * Снять все выделения
     */
    deselectAll() {
      this.selectedIds = []
    },

    /**
     * Toggle выделение
     */
    toggle(id) {
      if (this.selectedIds.includes(id)) {
        this.deselect(id)
      } else {
        this.select(id, true)
      }
    },

    /**
     * Установить hover
     */
    setHovered(id) {
      this.hoveredId = id
    },

    /**
     * Убрать hover
     */
    clearHovered() {
      this.hoveredId = null
    },

    /**
     * Выбрать все элементы
     */
    selectAll() {
      const projectStore = useProjectStore()
      this.selectedIds = projectStore.elements.map(el => el.id)
    }
  }
})

