'use client'

import { useState, useEffect } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import styled from '@emotion/styled'

interface CollapsibleSidebarProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  collapsedWidth?: number
  expandedWidth?: number
  mobileBreakpoint?: 'sm' | 'md' | 'lg'
}

const StyledSidebarContainer = styled(Box)<{ isHovered: boolean; isCollapsed: boolean; expandedWidth: number; collapsedWidth: number }>`
  position: sticky;
  top: 0;
  height: 100vh;
  width: ${(props) => (props.isHovered || !props.isCollapsed ? props.expandedWidth : props.collapsedWidth)}px;
  min-width: ${(props) => (props.isHovered || !props.isCollapsed ? props.expandedWidth : props.collapsedWidth)}px;
  background-color: #f9f9f9;
  border-right: 1px solid #efefef;
  transition: all 300ms ease-in-out;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  &:hover {
    width: ${(props) => props.expandedWidth}px;
    min-width: ${(props) => props.expandedWidth}px;
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 3px;

    &:hover {
      background: #b0b0b0;
    }
  }
`

const SidebarBackdrop = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 8;

  @media (min-width: 1200px) {
    display: none;
  }
`

export function CollapsibleSidebar({
  children,
  open,
  onOpenChange,
  collapsedWidth = 80,
  expandedWidth = 260,
  mobileBreakpoint = 'lg',
}: CollapsibleSidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(mobileBreakpoint))
  const [isHovered, setIsHovered] = useState(false)

  // On mobile, use drawer; on desktop, use sticky sidebar
  if (isMobile) {
    return (
      <>
        {open && <SidebarBackdrop onClick={() => onOpenChange(false)} />}
        <Drawer
          anchor="left"
          open={open}
          onClose={() => onOpenChange(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: expandedWidth,
              backgroundColor: '#f9f9f9',
              borderRight: '1px solid #efefef',
            },
          }}
        >
          {children}
        </Drawer>
      </>
    )
  }

  // Desktop: Collapsible with hover
  return (
    <StyledSidebarContainer
      isHovered={isHovered}
      isCollapsed={!open}
      expandedWidth={expandedWidth}
      collapsedWidth={collapsedWidth}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </StyledSidebarContainer>
  )
}

export default CollapsibleSidebar
