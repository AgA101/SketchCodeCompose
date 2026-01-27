<template>
  <button class="mini-menu-button" @click="toggleMenu" title="Menu">📱</button>
</template>

<script setup>
import { useMenu } from '@/composables/useMenu'

const { toggleMenu } = useMenu()
</script>

<style scoped>
.mini-menu-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-accent);
  border-radius: var(--radius-md);
  font-size: 18px;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.mini-menu-button:hover {
  background-color: var(--color-accent-hover);
  transform: scale(1.05);
}
</style>

