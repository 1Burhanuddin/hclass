'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createAppTheme } from './mui-theme'
import { ReactNode, useMemo } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMemo(() => createAppTheme(), [])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
