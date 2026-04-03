'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function RoleSelectPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userCreated, setUserCreated] = useState(false)

  const getUserByClerkId = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip')
  const createUser = useMutation(api.users.createUser)
  const updateUserRole = useMutation(api.users.updateUserRole)

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
        setUserCreated(true) // Mark as attempted to prevent infinite retries
      }
    }

    autoCreateUser()
  }, [isLoaded, user, userCreated])

  // If user already has a role, redirect to dashboard
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in')
    } else if (getUserByClerkId && getUserByClerkId.role) {
      if (getUserByClerkId.role === 'admin') {
        router.push('/admin')
      } else if (getUserByClerkId.role === 'teacher') {
        router.push('/teacher')
      } else {
        router.push('/student')
      }
    }
  }, [isLoaded, user, router, getUserByClerkId])

  const handleRoleSelect = async (role: 'admin' | 'teacher' | 'student') => {
    if (!user) return

    setLoading(true)
    setError('')
    try {
      await updateUserRole({
        clerkId: user.id,
        role: role,
      })

      if (role === 'admin') {
        router.push('/admin')
      } else if (role === 'teacher') {
        router.push('/teacher')
      } else {
        router.push('/student')
      }
    } catch (err) {
      setError('Failed to set role. Please try again.')
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Select Your Role</h1>
          <p className="text-slate-600 text-sm mb-8">Welcome, {user?.firstName || 'User'}! Choose how you will use this system.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleRoleSelect('admin')}
              disabled={loading}
              className="w-full p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition text-left disabled:opacity-50"
            >
              <div className="font-medium text-slate-900">Admin</div>
              <div className="text-xs text-slate-600 mt-1">Manage system, users, and settings</div>
            </button>

            <button
              onClick={() => handleRoleSelect('teacher')}
              disabled={loading}
              className="w-full p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition text-left disabled:opacity-50"
            >
              <div className="font-medium text-slate-900">Teacher</div>
              <div className="text-xs text-slate-600 mt-1">Manage classes, attendance, and assignments</div>
            </button>

            <button
              onClick={() => handleRoleSelect('student')}
              disabled={loading}
              className="w-full p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition text-left disabled:opacity-50"
            >
              <div className="font-medium text-slate-900">Student</div>
              <div className="text-xs text-slate-600 mt-1">View assignments, attendance, and grades</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
