import webpush from 'web-push'
import { loadFromS3, saveToS3, SUBS_KEY } from './s3.js'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function sendNotifications(newJobs) {
  const subs = await loadFromS3(SUBS_KEY) ?? []
  if (!subs.length) return

  const byCompany = {}
  for (const job of newJobs) {
    (byCompany[job.company] ??= []).push(job)
  }

  const notifications = Object.entries(byCompany).map(([company, jobs]) =>
    jobs.length === 1
      ? {
          title: `New job at ${company}`,
          body:  jobs[0].title + (jobs[0].location ? ` · ${jobs[0].location}` : ''),
          url:   jobs[0].url,
          tag:   `job-${jobs[0].id}`,
        }
      : {
          title: `${jobs.length} new jobs at ${company}`,
          body:  jobs.slice(0, 3).map(j => j.title).join(', '),
          url:   jobs[0].url,
          tag:   `jobs-${company}`,
        }
  )

  const deadEndpoints = new Set()

  await Promise.allSettled(
    subs.flatMap(sub =>
      notifications.map(notif =>
        webpush.sendNotification(sub, JSON.stringify(notif)).catch(err => {
          if (err.statusCode === 410) deadEndpoints.add(sub.endpoint)
          else console.error('Push failed:', err.message)
        })
      )
    )
  )

  if (deadEndpoints.size) {
    await saveToS3(SUBS_KEY, subs.filter(s => !deadEndpoints.has(s.endpoint)))
  }
}
