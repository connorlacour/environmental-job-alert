import { runScraper } from './scraper.js'
import { loadFromS3, saveToS3, JOBS_KEY, SUBS_KEY } from './s3.js'
import { json, CORS_HEADERS } from './utils.js'

export const handler = async (event) => {
  if (event.source === 'aws.events' || event['detail-type'] === 'Scheduled Event') {
    return runScraper()
  }

  const method  = event.httpMethod || event.requestContext?.http?.method
  const reqPath = event.path || event.rawPath || '/'

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  if (method === 'GET' && reqPath.endsWith('/jobs')) {
    const data = await loadFromS3(JOBS_KEY) ?? { jobs: [], lastChecked: null }
    return json(200, data)
  }

  if (method === 'POST' && reqPath.endsWith('/subscribe')) {
    const sub  = JSON.parse(event.body || '{}')
    const subs = await loadFromS3(SUBS_KEY) ?? []
    if (!subs.some(s => s.endpoint === sub.endpoint)) {
      await saveToS3(SUBS_KEY, [...subs, sub])
    }
    return json(200, { ok: true })
  }

  if (method === 'POST' && reqPath.endsWith('/unsubscribe')) {
    const { endpoint } = JSON.parse(event.body || '{}')
    const subs = await loadFromS3(SUBS_KEY) ?? []
    await saveToS3(SUBS_KEY, subs.filter(s => s.endpoint !== endpoint))
    return json(200, { ok: true })
  }

  if (method === 'POST' && reqPath.endsWith('/scrape')) {
    return json(200, await runScraper())
  }

  return json(404, { error: 'Not found' })
}
