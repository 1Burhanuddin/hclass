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



  const filteredAssignments = assignments

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
        Study Material
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}



      {/* Assignments Grid */}
      {filteredAssignments && filteredAssignments.length > 0 ? (
        <Grid container spacing={2}>
          {filteredAssignments.map((assignment: any) => {
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
                    borderLeft: `1px solid #eee`,
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

                    {/* Posted Date */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                        Posted on: {format(new Date(assignment.createdAt), 'MMM dd, yyyy')}
                      </Typography>
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
            No study material available yet. Check back later!
          </Typography>
        </DataCard>
      )}
    </Box>
  )
}
