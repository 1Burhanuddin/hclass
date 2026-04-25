'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import LinearProgress from '@mui/material/LinearProgress';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userProfile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');

  // Get student record
  const students = useQuery(api.students.getAllStudents);
  const studentId = students?.find((s: any) => s.userId === userProfile?._id)?._id;

  // Get student data
  const fees = studentId ? useQuery(api.fees.getStudentFees, { studentId }) : null;
  const notifications = userProfile ? useQuery(api.notifications.getUserNotifications, { userId: userProfile._id }) : null;
  const unreadNotifications = userProfile ? useQuery(api.notifications.getUnreadNotifications, { userId: userProfile._id }) : null;

  // Get assignments (using getAllAssignments and filter for student)
  const assignments = useQuery(api.assignments.getAllAssignments);
  const studentRecord = students?.find((s: any) => s._id === studentId);
  const studentAssignments = assignments?.filter((a: any) => a.batchId === studentRecord?.batchId);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in');
    } else if (userProfile && userProfile.role !== 'student') {
      router.push('/dashboard');
    }
  }, [isLoaded, user, router, userProfile]);

  if (!isLoaded || !userProfile || !students || !studentId) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'due':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} sx={{ width: '100%', m: 0, p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Summary Cards Row */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                   <Typography color="textSecondary" gutterBottom>
                    Study Material Items
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {studentAssignments?.length || 0}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2', opacity: 0.3 }} />
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
                    Unread Notifications
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {unreadNotifications?.count || 0}
                  </Typography>
                </Box>
                <Badge badgeContent={unreadNotifications?.count || 0} color="error">
                  <NotificationsIcon sx={{ fontSize: 40, color: '#ff9800', opacity: 0.3 }} />
                </Badge>
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
                    Fees Status
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {fees?.status ? fees.status.charAt(0).toUpperCase() + fees.status.slice(1) : '-'}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: '#ff6b6b', opacity: 0.3 }} />
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
                    Amount Due
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    ₹{fees?.dueAmount.toLocaleString() || 0}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Assignments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Study Material
                </Typography>
                <Button size="small" component={Link} href="/student/assignments">
                  View All
                </Button>
              </Box>

              {studentAssignments && studentAssignments.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          Posted
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentAssignments.slice(0, 3).map((assignment: any) => (
                        <TableRow key={assignment._id} hover>
                          <TableCell>{assignment.title}</TableCell>
                          <TableCell align="right">
                            {format(new Date(assignment.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  No study material available yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Fees Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Fees Summary
                </Typography>
                <Button size="small" component={Link} href="/student/fees">
                  View Details
                </Button>
              </Box>

              {fees ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Total Fees
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{fees.totalFees.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Amount Paid
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        ₹{fees.paidAmount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Amount Due
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#f44336' }}>
                        ₹{fees.dueAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Payment Progress
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {((fees.paidAmount / fees.totalFees) * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((fees.paidAmount / fees.totalFees) * 100, 100)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={fees.status.charAt(0).toUpperCase() + fees.status.slice(1)}
                      color={getStatusColor(fees.status)}
                      size="small"
                    />
                  </Box>
                </Box>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  No fees information available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Notifications
                </Typography>
                <Button size="small" component={Link} href="/student/notifications">
                  View All
                </Button>
              </Box>

              {notifications && notifications.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {notifications.slice(0, 5).map((notif: any, idx: number) => (
                    <Paper key={idx} sx={{ p: 2, backgroundColor: notif.isRead ? '#fafafa' : '#f0f7ff' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {notif.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            {notif.message}
                          </Typography>
                        </Box>
                        {!notif.isRead && <Chip label="New" size="small" color="primary" />}
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  No notifications yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

