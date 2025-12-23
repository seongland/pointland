declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export const GA_TRACKING_ID = 'YOUR_GA_TRACKING_ID'

export const initGA = () => {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID)
}

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
