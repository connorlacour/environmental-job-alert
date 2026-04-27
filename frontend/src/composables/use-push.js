import { onMounted, ref } from 'vue'
import { apiConfigured, apiUrl, vapidPublicKey } from '../config/index.js'

export function usePush({ showToast }) {
  const pushEnabled = ref(false)

  async function checkPushStatus() {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready.catch(() => null)
    if (!reg) return
    const sub = await reg.pushManager.getSubscription().catch(() => null)
    pushEnabled.value = !!sub
  }

  async function togglePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      showToast('Push notifications not supported in this browser')
      return
    }

    if (pushEnabled.value) {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await sub.unsubscribe()
        if (apiConfigured) {
          await fetch(`${apiUrl}/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          })
        }
      }
      pushEnabled.value = false
      showToast('Notifications disabled')
      return
    }

    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })
      if (apiConfigured) {
        await fetch(`${apiUrl}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        })
      }
      pushEnabled.value = true
      showToast("Notifications enabled — you'll hear about new jobs as they post")
    } catch (e) {
      console.error(e)
      showToast('Could not enable notifications: ' + e.message)
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
  }

  onMounted(checkPushStatus)

  return { pushEnabled, togglePush }
}
