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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material'
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'
import AddIcon from '@mui/icons-material/Add'

interface Batch {
  _id: string
  class: string
  section: string
  name: string
  createdAt: number
}

const CLASSES = ['9', '10', '11', '12']
const SECTIONS = ['A', 'B', 'C', 'D', 'E']

export default function BatchesManagementPage() {
  const allBatches = useQuery(api.batches.getAllBatches)
  
  const createBatchMutation = useMutation(api.batches.createBatch)
  const updateBatchMutation = useMutation(api.batches.updateBatch)
  const deleteBatchMutation = useMutation(api.batches.deleteBatch)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleAddBatch = () => {
    setEditingBatch(null)
    setFormData({ class: '', section: '', name: '' })
    setError('')
    setOpenDialog(true)
  }

  const handleEditBatch = (b: Batch) => {
    setEditingBatch(b)
    setFormData({ class: b.class, section: b.section, name: b.name })
    setError('')
    setOpenDialog(true)
  }

  const handleSaveBatch = async () => {
    if (!formData.class || !formData.section || !formData.name.trim()) {
      setError('Class, section, and name are required')
      return
    }

    try {
      setSaveLoading(true)
      setError('')
      
      if (editingBatch) {
        await updateBatchMutation({
          batchId: editingBatch._id as any,
          section: formData.section,
          name: formData.name,
        })
      } else {
        await createBatchMutation({
          class: parseInt(formData.class),
          section: formData.section,
          name: formData.name,
        })
      }
      
      setOpenDialog(false)
      setSaveLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save batch')
      setSaveLoading(false)
    }
  }

  const handleDeleteBatch = (b: Batch) => {
    setEditingBatch(b)
    setError('')
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingBatch) return
    
    try {
      setDeleteLoading(true)
      setError('')
      
      await deleteBatchMutation({
        batchId: editingBatch._id as any,
      })
      
      setOpenDeleteDialog(false)
      setDeleteLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete batch')
      setDeleteLoading(false)
    }
  }

  const tableColumns: EnhancedTableColumn[] = [
    { id: 'class', label: 'Class', minWidth: 100, sortable: true, filterable: true },
    { id: 'section', label: 'Section', minWidth: 100, sortable: true, filterable: true, hideOnMobile: true },
    { id: 'name', label: 'Batch Name', minWidth: 200, sortable: true, filterable: true },
  ]

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Batches Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Manage class batches ({allBatches?.length || 0} total)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px' }}
            onClick={handleAddBatch}
          >
            Add Batch
          </Button>
        </Box>
      </Grid>

      {/* Batches Table */}
      <Grid item xs={12}>
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          backgroundColor: 'white',
          overflow: 'hidden'
        }}>
          <EnhancedTable
            columns={tableColumns}
            rows={allBatches || []}
            loading={!allBatches}
            onRowClick={handleEditBatch}
            allowExport={true}
          />
        </Box>
      </Grid>

      {/* Batch Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}>
          {editingBatch ? 'Edit Batch' : 'Add Batch'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <FormControl fullWidth disabled={saveLoading || !!editingBatch}>
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              label="Class"
              sx={{
                borderRadius: '12px',
              }}
            >
              <MenuItem value="">
                <em>Select class</em>
              </MenuItem>
              {CLASSES.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  Class {cls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={saveLoading}>
            <InputLabel id="section-select-label">Section</InputLabel>
            <Select
              labelId="section-select-label"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              label="Section"
              sx={{
                borderRadius: '12px',
              }}
            >
              <MenuItem value="">
                <em>Select section</em>
              </MenuItem>
              {SECTIONS.map((sec) => (
                <MenuItem key={sec} value={sec}>
                  Section {sec}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Batch Name"
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
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(true)}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', py: 1, px: 2, textTransform: 'none' }}
            disabled={saveLoading || deleteLoading || !editingBatch}
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
            onClick={handleSaveBatch}
            variant="contained" 
            sx={{ borderRadius: '8px', py: 1, px: 3, minWidth: '100px' }} 
            disabled={saveLoading || deleteLoading}
          >
            {saveLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Saving...
              </Box>
            ) : editingBatch ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete Batch</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete <strong>{editingBatch?.name}</strong> (Class {editingBatch?.class} - Section {editingBatch?.section})? This action cannot be undone.
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
