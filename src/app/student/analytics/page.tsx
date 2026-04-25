'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
  Chip,
  Alert,
  Paper,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Link from 'next/link';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StudentAnalyticsDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  const userProfile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');

  const students = useQuery(api.students.getAllStudents);
  const studentId = students?.find((s: any) => s.userId === userProfile?._id)?._id;

  const performanceSummary = useQuery(api.studentAnalytics.getPerformanceSummary, studentId ? { studentId } : 'skip');

  const subjectPerformance = useQuery(api.studentAnalytics.getSubjectPerformance, studentId ? { studentId } : 'skip');

  const studyRecommendations = useQuery(api.studentAnalytics.getStudyRecommendations, studentId ? { studentId } : 'skip');

  const gradeGradeApi = useQuery(api.grades.getStudentGrades, studentId ? { studentId } : 'skip');

  const attendance = useQuery(api.attendance.getAttendanceByStudent, studentId ? { studentId } : 'skip');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in');
    } else if (userProfile && userProfile.role !== 'student') {
      router.push('/student');
    }
  }, [isLoaded, user, router, userProfile]);

  if (!isLoaded || !userProfile || !studentId) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const getTrendIcon = () => {
    if (performanceSummary?.trend === 'improving') {
      return <TrendingUpIcon sx={{ color: '#4caf50' }} />;
    } else if (performanceSummary?.trend === 'declining') {
      return <TrendingDownIcon sx={{ color: '#f44336' }} />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (performanceSummary?.trend === 'improving') return '#4caf50';
    if (performanceSummary?.trend === 'declining') return '#f44336';
    return '#ff9800';
  };

  const gradeColor = (avg: number) => {
    if (avg >= 90) return '#4caf50';
    if (avg >= 80) return '#2196f3';
    if (avg >= 70) return '#ff9800';
    if (avg >= 60) return '#f57c00';
    return '#f44336';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon fontSize="large" color="primary" /> Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Track your academic performance, attendance, and get personalized insights
        </Typography>
      </Box>

      {/* Summary Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Overall Average
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: gradeColor(performanceSummary?.overallAverage || 0) }}>
                    {performanceSummary?.overallAverage || 0}%
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: gradeColor(performanceSummary?.overallAverage || 0), opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Attendance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: performanceSummary?.attendancePercentage! >= 75 ? '#4caf50' : '#f44336' }}>
                    {performanceSummary?.attendancePercentage || 0}%
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: performanceSummary?.attendancePercentage! >= 75 ? '#4caf50' : '#f44336', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Assessments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {performanceSummary?.totalAssessments || 0}
                  </Typography>
                </Box>
                <AnalyticsIcon sx={{ fontSize: 40, color: '#1976d2', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Trend
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: getTrendColor() }}>
                      {performanceSummary?.trend.toUpperCase()}
                    </Typography>
                    {getTrendIcon()}
                  </Box>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: getTrendColor(), opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Views */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          sx={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <Tab icon={<SchoolIcon />} iconPosition="start" label="Subject Performance" />
          <Tab icon={<CheckCircleIcon />} iconPosition="start" label="Attendance Overview" />
          <Tab icon={<TipsAndUpdatesIcon />} iconPosition="start" label="Study Recommendations" />
          <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Performance History" />
        </Tabs>

        {/* Subject Performance Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {subjectPerformance && subjectPerformance.length > 0 ? (
              subjectPerformance.map((subject: any) => (
                <Grid item xs={12} md={6} key={subject.subjectId}>
                  <Card sx={{ border: `3px solid ${gradeColor(subject.averagePercentage)}` }}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {subject.subjectName}
                          </Typography>
                          <Chip
                            label={`${subject.averagePercentage}%`}
                            sx={{
                              backgroundColor: gradeColor(subject.averagePercentage),
                              color: '#fff',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={subject.averagePercentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: gradeColor(subject.averagePercentage),
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          <strong>{subject.assessmentCount}</strong> assessments
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Grades: <strong>{subject.grades.join(', ')}</strong>
                        </Typography>
                      </Box>

                      {subject.averagePercentage >= 80 && (
                        <Alert severity="success" sx={{ mt: 2, fontSize: '0.85rem' }}>
                          Great job! Keep up the excellent work.
                        </Alert>
                      )}
                      {subject.averagePercentage < 70 && (
                        <Alert severity="warning" sx={{ mt: 2, fontSize: '0.85rem' }}>
                          Consider focusing more on this subject.
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">No subject performance data available yet.</Alert>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Attendance Overview Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Attendance Statistics
                  </Typography>

                  {attendance && attendance.length > 0 ? (
                    <Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, mb: 3 }}>
                        <Box sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Present
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                            {attendance.filter((a: any) => a.status === 'present').length}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, backgroundColor: '#ffebee', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Absent
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                            {attendance.filter((a: any) => a.status === 'absent').length}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Leave
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                            {attendance.filter((a: any) => a.status === 'leave').length}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Total
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            {attendance.length}
                          </Typography>
                        </Box>
                      </Box>

                      {performanceSummary?.attendancePercentage! < 75 && (
                        <Alert severity="warning">
                          ⚠️ Your attendance is below 75%. Regular attendance is important for your academic success.
                        </Alert>
                      )}
                      {performanceSummary?.attendancePercentage! >= 90 && (
                        <Alert severity="success">
                          🎉 Excellent attendance! Keep it up!
                        </Alert>
                      )}
                    </Box>
                  ) : (
                    <Alert severity="info">No attendance data available yet.</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Study Recommendations Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {studyRecommendations && studyRecommendations.length > 0 ? (
              studyRecommendations.map((rec: any, idx: number) => (
                <Grid item xs={12} key={idx}>
                  <Card
                    sx={{
                      borderLeft: `4px solid ${
                        rec.type === 'strength'
                          ? '#4caf50'
                          : rec.type === 'weakness'
                          ? '#f44336'
                          : '#ff9800'
                      }`,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box>
                          {rec.type === 'strength' && <EmojiEventsIcon sx={{ color: '#4caf50', fontSize: 28 }} />}
                          {rec.type === 'weakness' && <TrendingDownIcon sx={{ color: '#f44336', fontSize: 28 }} />}
                          {rec.type === 'opportunity' && <TrendingUpIcon sx={{ color: '#ff9800', fontSize: 28 }} />}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {rec.subject ? rec.subject : 'General'}
                            </Typography>
                            <Chip
                              label={rec.priority.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor:
                                  rec.priority === 'high'
                                    ? '#ffebee'
                                    : rec.priority === 'medium'
                                    ? '#fff3e0'
                                    : '#e8f5e9',
                                color:
                                  rec.priority === 'high'
                                    ? '#f44336'
                                    : rec.priority === 'medium'
                                    ? '#ff9800'
                                    : '#4caf50',
                                fontWeight: 'bold',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                            {rec.message}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">No recommendations available yet. Complete more assessments to see personalized recommendations.</Alert>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Performance History Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Recent Assessments
                  </Typography>

                  {gradeGradeApi && gradeGradeApi.length > 0 ? (
                    <Box>
                      {gradeGradeApi.slice(-10).map((grade: any, idx: number) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            borderBottom: idx < gradeGradeApi.slice(-10).length - 1 ? '1px solid #f0f0f0' : 'none',
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 'bold' }}>
                              {grade.assessmentName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Type: {grade.assessmentType}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip
                              label={grade.grade}
                              sx={{
                                backgroundColor: gradeColor(grade.percentage),
                                color: '#fff',
                                fontWeight: 'bold',
                                mb: 0.5,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {grade.score}/{grade.maxScore}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Alert severity="info">No assessment history yet.</Alert>
                  )}

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button component={Link} href="/student/grades" variant="outlined">
                      View All Grades
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Quick Links */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Navigation
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined" component={Link} href="/student/grades" startIcon={<GradeIcon />} sx={{ py: 1.5 }}>
            View Grades
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined" component={Link} href="/student/attendance" startIcon={<CheckCircleIcon />} sx={{ py: 1.5 }}>
            Attendance
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined" component={Link} href="/student/assignments" startIcon={<AssignmentIcon />} sx={{ py: 1.5 }}>
            Study Material
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined" component={Link} href="/student/fees" startIcon={<ReceiptIcon />} sx={{ py: 1.5 }}>
            Fees
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
