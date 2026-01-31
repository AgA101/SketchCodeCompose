import { defineStore } from 'pinia'
import { Project } from '@/core/models/Project'
import { recalculateRelativePosition } from '@/core/utils/geometry'
import { Element } from '@/core/models/Element'
import { VIRTUAL_ROOT_ID } from '@/constants/elementTypes'

export const useProjectStore = defineStore('project', {
  state: () => ({
    project: null,
    isDirty: false,
    lastSaved: null
  }),

  getters: {
    /**
     * Все элементы как массив
     */
    elements: state => {
      if (!state.project) return []
      return Array.from(state.project.elements.values())
    },

    /**
     * Получить элемент по ID
     */
    getElementById: state => id => {
      if (!state.project) return null
      return state.project.getElementById(id)
    },

    /**
     * Получить детей элемента
     */
    getChildrenOf: state => parentId => {
      if (!state.project) return []
      return state.project.getChildren(parentId)
    },

    /**
     * Проверка есть ли несохраненные изменения
     */
    hasUnsavedChanges: state => state.isDirty
  },

  actions: {
    /**
     * Создать новый проект
     */
    createNewProject(name) {
      this.project = new Project({ name })
      this.isDirty = false
      this.lastSaved = null
    },

    /**
     * Загрузить проект
     */
    loadProject(projectData) {
      this.project = Project.fromJSON(projectData)
      this.isDirty = false
      this.lastSaved = new Date()
    },

    /**
     * Добавить элемент
     */
    addElement(element) {
      if (!this.project) return

      this.project.addElement(element)
      this.isDirty = true
    },

    /**
     * Обновить элемент
     */
    updateElement(id, updates) {
      if (!this.project) return

      const element = this.project.getElementById(id)
      if (!element) return

      // Если меняется родитель - обновляем children у старого и нового родителя
      if (updates.parentId !== undefined && updates.parentId !== element.parentId) {
        // null => VIRTUAL_ROOT_ID
        const oldParentId = element.parentId || VIRTUAL_ROOT_ID
        const newParentId = updates.parentId || VIRTUAL_ROOT_ID
        
        console.log('📦 Reparenting element:', {
          elementId: id,
          oldParentId,
          newParentId
        })
        
        // Удаляем из children старого родителя
        const oldParent = this.project.getElementById(oldParentId)
        if (oldParent && oldParent.children) {
          oldParent.children = oldParent.children.filter(childId => childId !== id)
        }
        
        // Добавляем в children нового родителя
        const newParent = this.project.getElementById(newParentId)
        if (newParent) {
          if (!newParent.children) {
            newParent.children = []
          }
          if (!newParent.children.includes(id)) {
            newParent.children.push(id)
          }
        }
        
        console.log('📦 After reparenting:', {
          newParentChildren: newParent?.children || []
        })
        
        // Пересчитываем относительные координаты для нового родителя
        // Виртуальный root не имеет координат, используем null
        const newParentForCalc = newParentId === VIRTUAL_ROOT_ID ? null : newParent
        const newRelativePos = recalculateRelativePosition(
          element,
          newParentForCalc,
          (id) => this.project.getElementById(id)
        )
        
        console.log('📍 Recalculated position:', {
          oldPos: element.relativePosition,
          newPos: newRelativePos
        })
        
        // Обновляем позицию
        updates.relativePosition = {
          ...element.relativePosition,
          ...newRelativePos
        }
      }

      // Обновляем свойства
      Object.assign(element, updates)
      this.project.metadata.updatedAt = new Date()
      this.isDirty = true
    },

    /**
     * Удалить элемент
     */
    deleteElement(id) {
      if (!this.project) return

      this.project.removeElement(id)
      this.isDirty = true
    },

    /**
     * Обновить стили элемента
     */
    updateElementStyles(id, styles) {
      if (!this.project) return

      const element = this.project.getElementById(id)
      if (!element) return

      element.styles = { ...element.styles, ...styles }
      this.project.metadata.updatedAt = new Date()
      this.isDirty = true
    },

    /**
     * Обновить layout элемента
     */
    updateElementLayout(id, layout) {
      if (!this.project) return

      const element = this.project.getElementById(id)
      if (!element) return

      element.layout = { ...element.layout, ...layout }
      this.project.metadata.updatedAt = new Date()
      this.isDirty = true
    },

    /**
     * Изменить тип элемента
     */
    changeElementType(id, newType) {
      if (!this.project) return

      const element = this.project.getElementById(id)
      if (!element) return

      element.type = newType
      element.metadata.cssClass = element.generateDefaultClass()
      this.project.metadata.updatedAt = new Date()
      this.isDirty = true
    },

    /**
     * Сохранить проект
     */
    async save() {
      if (!this.project) return

      try {
        const serialized = JSON.stringify(this.project.toJSON())
        localStorage.setItem(`project_${this.project.id}`, serialized)
        
        this.lastSaved = new Date()
        this.isDirty = false
        
        return true
      } catch (error) {
        console.error('Failed to save project:', error)
        return false
      }
    },

    /**
     * Загрузить проект из localStorage
     */
    async loadFromStorage(projectId) {
      try {
        const data = localStorage.getItem(`project_${projectId}`)
        if (!data) return false

        const projectData = JSON.parse(data)
        this.loadProject(projectData)
        
        return true
      } catch (error) {
        console.error('Failed to load project:', error)
        return false
      }
    },

    /**
     * Сбросить состояние
     */
    reset() {
      this.project = null
      this.isDirty = false
      this.lastSaved = null
    }
  }
})

