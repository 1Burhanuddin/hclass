'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-4">Welcome, {user.firstName}!</p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-blue-800">
              ℹ️ This dashboard is a placeholder. Next step is to create Convex schema and implement role-based dashboards (Admin, Teacher, Student).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
