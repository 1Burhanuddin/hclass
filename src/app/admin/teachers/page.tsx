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
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'
import AddIcon from '@mui/icons-material/Add'

interface Teacher {
  _id: string
  name: string
  email: string
  role: 'teacher'
  isActive: boolean
  createdAt: number
  primarySubjectId?: string
}

export default function TeachersManagementPage() {
  const allUsers = useQuery(api.users.getAllUsers)
  const subjects = useQuery(api.subjects.getAllSubjects)
  const allTeachers = useQuery(api.teachers.getAllTeachers)
  
  const updateUserMutation = useMutation(api.users.updateUserDetails)
  const deactivateUserMutation = useMutation(api.users.deactivateUser)
  const updateTeacherMutation = useMutation(api.teachers.updateTeacher)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [editingTeacherRecord, setEditingTeacherRecord] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    primarySubjectId: '',
  })
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Filter for teachers only
  const teachers = allUsers?.filter((u) => u.role === 'teacher') || []

  const handleEditTeacher = (t: Teacher) => {
    const teacherRecord = allTeachers?.find((tr: any) => tr.userId === t._id)
    setEditingTeacher(t)
    setEditingTeacherRecord(teacherRecord)
    setFormData({ 
      name: t.name, 
      email: t.email, 
      primarySubjectId: teacherRecord?.primarySubjectId || '' 
    })
    setError('')
    setOpenDialog(true)
  }

  const handleSaveTeacher = async () => {
    if (!editingTeacher) return
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required')
      return
    }
    
    try {
      setSaveLoading(true)
      setError('')
      
      await updateUserMutation({
        userId: editingTeacher._id as any,
        name: formData.name,
        email: formData.email,
        role: 'teacher',
      })
      
      // Update teacher's primary subject if teacher record exists and subject changed
      if (editingTeacherRecord && formData.primarySubjectId && formData.primarySubjectId !== (editingTeacherRecord.primarySubjectId || '')) {
        await updateTeacherMutation({
          teacherId: editingTeacherRecord._id as any,
          primarySubjectId: formData.primarySubjectId as any,
        })
      }
      
      setOpenDialog(false)
      setSaveLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update teacher')
      setSaveLoading(false)
    }
  }

  const handleDeleteTeacher = (t: Teacher) => {
    setEditingTeacher(t)
    setError('')
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingTeacher) return
    
    try {
      setDeleteLoading(true)
      setError('')
      
      await deactivateUserMutation({
        userId: editingTeacher._id as any,
      })
      
      setOpenDeleteDialog(false)
      setDeleteLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete teacher')
      setDeleteLoading(false)
    }
  }

  const tableColumns: EnhancedTableColumn[] = [
    { id: 'name', label: 'Name', minWidth: 150, sortable: true, filterable: true },
    { id: 'email', label: 'Email', minWidth: 200, sortable: true, filterable: true, hideOnMobile: true },
    {
      id: 'subject',
      label: 'Subject',
      minWidth: 150,
      sortable: true,
      filterable: true,
      format: (value: any) => {
        const teacherRecord = allTeachers?.find((tr: any) => tr.userId === value)
        if (!teacherRecord?.primarySubjectId) return <span style={{ color: '#999' }}>—</span>
        const subject = subjects?.find((s: any) => s._id === teacherRecord.primarySubjectId)
        return subject ? subject.name : '—'
      },
    },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      hideOnMobile: true,
      format: (value: boolean) => (
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
              Teachers Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Manage system teachers ({teachers?.length || 0} total)
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Teachers Table */}
      <Grid item xs={12}>
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          backgroundColor: 'white',
          overflow: 'hidden'
        }}>
          <EnhancedTable
            columns={tableColumns}
            rows={teachers || []}
            loading={!allUsers}
            onRowClick={handleEditTeacher}
            allowExport={true}
          />
        </Box>
      </Grid>

      {/* Edit Teacher Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}>Edit Teacher</DialogTitle>
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
          <FormControl fullWidth disabled={saveLoading}>
            <InputLabel id="subject-select-label">Primary Subject</InputLabel>
            <Select
              labelId="subject-select-label"
              id="subject-select"
              value={formData.primarySubjectId}
              label="Primary Subject"
              onChange={(e) => setFormData({ ...formData, primarySubjectId: e.target.value })}
              sx={{
                borderRadius: '12px',
              }}
            >
              <MenuItem value="">
                <em>None / Unassigned</em>
              </MenuItem>
              {subjects?.map((subject: any) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
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
            onClick={handleSaveTeacher}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete Teacher</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete <strong>{editingTeacher?.name}</strong>? This action will soft-delete the teacher.
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
