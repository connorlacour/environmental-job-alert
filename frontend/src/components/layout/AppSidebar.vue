<script setup>
defineProps({
  search: { type: String, default: '' },
  selectedCompany: { default: null },
  companies: { type: Array, required: true },
  newJobs: { type: Array, required: true },
  jobs: { type: Array, required: true },
  pushEnabled: { type: Boolean, required: true },
  companyHasNew: { type: Function, required: true },
  companyJobCount: { type: Function, required: true },
})

const emit = defineEmits(['update:search', 'update:selected-company', 'toggle-push'])
</script>

<template>
  <aside>
    <div class="section">
      <div class="section-label">Notifications</div>
      <button
        :class="['notify-btn', pushEnabled ? 'notify-btn--active' : '']"
        @click="emit('toggle-push')"
      >
        {{ pushEnabled ? '✓ notifications on' : '⬡ enable notifications' }}
      </button>
    </div>

    <div class="section">
      <div class="section-label">Filter</div>
      <input
        class="filter-input"
        :value="search"
        placeholder="search titles..."
        @input="emit('update:search', $event.target.value)"
      />
    </div>

    <div class="section">
      <div class="section-label">Companies ({{ companies.length }})</div>
      <div class="company-list">
        <div
          :class="['company-item', selectedCompany === null ? 'company-item--active' : '']"
          @click="emit('update:selected-company', null)"
        >
          <span :class="['company-dot', newJobs.length ? 'company-dot--new' : '']" />
          All companies
          <span :class="['badge', newJobs.length ? 'badge--new' : '']">
            {{ newJobs.length ? '+' + newJobs.length : jobs.length }}
          </span>
        </div>

        <div
          v-for="c in companies"
          :key="c.id"
          :class="['company-item', selectedCompany === c.id ? 'company-item--active' : '']"
          @click="emit('update:selected-company', c.id)"
        >
          <span :class="['company-dot', companyHasNew(c.id) ? 'company-dot--new' : '']" />
          {{ c.name }}
          <span :class="['badge', companyHasNew(c.id) ? 'badge--new' : '']">
            {{ companyJobCount(c.id) }}
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
aside {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  padding: 24px 0;
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  overflow-y: auto;
}

.section { margin-bottom: 28px; }

.section-label {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  text-transform: uppercase;
  padding: 0 20px 10px;
}

.notify-btn {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 10px 16px;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.15s;
  text-align: left;
}

.notify-btn:hover { border-color: var(--green-dim); color: var(--green-bright); }
.notify-btn--active { border-color: var(--green); color: var(--green-bright); background: rgba(90, 158, 58, 0.08); }

.filter-input {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 8px 12px;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  border-radius: 3px;
  outline: none;
}

.filter-input:focus { border-color: var(--green-dim); }
.filter-input::placeholder { color: var(--text-muted); }

.company-list { margin-top: 4px; }

.company-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 20px;
  font-size: 12px;
  color: var(--text-dim);
  cursor: pointer;
  transition: background 0.1s;
  border-left: 2px solid transparent;
}

.company-item:hover { background: var(--bg3); color: var(--text); }
.company-item--active { border-left-color: var(--green); color: var(--text); background: var(--bg3); }

.company-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-muted);
  flex-shrink: 0;
}

.company-dot--new { background: var(--new); }

.badge {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
}

.badge--new { color: var(--new); }

@media (max-width: 700px) {
  aside { display: none; }
}
</style>
