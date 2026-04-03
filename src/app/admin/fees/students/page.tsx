'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
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
} from '@mui/material';
import { useRouter } from 'next/navigation';
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable';

export default function ManageStudentFeesPage() {
  const router = useRouter();
  const { user } = useUser();
  const userRecord = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [totalFeesAmount, setTotalFeesAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const students = useQuery(api.students.getAllStudents);
  const batches = useQuery(api.batches.getAllBatches);
  const allFees = useQuery(api.fees.getAllFees);
  const allStudentUsers = useQuery(api.users.getAllUsers);
  const createFeesMutation = useMutation(api.fees.createFees);
  const updateFeesMutation = useMutation(api.fees.updateTotalFees);

  useEffect(() => {
    if (userRecord && userRecord.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [userRecord, router]);

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const studentList = (students || []).map((student: any) => {
    const batch = batches?.find((b: any) => b._id === student.batchId);
    const fees = allFees?.find((f: any) => f.studentId === student._id);
    const studentUser = allStudentUsers?.find((u: any) => u._id === student.userId);

    return {
      ...student,
      batchName: batch?.name || 'Unknown',
      studentName: studentUser?.name || `Student ${student._id.slice(0, 8)}`,
      studentEmail: studentUser?.email || 'No email',
      fees: fees || null,
      totalFees: fees?.totalFees || 0,
      paidAmount: fees?.paidAmount || 0,
      dueAmount: fees?.dueAmount || 0,
      status: fees?.status || 'not_set',
    };
  });

  const handleSetFees = async () => {
    if (!selectedStudent || !totalFeesAmount) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    NProgress.start();

    try {
      const amount = parseFloat(totalFeesAmount);

      if (selectedStudent.fees) {
        await updateFeesMutation({
          studentId: selectedStudent._id,
          newTotal: amount,
        });
        showToast('Student fees updated successfully', 'success');
      } else {
        await createFeesMutation({
          studentId: selectedStudent._id,
          totalFees: amount,
        });
        showToast('Student fees created successfully', 'success');
      }

      setFeeDialogOpen(false);
      setTotalFeesAmount('');
      setSelectedStudent(null);
      NProgress.done();
    } catch (error) {
      console.error(error);
      showToast('Failed to set fees', 'error');
      NProgress.done();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (student: any) => {
    setSelectedStudent(student);
    setTotalFeesAmount(student.totalFees.toString());
    setFeeDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    const statusMap: any = {
      paid: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
      partial: { backgroundColor: '#fff3e0', color: '#e65100' },
      due: { backgroundColor: '#ffebee', color: '#c62828' },
      not_set: { backgroundColor: '#f5f5f5', color: '#666' },
    };
    return statusMap[status] || { backgroundColor: '#f5f5f5', color: '#424242' };
  };

  const getStatusLabel = (status: string) => {
    const labelMap: any = {
      paid: 'Fully Paid',
      partial: 'Partial Payment',
      due: 'Payment Due',
      not_set: 'Not Set',
    };
    return labelMap[status] || 'Unknown';
  };

  if (!userRecord) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Manage Student Fees
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Set or edit total fees amount for each student individually. Different students can have different amounts.
        </Typography>
      </Box>

      <Card sx={{ border: '1px solid #efefef', borderRadius: '12px' }}>
        <CardContent sx={{ minHeight: '600px', display: 'flex', flexDirection: 'column', p: 0 }}>
          <EnhancedTable
            columns={[
              { id: 'studentName', label: 'Student Name', minWidth: 180, sortable: true },
              { id: 'studentEmail', label: 'Email', minWidth: 200, sortable: true },
              { id: 'batchName', label: 'Batch', minWidth: 130, sortable: true },
              {
                id: 'totalFees',
                label: 'Total Fees',
                minWidth: 120,
                align: 'right' as any,
                sortable: true,
                format: (value) => (value > 0 ? `₹${value.toLocaleString()}` : '-'),
              },
              {
                id: 'paidAmount',
                label: 'Paid',
                minWidth: 110,
                align: 'right' as any,
                sortable: true,
                format: (value) => (value > 0 ? `₹${value.toLocaleString()}` : '-'),
              },
              {
                id: 'dueAmount',
                label: 'Due',
                minWidth: 110,
                align: 'right' as any,
                sortable: true,
                format: (value) =>
                  value > 0 ? (
                    <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>₹{value.toLocaleString()}</span>
                  ) : (
                    '-'
                  ),
              },
              {
                id: 'status',
                label: 'Status',
                minWidth: 130,
                sortable: true,
                format: (value) => (
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: '16px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      ...getStatusColor(value),
                    }}
                  >
                    {getStatusLabel(value)}
                  </Box>
                ),
              },
            ]}
            rows={studentList}
            loading={!students || !batches || !allFees}
            onRowClick={handleOpenDialog}
          />
        </CardContent>
      </Card>

      <Dialog open={feeDialogOpen} onClose={() => setFeeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStudent?.fees ? 'Edit Student Fees' : 'Set Student Fees'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedStudent && (
            <>
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {selectedStudent.studentName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {selectedStudent.studentEmail}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {selectedStudent.batchName}
                </Typography>
              </Box>

              {selectedStudent.fees && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff3cd', borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current Status:</strong> {getStatusLabel(selectedStudent.status)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Fees:</strong> ₹{selectedStudent.totalFees.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Already Paid:</strong> ₹{selectedStudent.paidAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                    <strong>Remaining Due:</strong> ₹{selectedStudent.dueAmount.toLocaleString()}
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                label="Total Fees Amount (₹)"
                type="number"
                value={totalFeesAmount}
                onChange={(e) => setTotalFeesAmount(e.target.value)}
                placeholder="0"
                inputProps={{ step: '0.01', min: '1' }}
                helperText="Enter the total fees amount for this student"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeeDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSetFees}
            variant="contained"
            disabled={isLoading || !totalFeesAmount}
          >
            {isLoading ? 'Saving...' : 'Save Fees'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ borderRadius: '12px' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
