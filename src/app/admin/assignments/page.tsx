'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import NProgress from 'nprogress'
import { format } from 'date-fns'
import { DataCard } from '@/components/ui'

export default function AssignmentsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  })

  // Get user record to check role
  const userRecord = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )

  // Get teacher record (if user is a teacher)
  const teacher = useQuery(
    api.teachers.getTeacherByUserId,
    userRecord && userRecord.role !== 'admin' ? { userId: userRecord._id } : 'skip'
  )

  // Determine if user is authorized (admin or teacher)
  const isAuthorized = userRecord && (userRecord.role === 'admin' || teacher)

  // Get assignments: use getAllAssignments for admins, getTeacherAssignments for teachers
  const assignments = useQuery(
    userRecord?.role === 'admin' 
      ? api.assignments.getAllAssignments
      : api.assignments.getTeacherAssignments,
    userRecord?.role === 'admin'
      ? {}
      : (teacher ? { teacherId: teacher._id } : 'skip')
  ) as any

  const deleteAssignmentMutation = useMutation(api.assignments.deleteAssignment)

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      await deleteAssignmentMutation({ assignmentId: id as any })
      setDeleteDialog({ open: false, id: null })
      setError('')
    } catch (err: any) {
      setError(err.message || 'Failed to delete assignment')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    NProgress.start()
    router.push(`/admin/assignments/${id}`)
  }

  const handleView = (id: string) => {
    NProgress.start()
    router.push(`/admin/assignments/${id}`)
  }

  // Show loading only if user or queries haven't resolved yet
  if (!user || userRecord === undefined) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  // If user isn't admin or teacher, show error
  if (!isAuthorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Assignments</Typography>
        <Alert severity="warning">You don't have permission to manage assignments. Only admins and teachers can create assignments.</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Assignments</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                NProgress.start()
                router.push('/admin/assignments/create')
              }}
              sx={{ borderRadius: '8px' }}
            >
              Create Assignment
            </Button>
          </Box>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataCard>
        {!assignments ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : assignments.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#999', p: 3 }}>
            No assignments yet. Create your first assignment!
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Batch-Subject</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Due Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment: any) => (
                  <TableRow key={assignment._id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>
                      {assignment.batch?.name} - {assignment.subject?.name}
                    </TableCell>
                    <TableCell>{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(assignment.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleView(assignment._id)}
                        title="View"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(assignment._id)}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteDialog({ open: true, id: assignment._id })}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataCard>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Delete Assignment?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this assignment? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button
            onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
