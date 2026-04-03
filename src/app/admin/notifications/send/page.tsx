'use client'

import { useState } from 'react'
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CancelIcon from '@mui/icons-material/Cancel'
import NProgress from 'nprogress'
import { DataCard } from '@/components/ui'

export default function SendNotificationPage() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    targetType: 'global',
    batchId: '',
    studentId: '',
    title: '',
    message: '',
  })

  // Get user record to check authorization
  const userRecord = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )

  // Only admins can send notifications
  const isAuthorized = userRecord && userRecord.role === 'admin'

  // Get all batches for batch selection
  const allBatches = useQuery(api.batches.getAllBatches)

  // Get all students for student selection
  const allStudents = useQuery(
    api.students.getAllStudents,
    {}
  )

  // Filter students by selected batch
  const filteredStudents =
    formData.batchId && allStudents
      ? allStudents.filter((s: any) => s.batchId === formData.batchId)
      : []

  const createNotificationMutation = useMutation(api.notifications.createNotification)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset dependent fields when targetType changes
      ...(name === 'targetType' && {
        batchId: '',
        studentId: '',
      }),
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    NProgress.start()
    setLoading(true)
    setError('')

    try {
      // Validation
      if (!formData.title.trim()) {
        setError('Title is required')
        NProgress.done()
        setLoading(false)
        return
      }
      if (!formData.message.trim()) {
        setError('Message is required')
        NProgress.done()
        setLoading(false)
        return
      }

      if (formData.targetType === 'batch' && !formData.batchId) {
        setError('Please select a batch')
        NProgress.done()
        setLoading(false)
        return
      }

      if (formData.targetType === 'student' && !formData.studentId) {
        setError('Please select a student')
        NProgress.done()
        setLoading(false)
        return
      }

      // Prepare args based on targetType
      const notificationArgs: any = {
        title: formData.title,
        message: formData.message,
        targetType: formData.targetType,
        senderId: userRecord!._id,
      }

      if (formData.targetType === 'batch') {
        notificationArgs.targetId = formData.batchId
      } else if (formData.targetType === 'student') {
        notificationArgs.targetId = formData.studentId
      }

      await createNotificationMutation(notificationArgs)
      setError('')
      
      // Show success and redirect
      NProgress.done()
      alert('Notification sent successfully!')
      router.push('/admin/notifications')
    } catch (err: any) {
      setError(err.message || 'Failed to send notification')
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

  // Only admins can access this page
  if (!isAuthorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Send Notification</Typography>
        <Alert severity="warning">Only admins can send notifications.</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Send Notification</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataCard>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Target Type Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Send To:
              </Typography>
              <RadioGroup
                row
                name="targetType"
                value={formData.targetType}
                onChange={handleChange}
              >
                <FormControlLabel value="global" control={<Radio />} label="All Users (Global)" />
                <FormControlLabel value="batch" control={<Radio />} label="Specific Batch" />
                <FormControlLabel value="student" control={<Radio />} label="Specific Student" />
              </RadioGroup>
            </Grid>

            {/* Batch Selection */}
            {formData.targetType === 'batch' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Batch</InputLabel>
                  <Select
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleChange}
                    label="Select Batch"
                    sx={{ borderRadius: '8px' }}
                    disabled={loading}
                  >
                    <MenuItem value="">Choose a batch</MenuItem>
                    {allBatches &&
                      allBatches.map((batch: any) => (
                        <MenuItem key={batch._id} value={batch._id}>
                          {batch.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Student Selection */}
            {formData.targetType === 'student' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Batch</InputLabel>
                    <Select
                      name="batchId"
                      value={formData.batchId}
                      onChange={handleChange}
                      label="Select Batch"
                      sx={{ borderRadius: '8px' }}
                      disabled={loading}
                    >
                      <MenuItem value="">Choose a batch first</MenuItem>
                      {allBatches &&
                        allBatches.map((batch: any) => (
                          <MenuItem key={batch._id} value={batch._id}>
                            {batch.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                {formData.batchId && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Select Student</InputLabel>
                      <Select
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        label="Select Student"
                        sx={{ borderRadius: '8px' }}
                        disabled={loading || filteredStudents.length === 0}
                      >
                        <MenuItem value="">Choose a student</MenuItem>
                        {filteredStudents.map((student: any) => (
                          <MenuItem key={student._id} value={student._id}>
                            {student.userName || student._id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </>
            )}

            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notification Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., New Assignment Posted"
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            {/* Message */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your notification message here..."
                multiline
                rows={4}
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  NProgress.start()
                  router.push('/admin/notifications')
                }}
                sx={{ borderRadius: '8px' }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                type="submit"
                sx={{ borderRadius: '8px' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Send Notification'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DataCard>
    </Box>
  )
}
