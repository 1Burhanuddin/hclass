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
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material'
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'
import AddIcon from '@mui/icons-material/Add'

interface Subject {
  _id: string
  name: string
  code: string
  description?: string
  createdAt: number
}

export default function SubjectsManagementPage() {
  const allSubjects = useQuery(api.subjects.getAllSubjects)
  
  const createSubjectMutation = useMutation(api.subjects.createSubject)
  const updateSubjectMutation = useMutation(api.subjects.updateSubject)
  const deleteSubjectMutation = useMutation(api.subjects.deleteSubject)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleAddSubject = () => {
    setEditingSubject(null)
    setFormData({ name: '', code: '', description: '' })
    setError('')
    setOpenDialog(true)
  }

  const handleEditSubject = (s: Subject) => {
    setEditingSubject(s)
    setFormData({ name: s.name, code: s.code, description: s.description || '' })
    setError('')
    setOpenDialog(true)
  }

  const handleSaveSubject = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      setError('Subject name and code are required')
      return
    }

    try {
      setSaveLoading(true)
      setError('')
      
      if (editingSubject) {
        await updateSubjectMutation({
          subjectId: editingSubject._id as any,
          name: formData.name,
          code: formData.code.toUpperCase(),
          description: formData.description || undefined,
        })
      } else {
        await createSubjectMutation({
          name: formData.name,
          code: formData.code.toUpperCase(),
          description: formData.description || undefined,
        })
      }
      
      setOpenDialog(false)
      setSaveLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save subject')
      setSaveLoading(false)
    }
  }

  const handleDeleteSubject = (s: Subject) => {
    setEditingSubject(s)
    setError('')
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingSubject) return
    
    try {
      setDeleteLoading(true)
      setError('')
      
      await deleteSubjectMutation({
        subjectId: editingSubject._id as any,
      })
      
      setOpenDeleteDialog(false)
      setDeleteLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete subject')
      setDeleteLoading(false)
    }
  }

  const tableColumns: EnhancedTableColumn[] = [
    { id: 'name', label: 'Subject Name', minWidth: 200, sortable: true, filterable: true },
    { id: 'code', label: 'Code', minWidth: 120, sortable: true, filterable: true, hideOnMobile: true },
    { id: 'description', label: 'Description', minWidth: 250, sortable: true, filterable: true, hideOnMobile: true },
  ]

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Subjects Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Manage course subjects ({allSubjects?.length || 0} total)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px' }}
            onClick={handleAddSubject}
          >
            Add Subject
          </Button>
        </Box>
      </Grid>

      {/* Subjects Table */}
      <Grid item xs={12}>
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          backgroundColor: 'white',
          overflow: 'hidden'
        }}>
          <EnhancedTable
            columns={tableColumns}
            rows={allSubjects || []}
            loading={!allSubjects}
            onRowClick={handleEditSubject}
            allowExport={true}
          />
        </Box>
      </Grid>

      {/* Subject Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}>
          {editingSubject ? 'Edit Subject' : 'Add Subject'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Subject Name"
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
            label="Subject Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            fullWidth
            disabled={saveLoading}
            placeholder="e.g., MATH"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
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
            onClick={() => setOpenDeleteDialog(true)}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', py: 1, px: 2, textTransform: 'none' }}
            disabled={saveLoading || deleteLoading || !editingSubject}
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
            onClick={handleSaveSubject}
            variant="contained" 
            sx={{ borderRadius: '8px', py: 1, px: 3, minWidth: '100px' }} 
            disabled={saveLoading || deleteLoading}
          >
            {saveLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Saving...
              </Box>
            ) : editingSubject ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete Subject</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete <strong>{editingSubject?.name}</strong>? This action cannot be undone.
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
