'use client'

import { Box, Card, CardContent, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button } from '@mui/material'
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'

export default function TableShowcasePage() {
  const sampleData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Teacher', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'active', joinDate: '2024-02-20' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Teacher', status: 'inactive', joinDate: '2023-12-10' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-05' },
    { id: '5', name: 'Carol White', email: 'carol@example.com', role: 'Student', status: 'pending', joinDate: '2024-03-01' },
  ]

  const enhancedTableColumns: EnhancedTableColumn[] = [
    { id: 'name', label: 'Name', minWidth: 150, sortable: true, filterable: true },
    { id: 'email', label: 'Email', minWidth: 200, sortable: true, filterable: true, hideOnMobile: true },
    { id: 'role', label: 'Role', minWidth: 120, sortable: true, filterable: true },
    { id: 'joinDate', label: 'Join Date', minWidth: 120, sortable: true, hideOnMobile: true },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      filterable: true,
      format: (value: string) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={value === 'active' ? 'success' : value === 'inactive' ? 'error' : 'warning'}
          size="small"
          sx={{ borderRadius: '16px', fontWeight: 600 }}
        />
      ),
    },
  ]

  const getStatusColor = (status: string) => {
    if (status === 'active') return '#4caf50'
    if (status === 'inactive') return '#f44336'
    return '#ff9800'
  }

  const getRoleColor = (role: string) => {
    if (role === 'Teacher') return '#1976d2'
    if (role === 'Student') return '#9c27b0'
    return '#f57c00'
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        Table UI Showcase
      </Typography>
      <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
        Compare different table UI implementations for your project
      </Typography>

      {/* Current Implementation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            📊 Current: EnhancedTable Component
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            Advanced table with comprehensive features for complex data management and user interactions.
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="✓ Advanced Filtering" size="small" sx={{ borderRadius: '16px' }} />
            <Chip label="✓ Column Sorting" size="small" sx={{ borderRadius: '16px' }} />
            <Chip label="✓ Pagination" size="small" sx={{ borderRadius: '16px' }} />
            <Chip label="✓ Column Visibility" size="small" sx={{ borderRadius: '16px' }} />
            <Chip label="✓ CSV Export" size="small" sx={{ borderRadius: '16px' }} />
            <Chip label="✓ Mobile Responsive" size="small" sx={{ borderRadius: '16px' }} />
          </Box>
          <EnhancedTable 
            columns={enhancedTableColumns} 
            rows={sampleData} 
            onRowClick={(row) => console.log(row)}
            allowExport={true}
          />
        </CardContent>
      </Card>

      {/* Alternative: Advanced Native HTML Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            🎯 Alternative: Advanced HTML Table (like RMS CustomTable)
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            Custom native HTML table with professional styling, checkboxes, pagination, and advanced features.
            More control over styling but requires custom implementation.
          </Typography>
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="✓ Checkboxes/Radio" size="small" sx={{ borderRadius: '16px', backgroundColor: '#c8e6c9' }} />
            <Chip label="✓ Row Selection" size="small" sx={{ borderRadius: '16px', backgroundColor: '#c8e6c9' }} />
            <Chip label="✓ Pagination" size="small" sx={{ borderRadius: '16px', backgroundColor: '#c8e6c9' }} />
            <Chip label="✓ CSV Export" size="small" sx={{ borderRadius: '16px', backgroundColor: '#c8e6c9' }} />
            <Chip label="✓ Sortable" size="small" sx={{ borderRadius: '16px', backgroundColor: '#c8e6c9' }} />
            <Chip label="✓ Custom Styling" size="small" sx={{ borderRadius: '16px', backgroundColor: '#c8e6c9' }} />
          </Box>

          {/* HTML Table Preview */}
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
            <Table sx={{ backgroundColor: '#fafafa' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <TableCell sx={{ fontWeight: 700, padding: '16px' }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, padding: '16px' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, padding: '16px' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, padding: '16px' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, padding: '16px' }}>Join Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, padding: '16px', textAlign: 'center' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleData.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      borderBottom: '1px solid #eee',
                      '&:hover': { backgroundColor: '#f0f7ff' },
                      cursor: 'pointer',
                    }}
                  >
                    <TableCell sx={{ padding: '16px' }}>
                      <input type="checkbox" style={{ cursor: 'pointer' }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, padding: '16px' }}>{row.name}</TableCell>
                    <TableCell sx={{ padding: '16px', color: '#666' }}>{row.email}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>
                      <Chip
                        label={row.role}
                        size="small"
                        sx={{
                          backgroundColor: getRoleColor(row.role) + '20',
                          color: getRoleColor(row.role),
                          fontWeight: 600,
                          borderRadius: '12px',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '16px', color: '#666' }}>{row.joinDate}</TableCell>
                    <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(row.status),
                        }}
                        title={row.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Chip label="← 1 2 3 4" icon={<span>📄</span>} sx={{ borderRadius: '8px' }} />
            <Button variant="outlined" size="small" sx={{ borderRadius: '8px' }}>
              Export CSV
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            📋 Feature Comparison
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Feature</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>EnhancedTable (Current)</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Advanced Table (RMS)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { feature: 'Sorting', current: true, advanced: true },
                  { feature: 'Pagination', current: true, advanced: true },
                  { feature: 'Search/Filter', current: false, advanced: true },
                  { feature: 'Row Selection', current: false, advanced: true },
                  { feature: 'Checkboxes', current: false, advanced: true },
                  { feature: 'Multi-row Actions', current: false, advanced: true },
                  { feature: 'CSV Export', current: false, advanced: true },
                  { feature: 'Custom Cell Render', current: true, advanced: true },
                  { feature: 'Responsive', current: true, advanced: true },
                  { feature: 'Sticky Headers', current: false, advanced: true },
                  { feature: 'Setup Complexity', current: '🟢 Low', advanced: '🟡 Medium' },
                  { feature: 'Bundle Size', current: '🟢 Small', advanced: '🟡 Medium' },
                ].map((row, idx) => (
                  <TableRow key={idx} sx={{ borderBottom: '1px solid #eee' }}>
                    <TableCell sx={{ fontWeight: 500 }}>{row.feature}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {typeof row.current === 'boolean' ? (
                        row.current ? '✅' : '❌'
                      ) : (
                        row.current
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {typeof row.advanced === 'boolean' ? (
                        row.advanced ? '✅' : '❌'
                      ) : (
                        row.advanced
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card sx={{ mb: 4, backgroundColor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            💡 Recommendations
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              <strong>Use EnhancedTable when:</strong> You need comprehensive table functionality with filtering, sorting, export, and responsive design.
              Perfect for admin panels and data-heavy interfaces.
            </Typography>
            <Typography variant="body2">
              <strong>Use Advanced Table when:</strong> You need bulk row selection, CSV export, complex filtering, or
              advanced analytics features. Worth the extra setup for high-frequency table interactions.
            </Typography>
            <Typography variant="body2" sx={{ pt: 2 }}>
              <strong>Suggestion:</strong> EnhancedTable is now the standard for all admin panels, providing consistent UX
              with advanced features like filtering, export, and mobile responsiveness across all modules.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Code Example */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            🎨 Styling Examples
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Status Indicators (with Pill Badges)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label="Active"
                  color="success"
                  sx={{ borderRadius: '16px', fontWeight: 600 }}
                />
                <Chip
                  label="Inactive"
                  color="error"
                  sx={{ borderRadius: '16px', fontWeight: 600 }}
                />
                <Chip
                  label="Pending"
                  color="warning"
                  sx={{ borderRadius: '16px', fontWeight: 600 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Role Tags (Color-Coded)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label="Teacher"
                  size="small"
                  sx={{
                    backgroundColor: '#1976d220',
                    color: '#1976d2',
                    fontWeight: 600,
                    borderRadius: '12px',
                  }}
                />
                <Chip
                  label="Student"
                  size="small"
                  sx={{
                    backgroundColor: '#9c27b020',
                    color: '#9c27b0',
                    fontWeight: 600,
                    borderRadius: '12px',
                  }}
                />
                <Chip
                  label="Admin"
                  size="small"
                  sx={{
                    backgroundColor: '#f57c0020',
                    color: '#f57c00',
                    fontWeight: 600,
                    borderRadius: '12px',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
