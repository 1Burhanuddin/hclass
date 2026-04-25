'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material'

export default function StudentAttendancePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const userProfile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip')
  const student = useQuery(api.students.getStudentByUserId, userProfile?._id ? { userId: userProfile._id } : 'skip')

  const attendance = useQuery(
    api.attendance.getAttendanceByStudent,
    student?._id ? { studentId: student._id } : 'skip'
  )

  const batchSubjects = useQuery(
    api.batchSubjects.getBatchSubjectsByBatchId,
    student?.batchId ? { batchId: student.batchId } : 'skip'
  )

  if (!isLoaded || userProfile === undefined || student === undefined || attendance === undefined || batchSubjects === undefined) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Calculate stats
  const totalClasses = attendance.length
  const presentCount = attendance.filter((a: any) => a.status === 'present').length
  const absentCount = attendance.filter((a: any) => a.status === 'absent').length
  const leaveCount = attendance.filter((a: any) => a.status === 'leave').length
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success'
      case 'absent': return 'error'
      case 'leave': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>My Attendance</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your attendance records
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom fontSize="0.875rem">Current Attendance</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: attendancePercentage >= 75 ? 'success.main' : 'error.main' }}>
                {attendancePercentage}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom fontSize="0.875rem">Total Classes</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalClasses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom fontSize="0.875rem">Classes Attended</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>{presentCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom fontSize="0.875rem">Leaves Given</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>{leaveCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {attendancePercentage < 75 && totalClasses > 5 && (
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
          Your attendance is below the 75% requirement. Please make sure to attend upcoming classes.
        </Alert>
      )}

      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        {attendance.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Remark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...attendance].sort((a: any, b: any) => b.date - a.date).map((record: any) => {
                  const subject = batchSubjects.find((bs: any) => bs._id === record.batchSubjectId)?.subject
                  return (
                    <TableRow key={record._id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{subject?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status.charAt(0).toUpperCase() + record.status.slice(1)} 
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{record.remark || '-'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No attendance records found.</Typography>
          </Box>
        )}
      </Card>
    </Container>
  )
}
