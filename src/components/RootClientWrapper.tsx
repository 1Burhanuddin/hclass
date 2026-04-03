'use client'

import { ReactNode } from 'react'
import ProgressBar from './ProgressBar'

export function RootClientWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <ProgressBar />
      {children}
    </>
  )
}
