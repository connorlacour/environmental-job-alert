export const apiUrl = import.meta.env.VITE_API_URL || ''
export const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
export const apiConfigured = Boolean(apiUrl && apiUrl !== 'YOUR_API_GATEWAY_URL')
