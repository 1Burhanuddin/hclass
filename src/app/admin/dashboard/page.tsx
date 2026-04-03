'use client'

import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Backdrop,
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useToast } from '@/hooks/useToast'
import { ToastDisplay } from '@/components/shared/ToastDisplay'
import { DataCard } from '@/components/ui'
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  isActive: boolean
}

export default function AdminDashboard() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student' as 'admin' | 'teacher' | 'student' })
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { toast, showToast, closeToast } = useToast()

  // Fetch real data
  const allUsers = useQuery(api.users.getAllUsers)
  const updateUserMutation = useMutation(api.users.updateUserDetails)
  const deactivateUserMutation = useMutation(api.users.deactivateUser)

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role })
    setEditDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!selectedUser) return
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'error')
      return
    }
    try {
      setSaveLoading(true)
      await updateUserMutation({
        userId: selectedUser._id as any,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      })
      showToast('User updated successfully', 'success')
      setEditDialogOpen(false)
      setSaveLoading(false)
    } catch (err: any) {
      showToast(err.message || 'Failed to update user', 'error')
      setSaveLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      setDeleteLoading(true)
      await deactivateUserMutation({
        userId: selectedUser._id as any,
      })
      showToast('User deleted successfully', 'success')
      setDeleteConfirmOpen(false)
      setEditDialogOpen(false)
      setDeleteLoading(false)
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error')
      setDeleteLoading(false)
    }
  }

  const tableColumns: EnhancedTableColumn[] = [
    { id: 'name', label: 'Name', minWidth: 150, sortable: true, filterable: true },
    { id: 'email', label: 'Email', minWidth: 200, sortable: true, filterable: true, hideOnMobile: true },
    {
      id: 'role',
      label: 'Role',
      minWidth: 120,
      sortable: true,
      filterable: true,
      format: (value: string) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          size="small"
          sx={{
            borderRadius: '16px',
            fontWeight: 600,
            color: value === 'admin' ? '#d32f2f' : value === 'teacher' ? '#1976d2' : '#388e3c',
            backgroundColor: value === 'admin' ? '#ffebee' : value === 'teacher' ? '#e3f2fd' : '#e8f5e9',
            border: 'none',
          }}
        />
      ),
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
      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <DataCard>
          <Typography color="textSecondary" sx={{ fontSize: '0.875rem', mb: 1 }}>
            Total Users
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
            {allUsers?.length || 0}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            Active in system
          </Typography>
        </DataCard>
      </Grid>

      {/* Users Table */}
      <Grid item xs={12}>
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          backgroundColor: 'white',
          overflow: 'hidden',
          p: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
            Users (Click row to edit)
          </Typography>
          <EnhancedTable
            columns={tableColumns}
            rows={allUsers || []}
            loading={!allUsers}
            onRowClick={handleEditUser}
            allowExport={true}
          />
        </Box>
      </Grid>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        {saveLoading && (
          <Backdrop
            sx={{
              position: 'absolute',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(2px)',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            open={true}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <CircularProgress />
              <Typography sx={{ fontSize: '0.875rem', color: '#666', mt: 1 }}>Saving...</Typography>
            </Box>
          </Backdrop>
        )}
        <DialogTitle sx={{ fontWeight: 700, color: '#001a4d', pb: 1 }}>Edit User</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5, opacity: saveLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
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
          <TextField
            select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            fullWidth
            disabled={saveLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(true)}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', py: 1, px: 2, textTransform: 'none' }}
            disabled={saveLoading || deleteLoading}
          >
            Delete
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: '8px', py: 1, px: 2 }} disabled={saveLoading || deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser} 
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
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="sm">
        {deleteLoading && (
          <Backdrop
            sx={{
              position: 'absolute',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(2px)',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            open={true}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <CircularProgress />
              <Typography sx={{ fontSize: '0.875rem', color: '#666', mt: 1 }}>Deleting...</Typography>
            </Box>
          </Backdrop>
        )}
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete User</DialogTitle>
        <DialogContent sx={{ pt: 2, opacity: deleteLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          <Typography>
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This user will be soft deleted and can be restored later.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)} 
            sx={{ borderRadius: '8px', py: 1, px: 2 }} 
            disabled={deleteLoading || saveLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
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

      <ToastDisplay toast={toast} onClose={closeToast} />
    </Grid>
  )
}
