'use client';

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
} from '@mui/material';

import { useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface StudentLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { label: 'Dashboard', icon: <HomeIcon />, href: '/student' },
  { label: 'Analytics', icon: <AnalyticsIcon />, href: '/student/analytics' },
  { label: 'Grades', icon: <GradeIcon />, href: '/student/grades' },
  { label: 'Attendance', icon: <EventIcon />, href: '/student/attendance' },
  { label: 'Assignments', icon: <AssignmentIcon />, href: '/student/assignments' },
  { label: 'Fees', icon: <ReceiptIcon />, href: '/student/fees' },
  { label: 'Notifications', icon: <NotificationsIcon />, href: '/student/notifications' },
];

export function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState<null | HTMLElement>(null);
  const pathname = usePathname();

  // Sample notifications
  const notifications = [
    { id: 1, message: 'New assignment posted' },
    { id: 2, message: 'Grade published for Mathematics' },
    { id: 3, message: 'Reminder: Fee due date approaching' },
  ];

  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationsMenuOpen(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenuOpen(null);
  };

  const getActiveStatus = (href: string) => {
    return pathname === href || pathname === `${href}/`;
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#ffffff',
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
          borderBottom: '1px solid #e0e0e0',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {sidebarOpen ? (
          <>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                Harshdeep
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                Student Portal
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setSidebarOpen(false)}
              sx={{ display: { xs: 'none', md: 'flex' }, transition: 'all 250ms ease' }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            size="small"
            onClick={() => setSidebarOpen(true)}
            sx={{ display: { xs: 'none', md: 'flex' }, transition: 'all 250ms ease' }}
          >
            <ChevronLeftIcon sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List
        sx={{
          flex: 1,
          px: 1.5,
          py: 2,
          overflow: 'auto',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#ccc',
            borderRadius: '3px',
            '&:hover': { bgcolor: '#999' },
          },
        }}
      >
        {navigationItems.map((item, idx) => {
          const isActive = getActiveStatus(item.href);
          return (
            <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: '10px',
                  bgcolor: isActive ? '#e3f2fd' : 'transparent',
                  color: isActive ? '#1976d2' : '#616161',
                  pl: sidebarOpen ? 2 : 1.5,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  fontWeight: isActive ? 600 : 400,
                  margin: '4px 8px',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isActive ? '#e3f2fd' : '#f5f5f5',
                    transform: 'translateX(2px)',
                    color: isActive ? '#1976d2' : '#424242',
                  },
                  '&:active': {
                    transform: 'translateX(0px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: sidebarOpen ? 40 : 'auto',
                    justifyContent: 'center',
                    transition: 'all 250ms ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
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
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'auto',
          flexShrink: 0,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#ccc',
            borderRadius: '3px',
            '&:hover': { bgcolor: '#999' },
          },
          bgcolor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: '#ffffff',
            color: '#1a1a1a',
            borderBottom: '1px solid #e0e0e0',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, minHeight: { xs: 56, md: 64 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                sx={{ display: { xs: 'flex', md: 'none' }, color: '#1976d2', transition: 'all 250ms ease' }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                Student Panel
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleNotificationsClick}
                sx={{
                  color: '#1976d2',
                  position: 'relative',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
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
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', overflowX: 'hidden', p: { xs: 2, md: 4 }, width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
