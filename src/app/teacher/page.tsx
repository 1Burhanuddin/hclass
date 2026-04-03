'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userProfile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');

  // Get teacher record
  const teachers = useQuery(api.teachers.getAllTeachers);
  const teacherId = teachers?.find((t: any) => t.userId === userProfile?._id)?._id;

  // Get batch-subject mappings for this teacher
  const batchSubjects = useQuery(api.batchSubjects.getAllBatchSubjects);
  const teacherMappings = batchSubjects?.filter((bs: any) => bs.teacherId === teacherId) || [];

  // Get batches for quick info
  const batches = useQuery(api.batches.getAllBatches);
  const students = useQuery(api.students.getAllStudents);
  const subjects = useQuery(api.subjects.getAllSubjects);

  // Calculate stats
  const uniqueBatches = new Set(teacherMappings.map((m: any) => m.batchId)).size;
  const batchIds = Array.from(new Set(teacherMappings.map((m: any) => m.batchId)));
  const studentCount = students?.filter((s: any) => batchIds.includes(s.batchId)).length || 0;
  const uniqueSubjects = new Set(teacherMappings.map((m: any) => m.subjectId)).size;

  // Get assignments for this teacher (via batch subjects)
  const assignments = useQuery(api.assignments.getAllAssignments);
  const teacherAssignments = assignments?.filter((a: any) =>
    teacherMappings.some((m: any) => m._id === a.batchSubjectId)
  ) || [];
  const pendingAssignments = teacherAssignments.filter((a: any) => a.status !== 'graded').length;

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in');
    } else if (userProfile && userProfile.role !== 'teacher') {
      router.push('/dashboard');
    }
  }, [isLoaded, user, router, userProfile]);

  if (!isLoaded || !userProfile || !teachers) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Welcome back, {userProfile.name}
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards Row */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    My Batches
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {uniqueBatches}
                  </Typography>
                </Box>
                <ClassIcon sx={{ fontSize: 40, color: '#1976d2', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Students
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {studentCount}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: '#ff9800', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Subjects
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {uniqueSubjects}
                  </Typography>
                </Box>
                <BookIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Grades
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {pendingAssignments}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: '#f44336', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Batch-Subject Mappings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  My Classes
                </Typography>
              </Box>

              {teacherMappings && teacherMappings.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Batch</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          Students
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teacherMappings.slice(0, 5).map((mapping: any) => {
                        const batch = batches?.find((b: any) => b._id === mapping.batchId);
                        const subject = subjects?.find((s: any) => s._id === mapping.subjectId);
                        const count = students?.filter((s: any) => s.batchId === mapping.batchId).length || 0;
                        return (
                          <TableRow key={mapping._id} hover>
                            <TableCell>{batch?.name || 'Unknown'}</TableCell>
                            <TableCell>{subject?.name || 'Unknown'}</TableCell>
                            <TableCell align="right">{count}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  No class assignments yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Assignments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Assignments
                </Typography>
                <Button size="small" component={Link} href="/admin/assignments">
                  View All
                </Button>
              </Box>

              {teacherAssignments && teacherAssignments.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teacherAssignments.slice(0, 3).map((assignment: any) => (
                        <TableRow key={assignment._id} hover>
                          <TableCell>{assignment.title}</TableCell>
                          <TableCell>
                            <Chip
                              label={assignment.status ? assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1) : 'Pending'}
                              size="small"
                              color={assignment.status === 'graded' ? 'success' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  No assignments assigned yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                <Button variant="outlined" component={Link} href="/teacher/attendance" fullWidth>
                  📝 Mark Attendance
                </Button>
                <Button variant="outlined" component={Link} href="/admin/assignments" fullWidth>
                  📋 Manage Assignments
                </Button>
                <Button variant="outlined" component={Link} href="/teacher/notifications" fullWidth>
                  🔔 Notifications
                </Button>
                <Button variant="outlined" component={Link} href="/teacher" fullWidth>
                  📊 View Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
