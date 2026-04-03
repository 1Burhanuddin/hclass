'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress for faster response
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 50,
  minimum: 0.1,
  easing: 'linear',
  speed: 200,
})

export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isNavigatingRef = useRef(false)

  // Inject custom styles on client-side only
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: linear-gradient(to right, #001a4d, #000d1a, #001a4d);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        z-index: 9999;
      }
      #nprogress .spinner {
        display: none;
      }
      #nprogress.ng-hide .bar {
        visibility: hidden;
      }
    `
    document.head.appendChild(style)
  }, [])

  useEffect(() => {
    // Complete progress when route changes
    if (isNavigatingRef.current) {
      NProgress.done()
      isNavigatingRef.current = false
    }
  }, [pathname, searchParams])

  useEffect(() => {
    // Handle all clicks on links
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const anchor = target.closest('a')

      if (!anchor) return

      try {
        const targetUrl = new URL(anchor.href, window.location.href)
        const currentUrl = new URL(window.location.href)

        // Check if it's a different page
        if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
          isNavigatingRef.current = true
          NProgress.start()
        }
      } catch (e) {
        // Invalid URL, ignore
      }
    }

    // Add listeners
    document.addEventListener('click', handleClick, true)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true)
      NProgress.done()
    }
  }, [])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      isNavigatingRef.current = true
      NProgress.start()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      NProgress.done()
    }
  }, [])

  return null
}
