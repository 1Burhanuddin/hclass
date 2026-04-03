'use client'

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/material'
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HomeIcon from '@mui/icons-material/Home'
import GroupIcon from '@mui/icons-material/Group'
import ClassIcon from '@mui/icons-material/Class'
import BookIcon from '@mui/icons-material/Book'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import CloseIcon from '@mui/icons-material/Close'

export default function LayoutOption3Final() {
  const [mobileDrawer, setMobileDrawer] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Fetch real data from Convex
  const allUsers = useQuery(api.users.getAllUsers)
  const allTeachers = useQuery(api.users.getAllTeachers)
  const allStudents = useQuery(api.users.getAllStudents)
  const allBatches = useQuery(api.batches.getAllBatches)
  const allSubjects = useQuery(api.subjects.getAllSubjects)

  const navigationItems = [
    { label: 'Dashboard', icon: <HomeIcon />, active: true },
    { label: 'Users', icon: <GroupIcon /> },
    { label: 'Teachers', icon: <PersonIcon /> },
    { label: 'Batches', icon: <ClassIcon /> },
    { label: 'Subjects', icon: <BookIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
  ]

  const sidebarContent = (
    <Box
      sx={{
        width: 280,
        bgcolor: '#1a1f36',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      {/* Brand */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Harshdeep
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Class Management
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 2 }}>
        {navigationItems.map((item, idx) => (
          <ListItem key={idx} disablePadding sx={{ px: 1, mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                bgcolor: item.active ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                color: item.active ? '#667eea' : 'rgba(255,255,255,0.7)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

      {/* User Profile */}
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#667eea', width: 40, height: 40 }}>AD</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Admin
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Online
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      {/* Sidebar - Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: 280, height: '100vh', position: 'sticky', top: 0 }}>
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileDrawer} onClose={() => setMobileDrawer(false)}>
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderBottom: 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setMobileDrawer(!mobileDrawer)}
                sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                Dashboard
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ color: 'white' }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer' }}>
                AD
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflowY: 'auto' }}>
          {/* Welcome Card */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '16px',
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Welcome back!
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Here is what is happening in your class management system today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* KPI Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <CardContent sx={{ position: 'relative' }}>
                  <Typography color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', my: 1.5 }}>
                    {allUsers ? allUsers.length : '...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ color: '#52c41a', fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#52c41a', fontWeight: 600 }}>
                      Active
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(20, 177, 90, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <CardContent sx={{ position: 'relative' }}>
                  <Typography color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Teachers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#14b15a', my: 1.5 }}>
                    {allTeachers ? allTeachers.length : '...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ color: '#52c41a', fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#52c41a', fontWeight: 600 }}>
                      On Staff
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(255, 153, 0, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <CardContent sx={{ position: 'relative' }}>
                  <Typography color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9900', my: 1.5 }}>
                    {allStudents ? allStudents.length : '...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ color: '#52c41a', fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#52c41a', fontWeight: 600 }}>
                      Enrolled
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <CardContent sx={{ position: 'relative' }}>
                  <Typography color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Batches
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', my: 1.5 }}>
                    {allBatches ? allBatches.length : '...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ color: '#52c41a', fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#52c41a', fontWeight: 600 }}>
                      Active
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Subjects Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <CardContent sx={{ position: 'relative' }}>
                  <Typography color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Subjects
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336', my: 1.5 }}>
                    {allSubjects ? allSubjects.length : '...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ color: '#52c41a', fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#52c41a', fontWeight: 600 }}>
                      Offered
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Data Overview Section */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '12px' }}>
                <Box
                  sx={{
                    p: 3,
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    System Overview
                  </Typography>
                </Box>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          Total Users
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
                          {allUsers ? allUsers.length : 0}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          {allTeachers && allStudents
                            ? `${allTeachers.length} teachers, ${allStudents.length} students`
                            : 'Loading...'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          Curriculum
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
                          {allBatches && allSubjects
                            ? `${allBatches.length} batches, ${allSubjects.length} subjects`
                            : 'Loading...'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          Organized by class and section
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
