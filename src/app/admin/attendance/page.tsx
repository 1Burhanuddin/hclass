'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { DataTable, DataCard } from '@/components/ui'
import { format } from 'date-fns'

// Configure NProgress
NProgress.configure({ showSpinner: false })

export default function AttendanceManagementPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  // Get all batch subjects
  const batchSubjects = useQuery(api.batchSubjects.getAllBatchSubjectsWithDetails)

  // Get attendance history for all batch subjects
  const attendanceHistory = useQuery(
    api.attendance.getAttendanceByBatchSubject,
    batchSubjects && batchSubjects.length > 0
      ? { batchSubjectId: batchSubjects[0]._id as any }
      : 'skip'
  )

  // Group attendance records by batch and date for summary view
  const getAttendanceSummary = () => {
    if (!batchSubjects || !attendanceHistory) return []

    // Create a map of unique batch-dates with counts
    const summaryMap = new Map<string, any>()

    attendanceHistory.forEach((record: any) => {
      const batchSubject = batchSubjects.find((bs: any) => bs._id === record.batchSubjectId)
      if (!batchSubject) return

      const dateKey = format(new Date(record.date), 'yyyy-MM-dd')
      const summaryKey = `${batchSubject._id}-${dateKey}`

      if (!summaryMap.has(summaryKey)) {
        summaryMap.set(summaryKey, {
          _id: summaryKey,
          batch: batchSubject.batch?.name || 'Unknown',
          batchId: batchSubject._id,
          subject: batchSubject.subject?.name || 'Unknown',
          date: dateKey,
          dateTime: record.date,
          present: 0,
          absent: 0,
          total: 0,
        })
      }

      const summary = summaryMap.get(summaryKey)
      summary.total += 1
      if (record.status === 'present') {
        summary.present += 1
      } else if (record.status === 'absent') {
        summary.absent += 1
      }
    })

    return Array.from(summaryMap.values()).sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    )
  }

  const summaryData = getAttendanceSummary()

  const tableColumns = [
    { id: 'batch', label: 'Batch', width: '20%' },
    { id: 'subject', label: 'Subject', width: '20%' },
    { id: 'date', label: 'Date', width: '15%' },
    {
      id: 'present',
      label: 'Present',
      width: '12%',
      render: (value: number) => (
        <Chip label={value} color="success" size="small" />
      ),
    },
    {
      id: 'absent',
      label: 'Absent',
      width: '12%',
      render: (value: number) => (
        <Chip label={value} color="error" size="small" />
      ),
    },
    {
      id: 'total',
      label: 'Total',
      width: '11%',
      render: (value: number) => (
        <Chip label={value} variant="outlined" size="small" />
      ),
    },
  ]

  if (batchSubjects === undefined) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!batchSubjects || batchSubjects.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Attendance Management
        </Typography>
        <Alert severity="info">
          No batch-subject mappings found. Please create batch-subject mappings first.
        </Alert>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Attendance Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Mark and view attendance records by batch and date ({summaryData.length} records)
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              NProgress.start()
              router.push('/admin/attendance/add')
            }}
            sx={{ borderRadius: '8px' }}
          >
            Add Attendance
          </Button>
        </Box>
      </Grid>

      {/* Attendance Records Table */}
      <Grid item xs={12}>
        <DataCard>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {summaryData && summaryData.length > 0 ? (
            <DataTable
              columns={tableColumns}
              data={summaryData}
              loading={!summaryData}
              onRowClick={(row) => {
                NProgress.start()
                router.push(`/admin/attendance/add?batchSubject=${row.batchId}&date=${row.date}`)
              }}
              emptyMessage="No attendance records found"
            />
          ) : (
            <Typography sx={{ p: 3, textAlign: 'center', color: '#666' }}>
              No attendance records found. Click "Add Attendance" to create one.
            </Typography>
          )}
        </DataCard>
      </Grid>
    </Grid>
  )
}
