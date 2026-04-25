'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { format, addDays } from 'date-fns'
import NProgress from 'nprogress'
import { DataCard } from '@/components/ui'

export default function CreateAssignmentPage() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    batchId: '',
    subjectId: '',
    title: '',
    description: '',
  })

  // Get teacher record
  const userRecord = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )

  const teacher = useQuery(
    api.teachers.getTeacherByUserId,
    userRecord && userRecord.role !== 'admin' ? { userId: userRecord._id } : 'skip'
  )

  // Determine if user is authorized
  const isAuthorized = userRecord && (userRecord.role === 'admin' || teacher)

  // Get batch-subjects assigned to this teacher (only if teacher, not admin)
  const teacherBatchSubjects = useQuery(
    api.batchSubjects.getBatchSubjectsByTeacherId,
    teacher ? { teacherId: teacher._id } : 'skip'
  )

  // Get all batches
  const allBatches = useQuery(api.batches.getAllBatches)

  // Get all batch-subjects for filtering
  const allBatchSubjects = useQuery(
    api.batchSubjects.getAllBatchSubjects,
    {}
  )

  // For teachers, filter batches to only those they teach
  const availableBatches = userRecord?.role === 'admin' 
    ? allBatches 
    : allBatches && teacherBatchSubjects 
      ? allBatches.filter((batch: any) => 
          teacherBatchSubjects.some((bs: any) => bs.batchId === batch._id)
        )
      : []

  // Filter subjects based on selected batch
  const availableSubjectsForBatch = formData.batchId && allBatchSubjects
    ? allBatchSubjects.filter((bs: any) => bs.batchId === formData.batchId)
    : []

  // Find the matching batchSubjectId from selected batch and subject
  const selectedBatchSubjectId = formData.batchId && formData.subjectId && allBatchSubjects
    ? allBatchSubjects.find((bs: any) => 
        bs.batchId === formData.batchId && bs.subjectId === formData.subjectId
      )?._id
    : null

  const createAssignmentMutation = useMutation(api.assignments.createAssignment)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    NProgress.start()
    setLoading(true)
    setError('')

    // For admins, use their own ID as teacherId; for teachers, use their teacher ID
    const applicableTeacherId = userRecord?.role === 'admin' ? userRecord._id : teacher?._id

    if (!applicableTeacherId) {
      setError('Unable to determine teacher for this assignment')
      NProgress.done()
      setLoading(false)
      return
    }

    if (!formData.batchId) {
      setError('Please select a batch')
      return
    }
    if (!formData.subjectId) {
      setError('Please select a subject')
      return
    }

    const batchSubjectId = selectedBatchSubjectId
    if (!batchSubjectId) {
      setError('Unable to find batch-subject combination')
      return
    }
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    try {
      await createAssignmentMutation({
        batchSubjectId: batchSubjectId as any,
        teacherId: applicableTeacherId as any,
        title: formData.title,
        description: formData.description,
        attachmentUrl: attachmentFile ? attachmentFile.name : undefined,
      })

      setError('')
      router.push('/admin/assignments')
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment')
      NProgress.done()
    } finally {
      setLoading(false)
    }
  }

  // Show loading only if user or queries haven't resolved yet
  if (!user || userRecord === undefined) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  // If user isn't admin or teacher, show error
  if (!isAuthorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Create Study Material</Typography>
        <Alert severity="warning">You don't have permission to create study material. Only admins and teachers can create study materials.</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Assignment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* For admins selecting teacher */}
      {userRecord?.role === 'admin' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          As an admin, you can create assignments for any batch-subject. Select a batch-subject below to continue.
        </Alert>
      )}

      <DataCard>
        {allBatches === undefined || allBatchSubjects === undefined ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : availableBatches === undefined || availableBatches.length === 0 ? (
          <Alert severity="info">No batches available. {userRecord?.role === 'teacher' ? 'Contact admin to assign you to batches.' : 'Create batches first.'}</Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            {/* Batch Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Batch</InputLabel>
                <Select
                  name="batchId"
                  value={formData.batchId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      batchId: e.target.value,
                      subjectId: '', // Reset subject when batch changes
                    })
                  }}
                  label="Batch"
                  sx={{ borderRadius: '8px' }}
                  disabled={loading}
                >
                  <MenuItem value="">Select a batch</MenuItem>
                  {availableBatches && availableBatches.map((batch: any) => (
                    <MenuItem key={batch._id} value={batch._id}>
                      {batch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subject Selection */}
            {formData.batchId && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        subjectId: e.target.value,
                      })
                    }}
                    label="Subject"
                    sx={{ borderRadius: '8px' }}
                    disabled={loading || !formData.batchId}
                  >
                    <MenuItem value="">Select a subject</MenuItem>
                    {availableSubjectsForBatch && availableSubjectsForBatch.map((bs: any) => (
                      <MenuItem key={bs._id} value={bs.subjectId}>
                        {bs.subject?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assignment Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Chapter 5 - Algebra"
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Assignment details and instructions..."
                multiline
                rows={4}
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            {/* Due Date */}
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

            {/* Attachment File (optional) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Attachment (Optional - PDF or DOC only)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    color: attachmentFile ? '#1976d2' : '#666',
                    borderColor: attachmentFile ? '#1976d2' : '#d0d0d0',
                  }}
                  disabled={loading}
                >
                  {attachmentFile ? attachmentFile.name : 'Choose File (PDF or DOC)'}
                  <input
                    hidden
                    accept=".pdf,.doc,.docx"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                        if (validTypes.includes(file.type)) {
                          setAttachmentFile(file)
                          setError('')
                        } else {
                          setError('Invalid file type. Only PDF and DOC files are allowed.')
                          setAttachmentFile(null)
                        }
                      }
                    }}
                  />
                </Button>
              </FormControl>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  NProgress.start()
                  router.push('/admin/assignments')
                }}
                sx={{ borderRadius: '8px' }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
                sx={{ borderRadius: '8px' }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </Button>
            </Grid>
          </Grid>
        </form>
        )}
      </DataCard>
    </Box>
  )
}
