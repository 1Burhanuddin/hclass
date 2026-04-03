'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function StudentGradesPage() {
  const router = useRouter();
  const { user } = useUser();
  const userRecord = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');
  
  // Get all students to find this user's student record
  const allStudents = useQuery(api.students.getAllStudents);
  const studentRecord = allStudents?.find((s: any) => s.userId === userRecord?._id);

  const studentGrades = studentRecord ? useQuery(api.grades.getStudentGrades, { studentId: studentRecord._id }) : null;

  const allBatches = useQuery(api.batches.getAllBatches);

  useEffect(() => {
    if (userRecord && userRecord.role !== 'student') {
      router.push('/auth/sign-in');
    }
  }, [userRecord, router]);

  if (!userRecord || !studentRecord) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 95) return { bg: '#4caf50', text: 'white' }; // Green for A+
    if (percentage >= 90) return { bg: '#4caf50', text: 'white' }; // Green for A
    if (percentage >= 85) return { bg: '#66bb6a', text: 'white' }; // Light green for A-
    if (percentage >= 80) return { bg: '#81c784', text: 'white' }; // Lighter green for B+
    if (percentage >= 75) return { bg: '#a5d6a7', text: 'black' }; // Pale green for B
    if (percentage >= 70) return { bg: '#ffc107', text: 'black' }; // Amber for C+
    if (percentage >= 65) return { bg: '#ffb74d', text: 'black' }; // Orange for C
    if (percentage >= 60) return { bg: '#ff9800', text: 'black' }; // Dark orange for D
    if (percentage >= 50) return { bg: '#ff7043', text: 'white' }; // Red-orange for D
    return { bg: '#f44336', text: 'white' }; // Red for F
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'A-';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'C-';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // Group grades by subject
  const gradesBySubject: { [key: string]: any[] } = {};
  (studentGrades || []).forEach((grade: any) => {
    if (!gradesBySubject[grade.subjectName]) {
      gradesBySubject[grade.subjectName] = [];
    }
    gradesBySubject[grade.subjectName].push(grade);
  });

  // Calculate subject averages
  const subjectAverages = Object.entries(gradesBySubject).map(([subject, grades]) => {
    const avgPercentage = Math.round(
      (grades as any[]).reduce((sum, g) => sum + g.percentage, 0) / (grades as any[]).length
    );
    return {
      subject,
      average: avgPercentage,
      count: (grades as any[]).length,
      letterGrade: getLetterGrade(avgPercentage),
    };
  });

  // Overall average
  const overallAverage = Math.round(
    (studentGrades || []).reduce((sum, g) => sum + g.percentage, 0) / Math.max(1, (studentGrades || []).length)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        My Grades
      </Typography>

      {studentGrades && (studentGrades as any[]).length > 0 ? (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Overall Average
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {overallAverage}%
                    </Typography>
                    <Chip
                      label={getLetterGrade(overallAverage)}
                      sx={{
                        bgcolor: getGradeColor(overallAverage).bg,
                        color: getGradeColor(overallAverage).text,
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={overallAverage}
                    sx={{
                      mt: 2,
                      height: 8,
                      borderRadius: '4px',
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getGradeColor(overallAverage).bg,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Assessments
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {(studentGrades || []).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Subjects
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {subjectAverages.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Highest Subject
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, flex: 1 }}>
                      {subjectAverages.length > 0 ? Math.max(...subjectAverages.map((s) => s.average)) : 0}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Subject Performance */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Performance by Subject
          </Typography>
          <Paper sx={{ borderRadius: '12px', overflow: 'hidden', mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Average
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Grade
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Assessments
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjectAverages.map((subj) => (
                    <TableRow key={subj.subject} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{subj.subject}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {subj.average}%
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={subj.letterGrade}
                          sx={{
                            bgcolor: getGradeColor(subj.average).bg,
                            color: getGradeColor(subj.average).text,
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{subj.count}</TableCell>
                      <TableCell>
                        <LinearProgress
                          variant="determinate"
                          value={subj.average}
                          sx={{
                            height: 6,
                            borderRadius: '3px',
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getGradeColor(subj.average).bg,
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* All Assessments by Subject */}
          {Object.entries(gradesBySubject).map(([subject, grades]) => (
            <Box key={subject} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {subject}
              </Typography>
              <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Assessment</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Score
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Percentage
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Grade
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Feedback</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(grades as any[]).map((grade) => (
                        <TableRow key={grade._id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{grade.assessmentName}</TableCell>
                          <TableCell>{grade.assessmentType}</TableCell>
                          <TableCell align="center">
                            {grade.score}/{grade.maxScore}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>
                            {grade.percentage}%
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={grade.grade}
                              sx={{
                                bgcolor: getGradeColor(grade.percentage).bg,
                                color: getGradeColor(grade.percentage).text,
                                fontWeight: 'bold',
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: '200px' }}>
                            {grade.comments ? (
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                {grade.comments}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#999' }}>
                                —
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          ))}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
          <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
            No grades available yet. Check back later!
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
