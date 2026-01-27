import { watch, onUnmounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSettingsStore } from '@/stores/settingsStore'

/**
 * Автосохранение проекта
 */
export function useAutoSave() {
  const projectStore = useProjectStore()
  const settingsStore = useSettingsStore()

  let intervalId = null

  // Запускаем автосохранение если включено
  if (settingsStore.autoSaveEnabled) {
    intervalId = setInterval(() => {
      if (projectStore.isDirty) {
        projectStore.save()
      }
    }, settingsStore.autoSaveIntervalMs)
  }

  // Следим за изменением настроек
  watch(
    () => settingsStore.autoSaveEnabled,
    enabled => {
      if (enabled && !intervalId) {
        intervalId = setInterval(() => {
          if (projectStore.isDirty) {
            projectStore.save()
          }
        }, settingsStore.autoSaveIntervalMs)
      } else if (!enabled && intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  )

  // Очистка при unmount
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }
}

