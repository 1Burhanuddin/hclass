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
} from '@mui/material'
import { DataTable, DataCard } from '@/components/ui'
import AddIcon from '@mui/icons-material/Add'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  isActive: boolean
  createdAt: number
}

export default function UsersManagementPage() {
  const allUsers = useQuery(api.users.getAllUsers)
  
  const updateUserMutation = useMutation(api.users.updateUserDetails)
  const deactivateUserMutation = useMutation(api.users.deactivateUser)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
  })
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleEditUser = (u: User) => {
    setEditingUser(u)
    setFormData({ name: u.name, email: u.email, role: u.role })
    setError('')
    setOpenDialog(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required')
      return
    }
    
    try {
      setSaveLoading(true)
      setError('')
      
      await updateUserMutation({
        userId: editingUser._id as any,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      })
      
      setOpenDialog(false)
      setSaveLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update user')
      setSaveLoading(false)
    }
  }

  const handleDeleteUser = (u: User) => {
    setEditingUser(u)
    setError('')
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingUser) return
    
    try {
      setDeleteLoading(true)
      setError('')
      
      await deactivateUserMutation({
        userId: editingUser._id as any,
      })
      
      setOpenDeleteDialog(false)
      setDeleteLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete user')
      setDeleteLoading(false)
    }
  }

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
              Manage system users ({allUsers?.length || 0} total)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px' }}
            disabled
          >
            Add User
          </Button>
        </Box>
      </Grid>

      {/* Users Table */}
      <Grid item xs={12}>
        <DataCard>
          <DataTable
            columns={tableColumns}
            data={allUsers || []}
            loading={!allUsers}
            disabled={saveLoading || deleteLoading}
            onRowClick={handleEditUser}
            emptyMessage="No users found. Users will appear here after they sign up."
          />
        </DataCard>
      </Grid>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 1 }}>Edit User</DialogTitle>
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
    </Grid>
  )
}
