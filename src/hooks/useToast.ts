'use client'

import { useState, useCallback } from 'react'

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  open: boolean
  message: string
  severity: ToastSeverity
}

export function useToast() {
  const [toast, setToast] = useState<Toast>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showToast = useCallback((message: string, severity: ToastSeverity = 'success') => {
    setToast({
      open: true,
      message,
      severity,
    })
  }, [])

  const closeToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }))
  }, [])

  return {
    toast,
    showToast,
    closeToast,
    setToast,
  }
}
