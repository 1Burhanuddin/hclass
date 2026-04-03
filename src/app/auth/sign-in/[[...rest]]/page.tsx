'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full">
        <SignIn routing="hash" signUpUrl="/auth/sign-up" />
      </div>
    </div>
  )
}
