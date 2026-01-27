export const APP_CONFIG = {
  name: 'SketchCodeCompose',
  version: '0.1.0',
  description: 'Visual HTML/CSS Composer',

  github: 'https://github.com/yourusername/sketchcodecompose',
  docs: 'https://sketchcodecompose.dev/docs',

  defaultProject: {
    name: 'Untitled Project',
    canvasWidth: 1920,
    canvasHeight: 1080,
    gridSize: 8
  },

  limits: {
    maxElements: 1000,
    maxHistorySize: 50,
    maxProjectSize: 10 * 1024 * 1024 // 10 MB
  },

  autosave: {
    interval: 30000, // 30 seconds
    enabled: true
  }
}

