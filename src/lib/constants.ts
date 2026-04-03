/**
 * Constants for the Harshdeep Classes Management System
 */

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LEAVE: 'leave',
} as const;

export const FEE_STATUS = {
  PAID: 'paid',
  PARTIAL: 'partial',
  DUE: 'due',
} as const;

export const NOTIFICATION_TARGET_TYPES = {
  GLOBAL: 'global',
  BATCH: 'batch',
  STUDENT: 'student',
} as const;

export const CLASSES = [10, 11, 12];
export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const STANDARD_SUBJECTS = [
  { name: 'Mathematics', code: 'MATH' },
  { name: 'Physics', code: 'PHYS' },
  { name: 'Chemistry', code: 'CHEM' },
  { name: 'Biology', code: 'BIO' },
  { name: 'English', code: 'ENG' },
  { name: 'Hindi', code: 'HINDI' },
  { name: 'History', code: 'HIST' },
  { name: 'Geography', code: 'GEO' },
  { name: 'Social Studies', code: 'SS' },
];

export const ATTENDANCE_PERCENTAGE_THRESHOLDS = {
  EXCELLENT: 95,
  GOOD: 85,
  FAIR: 75,
  POOR: 0,
} as const;

export const ROUTES = {
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    TEACHERS: '/admin/teachers',
    STUDENTS: '/admin/students',
    BATCHES: '/admin/batches',
    SUBJECTS: '/admin/subjects',
    BATCH_SUBJECTS: '/admin/batch-subjects',
    FEES: '/admin/fees',
    NOTIFICATIONS: '/admin/notifications',
  },
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    ATTENDANCE: '/teacher/attendance',
    ASSIGNMENTS: '/teacher/assignments',
    NOTIFICATIONS: '/teacher/notifications',
    PROFILE: '/teacher/profile',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    ATTENDANCE: '/student/attendance',
    ASSIGNMENTS: '/student/assignments',
    FEES: '/student/fees',
    NOTIFICATIONS: '/student/notifications',
    PROFILE: '/student/profile',
  },
} as const;
