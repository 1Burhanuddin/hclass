'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { PageHeader } from '@/components/shared'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface AuthenticatedLayoutProps {
  children: ReactNode
  signedOutContent?: ReactNode
}

export function AuthenticatedLayout({
  children,
  signedOutContent,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <>
      <SignedOut>
        {signedOutContent || children}
      </SignedOut>
      <SignedIn>
        {!isAdminRoute && <PageHeader title="Dashboard" />}
        <main>{children}</main>
      </SignedIn>
    </>
  )
}
