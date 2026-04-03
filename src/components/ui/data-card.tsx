'use client'

import { Card, CardContent, CardProps } from '@mui/material'

interface DataCardProps extends CardProps {}

export function DataCard({ children, ...props }: DataCardProps) {
  return (
    <Card sx={{ 
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#ffffff',
      minHeight: '56px',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderColor: '#d0d0d0',
      },
      ...props.sx 
    }}>
      <CardContent sx={{ p: 3, width: '100%', '&:last-child': { pb: 3 } }}>{children}</CardContent>
    </Card>
  )
}
