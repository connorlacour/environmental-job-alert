<script setup>
defineProps({
  jobCount: { type: Number, required: true },
  lastChecked: { type: String, default: '' },
  scraping: { type: Boolean, default: false },
  apiConfigured: { type: Boolean, default: false },
})

const emit = defineEmits(['scrape'])
</script>

<template>
  <header>
    <div class="wordmark">job<span>//</span>watch</div>
    <div class="status-bar">
      <span :class="['dot', jobCount > 0 ? 'dot--active' : '']" />
      <span>{{ jobCount }} listings tracked</span>
      <span>{{ lastChecked }}</span>
      <button
        v-if="apiConfigured"
        class="scrape-btn"
        :disabled="scraping"
        @click="emit('scrape')"
      >
        {{ scraping ? 'scraping...' : '↻ scrape' }}
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  border-bottom: 1px solid var(--border);
  padding: 20px 32px;
  display: flex;
  align-items: baseline;
  gap: 20px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}

.wordmark {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 600;
  color: var(--green-bright);
  letter-spacing: -0.5px;
}

.wordmark span { color: var(--text-dim); }

.status-bar {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-muted);
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  display: inline-block;
}

.dot--active {
  background: var(--green);
  animation: pulse 2s infinite;
}

.scrape-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s;
}

.scrape-btn:hover:not(:disabled) {
  border-color: var(--green-dim);
  color: var(--green-bright);
}

.scrape-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  header { padding: 16px; }
}
</style>
