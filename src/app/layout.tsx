import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from '@/lib/convex-provider'
import { ThemeProvider } from '@/lib/theme-provider'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { RootClientWrapper } from '@/components/RootClientWrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'Harshdeep Classes Management System',
  description: 'Complete class management solution',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <ConvexClientProvider>
            <ThemeProvider>
              <RootClientWrapper>
                <AuthenticatedLayout>{children}</AuthenticatedLayout>
              </RootClientWrapper>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
