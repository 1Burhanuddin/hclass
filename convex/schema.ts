import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.optional(v.union(v.literal('admin'), v.literal('teacher'), v.literal('student'))),
    status: v.optional(v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected'))),
    profileImage: v.optional(v.string()),
    isActive: v.boolean(),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_status', ['status']),

  batches: defineTable({
    name: v.string(),
    class: v.number(),
    section: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_isActive', ['isActive']),

  subjects: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_code', ['code']),

  teachers: defineTable({
    userId: v.id('users'),
    qualification: v.string(),
    joinDate: v.number(),
    primarySubjectId: v.optional(v.id('subjects')),
  }),

  students: defineTable({
    userId: v.id('users'),
    batchId: v.id('batches'),
    enrollmentNumber: v.string(),
    joinDate: v.number(),
  }),

  batchSubjects: defineTable({
    batchId: v.id('batches'),
    subjectId: v.id('subjects'),
    teacherId: v.id('teachers'),
    createdAt: v.number(),
  }),

  attendance: defineTable({
    studentId: v.id('students'),
    batchSubjectId: v.id('batchSubjects'),
    date: v.number(),
    status: v.union(v.literal('present'), v.literal('absent'), v.literal('leave')),
    remark: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_student_batchSubject_date', ['studentId', 'batchSubjectId', 'date'])
    .index('by_batchSubject_date', ['batchSubjectId', 'date'])
    .index('by_student_date', ['studentId', 'date']),

  assignments: defineTable({
    batchSubjectId: v.id('batchSubjects'),
    teacherId: v.id('teachers'),
    title: v.string(),
    description: v.string(),
    dueDate: v.number(),
    attachmentUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_batchSubject', ['batchSubjectId'])
    .index('by_teacher', ['teacherId'])
    .index('by_dueDate', ['dueDate']),

  notifications: defineTable({
    title: v.string(),
    message: v.string(),
    senderId: v.id('users'),
    targetType: v.union(v.literal('global'), v.literal('batch'), v.literal('student'), v.literal('user')),
    targetId: v.optional(v.union(v.id('batches'), v.id('students'), v.id('users'))),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_targetType_targetId', ['targetType', 'targetId'])
    .index('by_senderId', ['senderId'])
    .index('by_createdAt', ['createdAt']),

  fees: defineTable({
    studentId: v.id('students'),
    totalFees: v.number(),
    paidAmount: v.number(),
    dueAmount: v.number(),
    status: v.union(v.literal('paid'), v.literal('partial'), v.literal('due')),
    lastPaymentDate: v.optional(v.number()),
    paymentHistory: v.optional(
      v.array(
        v.object({
          date: v.number(),
          amount: v.number(),
          note: v.optional(v.string()),
        })
      )
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_studentId', ['studentId'])
    .index('by_status', ['status'])
    .index('by_dueAmount', ['dueAmount']),

  grades: defineTable({
    studentId: v.id('students'),
    batchSubjectId: v.id('batchSubjects'),
    teacherId: v.id('teachers'),
    assessmentType: v.string(), // e.g., "Unit Test", "Mid-Term", "Final", "Assignment"
    assessmentName: v.string(), // e.g., "Chapter 1 Quiz"
    score: v.number(),
    maxScore: v.number(),
    percentage: v.number(),
    grade: v.union(
      v.literal('A+'),
      v.literal('A'),
      v.literal('A-'),
      v.literal('B+'),
      v.literal('B'),
      v.literal('B-'),
      v.literal('C+'),
      v.literal('C'),
      v.literal('C-'),
      v.literal('D'),
      v.literal('F')
    ),
    comments: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_student', ['studentId'])
    .index('by_batchSubject', ['batchSubjectId'])
    .index('by_teacher', ['teacherId'])
    .index('by_assessmentType', ['assessmentType']),
})
