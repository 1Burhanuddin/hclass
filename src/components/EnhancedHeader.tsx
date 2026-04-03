'use client'

import { Box, AppBar, Toolbar, useScrollTrigger } from '@mui/material'
import styled from '@emotion/styled'
import { ReactNode } from 'react'

interface EnhancedHeaderProps {
  children?: ReactNode
  enableScrollEffect?: boolean
  enableBlur?: boolean
  detached?: boolean
}

const StyledAppBar = styled(AppBar)<{
  scrolled: boolean
  enableScrollEffect: boolean
  enableBlur: boolean
  detached: boolean
}>`
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 250ms ease-in-out, box-shadow 250ms ease-in-out;

  ${(props) =>
    props.enableScrollEffect &&
    props.scrolled &&
    `
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    background-color: rgba(255, 255, 255, 0.98);
  `}

  ${(props) =>
    props.enableBlur &&
    props.scrolled &&
    `
    backdrop-filter: blur(12px) saturate(100%);
    -webkit-backdrop-filter: blur(12px) saturate(100%);
    background-color: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  `}
`

export function EnhancedHeader({
  children,
  enableScrollEffect = true,
  enableBlur = false,
  detached = true,
}: EnhancedHeaderProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return (
    <StyledAppBar
      position={enableScrollEffect ? 'sticky' : 'static'}
      elevation={0}
      scrolled={trigger}
      enableScrollEffect={enableScrollEffect}
      enableBlur={enableBlur}
      detached={detached}
      sx={{
        backgroundColor: '#ffffff',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: '#e0e0e0',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '0',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 3 },
          gap: 2,
          minHeight: { xs: 56, md: 64 },
        }}
      >
        {children}
      </Toolbar>
    </StyledAppBar>
  )
}

export default EnhancedHeader
