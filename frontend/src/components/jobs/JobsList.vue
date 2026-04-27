<script setup>
import JobCard from './JobCard.vue'
import TagFilter from './TagFilter.vue'

defineProps({
  loading: { type: Boolean, required: true },
  filteredJobs: { type: Array, required: true },
  viewTitle: { type: String, required: true },
  tags: { type: Array, required: true },
  activeTag: { default: null },
  search: { type: String, default: '' },
})

const emit = defineEmits(['toggle-tag'])
</script>

<template>
  <div class="toolbar">
    <div class="view-title">
      <strong>{{ viewTitle }}</strong>
    </div>
    <TagFilter :tags="tags" :active-tag="activeTag" @toggle-tag="emit('toggle-tag', $event)" />
  </div>

  <!-- Loading skeletons -->
  <div v-if="loading" class="jobs-grid">
    <div v-for="i in 6" :key="i" class="loading-row">
      <div>
        <div class="skel" :style="`height:14px;width:${180 + (i * 17) % 120}px;margin-bottom:8px`" />
        <div class="skel" style="height:11px;width:220px" />
      </div>
    </div>
  </div>

  <!-- Jobs -->
  <div v-else-if="filteredJobs.length" class="jobs-grid">
    <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
  </div>

  <!-- Empty -->
  <div v-else class="empty-state">
    <pre>
  ╔══════════════════╗
  ║  no jobs found   ║
  ╚══════════════════╝</pre>
    <div>
      {{ search || activeTag
        ? 'try adjusting your filters'
        : "scraper hasn't run yet — trigger it manually or wait for schedule" }}
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.view-title {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-dim);
}

.view-title strong { color: var(--text); }

.jobs-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.loading-row {
  background: var(--bg2);
  padding: 16px 20px;
  display: flex;
  gap: 12px;
}

.skel {
  background: var(--bg3);
  border-radius: 2px;
  animation: shimmer 1.4s infinite;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  font-family: var(--mono);
  color: var(--text-muted);
}

.empty-state pre {
  font-size: 11px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: var(--text-dim);
}
</style>
