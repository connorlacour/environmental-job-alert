import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' })
const BUCKET = process.env.S3_BUCKET

export const JOBS_KEY = 'jobs.json'
export const SUBS_KEY = 'subscriptions.json'

export async function loadFromS3(key) {
  try {
    const res  = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
    const body = await res.Body.transformToString()
    return JSON.parse(body)
  } catch (e) {
    if (e.name === 'NoSuchKey') return null
    throw e
  }
}

export async function saveToS3(key, data) {
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        JSON.stringify(data),
    ContentType: 'application/json',
  }))
}
