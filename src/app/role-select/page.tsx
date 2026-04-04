'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Box, Card, CardContent, Typography, CircularProgress, Button, Alert } from '@mui/material'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import CancelIcon from '@mui/icons-material/Cancel'

export default function RoleSelectPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [userCreated, setUserCreated] = useState(false)

  const getUserByClerkId = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip')
  const createUser = useMutation(api.users.createUser)

  // Auto-create user if they don't exist
  useEffect(() => {
    if (!isLoaded || !user || userCreated) return

    const autoCreateUser = async () => {
      try {
        // Only create if user doesn't exist yet
        if (!getUserByClerkId) {
          await createUser({
            clerkId: user.id,
            name: (user.firstName || '') + ' ' + (user.lastName || '') || 'User',
            email: user.emailAddresses[0]?.emailAddress || '',
          })
          setUserCreated(true)
        }
      } catch (err) {
        console.error('Failed to create user:', err)
        setUserCreated(true)
      }
    }

    autoCreateUser()
  }, [isLoaded, user, userCreated, getUserByClerkId, createUser])

  // Redirect if user is approved with role or rejected
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in')
      return
    }

    if (getUserByClerkId) {
      if (getUserByClerkId.status === 'approved' && getUserByClerkId.role) {
        // Redirect to appropriate dashboard
        if (getUserByClerkId.role === 'admin') {
          router.push('/admin')
        } else if (getUserByClerkId.role === 'teacher') {
          router.push('/teacher')
        } else if (getUserByClerkId.role === 'student') {
          router.push('/student')
        }
      }
    }
  }, [isLoaded, user, router, getUserByClerkId])

  if (!isLoaded || !getUserByClerkId) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    )
  }

  const userStatus = getUserByClerkId.status

  if (userStatus === 'rejected') {
    return (
      <Box className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CancelIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Application Rejected
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              Your signup application has been rejected. Please contact the administrator if you believe this is an error.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  // Pending status
  return (
    <Box className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card sx={{ maxWidth: 420, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 8, px: 4 }}>
          <HourglassTopIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2, animation: 'pulse 2s infinite' }} />

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'slate.900' }}>
            Awaiting Approval
          </Typography>

          <Typography color="textSecondary" sx={{ mb: 4, fontSize: '1rem' }}>
            Welcome, <strong>{user?.firstName || 'User'}</strong>! Your signup application has been received and is waiting for admin approval.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            The admin team will review your request and assign you an appropriate role (Student, Teacher, or Admin) shortly. You'll be notified once your account is approved.
          </Alert>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            <strong>Account Status:</strong> Pending Admin Approval
          </Typography>

          <Typography variant="caption" color="textSecondary">
            Please note: You won't be able to access the system until your account is approved. If you don't receive approval within 24 hours, please contact support.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
