'use client'

import { Card, CardContent, Typography, Box, useTheme } from '@mui/material'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export function StatsCard({ title, value, subtitle, icon, color = 'primary' }: StatsCardProps) {
  const theme = useTheme()

  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#ffffff',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderColor: '#d0d0d0',
        transform: 'translateY(-2px)',
      }
    }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          {icon && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: '10px',
                backgroundColor: theme.palette[color].light,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              {title}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: '#1a1a1a' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography color="textSecondary" variant="caption" sx={{ color: '#999' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
