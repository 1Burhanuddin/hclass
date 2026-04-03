'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { DataTable, DataCard } from '@/components/ui'

interface Student {
  _id: string
  name: string
  email: string
  role: 'student'
  isActive: boolean
  createdAt: number
}

interface Batch {
  _id: string
  name: string
}

export default function StudentsManagementPage() {
  const allUsers = useQuery(api.users.getAllUsers)
  const allBatches = useQuery(api.batches.getAllBatches)
  
  const updateUserMutation = useMutation(api.users.updateUserDetails)
  const deactivateUserMutation = useMutation(api.users.deactivateUser)
  const createStudentMutation = useMutation(api.students.createStudent)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [enrollingStudent, setEnrollingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [enrollData, setEnrollData] = useState({
    selectedBatch: '',
  })
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [enrollLoading, setEnrollLoading] = useState(false)

  // Filter for students only
  const students = allUsers?.filter((u) => u.role === 'student') || []

  // Generate unique enrollment number
  const generateEnrollmentNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `STU-${timestamp}-${random}`
  }

  const handleEditStudent = (s: Student) => {
    setEditingStudent(s)
    setFormData({ name: s.name, email: s.email })
    setError('')
    setOpenDialog(true)
  }

  const handleSaveStudent = async () => {
    if (!editingStudent) return
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required')
      return
    }
    
    try {
      setSaveLoading(true)
      setError('')
      
      await updateUserMutation({
        userId: editingStudent._id as any,
        name: formData.name,
        email: formData.email,
        role: 'student',
      })
      
      setOpenDialog(false)
      setSaveLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update student')
      setSaveLoading(false)
    }
  }

  const handleEnrollStudent = (s: Student) => {
    setEnrollingStudent(s)
    setEnrollData({ selectedBatch: '' })
    setError('')
    setOpenEnrollDialog(true)
  }

  const handleSaveEnrollment = async () => {
    if (!enrollingStudent || !enrollData.selectedBatch) {
      setError('Please select a batch')
      return
    }
    
    try {
      setEnrollLoading(true)
      setError('')
      
      // Auto-generate unique enrollment number
      const enrollmentNumber = generateEnrollmentNumber()
      
      await createStudentMutation({
        userId: enrollingStudent._id as any,
        batchId: enrollData.selectedBatch as any,
        enrollmentNumber: enrollmentNumber,
      })
      
      setOpenEnrollDialog(false)
      setEnrollLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to enroll student')
      setEnrollLoading(false)
    }
  }

  const handleDeleteStudent = (s: Student) => {
    setEditingStudent(s)
    setError('')
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingStudent) return
    
    try {
      setDeleteLoading(true)
      setError('')
      
      await deactivateUserMutation({
        userId: editingStudent._id as any,
      })
      
      setOpenDeleteDialog(false)
      setDeleteLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete student')
      setDeleteLoading(false)
    }
  }

  const tableColumns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    {
      id: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            borderRadius: '16px',
            fontWeight: 600,
            color: value ? '#2e7d32' : '#999',
            backgroundColor: value ? '#e8f5e9' : '#f5f5f5',
            border: 'none',
          }}
        />
      ),
    },
  ]

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Students Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Manage system students ({students?.length || 0} total)
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Students Table */}
      <Grid item xs={12}>
        <DataCard>
          <DataTable
            columns={tableColumns}
            data={students || []}
            loading={!allUsers}
            disabled={saveLoading || deleteLoading || enrollLoading}
            onRowClick={handleEditStudent}
            emptyMessage="No students found. Students are created through User Management."
          />
        </DataCard>
      </Grid>

      {/* Edit Student Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}>Edit Student</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            disabled={saveLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            disabled={saveLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => handleEnrollStudent(editingStudent!)}
            variant="outlined"
            fullWidth
            sx={{ borderRadius: '8px', py: 1, px: 2, textTransform: 'none' }}
            disabled={saveLoading || deleteLoading}
          >
            Enroll in Batch
          </Button>
          <Button
            onClick={() => setOpenDeleteDialog(true)}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', py: 1, px: 2, textTransform: 'none' }}
            disabled={saveLoading || deleteLoading}
          >
            Delete
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: '8px', py: 1, px: 2 }}
            disabled={saveLoading || deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveStudent}
            variant="contained" 
            sx={{ borderRadius: '8px', py: 1, px: 3, minWidth: '100px' }} 
            disabled={saveLoading || deleteLoading}
          >
            {saveLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Saving...
              </Box>
            ) : (
              'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enroll Student Dialog */}
      <Dialog open={openEnrollDialog} onClose={() => setOpenEnrollDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}>Enroll Student in Batch</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography sx={{ color: '#666', fontWeight: 500 }}>
            Student: <strong>{enrollingStudent?.name}</strong>
          </Typography>
          
          <FormControl fullWidth disabled={enrollLoading}>
            <InputLabel>Select Batch</InputLabel>
            <Select
              value={enrollData.selectedBatch}
              label="Select Batch"
              onChange={(e) => setEnrollData({ ...enrollData, selectedBatch: e.target.value })}
              sx={{
                borderRadius: '12px',
              }}
            >
              {allBatches?.map((batch: any) => (
                <MenuItem key={batch._id} value={batch._id}>
                  {batch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Alert severity="info" sx={{ borderRadius: '8px' }}>
            <Typography variant="caption">
              Enrollment number will be automatically generated upon saving.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenEnrollDialog(false)}
            sx={{ borderRadius: '8px', py: 1, px: 2 }}
            disabled={enrollLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEnrollment}
            variant="contained" 
            sx={{ borderRadius: '8px', py: 1, px: 3, minWidth: '100px' }} 
            disabled={enrollLoading}
          >
            {enrollLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Enrolling...
              </Box>
            ) : (
              'Enroll'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete Student</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete <strong>{editingStudent?.name}</strong>? This action will soft-delete the student.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ borderRadius: '8px', py: 1, px: 2 }} 
            disabled={deleteLoading || saveLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: '8px', py: 1, px: 3, minWidth: '100px' }}
            disabled={deleteLoading || saveLoading}
          >
            {deleteLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Deleting...
              </Box>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
