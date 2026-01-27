import { onMounted, onUnmounted } from 'vue'

/**
 * Обработка горячих клавиш
 */
export function useKeyboard() {
  const shortcuts = new Map()

  /**
   * Регистрация shortcut
   */
  const register = (keys, handler) => {
    shortcuts.set(keys, handler)
  }

  /**
   * Удаление shortcut
   */
  const unregister = keys => {
    shortcuts.delete(keys)
  }

  /**
   * Построение строки клавиш из события
   */
  const buildKeyString = event => {
    const parts = []

    if (event.ctrlKey || event.metaKey) parts.push('ctrl')
    if (event.shiftKey) parts.push('shift')
    if (event.altKey) parts.push('alt')

    const key = event.key.toLowerCase()
    if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
      parts.push(key)
    }

    return parts.join('+')
  }

  /**
   * Обработчик keydown
   */
  const handleKeyDown = event => {
    const keyString = buildKeyString(event)
    const handler = shortcuts.get(keyString)

    if (handler) {
      event.preventDefault()
      handler(event)
    }
  }

  // Подключаем обработчик
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  // Отключаем при unmount
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    register,
    unregister
  }
}

