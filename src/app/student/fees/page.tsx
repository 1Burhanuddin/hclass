'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import {
  Container,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function FeesPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const userRecord = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');
  
  // Get student record to find studentId
  const students = useQuery(api.students.getAllStudents);
  const studentId = students?.find((s: any) => s.userId === userRecord?._id)?._id;
  
  // Get fees for this student
  const fees = studentId ? useQuery(api.fees.getStudentFees, { studentId }) : null;

  // Check if user is student
  useEffect(() => {
    if (userRecord && userRecord.role !== 'student') {
      router.push('/');
      return;
    }
  }, [userRecord, router]);

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'paid':
        return 'All fees paid successfully!';
      case 'partial':
        return 'Partial payment received. Please pay the remaining amount.';
      case 'due':
        return 'Payment is due. Please submit your fees.';
      default:
        return 'Status unknown';
    }
  };

  if (!userRecord || !students || !studentId || !fees) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!fees) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No fees information found. Please contact the administrator.</Alert>
      </Container>
    );
  }

  const paymentPercentage = (fees.paidAmount / fees.totalFees) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Fees
      </Typography>

      {/* Status and Progress Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Fees
            </Typography>
            <Typography variant="h6">₹{fees.totalFees.toLocaleString()}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Amount Paid
            </Typography>
            <Typography variant="h6" sx={{ color: 'success.main' }}>
              ₹{fees.paidAmount.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Amount Due
            </Typography>
            <Typography variant="h6" sx={{ color: 'error.main' }}>
              ₹{fees.dueAmount.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        {fees.emiAmount && (
          <Card sx={{ borderLeft: '4px solid #1976d2' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                EMI/Month
              </Typography>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                ₹{Math.round(fees.emiAmount).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Status Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Payment Status
          </Typography>
          <Chip
            label={fees.status.charAt(0).toUpperCase() + fees.status.slice(1)}
            color={getStatusColor(fees.status)}
            size="medium"
          />
        </Box>
        <Alert severity={fees.status === 'paid' ? 'success' : fees.status === 'partial' ? 'warning' : 'error'}>
          {getStatusMessage(fees.status)}
        </Alert>

        {/* Progress Bar */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Payment Progress
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {paymentPercentage.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={Math.min(paymentPercentage, 100)} sx={{ height: 8 }} />
        </Box>

        {/* Last Payment */}
        {fees.lastPaymentDate && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Last Payment Date: {new Date(fees.lastPaymentDate).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Payment History */}
      {fees.paymentHistory && fees.paymentHistory.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Payment History
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees.paymentHistory.map((payment: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell align="right">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.note || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* No Payment History */}
      {(!fees.paymentHistory || fees.paymentHistory.length === 0) && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No payment history yet.</Typography>
        </Paper>
      )}
    </Container>
  );
}
