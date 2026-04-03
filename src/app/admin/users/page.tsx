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
  CircularProgress,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { useToast } from '@/hooks/useToast'
import { ToastDisplay } from '@/components/shared/ToastDisplay'
import { DataTable, DataCard } from '@/components/ui'
import AddIcon from '@mui/icons-material/Add'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  isActive: boolean
  deletedAt?: number
  createdAt: number
}

export default function UsersManagementPage() {
  const allUsers = useQuery(api.users.getAllUsers)
  
  const updateUserMutation = useMutation(api.users.updateUserDetails)
  const deactivateUserMutation = useMutation(api.users.deactivateUser)
  const reactivateUserMutation = useMutation(api.users.reactivateUser)
  
  const { toast, showToast, closeToast } = useToast()

  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
  })
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)

  const handleEditUser = (u: User) => {
    setEditingUser(u)
    setFormData({ name: u.name, email: u.email, role: u.role })
    setOpenDialog(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'error')
      return
    }
    
    try {
      setSaveLoading(true)
      
      await updateUserMutation({
        userId: editingUser._id as any,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      })
      
      showToast('User updated successfully', 'success')
      setOpenDialog(false)
      setSaveLoading(false)
    } catch (err: any) {
      showToast(err.message || 'Failed to update user', 'error')
      setSaveLoading(false)
    }
  }

  const handleDeleteUser = (u: User) => {
    setEditingUser(u)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingUser) return
    
    try {
      setDeleteLoading(true)
      
      await deactivateUserMutation({
        userId: editingUser._id as any,
      })
      
      showToast('User deleted successfully', 'success')
      setOpenDeleteDialog(false)
      setDeleteLoading(false)
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error')
      setDeleteLoading(false)
    }
  }

  const handleRestoreUser = (u: User) => {
    setEditingUser(u)
    setOpenRestoreDialog(true)
  }

  const handleConfirmRestore = async () => {
    if (!editingUser) return
    
    try {
      setRestoreLoading(true)
      
      await reactivateUserMutation({
        userId: editingUser._id as any,
      })
      
      showToast('User restored successfully', 'success')
      setOpenRestoreDialog(false)
      setRestoreLoading(false)
    } catch (err: any) {
      showToast(err.message || 'Failed to restore user', 'error')
      setRestoreLoading(false)
    }
  }

  // Filter users based on deleted status
  const displayedUsers = showDeleted 
    ? (allUsers?.filter((u) => u.deletedAt !== undefined) || [])
    : (allUsers?.filter((u) => u.deletedAt === undefined) || [])

  const tableColumns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    {
      id: 'role',
      label: 'Role',
      render: (value: string) => (
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
              Users Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {showDeleted 
                ? `Manage deleted users (${displayedUsers?.length || 0} total)` 
                : `Manage active users (${displayedUsers?.length || 0} total)`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={<Switch checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />}
              label="Show Deleted"
              sx={{ fontWeight: 500 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ borderRadius: '8px' }}
              disabled
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* Users Table */}
      <Grid item xs={12}>
        <DataCard>
          <DataTable
            columns={tableColumns}
            data={displayedUsers || []}
            loading={!allUsers}
            disabled={saveLoading || deleteLoading || restoreLoading}
            onRowClick={handleEditUser}
            emptyMessage="No users found. Users will appear here after they sign up."
          />
        </DataCard>
      </Grid>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#001a4d', pb: 1 }}>Edit User</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
          {!editingUser?.deletedAt ? (
            <>
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
            </>
          ) : (
            <>
              <Button
                onClick={() => handleRestoreUser(editingUser!)}
                variant="outlined"
                sx={{ 
                  borderRadius: '8px', 
                  py: 1, 
                  px: 2, 
                  textTransform: 'none',
                  color: '#2e7d32',
                  borderColor: '#2e7d32',
                }}
                disabled={restoreLoading}
              >
                Restore
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                onClick={() => setOpenDialog(false)}
                sx={{ borderRadius: '8px', py: 1, px: 2 }}
                disabled={restoreLoading}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete <strong>{editingUser?.name}</strong>? This action will soft-delete the user.
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

      {/* Restore Confirmation Dialog */}
      <Dialog open={openRestoreDialog} onClose={() => setOpenRestoreDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#2e7d32', pb: 1 }}>Restore User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to restore <strong>{editingUser?.name}</strong>? This will re-activate their account and they will appear in the user list.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenRestoreDialog(false)}
            sx={{ borderRadius: '8px', py: 1, px: 2 }} 
            disabled={restoreLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRestore}
            variant="contained"
            sx={{ 
              borderRadius: '8px', 
              py: 1, 
              px: 3, 
              minWidth: '100px',
              backgroundColor: '#2e7d32',
              '&:hover': { backgroundColor: '#1b5e20' },
            }}
            disabled={restoreLoading}
          >
            {restoreLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Restoring...
              </Box>
            ) : (
              'Restore'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastDisplay toast={toast} onClose={closeToast} />
    </Grid>
  )
}
