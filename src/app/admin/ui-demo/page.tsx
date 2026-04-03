'use client'

import { Box, Grid, Card, CardContent, Typography, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'

export default function UIDemoPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')

  // Sample data for EnhancedTable demo
  const tableData = [
    { id: '1', name: 'John Doe', status: 'active', email: 'john@example.com', role: 'Teacher' },
    { id: '2', name: 'Jane Smith', status: 'inactive', email: 'jane@example.com', role: 'Student' },
    { id: '3', name: 'Bob Johnson', status: 'active', email: 'bob@example.com', role: 'Admin' },
  ]

  const tableColumns: EnhancedTableColumn[] = [
    { id: 'name', label: 'Name', minWidth: 150, sortable: true, filterable: true },
    { id: 'email', label: 'Email', minWidth: 200, sortable: true, filterable: true, hideOnMobile: true },
    { id: 'role', label: 'Role', minWidth: 120, sortable: true, filterable: true },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      filterable: true,
      hideOnMobile: true,
      format: (value: string) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={value === 'active' ? 'success' : 'error'}
          size="small"
          sx={{ borderRadius: '16px' }}
        />
      ),
    },
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
        UI Component Demo
      </Typography>

      {/* Typography Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Typography
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="body1">Body text - Regular paragraph</Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>
              Caption text - Small secondary text
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Buttons Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Buttons
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" sx={{ borderRadius: '8px' }}>
              Primary
            </Button>
            <Button variant="outlined" sx={{ borderRadius: '8px' }}>
              Secondary
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: '8px' }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ borderRadius: '8px' }}
            >
              Add New
            </Button>
            <Button variant="text" sx={{ borderRadius: '8px' }}>
              Text Button
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Chips / Pills Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Chips & Badges (Pill Style)
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Status Chips */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2">Status Badges:</Typography>
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
            </Box>

            {/* Priority Pills */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2">Priority (Pill Only):</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label="Low"
                  size="small"
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: '#c8e6c9',
                    color: '#2e7d32',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Medium"
                  size="small"
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: '#fff9c4',
                    color: '#f57f17',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="High"
                  size="small"
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: '#ffcdd2',
                    color: '#c62828',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            {/* Grade Circles */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2">Grade Circles (Full Round):</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                  <Box
                    key={grade}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#fff',
                      backgroundColor:
                        grade === 'A'
                          ? '#4caf50'
                          : grade === 'B'
                            ? '#8bc34a'
                            : grade === 'C'
                              ? '#ffc107'
                              : grade === 'D'
                                ? '#ff9800'
                                : '#f44336',
                    }}
                  >
                    {grade}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* EnhancedTable Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Enhanced Table Component
          </Typography>
          <EnhancedTable 
            columns={tableColumns} 
            rows={tableData} 
            onRowClick={(row) => console.log(row)}
            allowExport={true}
          />
        </CardContent>
      </Card>

      {/* Dropdown/Select Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Dropdown / Select Components
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Option</InputLabel>
                <Select
                  value={selectedOption}
                  label="Select Option"
                  onChange={(e) => setSelectedOption(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                    },
                  }}
                >
                  <MenuItem value="">Choose an option</MenuItem>
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Disabled Select</InputLabel>
                <Select
                  value="disabled"
                  label="Disabled Select"
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                    },
                  }}
                >
                  <MenuItem value="disabled">Disabled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* TextField Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Text Inputs
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Standard Input"
                placeholder="Enter text"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Error State"
                error
                helperText="This field has an error"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Disabled Input"
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Multiline"
                multiline
                rows={3}
                placeholder="Multi-line text"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cards Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Card Variants
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DataCard>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  This is a DataCard - clean, minimal style
                </Typography>
              </DataCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="body2">Standard Card with shadow</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog Demo */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ borderRadius: '8px' }}
              onClick={() => setOpenDialog(true)}
            >
              Open Dialog Demo
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Dialog Title</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>This is a sample dialog component.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{ borderRadius: '8px' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Color Palette Section */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Color Palette
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: 'Primary', color: '#1976d2' },
              { name: 'Success', color: '#4caf50' },
              { name: 'Error', color: '#f44336' },
              { name: 'Warning', color: '#ff9800' },
              { name: 'Info', color: '#2196f3' },
              { name: 'Background', color: '#f9f9f9' },
              { name: 'Text Primary', color: '#333' },
              { name: 'Text Secondary', color: '#666' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.name}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 60,
                      backgroundColor: item.color,
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {item.color}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
