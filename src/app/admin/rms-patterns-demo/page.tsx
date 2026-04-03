'use client'

import { useState } from 'react'
import { Box, Card, CardContent, Typography, Grid } from '@mui/material'
import EnhancedHeader from '@/components/EnhancedHeader'
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'
import CollapsibleSidebar from '@/components/CollapsibleSidebar'

export default function RMSPatternsDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Sample data
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Design', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', status: 'Inactive', joinDate: '2023-12-10' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', department: 'Engineering', status: 'Active', joinDate: '2024-01-05' },
    { id: 5, name: 'Carol White', email: 'carol@example.com', department: 'HR', status: 'Active', joinDate: '2024-03-01' },
    { id: 6, name: 'David Brown', email: 'david@example.com', department: 'Finance', status: 'Active', joinDate: '2024-02-15' },
    { id: 7, name: 'Emma Davis', email: 'emma@example.com', department: 'Engineering', status: 'Active', joinDate: '2023-11-20' },
    { id: 8, name: 'Frank Wilson', email: 'frank@example.com', department: 'Design', status: 'Inactive', joinDate: '2023-10-01' },
  ]

  const tableColumns: EnhancedTableColumn[] = [
    { id: 'id', label: 'ID', minWidth: 50, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 150, filterable: true, sortable: true },
    { id: 'email', label: 'Email', minWidth: 200, filterable: true, sortable: true },
    { id: 'department', label: 'Department', minWidth: 130, filterable: true, sortable: true },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      filterable: true,
      sortable: true,
      format: (value) => (
        <Box
          sx={{
            display: 'inline-block',
            px: 2,
            py: 0.5,
            borderRadius: '16px',
            backgroundColor: value === 'Active' ? '#e8f5e9' : '#ffebee',
            color: value === 'Active' ? '#2e7d32' : '#c62828',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          {value}
        </Box>
      ),
    },
    { id: 'joinDate', label: 'Join Date', minWidth: 130, sortable: true },
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Sidebar Demo */}
      <CollapsibleSidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            color: sidebarOpen ? 'text.primary' : '#999',
            transition: 'all 300ms ease-in-out',
            opacity: sidebarOpen ? 1 : 0.6,
            overflow: 'hidden',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {sidebarOpen ? 'Navigation' : 'Nav'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {['Dashboard', 'Users', 'Settings', 'Reports'].map((item) => (
              <Box
                key={item}
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease-in-out',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CollapsibleSidebar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Enhanced Header */}
        <EnhancedHeader enableScrollEffect enableBlur detached>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              RMS UI Patterns Demo
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Scroll to see header effects
            </Typography>
          </Box>
        </EnhancedHeader>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Grid container spacing={3}>
            {/* Info Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ border: '1px solid #efefef' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {sampleData.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ border: '1px solid #efefef' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Active
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                        {sampleData.filter((d) => d.status === 'Active').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ border: '1px solid #efefef' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Inactive
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#c62828' }}>
                        {sampleData.filter((d) => d.status === 'Inactive').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ border: '1px solid #efefef' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Departments
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {new Set(sampleData.map((d) => d.department)).size}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Features Explanation */}
            <Grid item xs={12}>
              <Card sx={{ border: '1px solid #efefef' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    ✨ New UI Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          📁 Collapsible Sidebar
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Sidebar starts collapsed (80px), expands to 260px on hover. Mobile: becomes drawer overlay.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          🎨 Scroll-Triggered Header
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Header changes appearance on scroll - adds rounded corners, shadow, and blur effect.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          🔍 Table Filtering
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Search/filter by any column. Live results update as you type.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          ↕️ Column Sorting & Visibility
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Sort by clicking headers. Toggle column visibility via menu.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Enhanced Table */}
            <Grid item xs={12}>
              <Card sx={{ border: '1px solid #efefef' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Team Members
                  </Typography>
                  <EnhancedTable columns={tableColumns} rows={sampleData} allowExport />
                </CardContent>
              </Card>
            </Grid>

            {/* Pagination Info */}
            <Grid item xs={12}>
              <Card sx={{ border: '1px solid #efefef', backgroundColor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    <strong>Pagination Options:</strong> 5, 15, 25, 50, 100 rows per page (like RMS) <br />
                    <strong>Features:</strong> Built-in filtering, sorting, column visibility, CSV export (scroll to refresh header
                    with blur + rounded corners effect)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
