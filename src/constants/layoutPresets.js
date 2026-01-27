/**
 * Layout Presets для разных сценариев работы
 */

export const LAYOUT_PRESETS = {
  DEFAULT: 'default',
  DESIGNER: 'designer',
  DEVELOPER: 'developer',
  MINI: 'mini',
  CUSTOM: 'custom',
}

export const PRESET_CONFIGS = {
  [LAYOUT_PRESETS.DEFAULT]: {
    name: 'Default',
    description: 'Balanced layout for all tasks',
    icon: '⚖️',
    panels: ['canvas', 'middle', 'code'],
    widths: {
      canvas: 40,
      middle: 20,
      code: 40,
    },
  },

  [LAYOUT_PRESETS.DESIGNER]: {
    name: 'Designer',
    description: 'Focus on canvas and properties',
    icon: '🎨',
    panels: ['canvas', 'middle'],
    widths: {
      canvas: 70,
      middle: 30,
    },
  },

  [LAYOUT_PRESETS.DEVELOPER]: {
    name: 'Developer',
    description: 'All panels visible (large screens)',
    icon: '💻',
    panels: ['canvas', 'properties', 'tree', 'code'],
    widths: {
      canvas: 35,
      properties: 15,
      tree: 15,
      code: 35,
    },
  },

  [LAYOUT_PRESETS.MINI]: {
    name: 'Mini',
    description: 'Switch between canvas/code (small screens)',
    icon: '📱',
    // В mini режиме две конфигурации
    modes: {
      canvas: {
        panels: ['canvas', 'middle'],
        widths: {
          canvas: 70,
          middle: 30,
        },
      },
      code: {
        panels: ['code', 'tree'],
        widths: {
          code: 70,
          tree: 30,
        },
      },
    },
    defaultMode: 'canvas',
  },

  [LAYOUT_PRESETS.CUSTOM]: {
    name: 'Custom',
    description: 'Your custom layout',
    icon: '⚙️',
    panels: ['canvas', 'middle', 'code'],
    widths: {
      canvas: 40,
      middle: 20,
      code: 40,
    },
  },
}

export function getPresetConfig(presetName) {
  return PRESET_CONFIGS[presetName] || PRESET_CONFIGS[LAYOUT_PRESETS.DEFAULT]
}

