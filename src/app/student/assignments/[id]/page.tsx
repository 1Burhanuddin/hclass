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

  if (assignment === undefined) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (assignment === null) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Study material not found</Alert>
      </Box>
    )
  }

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
        <Typography variant="h4" sx={{ flex: 1, fontWeight: 'bold' }}>
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

            {assignment.attachmentUrl && (
              <>
                <Divider sx={{ my: 4 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Study Material Preview
                  </Typography>
                  <Box sx={{ 
                    width: '100%', 
                    height: '700px', 
                    bgcolor: '#f5f5f5', 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                    mb: 4
                  }}>
                    <iframe
                      src={`${assignment.attachmentUrl}#toolbar=0`}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="File Preview"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    href={assignment.attachmentUrl}
                    target="_blank"
                    sx={{ borderRadius: '8px' }}
                  >
                    Download File
                  </Button>
                </Box>
              </>
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
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{assignment.subject?.name}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                BATCH
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{assignment.batch?.name}</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Dates */}
            {assignment.dueDate && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                  DUE DATE
                </Typography>
                <Typography variant="body1">
                  {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                POSTED
              </Typography>
              <Typography variant="body2">{format(new Date(assignment.createdAt), 'MMM dd, yyyy')}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                TEACHER
              </Typography>
              <Typography variant="body1">
                {assignment.teacher?.userId ? 'Assigned Teacher' : 'Admin'}
              </Typography>
            </Box>
          </DataCard>
        </Grid>
      </Grid>
    </Box>
  )
}
