import { v4 as uuidv4 } from 'uuid'
import { APP_CONFIG } from '@/constants/config'

/**
 * Модель проекта
 */
export class Project {
  constructor(config = {}) {
    this.id = config.id || uuidv4()
    this.name = config.name || APP_CONFIG.defaultProject.name
    this.version = config.version || '1.0.0'

    // Элементы (Map для быстрого доступа по ID)
    this.elements = config.elements || new Map()
    this.rootElements = config.rootElements || []

    // Настройки canvas
    this.canvas = config.canvas || {
      width: APP_CONFIG.defaultProject.canvasWidth,
      height: APP_CONFIG.defaultProject.canvasHeight,
      gridSize: APP_CONFIG.defaultProject.gridSize,
      backgroundColor: '#ffffff',
      snapToGrid: true
    }

    // Глобальные стили
    this.globalStyles = config.globalStyles || {
      fonts: [],
      cssVariables: {},
      resetCSS: true
    }

    // Метаданные
    this.metadata = config.metadata || {
      createdAt: new Date(),
      updatedAt: new Date(),
      author: ''
    }
  }

  /**
   * Добавить элемент
   */
  addElement(element) {
    this.elements.set(element.id, element)
    
    // Если нет родителя - добавляем в корневые
    if (!element.parentId) {
      if (!this.rootElements.includes(element.id)) {
        this.rootElements.push(element.id)
      }
    } else {
      // Если есть родитель - добавляем в его children
      const parent = this.elements.get(element.parentId)
      if (parent && !parent.children.includes(element.id)) {
        parent.children.push(element.id)
      }
    }
    
    this.metadata.updatedAt = new Date()
  }

  /**
   * Удалить элемент
   */
  removeElement(elementId) {
    const element = this.elements.get(elementId)
    if (!element) return

    // Удаляем детей рекурсивно
    element.children.forEach(childId => {
      this.removeElement(childId)
    })

    // Удаляем из родителя
    if (element.parentId) {
      const parent = this.elements.get(element.parentId)
      if (parent) {
        parent.children = parent.children.filter(id => id !== elementId)
      }
    } else {
      // Удаляем из корневых
      this.rootElements = this.rootElements.filter(id => id !== elementId)
    }

    // Удаляем элемент
    this.elements.delete(elementId)
    this.metadata.updatedAt = new Date()
  }

  /**
   * Получить элемент по ID
   */
  getElementById(id) {
    return this.elements.get(id)
  }

  /**
   * Получить детей элемента
   */
  getChildren(parentId) {
    return Array.from(this.elements.values()).filter(el => el.parentId === parentId)
  }

  /**
   * Получить корневые элементы
   */
  getRootElements() {
    return this.rootElements.map(id => this.elements.get(id)).filter(Boolean)
  }

  /**
   * Сериализация
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      elements: Array.from(this.elements.values()).map(el => el.toJSON()),
      rootElements: this.rootElements,
      canvas: this.canvas,
      globalStyles: this.globalStyles,
      metadata: {
        ...this.metadata,
        createdAt: this.metadata.createdAt.toISOString(),
        updatedAt: this.metadata.updatedAt.toISOString()
      }
    }
  }

  /**
   * Десериализация
   */
  static fromJSON(json) {
    // Восстанавливаем элементы
    const elements = new Map()
    json.elements.forEach(elementData => {
      const { Element } = require('./Element')
      const element = Element.fromJSON(elementData)
      elements.set(element.id, element)
    })

    return new Project({
      id: json.id,
      name: json.name,
      version: json.version,
      elements,
      rootElements: json.rootElements,
      canvas: json.canvas,
      globalStyles: json.globalStyles,
      metadata: {
        ...json.metadata,
        createdAt: new Date(json.metadata.createdAt),
        updatedAt: new Date(json.metadata.updatedAt)
      }
    })
  }
}

