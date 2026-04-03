'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import NProgress from 'nprogress'
import { format, formatDistance } from 'date-fns'
import { DataCard } from '@/components/ui'

export default function StudentAssignmentsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overdue' | 'upcoming'>('all')
  const [error, setError] = useState('')

  // Get user record
  const userRecord = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )

  // Get student record
  const student = useQuery(
    api.students.getStudentByUserId,
    userRecord ? { userId: userRecord._id } : 'skip'
  )

  // Get student's assignments
  const assignments = useQuery(
    api.assignments.getStudentAssignments,
    student ? { studentId: student._id } : 'skip'
  )

  const getAssignmentStatus = (dueDate: number) => {
    const now = Date.now()
    if (dueDate < now) return 'overdue'
    if (dueDate - now < 7 * 24 * 60 * 60 * 1000) return 'pending'
    return 'upcoming'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return '#d32f2f'
      case 'pending':
        return '#f57c00'
      case 'upcoming':
        return '#388e3c'
      default:
        return '#1976d2'
    }
  }

  const getStatusLabel = (dueDate: number) => {
    const now = Date.now()
    if (dueDate < now) {
      return `Overdue - ${formatDistance(new Date(dueDate), now, { addSuffix: true })}`
    }
    return `Due in ${formatDistance(new Date(dueDate), now, { addSuffix: false })}`
  }

  const filteredAssignments =
    !assignments || !filterStatus || filterStatus === 'all'
      ? assignments
      : assignments.filter((a: any) => getAssignmentStatus(a.dueDate) === filterStatus)

  if (!user || !student || !assignments) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Assignments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filter Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {['all', 'pending', 'overdue', 'upcoming'].map((status) => (
          <Chip
            key={status}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            onClick={() => setFilterStatus(status as any)}
            variant={filterStatus === status ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: filterStatus === status ? '#1976d2' : 'transparent',
              color: filterStatus === status ? 'white' : '#1976d2',
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>

      {/* Assignments Grid */}
      {filteredAssignments && filteredAssignments.length > 0 ? (
        <Grid container spacing={2}>
          {filteredAssignments.map((assignment: any) => {
            const status = getAssignmentStatus(assignment.dueDate)
            return (
              <Grid item xs={12} sm={6} md={4} key={assignment._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    },
                    borderLeft: `4px solid ${getStatusColor(status)}`,
                  }}
                  onClick={() => {
                    NProgress.start()
                    router.push(`/student/assignments/${assignment._id}`)
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    {/* Title */}
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, lineHeight: 1.3 }}>
                      {assignment.title}
                    </Typography>

                    {/* Subject & Batch */}
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      {assignment.subject?.name} • {assignment.batch?.name}
                    </Typography>

                    {/* Status Badge */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={getStatusLabel(assignment.dueDate)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(status),
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    {/* Teacher */}
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.875rem' }}>
                      By {assignment.teacher?.userId ? 'Teacher' : 'Admin'}
                    </Typography>
                  </CardContent>

                  {/* Footer with View Button */}
                  <Box sx={{ px: 2, pb: 2, pt: 1, borderTop: '1px solid #eee' }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      fullWidth
                      sx={{ textTransform: 'none', borderRadius: '6px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        NProgress.start()
                        router.push(`/student/assignments/${assignment._id}`)
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <DataCard>
          <Typography sx={{ textAlign: 'center', color: '#999', py: 4 }}>
            No assignments yet. Check back later!
          </Typography>
        </DataCard>
      )}
    </Box>
  )
}
