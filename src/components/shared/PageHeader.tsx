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
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {showLogo && (
            <Typography variant="h6" sx={{ fontWeight: 700, cursor: 'pointer' }} component={Link} href="/">
              Harshdeep Classes
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">{title}</Typography>
          <UserButton />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
