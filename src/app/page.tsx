'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function Home() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // Redirect immediately, don't show spinner on this page
      router.push('/dashboard')
    }
  }, [isLoaded, user, router])

  // Only show spinner if still loading or user exists
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <SignedOut>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Harshdeep Classes</h1>
            <p className="text-slate-600 text-lg">Class Management System</p>
          </div>
          <SignUp signInUrl="/auth/sign-in" />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting...</p>
        </div>
      </SignedIn>
    </div>
  )
}
