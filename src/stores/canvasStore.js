import { defineStore } from 'pinia'

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    // Zoom и Pan
    zoom: 1.0,
    pan: { x: 0, y: 0 },

    // Настройки отображения
    showGrid: true,
    gridSize: 8,
    showRulers: false,
    showSemanticHighlight: false,

    // Snap настройки
    snapToGrid: true,
    snapToElements: true,
    snapToCenter: true,
    snapDistance: 5, // пикселей

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
     * Увеличить zoom
     */
    zoomIn() {
      this.setZoom(this.zoom * 1.2)
    },

    /**
     * Уменьшить zoom
     */
    zoomOut() {
      this.setZoom(this.zoom / 1.2)
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
      this.pan = { x, y }
    },

    /**
     * Сдвинуть canvas
     */
    panBy(deltaX, deltaY) {
      this.pan.x += deltaX
      this.pan.y += deltaY
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
      this.gridSize = Math.max(4, Math.min(64, size))
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

