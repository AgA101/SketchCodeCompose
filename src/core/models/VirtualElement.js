import { Element } from './Element'
import { VIRTUAL_ROOT_ID, ELEMENT_TYPES } from '@/constants/elementTypes'

/**
 * Виртуальный корневой элемент
 * Специальный элемент-контейнер для всех корневых элементов проекта
 * Не рендерится визуально, служит только для упрощения логики иерархии
 */
export class VirtualElement extends Element {
  constructor() {
    super({
      id: VIRTUAL_ROOT_ID,
      type: ELEMENT_TYPES.VIRTUAL,
      parentId: null,
      children: [],
      // У виртуального элемента нет позиции
      relativePosition: null,
      styles: {},
      attributes: {},
      metadata: {
        name: 'Virtual Root',
        visible: false,
        locked: true,
        isVirtual: true
      }
    })
  }
}

