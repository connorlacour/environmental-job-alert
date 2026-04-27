<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import JobsList from './components/jobs/JobsList.vue'
import SetupBanner from './components/SetupBanner.vue'
import ToastMessage from './components/ToastMessage.vue'
import { useJobs } from './composables/use-jobs.js'
import { usePush } from './composables/use-push.js'

const {
  jobs,
  loading,
  scraping,
  search,
  selectedCompany,
  activeTag,
  toast,
  lastChecked,
  tags,
  companies,
  newJobs,
  filteredJobs,
  viewTitle,
  apiConfigured,
  companyHasNew,
  companyJobCount,
  toggleTag,
  showToast,
  triggerScrape,
} = useJobs()

const { pushEnabled, togglePush } = usePush({ showToast })
</script>

<template>
  <AppHeader
    :job-count="jobs.length"
    :last-checked="lastChecked"
    :scraping="scraping"
    :api-configured="apiConfigured"
    @scrape="triggerScrape"
  />

  <div class="app">
    <AppSidebar
      v-model:search="search"
      v-model:selected-company="selectedCompany"
      :companies="companies"
      :new-jobs="newJobs"
      :jobs="jobs"
      :push-enabled="pushEnabled"
      :company-has-new="companyHasNew"
      :company-job-count="companyJobCount"
      @toggle-push="togglePush"
    />

    <main>
      <SetupBanner v-if="!apiConfigured" />
      <JobsList
        :loading="loading"
        :filtered-jobs="filteredJobs"
        :view-title="viewTitle"
        :tags="tags"
        :active-tag="activeTag"
        :search="search"
        @toggle-tag="toggleTag"
      />
    </main>
  </div>

  <ToastMessage :message="toast" />
</template>

<style>
.app {
  display: flex;
  min-height: calc(100vh - 61px);
}

main {
  flex: 1;
  padding: 28px 36px;
  overflow-y: auto;
}

@media (max-width: 700px) {
  main { padding: 20px 16px; }
}
</style>
