'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EnhancedTable, { EnhancedTableColumn } from '@/components/EnhancedTable';
import NProgress from 'nprogress';

export default function FeesPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const userRecord = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');

  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentNote, setPaymentNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const allFees = useQuery(api.fees.getAllFees);
  const recordFeePayment = useMutation(api.fees.recordFeePayment);

  // Check if user is admin
  useEffect(() => {
    if (userRecord && userRecord.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [userRecord, router]);

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleRowClick = (row: any) => {
    setSelectedFee(row);
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentNote('');
    setPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedFee || !paymentAmount) {
      showToast('Please enter payment amount', 'error');
      return;
    }

    setIsLoading(true);
    NProgress.start();

    try {
      await recordFeePayment({
        studentId: selectedFee.studentId,
        amount: parseFloat(paymentAmount),
        date: new Date(paymentDate).getTime(),
        note: paymentNote,
      });

      showToast('Payment recorded successfully', 'success');
      setPaymentDialogOpen(false);
      setPaymentAmount('');
      setPaymentNote('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setSelectedFee(null);
      NProgress.done();
    } catch (error) {
      console.error(error);
      showToast('Failed to record payment', 'error');
      NProgress.done();
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'partial':
        return { backgroundColor: '#fff3e0', color: '#e65100' };
      case 'due':
        return { backgroundColor: '#ffebee', color: '#c62828' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#424242' };
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Fees Management
        </Typography>
        <Link href="/admin/fees/students" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" sx={{ borderRadius: '8px' }}>
            Manage Student Fees
          </Button>
        </Link>
      </Box>

      {/* Fees Table */}
      <Card sx={{ border: '1px solid #efefef' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Student Fees Overview
          </Typography>
          <EnhancedTable
            columns={[
              { id: 'studentName', label: 'Student Name', minWidth: 150, sortable: true },
              { id: 'studentEmail', label: 'Email', minWidth: 200, sortable: true },
              {
                id: 'totalFees',
                label: 'Total Fees',
                minWidth: 120,
                align: 'right',
                sortable: true,
                format: (value) => `₹${value.toLocaleString()}`,
              },
              {
                id: 'paidAmount',
                label: 'Paid',
                minWidth: 100,
                align: 'right',
                sortable: true,
                format: (value) => `₹${value.toLocaleString()}`,
              },
              {
                id: 'dueAmount',
                label: 'Due',
                minWidth: 100,
                align: 'right',
                sortable: true,
                format: (value) => `₹${value.toLocaleString()}`,
              },
              {
                id: 'status',
                label: 'Status',
                minWidth: 110,
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
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Box>
                ),
              },
            ]}
            rows={allFees || []}
            loading={!allFees}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedFee && (
            <>
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {selectedFee.studentName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {selectedFee.studentEmail}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Total Fees: ₹{selectedFee.totalFees.toLocaleString()} | Paid: ₹{selectedFee.paidAmount.toLocaleString()}{' '}
                  | Due: ₹{selectedFee.dueAmount.toLocaleString()}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Payment Amount (₹)"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0"
                inputProps={{ step: '0.01', min: '0' }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              />

              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              />

              <TextField
                fullWidth
                label="Note (Optional)"
                multiline
                rows={3}
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Add any notes about this payment..."
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handlePaymentSubmit} variant="contained" disabled={isLoading || !paymentAmount}>
            {isLoading ? 'Saving...' : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
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
