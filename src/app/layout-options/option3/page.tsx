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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material'
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SpaceshipIcon from '@mui/icons-material/Rocket'
import GroupIcon from '@mui/icons-material/Group'
import BarChartIcon from '@mui/icons-material/BarChart'
import BookIcon from '@mui/icons-material/Book'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import ArrowUpIcon from '@mui/icons-material/TrendingUp'
import ArrowDownIcon from '@mui/icons-material/TrendingDown'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

export default function LayoutOption3() {
  const [mobileDrawer, setMobileDrawer] = useState(false)

  const navigationItems = [
    { label: 'Dashboard', icon: <SpaceshipIcon />, active: true },
    { label: 'Team', icon: <GroupIcon /> },
    { label: 'Analytics', icon: <BarChartIcon /> },
    { label: 'Courses', icon: <BookIcon /> },
    { label: 'Profile', icon: <PersonIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
  ]

  const sidebarContent = (
    <Box
      sx={{
        width: 280,
        bgcolor: '#f5f7fa',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Brand */}
      <Box sx={{ p: 3, bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Harshdeep
        </Typography>
        <Typography variant="caption">Class Management</Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: '8px',
                bgcolor: item.active ? '#667eea' : 'transparent',
                color: item.active ? 'white' : '#666',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
      {/* Sidebar - Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>{sidebarContent}</Box>

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
                OPTION 3: Modern Gradient Design
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ color: 'white' }}>
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}>U</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <Grid container spacing={3}>
            {/* Welcome Card */}
            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Welcome back, Admin! 👋
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Here's what happened in your system today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* KPI Cards */}
            {[
              {
                title: 'Total Students',
                value: '1,234',
                change: '+12%',
                trend: 'up',
                icon: '👨‍🎓',
              },
              {
                title: 'Active Sessions',
                value: '89',
                change: '+8%',
                trend: 'up',
                icon: '📖',
              },
              {
                title: 'Attendance Rate',
                value: '94.2%',
                change: '-2%',
                trend: 'down',
                icon: '✓',
              },
              {
                title: 'Avg. Score',
                value: '78.5',
                change: '+5%',
                trend: 'up',
                icon: '⭐',
              },
            ].map((kpi, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                  {/* Background accent */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 150,
                      height: 150,
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '50%',
                    }}
                  />

                  <CardContent sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                          {kpi.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: '#667eea' }}>
                          {kpi.value}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '2rem' }}>{kpi.icon}</Typography>
                    </Box>

                    <Chip
                      icon={kpi.trend === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                      label={kpi.change}
                      size="small"
                      color={kpi.trend === 'up' ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Main Data Table */}
            <Grid item xs={12}>
              <Card>
                <Box
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Class Performance
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                      Overview of all batches
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <MoreHorizIcon />
                  </IconButton>
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                          Batch
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                          Teacher
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                          Students
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                          Avg. Score
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          batch: '10-A',
                          teacher: 'Mr. Patel',
                          students: 45,
                          score: 82.5,
                          status: 'Active',
                        },
                        {
                          batch: '10-B',
                          teacher: 'Ms. Singh',
                          students: 42,
                          score: 79.2,
                          status: 'Active',
                        },
                        {
                          batch: '11-A',
                          teacher: 'Dr. Kumar',
                          students: 48,
                          score: 85.1,
                          status: 'Active',
                        },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 500 }}>{row.batch}</td>
                          <td style={{ padding: '14px 16px' }}>{row.teacher}</td>
                          <td style={{ padding: '14px 16px' }}>{row.students}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#667eea' }}>
                                {row.score}
                              </Box>
                              <ArrowUpIcon sx={{ fontSize: 16, color: '#52c41a' }} />
                            </Box>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <Chip
                              icon={<CheckCircleIcon />}
                              label={row.status}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>

                <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
                  <Button color="primary">Load More</Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
