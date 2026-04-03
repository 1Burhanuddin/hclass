'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Typography,
  Grid,
} from '@mui/material'
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'
import AddIcon from '@mui/icons-material/Add'

interface Batch {
  _id: string
  name: string
  class: number
  section: string
}

interface Subject {
  _id: string
  name: string
  code: string
}

interface BatchSubject {
  _id: string
  batchId: string
  subjectId: string
  teacherId: string
  createdAt: number
}

export default function MappingPage() {
  const allBatches = useQuery(api.batches.getAllBatches)
  const allSubjects = useQuery(api.subjects.getAllSubjects)
  const allBatchSubjects = useQuery(api.batchSubjects.getAllBatchSubjects)
  const allUsers = useQuery(api.users.getAllUsers)
  const allTeachers = useQuery(api.teachers.getAllTeachers)
  
  const createMappingMutation = useMutation(api.batchSubjects.createBatchSubject)
  const updateMappingMutation = useMutation(api.batchSubjects.updateBatchSubjectTeacher)
  const deleteMappingMutation = useMutation(api.batchSubjects.deleteBatchSubject)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingMapping, setEditingMapping] = useState<BatchSubject | null>(null)
  const [formData, setFormData] = useState({
    batchId: '',
    subjectId: '',
    teacherId: '',
  })
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Extract teachers from users
  const teachers = allUsers?.filter((u) => u.role === 'teacher') || []

  const handleAddMapping = () => {
    setEditingMapping(null)
    setFormData({ batchId: '', subjectId: '', teacherId: '' })
    setError('')
    setOpenDialog(true)
  }

  const handleEditMapping = (m: BatchSubject) => {
    setEditingMapping(m)
    setFormData({
      batchId: m.batchId,
      subjectId: m.subjectId,
      teacherId: m.teacherId,
    })
    setError('')
    setOpenDialog(true)
  }

  const handleSaveMapping = async () => {
    if (!formData.batchId || !formData.subjectId || !formData.teacherId) {
      setError('Please select batch, subject, and teacher')
      return
    }

    try {
      setSaveLoading(true)
      setError('')
      
      if (editingMapping) {
        await updateMappingMutation({
          mappingId: editingMapping._id as any,
          teacherId: formData.teacherId as any,
        })
      } else {
        await createMappingMutation({
          batchId: formData.batchId as any,
          subjectId: formData.subjectId as any,
          teacherId: formData.teacherId as any,
        })
      }
      
      setOpenDialog(false)
      setSaveLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save mapping')
      setSaveLoading(false)
    }
  }

  const handleDeleteMapping = (m: BatchSubject) => {
    setEditingMapping(m)
    setError('')
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingMapping) return
    
    try {
      setDeleteLoading(true)
      setError('')
      
      await deleteMappingMutation({
        mappingId: editingMapping._id as any,
      })
      
      setOpenDeleteDialog(false)
      setDeleteLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete mapping')
      setDeleteLoading(false)
    }
  }

  const getBatchName = (batchId: string) => {
    const batch = allBatches?.find((b) => b._id === batchId)
    return batch ? `Class ${batch.class} - Section ${batch.section}` : '-'
  }

  const getSubjectName = (subjectId: string) => {
    return allSubjects?.find((s) => s._id === subjectId)?.name || '-'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers?.find((t) => t._id === teacherId)
    return teacher?.name || '-'
  }

  const getTeacherPrimarySubject = (teacherId: string) => {
    const teacher = allTeachers?.find((t: any) => t.userId === teacherId)
    if (!teacher?.primarySubjectId) return null
    return allSubjects?.find((s) => s._id === teacher.primarySubjectId)
  }

  const getTeacherWithSubject = (teacherId: string) => {
    return allTeachers?.find((t: any) => t.userId === teacherId)
  }

  const isTeacherSubjectMismatch = (teacherId: string, subjectId: string) => {
    const teacher = getTeacherWithSubject(teacherId)
    return teacher?.primarySubjectId && teacher.primarySubjectId !== subjectId
  }

  const tableColumns: EnhancedTableColumn[] = [
    { 
      id: 'batchId', 
      label: 'Batch', 
      minWidth: 150, 
      sortable: true, 
      filterable: true,
      format: (value: string) => getBatchName(value) 
    },
    { 
      id: 'subjectId', 
      label: 'Subject', 
      minWidth: 150, 
      sortable: true, 
      filterable: true,
      hideOnMobile: true,
      format: (value: string) => getSubjectName(value) 
    },
    { 
      id: 'teacherId', 
      label: 'Assigned Teacher', 
      minWidth: 200, 
      sortable: true, 
      filterable: true,
      format: (value: string) => getTeacherName(value) 
    },
  ]

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Batch-Subject-Teacher Mapping
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Assign teachers to batch-subject combinations ({allBatchSubjects?.length || 0} total)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px' }}
            onClick={handleAddMapping}
            disabled={teachers.length === 0}
          >
            Create Mapping
          </Button>
        </Box>
      </Grid>

      {/* Warning if no teachers */}
      {teachers.length === 0 && (
        <Grid item xs={12}>
          <Alert severity="warning">
            No teachers found. Please create some teachers first in User Management before creating mappings.
          </Alert>
        </Grid>
      )}

      {/* Mappings Table */}
      <Grid item xs={12}>
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          backgroundColor: 'white',
          overflow: 'hidden'
        }}>
          <EnhancedTable
            columns={tableColumns}
            rows={allBatchSubjects || []}
            loading={!allBatchSubjects}
            onRowClick={handleEditMapping}
            allowExport={true}
          />
        </Box>
      </Grid>

      {/* Edit/Create Mapping Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}>
          {editingMapping ? 'Edit Mapping' : 'Create Mapping'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            select
            label="Batch"
            value={formData.batchId}
            onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
            fullWidth
            disabled={saveLoading || !!editingMapping}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          >
            <MenuItem value="">
              <em>Select batch</em>
            </MenuItem>
            {allBatches?.map((batch) => (
              <MenuItem key={batch._id} value={batch._id}>
                Class {batch.class} - Section {batch.section}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Subject"
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            fullWidth
            disabled={saveLoading || !!editingMapping}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          >
            <MenuItem value="">
              <em>Select subject</em>
            </MenuItem>
            {allSubjects?.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.name} ({subject.code})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Teacher"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            fullWidth
            disabled={saveLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          >
            <MenuItem value="">
              <em>Select teacher</em>
            </MenuItem>
            {teachers?.map((teacher) => {
              const teacherRecord = getTeacherWithSubject(teacher._id)
              const primarySubject = getTeacherPrimarySubject(teacher._id)
              return (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                  {primarySubject && ` - Primary: ${primarySubject.name}`}
                </MenuItem>
              )
            })}
          </TextField>

          {/* Show suggestions/warnings based on teacher selection */}
          {formData.teacherId && (
            <>
              {getTeacherPrimarySubject(formData.teacherId) ? (
                <>
                  {isTeacherSubjectMismatch(formData.teacherId, formData.subjectId) ? (
                    <Alert severity="warning">
                      ⚠️ Warning: This teacher's primary subject is{' '}
                      <strong>{getTeacherPrimarySubject(formData.teacherId)!.name}</strong>, but you're assigning
                      them to <strong>{allSubjects?.find((s) => s._id === formData.subjectId)?.name || 'selected subject'}</strong>.
                      This is allowed but may indicate a mismatch. Consider using their primary subject instead.
                    </Alert>
                  ) : (
                    formData.subjectId && (
                      <Alert severity="success">
                        ✓ Good match: Teacher's primary subject aligns with the selected subject.
                      </Alert>
                    )
                  )}
                </>
              ) : (
                <Alert severity="info">
                  ℹ️ This teacher does not have a primary subject assigned. Consider setting one in the Teachers Management page.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(true)}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', py: 1, px: 2, textTransform: 'none' }}
            disabled={saveLoading || deleteLoading || !editingMapping}
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
            onClick={handleSaveMapping}
            variant="contained" 
            sx={{ borderRadius: '8px', py: 1, px: 3, minWidth: '100px' }} 
            disabled={saveLoading || deleteLoading}
          >
            {saveLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Saving...
              </Box>
            ) : editingMapping ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete Mapping</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete this mapping? This cannot be undone if there are associated attendance or assignment records.
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
