export const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
}

export function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  }
}

export async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'User-Agent': 'EnvironmentalJobAlert/1.0', ...options.headers },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

export function relativeDate(date) {
  const d = Math.floor((Date.now() - new Date(date)) / 86_400_000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}
