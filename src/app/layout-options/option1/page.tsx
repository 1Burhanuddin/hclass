'use client'

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  IconButton,
  Card,
  CardContent,
  Grid,
  Container,
} from '@mui/material'
import { useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import SchoolIcon from '@mui/icons-material/School'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const DRAWER_WIDTH = 280

export default function LayoutOption1() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon /> },
    { label: 'Users', icon: <PeopleIcon /> },
    { label: 'Batches', icon: <SchoolIcon /> },
    { label: 'Mapping', icon: <AssignmentIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
  ]

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo Section */}
      <Box sx={{ p: 2.5, backgroundColor: '#1976d2', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
          HC System
        </Typography>
        <Typography variant="caption">Management Platform</Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item, idx) => (
          <ListItem key={idx} disablePadding sx={{ mb: 0.5, px: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                bgcolor: idx === 0 ? '#e3f2fd' : 'transparent',
                color: idx === 0 ? '#1976d2' : '#666',
                '&:hover': { bgcolor: '#f5f5f5' },
                py: 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ '& .MuiTypography-root': { fontWeight: 500, fontSize: '0.95rem' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User Profile */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>AD</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Admin User
            </Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>
              admin@school.com
            </Typography>
          </Box>
          <MoreVertIcon sx={{ fontSize: 20, cursor: 'pointer', color: '#ccc' }} />
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f9fafb' }}>
      {/* Sidebar - Desktop */}
      <Box
        sx={{
          width: DRAWER_WIDTH,
          bgcolor: 'white',
          borderRight: '1px solid #e0e0e0',
          display: { xs: 'none', md: 'block' },
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        {drawer}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={1}
          sx={{ bgcolor: 'white', color: '#333', borderBottom: '1px solid #e0e0e0' }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                OPTION 1: Fixed Sidebar + Clean Header
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton>
                <SearchIcon />
              </IconButton>
              <IconButton>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Avatar sx={{ bgcolor: '#dc004e', cursor: 'pointer' }}>JD</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            {[
              { title: 'Total Users', value: '248', color: '#1976d2' },
              { title: 'Active Batches', value: '12', color: '#4caf50' },
              { title: 'Subjects', value: '45', color: '#ff9800' },
              { title: 'Teachers', value: '28', color: '#9c27b0' },
            ].map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ borderLeft: `4px solid ${stat.color}` }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Sample Table */}
            <Grid item xs={12}>
              <Card>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Users
                  </Typography>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                          Name
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                          Email
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                          Role
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'John Doe', email: 'john@school.com', role: 'Teacher', status: 'Active' },
                        { name: 'Jane Smith', email: 'jane@school.com', role: 'Admin', status: 'Active' },
                        { name: 'Mike Johnson', email: 'mike@school.com', role: 'Student', status: 'Inactive' },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '12px 16px' }}>{row.name}</td>
                          <td style={{ padding: '12px 16px', color: '#666' }}>{row.email}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 2,
                                py: 0.5,
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                              }}
                            >
                              {row.role}
                            </Box>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Box
                              sx={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                bgcolor: row.status === 'Active' ? '#4caf50' : '#ccc',
                                mr: 1,
                              }}
                            />
                            {row.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
