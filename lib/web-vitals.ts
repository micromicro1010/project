import type { Metric } from 'web-vitals'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator.connection &&
    'effectiveType' in navigator.connection
    ? navigator.connection.effectiveType
    : ''
}

export function sendToVercelAnalytics(metric: Metric) {
  const analyticsId = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID
  if (!analyticsId) {
    return
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  })
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
  }
}

export function webVitals(metric: Metric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Web Vitals:', metric)
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    sendToVercelAnalytics(metric)
  }
}