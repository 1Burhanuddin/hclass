'use client'

import { AppBar, Toolbar, Typography, Box, Container, useTheme } from '@mui/material'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showLogo?: boolean
}

export function PageHeader({ title, subtitle, showLogo = true }: PageHeaderProps) {
  const theme = useTheme()

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      borderBottom: '1px solid #e0e0e0',
      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {showLogo && (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                cursor: 'pointer',
                color: '#001a4d',
                transition: 'all 250ms ease',
                '&:hover': {
                  color: '#1565c0',
                }
              }} 
              component={Link} 
              href="/"
            >
              Harshdeep Classes
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242' }}>{title}</Typography>
          <UserButton />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
