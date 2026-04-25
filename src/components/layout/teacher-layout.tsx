'use client'

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'

import { useState, ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import AssignmentIcon from '@mui/icons-material/Assignment'
import GradeIcon from '@mui/icons-material/Grade'
import EventIcon from '@mui/icons-material/Event'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'

interface TeacherLayoutProps {
  children: ReactNode
}

const navigationItems = [
  { label: 'Dashboard', icon: <HomeIcon />, href: '/teacher' },
  { label: 'Attendance', icon: <EventIcon />, href: '/teacher/attendance' },
  { label: 'Study Material', icon: <AssignmentIcon />, href: '/admin/assignments' },
  { label: 'Notifications', icon: <NotificationsIcon />, href: '/teacher/notifications' },
  { label: 'Grades', icon: <GradeIcon />, href: '/teacher/grades' },
]

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState<null | HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll for sidebar shrinking
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setIsScrolled(contentRef.current.scrollTop > 0)
      }
    }

    const element = contentRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Sample notifications
  const notifications = [
    { id: 1, message: 'New assignment submission from student' },
    { id: 2, message: 'Attendance needs marking' },
    { id: 3, message: 'Grade submission deadline tomorrow' },
  ]

  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationsMenuOpen(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsMenuOpen(null)
  }

  const getActiveStatus = (href: string) => {
    return pathname === href || pathname === `${href}/`
  }

  const sidebarContent = (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {sidebarOpen ? (
          <>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#001a4d' }}>
                Harshdeep
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Class Management
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setSidebarOpen(false)} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton size="small" onClick={() => setSidebarOpen(true)} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <ChevronLeftIcon sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '3px', '&:hover': { bgcolor: '#999' } } }}>
        {navigationItems.map((item, idx) => {
          const isActive = getActiveStatus(item.href)
          return (
            <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: '8px',
                  bgcolor: isActive ? '#e3f2fd' : 'transparent',
                  color: isActive ? '#001a4d' : '#666',
                  pl: sidebarOpen ? 2 : 1.5,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  fontWeight: isActive ? 600 : 400,
                  '&:hover': {
                    bgcolor: isActive ? '#e3f2fd' : '#f5f5f5',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Sidebar - Desktop */}
      <Box
        sx={{
          width: sidebarOpen ? (isScrolled ? 240 : 280) : 80,
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: { xs: 'none', md: 'block' },
          transition: 'width 0.3s ease',
          overflow: 'auto',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '3px', '&:hover': { bgcolor: '#999' } },
          bgcolor: '#f9f9f9',
          borderRight: '1px solid #f0f0f0',
          borderBottomRightRadius: '16px',
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
        <Box sx={{ width: 280 }}>{sidebarContent}</Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: '#ffffff',
            color: '#333',
            borderBottom: '1px solid #f0f0f0',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                sx={{ display: { xs: 'flex', md: 'none' }, color: '#333' }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#001a4d' }}>
                Teacher Panel
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleNotificationsClick}
                sx={{
                  color: '#666',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    backgroundColor: '#ff9800',
                    borderRadius: '50%',
                  },
                }}
              >
                <NotificationsIcon />
              </IconButton>
              <Menu
                anchorEl={notificationsMenuOpen}
                open={Boolean(notificationsMenuOpen)}
                onClose={handleNotificationsClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <MenuItem key={notif.id} onClick={handleNotificationsClose}>
                      <Typography variant="body2">{notif.message}</Typography>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      No notifications
                    </Typography>
                  </MenuItem>
                )}
              </Menu>
              <UserButton afterSignOutUrl="/" />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box 
          ref={contentRef}
          sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
