<script setup>
defineProps({
  message: { type: String, default: '' },
})
</script>

<template>
  <Transition name="toast">
    <div v-if="message" class="toast">{{ message }}</div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  padding: 12px 18px;
  border-radius: 3px;
  z-index: 999;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
