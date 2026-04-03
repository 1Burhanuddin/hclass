'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const userProfile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip')
  const isLoadingData = userProfile === undefined

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push('/auth/sign-in')
      return
    }

    // If user profile is null (doesn't exist in Convex), redirect to role-select to create it
    if (userProfile === null) {
      router.push('/role-select')
      return
    }

    // If still loading data, wait
    if (isLoadingData) return

    // Check if user has a role assigned
    if (!userProfile.role) {
      router.push('/role-select')
    } else {
      // Redirect to role-specific dashboard
      if (userProfile.role === 'admin') {
        router.push('/admin')
      } else if (userProfile.role === 'teacher') {
        router.push('/teacher')
      } else if (userProfile.role === 'student') {
        router.push('/student')
      }
    }
  }, [isLoaded, user, router, userProfile, isLoadingData])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg text-slate-600 mb-4">Loading your dashboard...</div>
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  )
}
