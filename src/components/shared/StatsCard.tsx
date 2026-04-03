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
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          {icon && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                backgroundColor: theme.palette[color].light,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography color="textSecondary" variant="caption">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
