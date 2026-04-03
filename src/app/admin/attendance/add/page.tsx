'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import NProgress from 'nprogress'
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
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { format } from 'date-fns'

interface StudentAttendance {
  studentId: string
  isPresent: boolean
  remark: string
}

export default function AddAttendancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const selectedBatchSubjectId = searchParams.get('batchSubject')
  const selectedDateParam = searchParams.get('date')
  
  const [selectedBatchSubject, setSelectedBatchSubject] = useState<string | null>(selectedBatchSubjectId)
  const [selectedDate, setSelectedDate] = useState(selectedDateParam || format(new Date(), 'yyyy-MM-dd'))
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Queries
  const batchSubjects = useQuery(api.batchSubjects.getAllBatchSubjectsWithDetails)
  
  const selectedBatchSubjectData = selectedBatchSubject
    ? batchSubjects?.find((bs: any) => bs._id === selectedBatchSubject)
    : null
  
  const students = useQuery(
    api.students.getStudentsByBatch,
    selectedBatchSubjectData ? { batchId: selectedBatchSubjectData.batchId as any } : 'skip'
  )

  // Mutations
  const markBulkAttendance = useMutation(api.attendance.markBulkAttendance)

  // Initialize attendance state
  useEffect(() => {
    if (students) {
      const initialAttendance = students.map((student: any) => ({
        studentId: student._id,
        isPresent: true,
        remark: '',
      }))
      setStudentAttendance(initialAttendance)
    }
  }, [students])

  const handleBatchChange = (batchSubjectId: string) => {
    setSelectedBatchSubject(batchSubjectId)
    setStudentAttendance([])
    setError('')
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const handleStudentChange = (studentId: string, isPresent: boolean) => {
    setStudentAttendance((prev) =>
      prev.map((sa) =>
        sa.studentId === studentId ? { ...sa, isPresent } : sa
      )
    )
  }

  const handleRemarkChange = (studentId: string, remark: string) => {
    setStudentAttendance((prev) =>
      prev.map((sa) =>
        sa.studentId === studentId ? { ...sa, remark } : sa
      )
    )
  }

  const handleMarkAllPresent = () => {
    setStudentAttendance((prev) => prev.map((sa) => ({ ...sa, isPresent: true })))
  }

  const handleMarkAllAbsent = () => {
    setStudentAttendance((prev) => prev.map((sa) => ({ ...sa, isPresent: false })))
  }

  const handleSave = async () => {
    NProgress.start()
    if (!selectedBatchSubject || !selectedDate) {
      setError('Please select batch subject and date')
      return
    }

    if (studentAttendance.length === 0) {
      setError('No students found')
      return
    }

    setLoading(true)
    setError('')

    try {
      const attendanceRecords = studentAttendance.map((sa) => ({
        studentId: sa.studentId as any,
        batchSubjectId: selectedBatchSubject as any,
        date: new Date(selectedDate).setHours(0, 0, 0, 0),
        status: (sa.isPresent ? 'present' : 'absent') as 'present' | 'absent' | 'leave',
        remark: sa.remark,
      }))

      await markBulkAttendance({ records: attendanceRecords })
      setSuccess('Attendance saved successfully!')
      setTimeout(() => {
        router.push('/admin/attendance')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to save attendance')
    } finally {
      setLoading(false)
    }
  }

  const presentCount = studentAttendance.filter((sa) => sa.isPresent).length
  const absentCount = studentAttendance.length - presentCount

  if (batchSubjects === undefined) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Mark Attendance
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Select batch, date, and mark students present or absent
        </Typography>
      </Box>

      {/* Error & Success Alerts */}
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

      {/* Batch & Date Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>Select Batch-Subject</InputLabel>
                <Select
                  value={selectedBatchSubject || ''}
                  label="Select Batch-Subject"
                  onChange={(e) => handleBatchChange(e.target.value)}
                  sx={{
                    borderRadius: '8px',
                  }}
                >
                  {batchSubjects?.map((bs: any) => (
                    <MenuItem key={bs._id} value={bs._id}>
                      {bs.batch?.name} - {bs.subject?.name} ({bs.teacherUser?.name})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Batch Info */}
          {selectedBatchSubject && selectedBatchSubjectData && (
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Batch:</strong> {selectedBatchSubjectData.batch?.name} (Class {selectedBatchSubjectData.batch?.class}-{selectedBatchSubjectData.batch?.section})
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Subject:</strong> {selectedBatchSubjectData.subject?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Teacher:</strong> {selectedBatchSubjectData.teacherUser?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Students:</strong> {students?.length || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      {selectedBatchSubject && studentAttendance.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Summary:
              </Typography>
              <Chip label={`Present: ${presentCount}`} color="success" size="small" />
              <Chip label={`Absent: ${absentCount}`} color="error" size="small" />
              <Chip label={`Total: ${studentAttendance.length}`} variant="outlined" size="small" />
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Attendance Progress
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                  {studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 0}% Present
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={studentAttendance.length > 0 ? (presentCount / studentAttendance.length) * 100 : 0}
                sx={{
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: '4px',
                    backgroundColor: '#2e7d32',
                  },
                }}
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleMarkAllPresent}
                disabled={!selectedBatchSubject || studentAttendance.length === 0}
                sx={{ borderRadius: '8px' }}
              >
                Mark All Present
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleMarkAllAbsent}
                disabled={!selectedBatchSubject || studentAttendance.length === 0}
                sx={{ borderRadius: '8px' }}
              >
                Mark All Absent
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      {selectedBatchSubject && students && students.length > 0 ? (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {students.map((student: any) => {
                const attendance = studentAttendance.find((sa) => sa.studentId === student._id)
                return (
                  <Grid item xs={12} md={6} key={student._id}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={attendance?.isPresent || false}
                              onChange={(e) => handleStudentChange(student._id, e.target.checked)}
                              size="medium"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {student.user?.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {student.enrollmentNumber}
                              </Typography>
                            </Box>
                          }
                          sx={{ flex: 1, m: 0 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            bgcolor: attendance?.isPresent ? '#e8f5e9' : '#ffebee',
                            color: attendance?.isPresent ? '#2e7d32' : '#c62828',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {attendance?.isPresent ? 'PRESENT' : 'ABSENT'}
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Remark (optional)"
                        value={attendance?.remark || ''}
                        onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </Card>
      ) : selectedBatchSubject ? (
        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No students found in this batch
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Select a batch-subject to get started
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={() => {
            NProgress.start()
            router.push('/admin/attendance')
          }}
          sx={{ borderRadius: '8px' }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!selectedBatchSubject || studentAttendance.length === 0 || loading}
          sx={{ borderRadius: '8px' }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CircularProgress size={18} sx={{ color: 'inherit' }} /> Saving...
            </Box>
          ) : (
            'Save Attendance'
          )}
        </Button>
      </Box>
    </Box>
  )
}
