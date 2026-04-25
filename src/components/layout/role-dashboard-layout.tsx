'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  alpha,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { EnhancedHeader } from '../EnhancedHeader'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export interface SidebarNavigationItem {
  label: string
  icon: ReactNode
  href: string
}

interface RoleDashboardLayoutProps {
  children: ReactNode
  navigationItems: SidebarNavigationItem[]
  headerTitle: string
  brandSubtitle: string
  notifications?: Array<{ id: number; message: string }>
  headerActions?: ReactNode
}

type SidebarMode = 'hover' | 'manual'

const SIDEBAR_MODE_KEY = 'hc.sidebar.mode'
const SIDEBAR_OPEN_KEY = 'hc.sidebar.manualOpen'
const SIDEBAR_COLLAPSED_WIDTH = 92
const SIDEBAR_EXPANDED_WIDTH = 296

function SidebarContent({
  brandSubtitle,
  closeMobile,
  isExpanded,
  isMobile,
  mode,
  navigationItems,
  onRailClick,
  onSidebarButtonClick,
  onHoverEnd,
  onHoverStart,
  pathname,
}: {
  brandSubtitle: string
  closeMobile: () => void
  isExpanded: boolean
  isMobile: boolean
  mode: SidebarMode
  navigationItems: SidebarNavigationItem[]
  onRailClick: () => void
  onSidebarButtonClick: () => void
  onHoverEnd: () => void
  onHoverStart: () => void
  pathname: string
}) {
  const surfaceBorder = 'rgba(148, 163, 184, 0.18)'

  return (
    <Box
      onMouseEnter={!isMobile && mode === 'hover' ? onHoverStart : undefined}
      onMouseLeave={!isMobile && mode === 'hover' ? onHoverEnd : undefined}
      onClick={!isMobile && !isExpanded ? onRailClick : undefined}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: '#0f172a',
        px: 1.25,
        py: 1.5,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.98) 48%, rgba(241,245,249,0.98) 100%)',
        cursor: !isMobile && !isExpanded ? 'pointer' : 'default',
      }}
    >
      <Box
        sx={{
          mb: 1.25,
          borderRadius: 4,
          border: `1px solid ${surfaceBorder}`,
          backgroundColor: 'rgba(255,255,255,0.8)',
          color: '#0f172a',
          px: isExpanded ? 1.4 : 1.15,
          py: 1.15,
          minHeight: 64,
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
          transition: 'all 220ms ease',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          {isExpanded ? (
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#0b57d0',
                lineHeight: 1.1,
              }}
            >
              Harshdeep
            </Typography>
          ) : (
            <Box />
          )}

          {!isMobile && (
            <Tooltip
              title={mode === 'manual' && isExpanded ? 'Switch to hover mode' : 'Pin sidebar open'}
              placement="right"
            >
              <IconButton
                onClick={(event) => {
                  event.stopPropagation()
                  onSidebarButtonClick()
                }}
                size="small"
                sx={{
                  ml: 'auto',
                  color: '#0b57d0',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(11, 87, 208, 0.16)',
                  '&:hover': { backgroundColor: 'rgba(11, 87, 208, 0.06)' },
                }}
              >
                {mode === 'manual' && isExpanded ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Box>

      </Box>

      <List
        sx={{
          flex: 1,
          px: 0.25,
          py: 0,
          overflowY: isExpanded ? 'auto' : 'hidden',
          overflowX: 'hidden',
        }}
      >
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname === `${item.href}/`

          const button = (
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={closeMobile}
              sx={{
                minHeight: 54,
                px: isExpanded ? 1.5 : 0,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                borderRadius: 4,
                color: isActive ? '#0f172a' : '#475569',
                backgroundColor: isActive ? 'rgba(255,255,255,0.94)' : 'transparent',
                border: isActive ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid transparent',
                boxShadow: isActive ? '0 10px 24px rgba(15, 23, 42, 0.08)' : 'none',
                '&:hover': {
                  backgroundColor: isActive ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.72)',
                  transform: isExpanded ? 'translateX(3px)' : 'translateY(-1px)',
                },
                transition: 'all 180ms ease',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isExpanded ? 42 : 'auto',
                  color: isActive ? '#0b57d0' : '#64748b',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  opacity: isExpanded ? 1 : 0,
                  maxWidth: isExpanded ? 240 : 0,
                  transition: 'all 180ms ease',
                  overflow: 'hidden',
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.94rem',
                    fontWeight: isActive ? 700 : 600,
                    whiteSpace: 'nowrap',
                  }}
                />
              </Box>
            </ListItemButton>
          )

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.75 }}>
              {isExpanded ? (
                button
              ) : (
                <Tooltip title={item.label} placement="right">
                  {button}
                </Tooltip>
              )}
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ my: 1.25, borderColor: 'rgba(148, 163, 184, 0.16)' }} />

      <Box sx={{ height: isExpanded ? 12 : 0, transition: 'height 180ms ease' }} />
    </Box>
  )
}

export function RoleDashboardLayout({
  children,
  navigationItems,
  headerTitle,
  brandSubtitle,
  notifications = [],
  headerActions,
}: RoleDashboardLayoutProps) {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mode, setMode] = useState<SidebarMode>('hover')
  const [manualOpen, setManualOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null)

  const { user } = useUser()
  const userProfile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip')
  const dbNotifications = useQuery(api.notifications.getUserNotifications, userProfile?._id ? { userId: userProfile._id, limit: 5 } : 'skip') ?? []
  const unreadInfo = useQuery(api.notifications.getUnreadNotifications, userProfile?._id ? { userId: userProfile._id } : 'skip')
  const unreadCount = unreadInfo?.count ?? 0

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedMode = window.localStorage.getItem(SIDEBAR_MODE_KEY)
    const savedOpen = window.localStorage.getItem(SIDEBAR_OPEN_KEY)

    if (savedMode === 'hover' || savedMode === 'manual') {
      setMode(savedMode)
    }

    if (savedOpen === 'true' || savedOpen === 'false') {
      setManualOpen(savedOpen === 'true')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SIDEBAR_MODE_KEY, mode)
  }, [mode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SIDEBAR_OPEN_KEY, String(manualOpen))
  }, [manualOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isExpanded = useMemo(() => {
    if (isMobile) {
      return true
    }

    return mode === 'hover' ? hovered : manualOpen
  }, [hovered, isMobile, manualOpen, mode])

  const desktopWidth = isMobile
    ? 0
    : mode === 'hover'
      ? hovered
        ? SIDEBAR_EXPANDED_WIDTH
        : SIDEBAR_COLLAPSED_WIDTH
      : manualOpen
        ? SIDEBAR_EXPANDED_WIDTH
        : SIDEBAR_COLLAPSED_WIDTH

  const openSidebarFromRail = () => {
    setMode('manual')
    setManualOpen(true)
  }

  const handleSidebarButtonClick = () => {
    if (mode === 'manual' && isExpanded) {
      setMode('hover')
      setManualOpen(false)
      setHovered(false)
      return
    }

    setMode('manual')
    setManualOpen(true)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(191,219,254,0.42) 0%, rgba(248,250,252,0.95) 28%, rgba(241,245,249,1) 100%)',
      }}
    >
      {!isMobile && (
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Box
            sx={{
              width: desktopWidth,
              minWidth: desktopWidth,
              transition: 'width 220ms ease, min-width 220ms ease',
            }}
          >
            <Box
              sx={{
                height: '100%',
                minHeight: '100vh',
                borderRadius: '0 16px 16px 0',
                border: '1px solid rgba(255,255,255,0.75)',
                boxShadow: '0 30px 80px rgba(15, 23, 42, 0.10)',
                backdropFilter: 'blur(18px)',
                overflow: 'hidden',
              }}
            >
              <SidebarContent
                brandSubtitle={brandSubtitle}
                closeMobile={() => setMobileOpen(false)}
                isExpanded={isExpanded}
                isMobile={false}
                mode={mode}
                navigationItems={navigationItems}
                onRailClick={openSidebarFromRail}
                onSidebarButtonClick={handleSidebarButtonClick}
                onHoverEnd={() => setHovered(false)}
                onHoverStart={() => setHovered(true)}
                pathname={pathname}
              />
            </Box>
          </Box>
        </Box>
      )}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: SIDEBAR_EXPANDED_WIDTH,
            background: 'transparent',
            boxShadow: 'none',
            p: 1.25,
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.75)',
            boxShadow: '0 30px 80px rgba(15, 23, 42, 0.14)',
            backgroundColor: alpha('#ffffff', 0.92),
          }}
        >
          <SidebarContent
            brandSubtitle={brandSubtitle}
            closeMobile={() => setMobileOpen(false)}
            isExpanded
            isMobile
            mode={mode}
            navigationItems={navigationItems}
            onRailClick={openSidebarFromRail}
            onSidebarButtonClick={handleSidebarButtonClick}
            onHoverEnd={() => undefined}
            onHoverStart={() => undefined}
            pathname={pathname}
          />
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', px: { xs: 1.25, md: 1.5 }, py: 1.5 }}>
        <EnhancedHeader enableScrollEffect enableBlur detached>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                border: '1px solid rgba(148, 163, 184, 0.2)',
                backgroundColor: 'rgba(255,255,255,0.7)',
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {headerTitle}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
            <Tooltip title="Notifications">
              <IconButton
                onClick={(event) => setNotificationsAnchor(event.currentTarget)}
                sx={{
                  position: 'relative',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&::after': unreadCount > 0
                    ? {
                        content: '""',
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 8,
                        height: 8,
                        borderRadius: '999px',
                        backgroundColor: '#ef4444',
                      }
                    : undefined,
                }}
              >
                <NotificationsOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={() => setNotificationsAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
                {unreadCount > 0 && <Typography variant="caption" sx={{ color: '#0b57d0', fontWeight: 600, bgcolor: 'rgba(11, 87, 208, 0.1)', px: 1, py: 0.25, borderRadius: '4px' }}>{unreadCount} unread</Typography>}
              </Box>
              {dbNotifications.length ? (
                dbNotifications.map((notification: any) => (
                  <MenuItem key={notification._id} component={Link} href={`/${userProfile?.role}/notifications`} onClick={() => setNotificationsAnchor(null)}>
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>{notification.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(notification.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    No notifications
                  </Typography>
                </MenuItem>
              )}
              <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                <Typography component={Link} href={`/${userProfile?.role || 'admin'}/notifications`} onClick={() => setNotificationsAnchor(null)} variant="caption" sx={{ color: '#0b57d0', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>
                  View All
                </Typography>
              </Box>
            </Menu>

            {headerActions}
          </Box>
        </EnhancedHeader>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            mt: 1.5,
            borderRadius: { xs: '16px', md: '24px' },
            border: '1px solid rgba(255,255,255,0.75)',
            backgroundColor: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 24px 70px rgba(15, 23, 42, 0.07)',
            overflow: 'auto',
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default RoleDashboardLayout
