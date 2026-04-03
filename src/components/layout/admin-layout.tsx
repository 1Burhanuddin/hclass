'use client'

import {
  Box,
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

import { useState, ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import GroupIcon from '@mui/icons-material/Group'
import PersonIcon from '@mui/icons-material/Person'
import ClassIcon from '@mui/icons-material/Class'
import BookIcon from '@mui/icons-material/Book'
import SettingsIcon from '@mui/icons-material/Settings'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import EventIcon from '@mui/icons-material/Event'
import GradeIcon from '@mui/icons-material/Grade'
import CampaignIcon from '@mui/icons-material/Campaign'
import PaletteIcon from '@mui/icons-material/Palette'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { EnhancedHeader } from '../EnhancedHeader'

interface AdminLayoutProps {
  children: ReactNode
}

const navigationItems = [
  { label: 'Dashboard', icon: <HomeIcon />, href: '/admin/dashboard' },
  { label: 'Users', icon: <GroupIcon />, href: '/admin/users' },
  { label: 'Teachers', icon: <PersonIcon />, href: '/admin/teachers' },
  { label: 'Students', icon: <PersonIcon />, href: '/admin/students' },
  { label: 'Batches', icon: <ClassIcon />, href: '/admin/batches' },
  { label: 'Subjects', icon: <BookIcon />, href: '/admin/subjects' },
  { label: 'Mappings', icon: <PersonIcon />, href: '/admin/mapping' },
  { label: 'Attendance', icon: <EventIcon />, href: '/admin/attendance' },
  { label: 'Assignments', icon: <AssignmentIcon />, href: '/admin/assignments' },
  { label: 'Notifications', icon: <NotificationsIcon />, href: '/admin/notifications' },
  { label: 'Fees', icon: <ReceiptIcon />, href: '/admin/fees' },
  { label: 'Grades', icon: <GradeIcon />, href: '/admin/grades' },
  { label: 'Announcements', icon: <CampaignIcon />, href: '/admin/announcements' },
  { label: 'UI Components', icon: <PaletteIcon />, href: '/admin/ui-demo' },
  { label: 'Table Showcase', icon: <BookIcon />, href: '/admin/table-showcase' },
  { label: 'RMS Patterns', icon: <PaletteIcon />, href: '/admin/rms-patterns-demo' },
  { label: 'Settings', icon: <SettingsIcon />, href: '/admin/settings' },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState<null | HTMLElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  // Sample notifications
  const notifications = [
    { id: 1, message: 'New attendance marking requested' },
    { id: 2, message: 'Grade submission deadline tomorrow' },
    { id: 3, message: 'Parent meeting scheduled for April 15' },
  ]

  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationsMenuOpen(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsMenuOpen(null)
  }

  // Use Clerk's useUser hook for user data
  const getActiveStatus = (href: string) => {
    // Exact match or starts with path
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
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {sidebarOpen ? (
          <>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
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
      <List sx={{ flex: 1, px: 1.5, overflow: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '3px', '&:hover': { bgcolor: '#999' } } }}>
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
                  color: isActive ? '#1976d2' : '#666',
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
          width: sidebarOpen ? 280 : 80,
          minWidth: sidebarOpen ? 280 : 80,
          maxWidth: sidebarOpen ? 280 : 80,
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: { xs: 'none', md: 'block' },
          transition: 'all 0.3s ease',
          overflow: 'auto',
          flexShrink: 0,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '3px', '&:hover': { bgcolor: '#999' } },
          bgcolor: '#f9f9f9',
          borderRight: '1px solid #f0f0f0',
          zIndex: 100,
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} sx={{ zIndex: 1100 }}>
        <Box sx={{ width: 280 }}>{sidebarContent}</Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <EnhancedHeader enableScrollEffect enableBlur detached>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <IconButton
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#333' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              Admin Panel
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <UserButton />
          </Box>
        </EnhancedHeader>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', overflowX: 'hidden', p: { xs: 2, md: 4 }, width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
