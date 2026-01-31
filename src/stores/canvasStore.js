import { defineStore } from 'pinia'

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    // Zoom и Pan
    zoom: 1.0,
    pan: { x: 0, y: 0 },

    // Настройки отображения
    showGrid: true,
    gridSize: 8, // 1, 2, 4, 8, 16, 32, 64 или custom
    showRulers: false,
    showSemanticHighlight: false,

    // Snap настройки
    snapToGrid: true,
    snapToElements: false, // Пока не реализовано
    snapToCenter: false, // Для Smart Guides
    snapDistance: 5, // пикселей для snap to elements

    // Текущий инструмент
    tool: 'select', // 'select' | 'block' | 'hand' | 'zoom'

    // Smart guides
    guides: [], // Массив активных направляющих
    spacingIndicators: [] // Индикаторы расстояний
  }),

  getters: {
    /**
     * Можно ли увеличить zoom
     */
    canZoomIn: state => state.zoom < 5,

    /**
     * Можно ли уменьшить zoom
     */
    canZoomOut: state => state.zoom > 0.1,

    /**
     * Zoom в процентах
     */
    zoomPercent: state => Math.round(state.zoom * 100)
  },

  actions: {
    /**
     * Установить zoom
     */
    setZoom(zoom) {
      this.zoom = Math.max(0.1, Math.min(5, zoom))
    },

    /**
     * Увеличить zoom на 10%
     */
    zoomIn() {
      this.setZoom(this.zoom * 1.1)
    },

    /**
     * Уменьшить zoom на 10%
     */
    zoomOut() {
      this.setZoom(this.zoom / 1.1)
    },

    /**
     * Сбросить zoom
     */
    resetZoom() {
      this.zoom = 1.0
    },

    /**
     * Zoom to fit
     */
    zoomToFit() {
      // TODO: вычислить zoom чтобы все элементы влезли
      this.zoom = 1.0
      this.pan = { x: 0, y: 0 }
    },

    /**
     * Установить pan
     */
    setPan(x, y) {
      // Ограничиваем pan: оставляем небольшой отступ (100px) чтобы видеть границу
      // Вправо и вниз — можно бесконечно
      const BORDER_OFFSET = 25
      this.pan = { 
        x: Math.min(BORDER_OFFSET, x), 
        y: Math.min(BORDER_OFFSET, y) 
      }
    },

    /**
     * Сдвинуть canvas
     */
    panBy(deltaX, deltaY) {
      this.setPan(this.pan.x + deltaX, this.pan.y + deltaY)
    },

    /**
     * Переключить сетку
     */
    toggleGrid() {
      this.showGrid = !this.showGrid
    },

    /**
     * Установить размер сетки
     */
    setGridSize(size) {
      this.gridSize = Math.max(1, Math.min(64, size))
    },
    
    /**
     * Переключить snap to grid
     */
    toggleSnapToGrid() {
      this.snapToGrid = !this.snapToGrid
    },

    /**
     * Переключить линейки
     */
    toggleRulers() {
      this.showRulers = !this.showRulers
    },

    /**
     * Переключить семантическую подсветку
     */
    toggleSemanticHighlight() {
      this.showSemanticHighlight = !this.showSemanticHighlight
    },

    /**
     * Выбрать инструмент
     */
    setTool(tool) {
      this.tool = tool
    },

    /**
     * Установить направляющие
     */
    setGuides(guides) {
      this.guides = guides
    },

    /**
     * Очистить направляющие
     */
    clearGuides() {
      this.guides = []
      this.spacingIndicators = []
    },

    /**
     * Установить индикаторы расстояний
     */
    setSpacingIndicators(indicators) {
      this.spacingIndicators = indicators
    }
  }
})

