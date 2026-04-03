/**
 * Utility functions for the Harshdeep Classes Management System
 */

import { UserRole } from '@/types';
import { ATTENDANCE_PERCENTAGE_THRESHOLDS } from './constants';

/**
 * Redirect user based on role
 */
export function getRoleBasedDashboardPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
  };
  return paths[role] || '/';
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Determine attendance color badge
 */
export function getAttendanceColor(percentage: number): string {
  if (percentage >= ATTENDANCE_PERCENTAGE_THRESHOLDS.EXCELLENT) {
    return 'success';
  } else if (percentage >= ATTENDANCE_PERCENTAGE_THRESHOLDS.GOOD) {
    return 'info';
  } else if (percentage >= ATTENDANCE_PERCENTAGE_THRESHOLDS.FAIR) {
    return 'warning';
  } else {
    return 'error';
  }
}

/**
 * Get fee status color
 */
export function getFeeStatusColor(status: string): string {
  const colors: Record<string, string> = {
    paid: 'success',
    partial: 'warning',
    due: 'error',
  };
  return colors[status] || 'default';
}

/**
 * Calculate days until due date
 */
export function daysUntilDue(dueDate: number): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: number): boolean {
  const now = new Date();
  return new Date(date) < now;
}

/**
 * Format date
 */
export function formatDate(date: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(date: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
