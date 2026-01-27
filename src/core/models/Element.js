import { v4 as uuidv4 } from 'uuid'
import { ELEMENT_TYPES } from '@/constants/elementTypes'

/**
 * Модель элемента
 */
export class Element {
  constructor(config = {}) {
    this.id = config.id || uuidv4()
    this.type = config.type || ELEMENT_TYPES.CONTAINER
    this.parentId = config.parentId || null
    this.children = config.children || []

    // Позиция относительно родителя
    this.relativePosition = config.relativePosition || {
      offsetX: 0,
      offsetY: 0,
      width: 200,
      height: 100
    }

    // Layout для контейнеров
    this.layout = config.layout || null

    // CSS стили
    this.styles = config.styles || {}

    // HTML атрибуты
    this.attributes = config.attributes || {
      textContent: '',
      placeholder: '',
      src: '',
      alt: '',
      href: ''
    }

    // Метаданные
    this.metadata = config.metadata || {
      locked: false,
      visible: true,
      name: this.generateDefaultName(),
      cssClass: this.generateDefaultClass()
    }
  }

  /**
   * Генерирует дефолтное название
   */
  generateDefaultName() {
    const typeName = this.type.split('-')[0]
    return `${typeName}_${this.id.slice(0, 8)}`
  }

  /**
   * Генерирует дефолтное имя CSS класса
   */
  generateDefaultClass() {
    return this.type.replace(/-/g, '-')
  }

  /**
   * Проверяет является ли элемент контейнером
   */
  isContainer() {
    return [
      ELEMENT_TYPES.CONTAINER,
      ELEMENT_TYPES.SECTION,
      ELEMENT_TYPES.HEADER,
      ELEMENT_TYPES.FOOTER,
      ELEMENT_TYPES.MAIN,
      ELEMENT_TYPES.NAV
    ].includes(this.type)
  }

  /**
   * Клонирование элемента
   */
  clone() {
    const cloned = new Element({
      ...this,
      id: uuidv4(),
      children: this.children.map(child => child.clone())
    })
    cloned.metadata.name = `${this.metadata.name}_copy`
    return cloned
  }

  /**
   * Сериализация для сохранения
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      parentId: this.parentId,
      children: this.children.map(child => child.id),
      relativePosition: this.relativePosition,
      layout: this.layout,
      styles: this.styles,
      attributes: this.attributes,
      metadata: this.metadata
    }
  }

  /**
   * Десериализация
   */
  static fromJSON(json) {
    return new Element(json)
  }
}

