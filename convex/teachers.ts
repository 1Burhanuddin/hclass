import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Get all teachers
export const getAllTeachers = query({
  handler: async (ctx) => {
    return await ctx.db.query('teachers').collect()
  },
})

// Get teacher by ID
export const getTeacherById = query({
  args: { teacherId: v.id('teachers') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.teacherId)
  },
})

// Get teacher by user ID
export const getTeacherByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('teachers')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()
  },
})

// Get teacher by Clerk ID (combines user lookup + teacher lookup)
export const getTeacherByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Find user by clerk ID
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()

    if (!user) return null

    // Find teacher by user ID
    const teacher = await ctx.db
      .query('teachers')
      .filter((q) => q.eq(q.field('userId'), user._id))
      .first()

    return teacher
  },
})

// Get teacher details with expanded info
export const getTeacherDetails = query({
  args: { teacherId: v.id('teachers') },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.teacherId)
    if (!teacher) {
      return null
    }

    const user = await ctx.db.get(teacher.userId)
    const primarySubject = teacher.primarySubjectId
      ? await ctx.db.get(teacher.primarySubjectId)
      : null

    return {
      ...teacher,
      user,
      primarySubject,
    }
  },
})

// Create teacher with optional subject assignment
export const createTeacher = mutation({
  args: {
    userId: v.id('users'),
    qualification: v.string(),
    primarySubjectId: v.optional(v.id('subjects')),
  },
  handler: async (ctx, args) => {
    // Verify user exists and is a teacher
    const user = await ctx.db.get(args.userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.role !== 'teacher') {
      throw new Error('User is not a teacher')
    }

    // Check if teacher record already exists
    const existing = await ctx.db
      .query('teachers')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first()

    if (existing) {
      throw new Error('Teacher record already exists for this user')
    }

    // Verify subject exists if provided
    if (args.primarySubjectId) {
      const subject = await ctx.db.get(args.primarySubjectId)
      if (!subject) {
        throw new Error('Subject not found')
      }
    }

    const teacherId = await ctx.db.insert('teachers', {
      userId: args.userId,
      qualification: args.qualification,
      joinDate: Date.now(),
      primarySubjectId: args.primarySubjectId,
    })

    return { success: true, teacherId }
  },
})

// Update teacher info including subject
export const updateTeacher = mutation({
  args: {
    teacherId: v.id('teachers'),
    qualification: v.optional(v.string()),
    primarySubjectId: v.optional(v.id('subjects')),
  },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.teacherId)
    if (!teacher) {
      throw new Error('Teacher not found')
    }

    // Verify subject exists if provided
    if (args.primarySubjectId) {
      const subject = await ctx.db.get(args.primarySubjectId)
      if (!subject) {
        throw new Error('Subject not found')
      }
    }

    const updates: any = {}
    if (args.qualification !== undefined) {
      updates.qualification = args.qualification
    }
    if (args.primarySubjectId !== undefined) {
      updates.primarySubjectId = args.primarySubjectId
    }

    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update')
    }

    await ctx.db.patch(args.teacherId, updates)
    return { success: true }
  },
})

// Get all teachers with their primary subjects
export const getTeachersWithSubjects = query({
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect()

    return Promise.all(
      teachers.map(async (teacher) => {
        const user = await ctx.db.get(teacher.userId)
        const primarySubject = teacher.primarySubjectId
          ? await ctx.db.get(teacher.primarySubjectId)
          : null

        return {
          ...teacher,
          user,
          primarySubject,
        }
      })
    )
  },
})

// Get teachers assigned to a specific subject
export const getTeachersBySubject = query({
  args: { subjectId: v.id('subjects') },
  handler: async (ctx, args) => {
    const teachers = await ctx.db
      .query('teachers')
      .filter((q) => q.eq(q.field('primarySubjectId'), args.subjectId))
      .collect()

    return Promise.all(
      teachers.map(async (teacher) => {
        const user = await ctx.db.get(teacher.userId)
        return {
          ...teacher,
          user,
        }
      })
    )
  },
})

// Migration: Backfill teachers without a primary subject
// This can be called via the admin UI or dashboard to assign default/suggested subjects
export const migrateMissingPrimarySubjects = mutation({
  args: {
    subjectIdMap: v.optional(v.object({
      // Map of teacher IDs to subject IDs for specific assignments
      // e.g., { "teacher_id_1": "subject_id_1" }
    })),
    defaultSubjectId: v.optional(v.id('subjects')),
  },
  handler: async (ctx, args) => {
    // Get all teachers who don't have a primary subject assigned
    const teachers = await ctx.db.query('teachers').collect()
    const teachersWithoutSubject = teachers.filter(t => !t.primarySubjectId)
    
    const updateResults = {
      total: teachersWithoutSubject.length,
      updated: 0,
      errors: 0,
    }
    
    // Only proceed if we have a default subject or specific mappings
    if (!args.defaultSubjectId && !args.subjectIdMap) {
      return { ...updateResults, message: 'No subject assignments provided' }
    }
    
    for (const teacher of teachersWithoutSubject) {
      try {
        let subjectId: string | undefined = args.defaultSubjectId
        
        // Check if there's a specific subject assignment for this teacher
        if (args.subjectIdMap && teacher._id in args.subjectIdMap) {
          subjectId = (args.subjectIdMap as any)[teacher._id]
        }
        
        // Only update if we have a subject to assign
        if (subjectId) {
          await ctx.db.patch(teacher._id, {
            primarySubjectId: subjectId as any,
          })
          
          updateResults.updated++
        }
      } catch (err) {
        updateResults.errors++
      }
    }
    
    return updateResults
  },
})

// Alternative migration: Get teachers without subjects for UI-based assignment
export const getTeachersWithoutSubjects = query({
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect()
    const teachersWithoutSubject = teachers.filter(t => !t.primarySubjectId)
    
    // Fetch user details for each teacher
    const teachersWithUsers = await Promise.all(
      teachersWithoutSubject.map(async (teacher) => {
        const user = await ctx.db.get(teacher.userId)
        return {
          ...teacher,
          user,
        }
      })
    )
    
    return teachersWithUsers
  },
})
