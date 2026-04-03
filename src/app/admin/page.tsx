'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Grid, Box, Button, Card, CardContent, CardActions } from '@mui/material'
import { PageContainer, StatsCard, LoadingSpinner } from '@/components/shared'
import PeopleIcon from '@mui/icons-material/People'
import GroupsIcon from '@mui/icons-material/Groups'
import ClassIcon from '@mui/icons-material/Class'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const userProfile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip')

  // Get system statistics
  const teachers = useQuery(api.teachers.getAllTeachers)
  const students = useQuery(api.students.getAllStudents)
  const batches = useQuery(api.batches.getAllBatches)
  const subjects = useQuery(api.subjects.getAllSubjects)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in')
    } else if (userProfile && userProfile.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [isLoaded, user, router, userProfile])

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  return (
    <PageContainer>
      <Box sx={{ mb: 4 }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>Admin Dashboard</h1>
        <p style={{ margin: 0, color: '#666', marginTop: '8px' }}>System management and overview</p>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Teachers"
            value={teachers?.length.toString() || '0'}
            subtitle="Active teachers"
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Students"
            value={students?.length.toString() || '0'}
            subtitle="Total enrolled"
            icon={<GroupsIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Batches"
            value={batches?.length.toString() || '0'}
            subtitle="Active batches"
            icon={<ClassIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h2>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Manage Users</p>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.875rem' }}>Teachers & Students</p>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href="/admin/users" variant="contained" fullWidth>
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Manage Batches</p>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.875rem' }}>Classes & sections</p>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href="/admin/batches" variant="contained" fullWidth>
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Manage Subjects</p>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.875rem' }}>Course subjects</p>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href="/admin/subjects" variant="contained" fullWidth>
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Teacher Mapping</p>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.875rem' }}>Batch-Subject-Teacher</p>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href="/admin/mapping" variant="contained" fullWidth>
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>System Settings</p>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.875rem' }}>Configuration</p>
              </CardContent>
              <CardActions>
                <Button size="small" disabled fullWidth>
                  Coming Soon
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}
