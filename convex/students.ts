import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getStudentsByBatch = query({
  args: { batchId: v.id('batches') },
  handler: async (ctx, args) => {
    const students = await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('batchId'), args.batchId))
      .collect()

    // Fetch user details for each student
    const studentsWithUsers = await Promise.all(
      students.map(async (student) => {
        const user = await ctx.db.get(student.userId)
        return {
          ...student,
          user,
        }
      })
    )

    return studentsWithUsers
  },
})

export const getStudentById = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId)
    if (!student) return null

    const user = await ctx.db.get(student.userId)
    return {
      ...student,
      user,
    }
  },
})

export const getAllStudents = query({
  handler: async (ctx) => {
    const students = await ctx.db.query('students').collect()

    // Fetch user details and batch details for each student
    const studentsWithDetails = await Promise.all(
      students.map(async (student) => {
        const user = await ctx.db.get(student.userId)
        const batch = await ctx.db.get(student.batchId)
        return {
          ...student,
          user,
          batch,
        }
      })
    )

    return studentsWithDetails
  },
})

export const getStudentByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()

    if (!student) return null

    const user = await ctx.db.get(student.userId)
    const batch = await ctx.db.get(student.batchId)

    return {
      ...student,
      user,
      batch,
    }
  },
})

export const getStudentByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Find user by clerk ID
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()

    if (!user) return null

    // Find student by user ID
    const student = await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('userId'), user._id))
      .first()

    if (!student) return null

    const batch = await ctx.db.get(student.batchId)
    return {
      ...student,
      user,
      batch,
    }
  },
})

export const createStudent = mutation({
  args: {
    userId: v.id('users'),
    batchId: v.id('batches'),
    enrollmentNumber: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user exists and is a student
    const user = await ctx.db.get(args.userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.role !== 'student') {
      throw new Error('User is not a student')
    }

    // Verify batch exists
    const batch = await ctx.db.get(args.batchId)
    if (!batch) {
      throw new Error('Batch not found')
    }

    // Check if enrollment number already exists
    const existingEnrollment = await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('enrollmentNumber'), args.enrollmentNumber))
      .first()

    if (existingEnrollment) {
      throw new Error('Enrollment number already exists')
    }

    // Check if user is already enrolled in this specific batch
    const existingStudentInBatch = await ctx.db
      .query('students')
      .filter((q) => 
        q.and(
          q.eq(q.field('userId'), args.userId),
          q.eq(q.field('batchId'), args.batchId)
        )
      )
      .first()

    if (existingStudentInBatch) {
      throw new Error('User is already enrolled in this batch')
    }

    const studentId = await ctx.db.insert('students', {
      userId: args.userId,
      batchId: args.batchId,
      enrollmentNumber: args.enrollmentNumber,
      joinDate: Date.now(),
    })

    return { success: true, studentId }
  },
})

export const updateStudentBatch = mutation({
  args: {
    studentId: v.id('students'),
    batchId: v.id('batches'),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId)
    if (!student) {
      throw new Error('Student not found')
    }

    // Verify batch exists
    const batch = await ctx.db.get(args.batchId)
    if (!batch) {
      throw new Error('Batch not found')
    }

    await ctx.db.patch(args.studentId, {
      batchId: args.batchId,
    })

    return { success: true }
  },
})

export const deleteStudent = mutation({
  args: {
    studentId: v.id('students'),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId)
    if (!student) {
      throw new Error('Student not found')
    }

    // Check if student has any attendance records
    const attendance = await ctx.db
      .query('attendance')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .collect()

    if (attendance.length > 0) {
      throw new Error(
        `Cannot delete student with ${attendance.length} attendance records. Archive the data first.`
      )
    }

    // Check if student has any fee records
    const fees = await ctx.db
      .query('fees')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .collect()

    if (fees.length > 0) {
      throw new Error(
        `Cannot delete student with ${fees.length} fee records. Archive the data first.`
      )
    }

    await ctx.db.delete(args.studentId)
    return { success: true }
  },
})
