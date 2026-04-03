'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import {
  Container,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function GradesManagementPage() {
  const router = useRouter();
  const { user } = useUser();
  const userRecord = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');

  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    batchSubjectId: '',
    assessmentType: '',
    assessmentName: '',
    score: '',
    maxScore: '100',
    comments: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const students = useQuery(api.students.getAllStudents);
  const batchSubjects = useQuery(api.batchSubjects.getAllBatchSubjects);
  const allGrades = useQuery(api.grades.getAllGrades);
  const allUsers = useQuery(api.users.getAllUsers);
  const allTeachers = useQuery(api.teachers.getAllTeachers);
  const createGradeMutation = useMutation(api.grades.createGrade);
  const updateGradeMutation = useMutation(api.grades.updateGrade);
  const deleteGradeMutation = useMutation(api.grades.deleteGrade);

  useEffect(() => {
    if (userRecord && userRecord.role !== 'admin') {
      router.push('/auth/sign-in');
    }
  }, [userRecord, router]);

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setFormData({
      studentId: '',
      batchSubjectId: '',
      assessmentType: '',
      assessmentName: '',
      score: '',
      maxScore: '100',
      comments: '',
    });
    setGradeDialogOpen(true);
  };

  const handleRowClick = (grade: any) => {
    setSelectedGrade(grade);
    setFormData({
      studentId: grade.studentId,
      batchSubjectId: grade.batchSubjectId,
      assessmentType: grade.assessmentType,
      assessmentName: grade.assessmentName,
      score: grade.score.toString(),
      maxScore: grade.maxScore.toString(),
      comments: grade.comments || '',
    });
    setGradeDialogOpen(true);
  };

  const handleSaveGrade = async () => {
    if (!formData.studentId || !formData.batchSubjectId || !formData.assessmentType || !formData.assessmentName || !formData.score) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    const score = parseFloat(formData.score);
    const maxScore = parseFloat(formData.maxScore);

    if (score < 0 || score > maxScore) {
      setToast({ open: true, message: 'Score must be between 0 and max score', severity: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      NProgress.start();

      if (selectedGrade) {
        // Update existing grade
        await updateGradeMutation({
          gradeId: selectedGrade._id,
          score,
          maxScore,
          comments: formData.comments || undefined,
        });
        setToast({ open: true, message: 'Grade updated successfully', severity: 'success' });
      } else {
        // Create new grade - use the first teacher as default for admin
        const defaultTeacher = (allTeachers || [])[0];
        if (!defaultTeacher) {
          setToast({ open: true, message: 'No teachers found in the system', severity: 'error' });
          setIsLoading(false);
          NProgress.done();
          return;
        }

        await createGradeMutation({
          studentId: formData.studentId as any,
          batchSubjectId: formData.batchSubjectId as any,
          teacherId: defaultTeacher._id,
          assessmentType: formData.assessmentType,
          assessmentName: formData.assessmentName,
          score,
          maxScore,
          comments: formData.comments || undefined,
        });
        setToast({ open: true, message: 'Grade added successfully', severity: 'success' });
      }

      setGradeDialogOpen(false);
      setIsLoading(false);
      NProgress.done();
    } catch (error) {
      console.error('Error saving grade:', error);
      setToast({ open: true, message: 'Failed to save grade', severity: 'error' });
      setIsLoading(false);
      NProgress.done();
    }
  };

  const handleDeleteGrade = async (gradeId: any) => {
    if (!confirm('Are you sure you want to delete this grade?')) return;

    setIsLoading(true);
    try {
      NProgress.start();
      await deleteGradeMutation({ gradeId });
      setToast({ open: true, message: 'Grade deleted successfully', severity: 'success' });
      setIsLoading(false);
      NProgress.done();
    } catch (error) {
      console.error('Error deleting grade:', error);
      setToast({ open: true, message: 'Failed to delete grade', severity: 'error' });
      setIsLoading(false);
      NProgress.done();
    }
  };

  const getGradeColor = (grade: string) => {
    const gradeVal = parseInt(grade);
    if (gradeVal >= 90) return '#4caf50'; // Green for A/A+
    if (gradeVal >= 80) return '#4caf50'; // Green for B
    if (gradeVal >= 70) return '#ff9800'; // Orange for C
    if (gradeVal >= 60) return '#ff9800'; // Orange for D
    return '#f44336'; // Red for F
  };

  if (!userRecord) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const tableData = (allGrades || []).map((grade: any) => ({
    ...grade,
    id: grade._id,
    scoreDisplay: `${grade.score}/${grade.maxScore}`,
  }));

  const columns: EnhancedTableColumn[] = [
    { id: 'studentName', label: 'Student', minWidth: 150 },
    { id: 'subjectName', label: 'Subject', minWidth: 120 },
    { id: 'assessmentName', label: 'Assessment', minWidth: 140 },
    { id: 'scoreDisplay', label: 'Score', minWidth: 100 },
    {
      id: 'percentage',
      label: 'Percentage',
      minWidth: 100,
      format: (value: number) => `${value}%`,
    },
    {
      id: 'grade',
      label: 'Grade',
      minWidth: 80,
      format: (value: string) => (
        <Chip label={value} sx={{ bgcolor: getGradeColor(value), color: 'white', fontWeight: 'bold' }} size="small" />
      ),
    },
    { id: 'comments', label: 'Comments', minWidth: 150 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Grade Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddGrade}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
        >
          Add Grade
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {allGrades ? (
        <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <EnhancedTable
            columns={columns}
            rows={tableData}
            onRowClick={handleRowClick}
            loading={isLoading}
          />
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onClose={() => setGradeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          {selectedGrade ? 'Edit Grade' : 'Add New Grade'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Student *</InputLabel>
            <Select
              name="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              label="Student *"
              disabled={!!selectedGrade}
            >
              {students?.map((student: any) => {
                const studentUser = allUsers?.find((u: any) => u._id === student.userId);
                return (
                  <MenuItem key={student._id} value={student._id}>
                    {studentUser?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Subject *</InputLabel>
            <Select
              name="batchSubjectId"
              value={formData.batchSubjectId}
              onChange={(e) => setFormData({ ...formData, batchSubjectId: e.target.value })}
              label="Subject *"
              disabled={!!selectedGrade}
            >
              {batchSubjects?.map((bs: any, idx: number) => {
                const batch = students?.find((s: any) => s._id === formData.studentId);
                if (batch?._id === bs.batchId || !formData.studentId) {
                  return (
                    <MenuItem key={bs._id} value={bs._id}>
                      Subject {idx + 1}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Assessment Type *"
            placeholder="e.g., Unit Test, Mid-Term, Final"
            value={formData.assessmentType}
            onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
            size="small"
          />

          <TextField
            fullWidth
            label="Assessment Name *"
            placeholder="e.g., Chapter 1 Quiz"
            value={formData.assessmentName}
            onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
            size="small"
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Score *"
              type="number"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              size="small"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Max Score *"
              type="number"
              value={formData.maxScore}
              onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
              size="small"
              inputProps={{ min: 1 }}
            />
          </Box>

          <TextField
            fullWidth
            label="Comments"
            placeholder="Optional feedback"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            size="small"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setGradeDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveGrade}
            variant="contained"
            disabled={isLoading || !formData.studentId || !formData.batchSubjectId || !formData.assessmentType || !formData.assessmentName || !formData.score}
          >
            {isLoading ? 'Saving...' : 'Save Grade'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
