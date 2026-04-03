import { ReactNode } from 'react'
import { TeacherLayout } from '@/components/layout/teacher-layout'

export default function TeacherLayoutWrapper({ children }: { children: ReactNode }) {
  return <TeacherLayout>{children}</TeacherLayout>
}
