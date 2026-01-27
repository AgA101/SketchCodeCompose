import { ELEMENT_TYPES } from './elementTypes'

// Цвета для семантической подсветки
export const SEMANTIC_COLORS = {
  STRUCTURE: '#8b5cf6', // Фиолетовый
  HEADING: '#3b82f6', // Синий
  TEXT: '#60a5fa', // Голубой
  INTERACTIVE: '#10b981', // Зеленый
  MEDIA: '#f59e0b', // Оранжевый
  LIST: '#ec4899' // Розовый
}

// Маппинг типов элементов на цвета
export const ELEMENT_TYPE_TO_COLOR = {
  // Структурные - фиолетовый
  [ELEMENT_TYPES.CONTAINER]: SEMANTIC_COLORS.STRUCTURE,
  [ELEMENT_TYPES.SECTION]: SEMANTIC_COLORS.STRUCTURE,
  [ELEMENT_TYPES.HEADER]: SEMANTIC_COLORS.STRUCTURE,
  [ELEMENT_TYPES.FOOTER]: SEMANTIC_COLORS.STRUCTURE,
  [ELEMENT_TYPES.MAIN]: SEMANTIC_COLORS.STRUCTURE,
  [ELEMENT_TYPES.NAV]: SEMANTIC_COLORS.STRUCTURE,

  // Заголовки - синий
  [ELEMENT_TYPES.HEADING_1]: SEMANTIC_COLORS.HEADING,
  [ELEMENT_TYPES.HEADING_2]: SEMANTIC_COLORS.HEADING,
  [ELEMENT_TYPES.HEADING_3]: SEMANTIC_COLORS.HEADING,
  [ELEMENT_TYPES.HEADING_4]: SEMANTIC_COLORS.HEADING,
  [ELEMENT_TYPES.HEADING_5]: SEMANTIC_COLORS.HEADING,
  [ELEMENT_TYPES.HEADING_6]: SEMANTIC_COLORS.HEADING,

  // Текст - голубой
  [ELEMENT_TYPES.TEXT]: SEMANTIC_COLORS.TEXT,

  // Интерактивные - зеленый
  [ELEMENT_TYPES.BUTTON]: SEMANTIC_COLORS.INTERACTIVE,
  [ELEMENT_TYPES.LINK]: SEMANTIC_COLORS.INTERACTIVE,
  [ELEMENT_TYPES.INPUT]: SEMANTIC_COLORS.INTERACTIVE,

  // Медиа - оранжевый
  [ELEMENT_TYPES.IMAGE]: SEMANTIC_COLORS.MEDIA,
  [ELEMENT_TYPES.VIDEO]: SEMANTIC_COLORS.MEDIA,

  // Списки - розовый
  [ELEMENT_TYPES.UNORDERED_LIST]: SEMANTIC_COLORS.LIST,
  [ELEMENT_TYPES.ORDERED_LIST]: SEMANTIC_COLORS.LIST,
  [ELEMENT_TYPES.LIST_ITEM]: SEMANTIC_COLORS.LIST
}

// Легенда для семантической подсветки
export const SEMANTIC_LEGEND = [
  {
    label: 'Structure',
    color: SEMANTIC_COLORS.STRUCTURE,
    description: '<div>, <section>, <header>, <footer>, <nav>, <main>',
    emoji: '🟣'
  },
  {
    label: 'Headings',
    color: SEMANTIC_COLORS.HEADING,
    description: '<h1> - Main title, <h2> - Section, <h3> - Subsection',
    emoji: '🔵'
  },
  {
    label: 'Text',
    color: SEMANTIC_COLORS.TEXT,
    description: '<p> - Paragraph, <span> - Inline text',
    emoji: '🔵'
  },
  {
    label: 'Interactive',
    color: SEMANTIC_COLORS.INTERACTIVE,
    description: '<button>, <a> - Link, <input> - Form input',
    emoji: '🟢'
  },
  {
    label: 'Media',
    color: SEMANTIC_COLORS.MEDIA,
    description: '<img> - Image, <video> - Video',
    emoji: '🟠'
  },
  {
    label: 'Lists',
    color: SEMANTIC_COLORS.LIST,
    description: '<ul> - Unordered, <ol> - Ordered, <li> - Item',
    emoji: '🌸'
  }
]

