'use client'

import { Snackbar, Alert } from '@mui/material'
import { Toast } from '@/hooks/useToast'

interface ToastDisplayProps {
  toast: Toast
  onClose: () => void
}

export function ToastDisplay({ toast, onClose }: ToastDisplayProps) {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={toast.severity} 
        sx={{ 
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          backgroundColor: toast.severity === 'success' ? '#4caf50' 
            : toast.severity === 'error' ? '#f44336'
            : toast.severity === 'warning' ? '#ff9800'
            : '#2196f3',
          color: '#ffffff',
          '& .MuiAlert-icon': {
            color: '#ffffff',
          },
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  )
}
