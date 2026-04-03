'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import BackIcon from '@mui/icons-material/ArrowBack'
import { format } from 'date-fns'
import NProgress from 'nprogress'
import { DataCard } from '@/components/ui'

export default function AssignmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    attachmentUrl: '',
  })

  const assignmentId = params.id as string

  // Get assignment
  const assignment = useQuery(api.assignments.getAssignmentById, {
    assignmentId: assignmentId as any,
  })

  // Get user and teacher info
  const userRecord = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )

  const teacher = useQuery(
    api.teachers.getTeacherByUserId,
    userRecord ? { userId: userRecord._id } : 'skip'
  )

  const updateAssignmentMutation = useMutation(api.assignments.updateAssignment)

  // Initialize form data when assignment loads
  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        dueDate: format(new Date(assignment.dueDate), 'yyyy-MM-dd'),
        attachmentUrl: assignment.attachmentUrl || '',
      })
    }
  }, [assignment])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e: any) => {
    e.preventDefault()
    NProgress.start()

    if (!formData.title.trim()) {
      setError('Title is required')
      NProgress.done()
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      NProgress.done()
      return
    }

    try {
      setLoading(true)
      const dueDateTime = new Date(formData.dueDate).getTime()

      await updateAssignmentMutation({
        assignmentId: assignmentId as any,
        title: formData.title,
        description: formData.description,
        dueDate: dueDateTime,
        attachmentUrl: formData.attachmentUrl || undefined,
      })

      setError('')
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update assignment')
      NProgress.done()
    } finally {
      setLoading(false)
    }
  }

  if (assignment === undefined || teacher === undefined) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (assignment === null || teacher === null) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Assignment or teacher information not found</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => {
              NProgress.start()
              router.push('/admin/assignments')
            }}
            sx={{ textTransform: 'none' }}
          >
            Back
          </Button>
          <Typography variant="h4">{assignment.title}</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsEditing(!isEditing)}
          sx={{ borderRadius: '8px' }}
        >
          {isEditing ? 'Cancel Edit' : 'Edit'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <DataCard>
            {isEditing ? (
              <form onSubmit={handleUpdate}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleChange}
                      disabled={loading}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Attachment URL"
                      name="attachmentUrl"
                      value={formData.attachmentUrl}
                      onChange={handleChange}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      sx={{ borderRadius: '8px' }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {assignment.description}
                  </Typography>
                </Box>
              </Box>
            )}
          </DataCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <DataCard>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                BATCH-SUBJECT
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {assignment.batch?.name} - {assignment.subject?.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                DUE DATE
              </Typography>
              <Typography variant="body1">{format(new Date(assignment.dueDate), 'MMM dd, yyyy HH:mm')}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                CREATED
              </Typography>
              <Typography variant="body1">{format(new Date(assignment.createdAt), 'MMM dd, yyyy')}</Typography>
            </Box>

            {assignment.attachmentUrl && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                  ATTACHMENT
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  href={assignment.attachmentUrl}
                  target="_blank"
                  sx={{ borderRadius: '6px' }}
                >
                  Download File
                </Button>
              </Box>
            )}
          </DataCard>
        </Grid>
      </Grid>
    </Box>
  )
}
