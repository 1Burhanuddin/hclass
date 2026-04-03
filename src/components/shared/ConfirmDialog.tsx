'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from '@mui/material'
import { ReactNode } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#001a4d', pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 2, color: '#424242' }}>
        {message}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <MuiButton 
          onClick={onCancel} 
          disabled={loading}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            transition: 'all 250ms ease'
          }}
        >
          {cancelText}
        </MuiButton>
        <MuiButton 
          onClick={onConfirm} 
          variant="contained" 
          disabled={loading}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            transition: 'all 250ms ease',
            '&:hover:not(:disabled)': {
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            }
          }}
        >
          {confirmText}
        </MuiButton>
      </DialogActions>
    </Dialog>
  )
}
