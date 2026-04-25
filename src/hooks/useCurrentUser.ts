/**
 * useCurrentUser — resolves the full chain:
 *   Clerk session → Convex user profile → role record (student | teacher)
 *
 * Call this once per role layout (or any page) instead of repeating
 * the same 3-query pattern everywhere.
 */
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export type CurrentUserState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | {
      status: 'ready'
      clerkUser: ReturnType<typeof useUser>['user']
      userProfile: NonNullable<ReturnType<typeof useQuery<typeof api.users.getUserByClerkId>>>
    }

/**
 * Base hook — resolves Clerk user + Convex user profile.
 * Use the role-specific hooks below when you also need the student/teacher record.
 */
export function useCurrentUser(): CurrentUserState {
  const { user, isLoaded } = useUser()

  const userProfile = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )

  if (!isLoaded || userProfile === undefined) {
    return { status: 'loading' }
  }

  if (!user || !userProfile) {
    return { status: 'unauthenticated' }
  }

  return {
    status: 'ready',
    clerkUser: user,
    userProfile,
  }
}

// ---------------------------------------------------------------------------
// Role-specific hooks
// ---------------------------------------------------------------------------

/** Returns the current user + their student record (null if not enrolled) */
export function useCurrentStudent() {
  const currentUser = useCurrentUser()

  const studentRecord = useQuery(
    api.students.getStudentByClerkId,
    currentUser.status === 'ready' && currentUser.clerkUser?.id
      ? { clerkId: currentUser.clerkUser.id }
      : 'skip'
  )

  return {
    ...currentUser,
    studentRecord: studentRecord ?? null,
    studentId: studentRecord?._id ?? null,
  }
}

/** Returns the current user + their teacher record (null if not a teacher) */
export function useCurrentTeacher() {
  const currentUser = useCurrentUser()

  const teacherRecord = useQuery(
    api.teachers.getTeacherByClerkId,
    currentUser.status === 'ready' && currentUser.clerkUser?.id
      ? { clerkId: currentUser.clerkUser.id }
      : 'skip'
  )

  return {
    ...currentUser,
    teacherRecord: teacherRecord ?? null,
    teacherId: teacherRecord?._id ?? null,
  }
}
