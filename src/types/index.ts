/**
 * Type definitions for the Harshdeep Classes Management System
 */

// User Roles
export type UserRole = 'admin' | 'teacher' | 'student';

// User Types
export interface User {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  isActive: boolean;
  createdAt: number;
}

export interface Teacher {
  _id: string;
  userId: string;
  qualification: string;
  experience: number;
  joinDate: number;
  isActive: boolean;
}

export interface Student {
  _id: string;
  userId: string;
  batchId: string;
  enrollmentNumber: string;
  joinDate: number;
  isActive: boolean;
}

// Batch Types
export interface Batch {
  _id: string;
  batchCode: string;
  name: string;
  class: number;
  section: string;
  studentCount: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Subject Types
export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Batch-Subject-Teacher Mapping
export interface BatchSubject {
  _id: string;
  batchId: string;
  subjectId: string;
  teacherId: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Attendance Types
export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface Attendance {
  _id: string;
  studentId: string;
  batchSubjectId: string;
  date: number;
  status: AttendanceStatus;
  remark?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  percentage: number;
}

// Assignment Types
export interface Assignment {
  _id: string;
  batchSubjectId: string;
  title: string;
  description: string;
  dueDate: number;
  attachmentUrl?: string;
  teacherId: string;
  createdAt: number;
  updatedAt: number;
}

// Notification Types
export type NotificationTargetType = 'global' | 'batch' | 'student';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  targetType: NotificationTargetType;
  targetId?: string;
  senderId: string;
  isRead: boolean;
  createdAt: number;
}

// Fees Types
export type FeeStatus = 'paid' | 'partial' | 'due';

export interface PaymentRecord {
  date: number;
  amount: number;
  note?: string;
}

export interface Fees {
  _id: string;
  studentId: string;
  totalFees: number;
  paidAmount: number;
  dueAmount: number;
  status: FeeStatus;
  lastPaymentDate?: number;
  paymentHistory: PaymentRecord[];
  createdAt: number;
  updatedAt: number;
}

export interface FeesSummary {
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  paidStudents: number;
  partialStudents: number;
  dueStudents: number;
}
