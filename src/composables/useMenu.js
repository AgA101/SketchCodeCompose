import { ref } from 'vue'

// Глобальное состояние меню (singleton)
const isMenuOpen = ref(false)

export function useMenu() {
  function openMenu() {
    isMenuOpen.value = true
  }

  function closeMenu() {
    isMenuOpen.value = false
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  }
}

