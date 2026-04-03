'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material'
import BackIcon from '@mui/icons-material/ArrowBack'
import DownloadIcon from '@mui/icons-material/Download'
import DescriptionIcon from '@mui/icons-material/Description'
import NProgress from 'nprogress'
import { format, formatDistance } from 'date-fns'
import { DataCard } from '@/components/ui'

export default function StudentAssignmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useUser()

  const assignmentId = params.id as string

  // Get assignment
  const assignment = useQuery(api.assignments.getAssignmentById, {
    assignmentId: assignmentId as any,
  })

  if (!assignment) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const getAssignmentStatus = (dueDate: number) => {
    const now = Date.now()
    if (dueDate < now) return 'overdue'
    if (dueDate - now < 7 * 24 * 60 * 60 * 1000) return 'pending'
    return 'upcoming'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return '#d32f2f'
      case 'pending':
        return '#f57c00'
      case 'upcoming':
        return '#388e3c'
      default:
        return '#1976d2'
    }
  }

  const status = getAssignmentStatus(assignment.dueDate)
  const isOverdue = status === 'overdue'
  const daysRemaining = Math.ceil((assignment.dueDate - Date.now()) / (24 * 60 * 60 * 1000))

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => {
            NProgress.start()
            router.push('/student/assignments')
          }}
          sx={{ textTransform: 'none' }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flex: 1 }}>
          {assignment.title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <DataCard>
            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Description
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#333' }}>
                {assignment.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Attachment Section */}
            {assignment.attachmentUrl && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Attachments
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={assignment.attachmentUrl}
                  target="_blank"
                  sx={{ borderRadius: '8px' }}
                >
                  Download Assignment File
                </Button>
              </Box>
            )}
          </DataCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <DataCard>
            {/* Subject & Batch */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                SUBJECT
              </Typography>
              <Typography variant="body1">{assignment.subject?.name}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                BATCH
              </Typography>
              <Typography variant="body1">{assignment.batch?.name}</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Due Date Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                DUE DATE
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {format(new Date(assignment.dueDate), 'MMM dd, yyyy • HH:mm')}
              </Typography>
              <Chip
                label={isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(status),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                TEACHER
              </Typography>
              <Typography variant="body1">
                {assignment.teacher?.userId ? 'Assigned Teacher' : 'Admin'}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Created Date */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                POSTED
              </Typography>
              <Typography variant="body2">{format(new Date(assignment.createdAt), 'MMM dd, yyyy')}</Typography>
            </Box>
          </DataCard>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {isOverdue ? '⚠️ This assignment is overdue' : '✓ You can still submit this assignment'}
        </Typography>
      </Box>
    </Box>
  )
}
