import { COMPANIES } from './companies.js'
import { sendNotifications } from './notifications.js'
import { loadFromS3, saveToS3, JOBS_KEY } from './s3.js'
import { fetchJSON, relativeDate } from './utils.js'

export async function runScraper() {
  console.log('Running scraper...')

  const previous    = await loadFromS3(JOBS_KEY) ?? { jobs: [], lastChecked: null }
  const previousIds = new Set((previous.jobs || []).map(j => j.id))

  const allJobs = []
  const results = await Promise.allSettled(COMPANIES.map(fetchCompanyJobs))

  results.forEach((r, i) => {
    if (r.status === 'fulfilled') allJobs.push(...r.value)
    else console.error(`Failed ${COMPANIES[i].name}:`, r.reason?.message)
  })

  const newJobs = allJobs.filter(j => !previousIds.has(j.id))
  console.log(`Found ${allJobs.length} total jobs, ${newJobs.length} new`)

  await saveToS3(JOBS_KEY, {
    jobs:         allJobs.map(j => ({ ...j, isNew: !previousIds.has(j.id) })),
    lastChecked:  new Date().toISOString(),
  })

  if (newJobs.length) await sendNotifications(newJobs)

  return { newJobs: newJobs.length, totalJobs: allJobs.length }
}

async function fetchCompanyJobs(company) {
  if (company.type === 'greenhouse') return fetchGreenhouse(company)
  if (company.type === 'lever')      return fetchLever(company)
  if (company.type === 'workday')    return fetchWorkday(company)
  return []
}

async function fetchGreenhouse(company) {
  const data = await fetchJSON(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=false`)
  return (data.jobs || []).map(j => ({
    id:         `${company.id}-${j.id}`,
    title:      j.title,
    company:    company.name,
    companyId:  company.id,
    sector:     company.sector,
    orgType:    company.orgType,
    location:   j.location?.name || '',
    department: j.departments?.[0]?.name || '',
    url:        j.absolute_url,
    postedAt:   j.updated_at,
    postedDate: relativeDate(j.updated_at),
  }))
}

async function fetchLever(company) {
  const data = await fetchJSON(`https://api.lever.co/v0/postings/${company.slug}?mode=json`)
  return (Array.isArray(data) ? data : []).map(j => ({
    id:         `${company.id}-${j.id}`,
    title:      j.text,
    company:    company.name,
    companyId:  company.id,
    sector:     company.sector,
    orgType:    company.orgType,
    location:   j.categories?.location || j.workplaceType || '',
    department: j.categories?.department || '',
    url:        j.hostedUrl,
    postedAt:   new Date(j.createdAt).toISOString(),
    postedDate: relativeDate(new Date(j.createdAt)),
  }))
}

async function fetchWorkday(company) {
  const base   = `https://${company.tenant}.${company.instance}.myworkdayjobs.com`
  const apiUrl = `${base}/wday/cxs/${company.tenant}/${company.board}/jobs`

  const postings = []
  const limit    = 20
  let offset     = 0

  while (true) {
    const data = await fetchJSON(apiUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ appliedFacets: {}, limit, offset, searchText: '' }),
    })
    postings.push(...(data.jobPostings || []))
    if (postings.length >= (data.total ?? 0)) break
    offset += limit
  }

  return postings.map(j => {
    const postedAt = parseWorkdayPostedOn(j.postedOn)
    return {
      id:         `${company.id}-${j.externalPath.split('/').pop()}`,
      title:      j.title,
      company:    company.name,
      companyId:  company.id,
      sector:     company.sector,
      orgType:    company.orgType,
      location:   j.locationsText || '',
      department: j.bulletFields?.[0] || '',
      url:        `${base}${j.externalPath}`,
      postedAt,
      postedDate: relativeDate(postedAt),
    }
  })
}

function parseWorkdayPostedOn(postedOn = '') {
  if (/today/i.test(postedOn))     return new Date().toISOString()
  if (/yesterday/i.test(postedOn)) return new Date(Date.now() - 86_400_000).toISOString()
  const match = postedOn.match(/(\d+)\+?\s+days?\s+ago/i)
  if (match) return new Date(Date.now() - parseInt(match[1]) * 86_400_000).toISOString()
  return new Date().toISOString()
}
