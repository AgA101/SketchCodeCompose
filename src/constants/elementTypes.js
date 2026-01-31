// ID виртуального корневого элемента
export const VIRTUAL_ROOT_ID = '__virtual_root__'

// Типы элементов
export const ELEMENT_TYPES = {
  // Виртуальный (не рендерится)
  VIRTUAL: 'virtual',
  // Структурные
  CONTAINER: 'container',
  SECTION: 'section',
  HEADER: 'header',
  FOOTER: 'footer',
  MAIN: 'main',
  NAV: 'nav',

  // Текстовые
  TEXT: 'text',
  HEADING_1: 'heading-1',
  HEADING_2: 'heading-2',
  HEADING_3: 'heading-3',
  HEADING_4: 'heading-4',
  HEADING_5: 'heading-5',
  HEADING_6: 'heading-6',

  // Интерактивные
  BUTTON: 'button',
  LINK: 'link',
  INPUT: 'input',

  // Медиа
  IMAGE: 'image',
  VIDEO: 'video',

  // Списки
  UNORDERED_LIST: 'ul',
  ORDERED_LIST: 'ol',
  LIST_ITEM: 'li'
}

// Маппинг типов на HTML теги
export const ELEMENT_TYPE_TO_TAG = {
  [ELEMENT_TYPES.CONTAINER]: 'div',
  [ELEMENT_TYPES.SECTION]: 'section',
  [ELEMENT_TYPES.HEADER]: 'header',
  [ELEMENT_TYPES.FOOTER]: 'footer',
  [ELEMENT_TYPES.MAIN]: 'main',
  [ELEMENT_TYPES.NAV]: 'nav',

  [ELEMENT_TYPES.TEXT]: 'p',
  [ELEMENT_TYPES.HEADING_1]: 'h1',
  [ELEMENT_TYPES.HEADING_2]: 'h2',
  [ELEMENT_TYPES.HEADING_3]: 'h3',
  [ELEMENT_TYPES.HEADING_4]: 'h4',
  [ELEMENT_TYPES.HEADING_5]: 'h5',
  [ELEMENT_TYPES.HEADING_6]: 'h6',

  [ELEMENT_TYPES.BUTTON]: 'button',
  [ELEMENT_TYPES.LINK]: 'a',
  [ELEMENT_TYPES.INPUT]: 'input',

  [ELEMENT_TYPES.IMAGE]: 'img',
  [ELEMENT_TYPES.VIDEO]: 'video',

  [ELEMENT_TYPES.UNORDERED_LIST]: 'ul',
  [ELEMENT_TYPES.ORDERED_LIST]: 'ol',
  [ELEMENT_TYPES.LIST_ITEM]: 'li'
}

// Дружественные названия
export const ELEMENT_TYPE_LABELS = {
  [ELEMENT_TYPES.CONTAINER]: 'Container (div)',
  [ELEMENT_TYPES.SECTION]: 'Section',
  [ELEMENT_TYPES.HEADER]: 'Header',
  [ELEMENT_TYPES.FOOTER]: 'Footer',
  [ELEMENT_TYPES.MAIN]: 'Main',
  [ELEMENT_TYPES.NAV]: 'Navigation',

  [ELEMENT_TYPES.TEXT]: 'Text (p)',
  [ELEMENT_TYPES.HEADING_1]: 'Heading 1 (h1)',
  [ELEMENT_TYPES.HEADING_2]: 'Heading 2 (h2)',
  [ELEMENT_TYPES.HEADING_3]: 'Heading 3 (h3)',
  [ELEMENT_TYPES.HEADING_4]: 'Heading 4 (h4)',
  [ELEMENT_TYPES.HEADING_5]: 'Heading 5 (h5)',
  [ELEMENT_TYPES.HEADING_6]: 'Heading 6 (h6)',

  [ELEMENT_TYPES.BUTTON]: 'Button',
  [ELEMENT_TYPES.LINK]: 'Link (a)',
  [ELEMENT_TYPES.INPUT]: 'Input',

  [ELEMENT_TYPES.IMAGE]: 'Image (img)',
  [ELEMENT_TYPES.VIDEO]: 'Video',

  [ELEMENT_TYPES.UNORDERED_LIST]: 'Unordered List (ul)',
  [ELEMENT_TYPES.ORDERED_LIST]: 'Ordered List (ol)',
  [ELEMENT_TYPES.LIST_ITEM]: 'List Item (li)'
}

