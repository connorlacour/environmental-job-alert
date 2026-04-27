import { computed, onMounted, ref } from 'vue'
import { apiConfigured, apiUrl } from '../config/index.js'
import { timeAgo } from '../utils/time.js'

export function useJobs() {
  const jobs = ref([])
  const loading = ref(true)
  const scraping = ref(false)
  const search = ref('')
  const selectedCompany = ref(null)
  const activeTag = ref(null)
  const toast = ref('')
  const lastChecked = ref('')

  const tags = ['remote', 'engineering', 'data', 'nonprofit', 'climate']

  const companies = computed(() => {
    const map = {}
    jobs.value.forEach((j) => {
      if (!map[j.companyId]) map[j.companyId] = { id: j.companyId, name: j.company }
    })
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name))
  })

  const newJobs = computed(() => jobs.value.filter((j) => j.isNew))

  const companyHasNew = (id) => jobs.value.some((j) => j.companyId === id && j.isNew)
  const companyJobCount = (id) => jobs.value.filter((j) => j.companyId === id).length

  const filteredJobs = computed(() => {
    let list = jobs.value

    if (selectedCompany.value) {
      list = list.filter((j) => j.companyId === selectedCompany.value)
    }

    if (search.value) {
      const q = search.value.toLowerCase()
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.department || '').toLowerCase().includes(q),
      )
    }

    if (activeTag.value) {
      const t = activeTag.value
      list = list.filter((j) => {
        if (t === 'remote') return (j.location || '').toLowerCase().includes('remote')
        if (t === 'nonprofit') return j.orgType === 'nonprofit'
        if (t === 'climate') return j.sector === 'climate'
        if (t === 'engineering') return (j.department || j.title || '').toLowerCase().includes('engineer')
        if (t === 'data') return (j.title || '').toLowerCase().includes('data')
        return true
      })
    }

    return [...list].sort((a, b) => (b.isNew - a.isNew) || (new Date(b.postedAt) - new Date(a.postedAt)))
  })

  const viewTitle = computed(() => {
    if (selectedCompany.value) {
      return companies.value.find((c) => c.id === selectedCompany.value)?.name ?? 'Jobs'
    }
    return newJobs.value.length ? `${newJobs.value.length} new since last check` : 'All Jobs'
  })

  function toggleTag(tag) {
    activeTag.value = activeTag.value === tag ? null : tag
  }

  function showToast(msg, duration = 3000) {
    toast.value = msg
    setTimeout(() => (toast.value = ''), duration)
  }

  async function triggerScrape() {
    if (!apiConfigured || scraping.value) return
    scraping.value = true
    try {
      const res  = await fetch(`${apiUrl}/scrape`, { method: 'POST' })
      const data = await res.json()
      const msg  = data.newJobs > 0
        ? `Found ${data.newJobs} new job${data.newJobs === 1 ? '' : 's'}`
        : 'No new jobs found'
      showToast(msg)
      await fetchJobs()
    } catch (e) {
      console.error(e)
      showToast('Scrape failed — check console')
    } finally {
      scraping.value = false
    }
  }

  async function fetchJobs() {
    loading.value = true
    try {
      const res = await fetch(`${apiUrl}/jobs`)
      const data = await res.json()
      jobs.value = data.jobs || []
      lastChecked.value = data.lastChecked
        ? `checked ${timeAgo(new Date(data.lastChecked))}`
        : 'not yet checked'
    } catch (e) {
      console.error(e)
      showToast('Could not reach API')
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(console.error)
    }
    await fetchJobs()
  })

  return {
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
  }
}
