import { StudentLayout } from '@/components/layout/student-layout';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <StudentLayout>{children}</StudentLayout>;
}
