<script setup>
defineProps({
  job: { type: Object, required: true },
})
</script>

<template>
  <a
    :href="job.url"
    target="_blank"
    rel="noopener"
    :class="['job-card', job.isNew ? 'job-card--new' : '']"
  >
    <div>
      <div class="job-title">{{ job.title }}</div>
      <div class="job-meta">
        <span class="company">{{ job.company }}</span>
        <span v-if="job.location">{{ job.location }}</span>
        <span v-if="job.department">{{ job.department }}</span>
      </div>
    </div>
    <div class="job-right">
      <span v-if="job.isNew" class="new-pill">NEW</span>
      <span class="job-date">{{ job.postedDate }}</span>
    </div>
  </a>
</template>

<style scoped>
.job-card {
  background: var(--bg2);
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: start;
  transition: background 0.1s;
  text-decoration: none;
  color: inherit;
}

.job-card:hover { background: var(--bg3); }
.job-card--new { border-left: 3px solid var(--new); }

.job-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 4px;
}

.job-meta {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.company { color: var(--green); }

.job-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.new-pill {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 3px 8px;
  background: rgba(168, 224, 99, 0.12);
  border: 1px solid var(--new);
  color: var(--new);
  border-radius: 2px;
}

.job-date {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
}
</style>
