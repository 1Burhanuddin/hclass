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
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { DataTable, DataCard } from '@/components/ui'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

interface Announcement {
  _id: string
  title: string
  content: string
  audience: 'all' | 'teachers' | 'students' | 'parents'
  priority: 'low' | 'medium' | 'high'
  createdBy: string
  createdAt: number
  expiresAt?: number
}

export default function AnnouncementsManagementPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'all' as 'all' | 'teachers' | 'students' | 'parents',
    priority: 'medium' as 'low' | 'medium' | 'high',
  })
  const [error, setError] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // Fetch announcements from Convex
  const announcements: Announcement[] = []

  const priorityColors: Record<string, 'success' | 'warning' | 'error'> = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  }

  const audienceLabels: Record<string, string> = {
    all: 'All Users',
    teachers: 'Teachers',
    students: 'Students',
    parents: 'Parents',
  }

  const handleRowClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      audience: announcement.audience,
      priority: announcement.priority,
    })
    setOpenDialog(true)
    setError('')
  }

  const handleSaveAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      setError('Title and content are required')
      return
    }

    if (formData.title.length > 100) {
      setError('Title must be less than 100 characters')
      return
    }

    if (formData.content.length > 2000) {
      setError('Content must be less than 2000 characters')
      return
    }

    setSaveLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000))
      setSuccess('Announcement posted successfully')
      setOpenDialog(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save announcement')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDeleteAnnouncement = () => {
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingAnnouncement) return

    setDeleteLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000))
      setSuccess('Announcement deleted successfully')
      setOpenDeleteDialog(false)
      setOpenDialog(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete announcement')
    } finally {
      setDeleteLoading(false)
    }
  }

  const columns = [
    { id: 'title', label: 'Title', width: '35%' },
    {
      id: 'audience',
      label: 'Audience',
      width: '20%',
      render: (value: string) => <Chip label={audienceLabels[value]} size="small" sx={{ borderRadius: '16px', fontWeight: 600 }} />,
    },
    {
      id: 'priority',
      label: 'Priority',
      width: '15%',
      render: (value: string) => (
        <Chip label={value.charAt(0).toUpperCase() + value.slice(1)} color={priorityColors[value]} size="small" sx={{ borderRadius: '16px', fontWeight: 600 }} />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      width: '20%',
      render: (value: number) => new Date(value).toLocaleDateString(),
    },
    { id: 'createdBy', label: 'By', width: '10%' },
  ]

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Announcements
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', py: 1.2, px: 3 }}
            onClick={() => {
              setEditingAnnouncement(null)
              setFormData({
                title: '',
                content: '',
                audience: 'all',
                priority: 'medium',
              })
              setOpenDialog(true)
              setError('')
            }}
          >
            New Announcement
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {announcements.length > 0 ? (
          <DataTable columns={columns} data={announcements} onRowClick={handleRowClick} />
        ) : (
          <DataCard>
            <Typography sx={{ color: '#999' }}>No announcements yet</Typography>
          </DataCard>
        )}
      </Grid>

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value.slice(0, 100) })}
            disabled={saveLoading || deleteLoading}
            placeholder="Announcement title"
            helperText={`${formData.title.length}/100 characters`}
            sx={{ borderRadius: '8px' }}
          />

          <TextField
            fullWidth
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value.slice(0, 2000) })}
            disabled={saveLoading || deleteLoading}
            placeholder="Announcement details"
            multiline
            rows={5}
            helperText={`${formData.content.length}/2000 characters`}
            sx={{ borderRadius: '8px' }}
          />

          <FormControl fullWidth disabled={saveLoading || deleteLoading}>
            <InputLabel>Audience</InputLabel>
            <Select
              value={formData.audience}
              label="Audience"
              onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="teachers">Teachers</MenuItem>
              <MenuItem value="students">Students</MenuItem>
              <MenuItem value="parents">Parents</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={saveLoading || deleteLoading}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          {editingAnnouncement && (
            <Button
              onClick={handleDeleteAnnouncement}
              variant="outlined"
              color="error"
              sx={{ borderRadius: '8px', py: 1, px: 2 }}
              disabled={saveLoading || deleteLoading}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: '8px', py: 1, px: 2 }}
            disabled={saveLoading || deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAnnouncement}
            variant="contained"
            sx={{ borderRadius: '8px', py: 1, px: 3, minWidth: '100px' }}
            disabled={saveLoading || deleteLoading}
          >
            {saveLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Saving...
              </Box>
            ) : editingAnnouncement ? (
              'Update'
            ) : (
              'Post'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', pb: 1 }}>Delete Announcement</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete the announcement <strong>"{editingAnnouncement?.title}"</strong>? This action cannot be undone.
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
