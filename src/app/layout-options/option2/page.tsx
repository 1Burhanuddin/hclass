'use client'

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Button,
  Badge,
} from '@mui/material'
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import GroupIcon from '@mui/icons-material/Group'
import ClassIcon from '@mui/icons-material/Class'
import EventIcon from '@mui/icons-material/Event'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export default function LayoutOption2() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const menuItems = [
    { label: 'Dashboard', icon: <HomeIcon />, active: true },
    { label: 'Users', icon: <GroupIcon /> },
    { label: 'Batches', icon: <ClassIcon /> },
    { label: 'Attendance', icon: <FingerprintIcon /> },
    { label: 'Events', icon: <EventIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Animated Sidebar */}
      <Box
        sx={{
          width: sidebarOpen ? 260 : 80,
          bgcolor: '#2c3e50',
          color: 'white',
          transition: 'width 0.3s',
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {sidebarOpen ? (
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
              HCS
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 700 }}>H</Typography>
          )}
          <IconButton
            size="small"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ color: 'white' }}
          >
            <ChevronRightIcon
              sx={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
            />
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

        {/* Menu */}
        <List sx={{ flex: 1, pt: 2 }}>
          {menuItems.map((item, idx) => (
            <ListItem key={idx} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: '8px',
                  bgcolor: item.active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: item.active ? '#fff' : 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: sidebarOpen ? 40 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

        {/* User Profile */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 1.5 : 0 }}>
            <Avatar sx={{ bgcolor: '#52c41a', width: 40, height: 40 }}>AD</Avatar>
            {sidebarOpen && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Admin
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Online
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'white',
            color: '#333',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              OPTION 2: Collapsible Sidebar + Search Bar
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Search..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#ccc' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 250,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f5f5f5',
                    border: 'none',
                  },
                }}
              />
              <IconButton>
                <Badge badgeContent={5} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Avatar sx={{ bgcolor: '#2c3e50', cursor: 'pointer' }}>JD</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Grid container spacing={3}>
            {/* Top Stats */}
            {[
              { title: 'Total Teachers', value: '28', icon: '👨‍🏫', color: '#1976d2' },
              { title: 'Total Students', value: '456', icon: '👨‍🎓', color: '#52c41a' },
              { title: 'Active Classes', value: '12', icon: '📚', color: '#faad14' },
              { title: 'Today Attendance', value: '92%', icon: '✓', color: '#52c41a' },
            ].map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    border: `2px solid ${stat.color}`,
                    borderRadius: '12px',
                    transition: 'transform 0.2s',
                    ':hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mt: 1 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box sx={{ fontSize: '2.5rem' }}>{stat.icon}</Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Data Table */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '12px' }}>
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Latest Attendance Records
                  </Typography>
                  <Button size="small" variant="outlined">
                    View All
                  </Button>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Batch</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Present</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Absent</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '2024-04-02', batch: '10-A', present: 42, absent: 3, rate: '93%' },
                        { date: '2024-04-01', batch: '10-B', present: 38, absent: 5, rate: '88%' },
                        { date: '2024-03-31', batch: '11-A', present: 45, absent: 2, rate: '95%' },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '12px 16px' }}>{row.date}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.batch}</td>
                          <td style={{ padding: '12px 16px', color: '#52c41a', fontWeight: 500 }}>
                            {row.present}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#f5222d', fontWeight: 500 }}>
                            {row.absent}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Box
                              sx={{
                                display: 'inline-block',
                                bgcolor: '#f6ffed',
                                color: '#52c41a',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '6px',
                                fontWeight: 600,
                              }}
                            >
                              {row.rate}
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
