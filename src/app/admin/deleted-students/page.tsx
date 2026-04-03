'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material'
import { DataTable, DataCard } from '@/components/ui'

interface DeletedStudent {
  _id: string
  name: string
  email: string
  role: 'student'
  isActive: boolean
  deletedAt?: number
  createdAt: number
}

export default function DeletedStudentsPage() {
  const allDeletedUsers = useQuery(api.users.getDeletedUsers)
  const reactivateUserMutation = useMutation(api.users.reactivateUser)
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<DeletedStudent | null>(null)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Filter for deleted students only
  const deletedStudents = (allDeletedUsers?.filter((u) => u.role === 'student') || []) as DeletedStudent[]

  const handleRestoreClick = (student: DeletedStudent) => {
    setSelectedStudent(student)
    setError('')
    setOpenConfirmDialog(true)
  }

  const handleConfirmRestore = async () => {
    if (!selectedStudent) return

    try {
      setRestoreLoading(true)
      setError('')

      await reactivateUserMutation({
        userId: selectedStudent._id as any,
      })

      setOpenConfirmDialog(false)
      setRestoreLoading(false)
      setSelectedStudent(null)
      setSuccessMessage(`${selectedStudent.name} has been restored successfully!`)

      // Clear success message after 4 seconds
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err: any) {
      setError(err.message || 'Failed to restore student')
      setRestoreLoading(false)
    }
  }

  const tableColumns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    {
      id: 'deletedAt',
      label: 'Deleted Date',
      render: (value: number) => {
        if (!value) return 'N/A'
        return new Date(value).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      },
    },
  ]

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Deleted Students
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              View and restore soft-deleted students ({deletedStudents?.length || 0} total)
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Success Message */}
      {successMessage && (
        <Grid item xs={12}>
          <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ borderRadius: '8px' }}>
            {successMessage}
          </Alert>
        </Grid>
      )}

      {/* Deleted Students Table */}
      <Grid item xs={12}>
        <DataCard>
          {deletedStudents.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: '#999' }}>
              <Typography>No deleted students found.</Typography>
            </Box>
          ) : (
            <Box sx={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                    {tableColumns.map((col) => (
                      <th
                        key={col.id}
                        style={{
                          textAlign: 'left',
                          padding: '12px',
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#333',
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deletedStudents.map((student) => (
                    <tr key={student._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      {tableColumns.map((col) => (
                        <td
                          key={col.id}
                          style={{
                            padding: '12px',
                            fontSize: '14px',
                            color: '#333',
                          }}
                        >
                          {col.render ? col.render((student as any)[col.id]) : (student as any)[col.id] || 'N/A'}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: '12px',
                          fontSize: '14px',
                        }}
                      >
                        <Button
                          onClick={() => handleRestoreClick(student)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: '6px',
                            textTransform: 'none',
                            color: '#001a4d',
                            borderColor: '#001a4d',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                          disabled={restoreLoading}
                        >
                          Restore
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </DataCard>
      </Grid>

      {/* Restore Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#001a4d', pb: 1 }}>Restore Student</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography>
            Are you sure you want to restore <strong>{selectedStudent?.name}</strong>? 
            This will re-activate their account and make them visible in the system.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            sx={{ borderRadius: '8px', py: 1, px: 2 }}
            disabled={restoreLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRestore}
            variant="contained"
            sx={{
              borderRadius: '8px',
              py: 1,
              px: 3,
              minWidth: '100px',
              backgroundColor: '#001a4d',
              '&:hover': { backgroundColor: '#000d33' },
            }}
            disabled={restoreLoading}
          >
            {restoreLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Restoring...
              </Box>
            ) : (
              'Restore'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
