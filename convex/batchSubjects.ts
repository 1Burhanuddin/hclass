import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Get all batch-subject mappings
export const getAllBatchSubjects = query({
  handler: async (ctx) => {
    return await ctx.db.query('batchSubjects').collect()
  },
})

// Get by batch ID
export const getBatchSubjectsByBatchId = query({
  args: { batchId: v.id('batches') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), args.batchId))
      .collect()
  },
})

// Get by batch ID with details
export const getBatchSubjectsByBatchIdWithDetails = query({
  args: { batchId: v.id('batches') },
  handler: async (ctx, args) => {
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), args.batchId))
      .collect()

    const enriched = await Promise.all(
      batchSubjects.map(async (bs) => {
        const batch = await ctx.db.get(bs.batchId)
        const subject = await ctx.db.get(bs.subjectId)
        return {
          ...bs,
          batch,
          subject,
        }
      })
    )

    return enriched
  },
})

// Get by subject ID
export const getBatchSubjectsBySubjectId = query({
  args: { subjectId: v.id('subjects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('subjectId'), args.subjectId))
      .collect()
  },
})

// Get by teacher ID
export const getBatchSubjectsByTeacherId = query({
  args: { teacherId: v.id('teachers') },
  handler: async (ctx, args) => {
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('teacherId'), args.teacherId))
      .collect()

    // Enrich with batch and subject details
    const enriched = await Promise.all(
      batchSubjects.map(async (bs) => {
        const batch = await ctx.db.get(bs.batchId)
        const subject = await ctx.db.get(bs.subjectId)
        return {
          ...bs,
          batch,
          subject,
        }
      })
    )

    return enriched
  },
})

// Create batch-subject mapping with teacher
export const createBatchSubject = mutation({
  args: {
    batchId: v.id('batches'),
    subjectId: v.id('subjects'),
    teacherId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify batch exists
    const batch = await ctx.db.get(args.batchId)
    if (!batch) {
      throw new Error('Batch not found')
    }

    // Verify subject exists
    const subject = await ctx.db.get(args.subjectId)
    if (!subject) {
      throw new Error('Subject not found')
    }

    // Verify user exists and is a teacher
    const user = await ctx.db.get(args.teacherId)
    if (!user) {
      throw new Error('Teacher not found')
    }

    if (user.role !== 'teacher') {
      throw new Error('User is not a teacher')
    }

    // Get or create teacher record for this user
    let teacherRecord = await ctx.db
      .query('teachers')
      .filter((q) => q.eq(q.field('userId'), args.teacherId))
      .first()

    let teacherId: any
    if (!teacherRecord) {
      // Create teacher record if it doesn't exist
      teacherId = await ctx.db.insert('teachers', {
        userId: args.teacherId,
        qualification: 'Not specified',
        joinDate: Date.now(),
      })
    } else {
      teacherId = teacherRecord._id
    }

    // Check if mapping already exists
    const existing = await ctx.db
      .query('batchSubjects')
      .filter(
        (q) =>
          q.and(
            q.eq(q.field('batchId'), args.batchId),
            q.eq(q.field('subjectId'), args.subjectId)
          )
      )
      .collect()

    if (existing.length > 0) {
      throw new Error('Subject already mapped to this batch')
    }

    const mappingId = await ctx.db.insert('batchSubjects', {
      batchId: args.batchId,
      subjectId: args.subjectId,
      teacherId: teacherId,
      createdAt: Date.now(),
    })

    return { success: true, mappingId }
  },
})

// Update teacher for a batch-subject mapping
export const updateBatchSubjectTeacher = mutation({
  args: {
    mappingId: v.id('batchSubjects'),
    teacherId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const mapping = await ctx.db.get(args.mappingId)
    if (!mapping) {
      throw new Error('Mapping not found')
    }

    // Verify user exists and is a teacher
    const user = await ctx.db.get(args.teacherId)
    if (!user) {
      throw new Error('Teacher not found')
    }

    if (user.role !== 'teacher') {
      throw new Error('User is not a teacher')
    }

    // Get or create teacher record for this user
    let teacherRecord = await ctx.db
      .query('teachers')
      .filter((q) => q.eq(q.field('userId'), args.teacherId))
      .first()

    let teacherId: any
    if (!teacherRecord) {
      // Create teacher record if it doesn't exist
      teacherId = await ctx.db.insert('teachers', {
        userId: args.teacherId,
        qualification: 'Not specified',
        joinDate: Date.now(),
      })
    } else {
      teacherId = teacherRecord._id
    }

    await ctx.db.patch(args.mappingId, {
      teacherId: teacherId,
    })

    return { success: true }
  },
})

// Delete batch-subject mapping
export const deleteBatchSubject = mutation({
  args: {
    mappingId: v.id('batchSubjects'),
  },
  handler: async (ctx, args) => {
    const mapping = await ctx.db.get(args.mappingId)
    if (!mapping) {
      throw new Error('Mapping not found')
    }

    // Check if there are any attendance records for this mapping
    const attendance = await ctx.db
      .query('attendance')
      .filter((q) => q.eq(q.field('batchSubjectId'), args.mappingId))
      .collect()

    if (attendance.length > 0) {
      throw new Error(
        `Cannot delete mapping with ${attendance.length} attendance records. Archive the data first.`
      )
    }

    // Check if there are any assignment records for this mapping
    const assignments = await ctx.db
      .query('assignments')
      .filter((q) => q.eq(q.field('batchSubjectId'), args.mappingId))
      .collect()

    if (assignments.length > 0) {
      throw new Error(
        `Cannot delete mapping with ${assignments.length} assignments. Archive the data first.`
      )
    }

    await ctx.db.delete(args.mappingId)
    return { success: true }
  },
})

// Update teacher's primary subject
export const updateTeacherPrimarySubject = mutation({
  args: {
    teacherId: v.id('teachers'),
    subjectId: v.optional(v.id('subjects')),
  },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.teacherId)
    if (!teacher) {
      throw new Error('Teacher not found')
    }

    if (args.subjectId) {
      const subject = await ctx.db.get(args.subjectId)
      if (!subject) {
        throw new Error('Subject not found')
      }
    }

    await ctx.db.patch(args.teacherId, {
      primarySubjectId: args.subjectId,
    })

    return { success: true }
  },
})

// Get all batch-subject mappings with expanded details
export const getAllBatchSubjectsWithDetails = query({
  handler: async (ctx) => {
    const batchSubjects = await ctx.db.query('batchSubjects').collect()

    // Fetch related details for each batch-subject
    const batchSubjectsWithDetails = await Promise.all(
      batchSubjects.map(async (batchSubject) => {
        const batch = await ctx.db.get(batchSubject.batchId)
        const subject = await ctx.db.get(batchSubject.subjectId)
        const teacher = await ctx.db.get(batchSubject.teacherId)
        const teacherUser = teacher ? await ctx.db.get(teacher.userId) : null

        return {
          ...batchSubject,
          batch,
          subject,
          teacher,
          teacherUser,
        }
      })
    )

    return batchSubjectsWithDetails
  },
})
