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
  transition:
    all 300ms ease-in-out,
    backdrop-filter 300ms ease-in-out,
    box-shadow 300ms ease-in-out;

  ${(props) =>
    props.enableScrollEffect &&
    props.scrolled &&
    `
    ${
      props.detached
        ? `
          border-radius: 12px;
          margin: 0 16px;
          width: calc(100% - 32px);
    `
        : ''
    }
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.95);
  `}

  ${(props) =>
    props.enableBlur &&
    props.scrolled &&
    `
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.8);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
        }}
      >
        {children}
      </Toolbar>
    </StyledAppBar>
  )
}

export default EnhancedHeader
