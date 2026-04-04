'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  TablePagination,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

export default function PendingUsersPage() {
  const pendingUsers = useQuery(api.users.getPendingUsers)
  const approveUserMutation = useMutation(api.users.approveUser)
  const rejectUserMutation = useMutation(api.users.rejectUser)

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student'>('student')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleApprove = (user: any) => {
    setSelectedUser(user)
    setSelectedRole('student')
    setOpenDialog(true)
  }

  const handleConfirmApprove = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      await approveUserMutation({
        userId: selectedUser._id,
        role: selectedRole,
      })
      setMessage(`User ${selectedUser.name} approved as ${selectedRole}`)
      setOpenDialog(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : 'Failed to approve user'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (user: any) => {
    if (!window.confirm(`Are you sure you want to reject ${user.name}?`)) return

    setLoading(true)
    try {
      await rejectUserMutation({
        userId: user._id,
      })
      setMessage(`User ${user.name} rejected`)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : 'Failed to reject user'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (!pendingUsers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  const displayedUsers = pendingUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <h1 className="text-3xl font-bold mb-2">Pending User Approvals</h1>
        <p className="text-gray-600">Review and approve new user signups</p>
      </Box>

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {pendingUsers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <p className="text-gray-500">No pending users to review</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedUsers.map((user: any) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(user)}
                        disabled={loading}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleReject(user)}
                        disabled={loading}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {pendingUsers.length > rowsPerPage && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pendingUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </>
      )}

      {/* Approval Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve User: {selectedUser?.name}</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <p className="mb-4 text-gray-600">{selectedUser?.email}</p>
          <FormControl fullWidth>
            <InputLabel>Assign Role</InputLabel>
            <Select
              value={selectedRole}
              label="Assign Role"
              onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'teacher' | 'student')}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmApprove}
            variant="contained"
            color="success"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
