<script setup>
defineProps({
  tags: { type: Array, required: true },
  activeTag: { default: null },
})

const emit = defineEmits(['toggle-tag'])
</script>

<template>
  <div class="tag-filter">
    <span
      v-for="tag in tags"
      :key="tag"
      :class="['tag', activeTag === tag ? 'tag--active' : '']"
      @click="emit('toggle-tag', tag)"
    >{{ tag }}</span>
  </div>
</template>

<style scoped>
.tag-filter {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-family: var(--mono);
  font-size: 10px;
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.1s;
}

.tag:hover { border-color: var(--green-dim); color: var(--text-dim); }
.tag--active { border-color: var(--green); color: var(--green-bright); background: rgba(90, 158, 58, 0.08); }
</style>
