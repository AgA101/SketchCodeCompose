import { defineStore } from 'pinia'
import { LAYOUT_PRESETS, PRESET_CONFIGS } from '@/constants/layoutPresets'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    currentPreset: LAYOUT_PRESETS.DEFAULT,
    miniMode: 'canvas', // 'canvas' | 'code' (для mini режима)
    
    // Текущие ширины панелей
    panelWidths: {
      canvas: 40,
      middle: 20,
      properties: 0,
      tree: 0,
      code: 40,
    },
    
    // Какие панели видимы
    visiblePanels: ['canvas', 'middle', 'code'],
  }),

  getters: {
    activePresetConfig(state) {
      return PRESET_CONFIGS[state.currentPreset]
    },

    isMiniMode(state) {
      return state.currentPreset === LAYOUT_PRESETS.MINI
    },

    isDeveloperMode(state) {
      return state.currentPreset === LAYOUT_PRESETS.DEVELOPER
    },

    availablePresets() {
      return Object.values(LAYOUT_PRESETS).map((preset) => ({
        id: preset,
        ...PRESET_CONFIGS[preset],
      }))
    },
  },

  actions: {
    setPreset(presetName) {
      const config = PRESET_CONFIGS[presetName]
      if (!config) return

      this.currentPreset = presetName

      // Для mini режима
      if (presetName === LAYOUT_PRESETS.MINI) {
        this.applyMiniMode(this.miniMode)
        return
      }

      // Для остальных режимов
      this.visiblePanels = config.panels
      this.panelWidths = { ...this.panelWidths, ...config.widths }
    },

    applyMiniMode(mode) {
      this.miniMode = mode
      const config = PRESET_CONFIGS[LAYOUT_PRESETS.MINI].modes[mode]
      
      if (config) {
        this.visiblePanels = config.panels
        this.panelWidths = { ...this.panelWidths, ...config.widths }
      }
    },

    toggleMiniMode() {
      if (!this.isMiniMode) return
      
      const newMode = this.miniMode === 'canvas' ? 'code' : 'canvas'
      this.applyMiniMode(newMode)
    },

    updatePanelWidth(panelName, width) {
      this.panelWidths[panelName] = width
      
      // Если пользователь меняет размеры вручную - переключаемся на custom
      if (this.currentPreset !== LAYOUT_PRESETS.CUSTOM) {
        this.currentPreset = LAYOUT_PRESETS.CUSTOM
      }
    },

    isPanelVisible(panelName) {
      return this.visiblePanels.includes(panelName)
    },

    loadLayout() {
      try {
        const saved = localStorage.getItem('sketchcodecompose_layout')
        if (saved) {
          const data = JSON.parse(saved)
          Object.assign(this.$state, data)
        }
      } catch (e) {
        console.error('Failed to load layout from localStorage', e)
      }
    },

    saveLayout() {
      try {
        localStorage.setItem('sketchcodecompose_layout', JSON.stringify(this.$state))
      } catch (e) {
        console.error('Failed to save layout to localStorage', e)
      }
    },
  },
})

