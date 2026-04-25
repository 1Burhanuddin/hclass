import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

/**
 * Get assignments for a specific batch-subject
 */
export const getAssignmentsByBatchSubject = query({
  args: { batchSubjectId: v.id('batchSubjects') },
  async handler(ctx, args) {
    const assignments = await ctx.db
      .query('assignments')
      .withIndex('by_batchSubject', (q) =>
        q.eq('batchSubjectId', args.batchSubjectId)
      )
      .order('desc')
      .collect()

    // Enrich with teacher details
    const enriched = await Promise.all(
      assignments.map(async (assignment) => {
        const teacher = await ctx.db.get(assignment.teacherId)
        const batchSubject = await ctx.db.get(assignment.batchSubjectId)
        return {
          ...assignment,
          teacher,
          batchSubject,
        }
      })
    )

    return enriched
  },
})

/**
 * Get all assignments for a student based on their enrolled batches
 */
export const getStudentAssignments = query({
  args: { studentId: v.id('students') },
  async handler(ctx, args) {
    const student = await ctx.db.get(args.studentId)
    if (!student) return []

    // Get all batch-subjects for the student's batch
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), student.batchId))
      .collect()

    // Get assignments for each batch-subject
    const assignments: any[] = []
    for (const bs of batchSubjects) {
      const bsAssignments = await ctx.db
        .query('assignments')
        .withIndex('by_batchSubject', (q) => q.eq('batchSubjectId', bs._id))
        .collect()

      for (const assignment of bsAssignments) {
        const teacher = await ctx.db.get(assignment.teacherId)
        const subject = await ctx.db.get(bs.subjectId)
        const batch = await ctx.db.get(bs.batchId)

        assignments.push({
          ...assignment,
          teacher,
          batchSubject: bs,
          subject,
          batch,
        })
      }
    }

    return assignments.sort((a, b) => b.dueDate - a.dueDate)
  },
})

/**
 * Get all assignments created by a teacher
 */
export const getTeacherAssignments = query({
  args: { teacherId: v.id('teachers') },
  async handler(ctx, args) {
    const assignments = await ctx.db
      .query('assignments')
      .withIndex('by_teacher', (q) => q.eq('teacherId', args.teacherId))
      .order('desc')
      .collect()

    // Enrich with batch-subject details
    const enriched = await Promise.all(
      assignments.map(async (assignment) => {
        const batchSubject = await ctx.db.get(assignment.batchSubjectId)
        const batch = batchSubject
          ? await ctx.db.get(batchSubject.batchId)
          : null
        const subject = batchSubject
          ? await ctx.db.get(batchSubject.subjectId)
          : null

        return {
          ...assignment,
          batchSubject,
          batch,
          subject,
        }
      })
    )

    return enriched
  },
})

/**
 * Get all assignments (for admins to see all assignments across teachers)
 */
export const getAllAssignments = query({
  async handler(ctx) {
    const assignments = await ctx.db
      .query('assignments')
      .order('desc')
      .collect()

    // Enrich with batch-subject details
    const enriched = await Promise.all(
      assignments.map(async (assignment) => {
        const teacher = await ctx.db.get(assignment.teacherId)
        const batchSubject = await ctx.db.get(assignment.batchSubjectId)
        const batch = batchSubject
          ? await ctx.db.get(batchSubject.batchId)
          : null
        const subject = batchSubject
          ? await ctx.db.get(batchSubject.subjectId)
          : null

        return {
          ...assignment,
          teacher,
          batchSubject,
          batch,
          subject,
        }
      })
    )

    return enriched
  },
})

/**
 * Get single assignment by ID
 */
export const getAssignmentById = query({
  args: { assignmentId: v.id('assignments') },
  async handler(ctx, args) {
    const assignment = await ctx.db.get(args.assignmentId)
    if (!assignment) return null

    const teacher = await ctx.db.get(assignment.teacherId)
    const batchSubject = await ctx.db.get(assignment.batchSubjectId)
    const batch = batchSubject
      ? await ctx.db.get(batchSubject.batchId)
      : null
    const subject = batchSubject
      ? await ctx.db.get(batchSubject.subjectId)
      : null

    return {
      ...assignment,
      teacher,
      batchSubject,
      batch,
      subject,
    }
  },
})

/**
 * Get upcoming assignments for a student (due within N days)
 */
export const getUpcomingAssignments = query({
  args: {
    studentId: v.id('students'),
    daysAhead: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const student = await ctx.db.get(args.studentId)
    if (!student) return []

    const daysAhead = args.daysAhead ?? 7
    const now = Date.now()
    const futureDate = now + daysAhead * 24 * 60 * 60 * 1000

    // Get all batch-subjects for the student's batch
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), student.batchId))
      .collect()

    // Get assignments due within the timeframe
    const assignments: any[] = []
    for (const bs of batchSubjects) {
      const bsAssignments = await ctx.db
        .query('assignments')
        .withIndex('by_batchSubject', (q) => q.eq('batchSubjectId', bs._id))
        .filter((q) => q.and(q.gte(q.field('dueDate'), now), q.lte(q.field('dueDate'), futureDate)))
        .collect()

      for (const assignment of bsAssignments) {
        const teacher = await ctx.db.get(assignment.teacherId)
        const subject = await ctx.db.get(bs.subjectId)

        assignments.push({
          ...assignment,
          teacher,
          subject,
          batchSubject: bs,
        })
      }
    }

    return assignments.sort((a, b) => a.dueDate - b.dueDate)
  },
})

/**
 * Create a new assignment
 */
export const createAssignment = mutation({
  args: {
    batchSubjectId: v.id('batchSubjects'),
    teacherId: v.id('teachers'),
    title: v.string(),
    description: v.string(),
    dueDate: v.optional(v.number()),
    attachmentUrl: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Validate batch-subject exists
    const batchSubject = await ctx.db.get(args.batchSubjectId)
    if (!batchSubject) {
      throw new Error('Batch-Subject not found')
    }

    // Validate teacher exists and owns this batch-subject
    const teacher = await ctx.db.get(args.teacherId)
    if (!teacher) {
      throw new Error('Teacher not found')
    }

    if (batchSubject.teacherId.toString() !== args.teacherId.toString()) {
      throw new Error('Teacher does not teach this batch-subject')
    }

    // Validate title and description
    if (!args.title?.trim()) {
      throw new Error('Title is required')
    }
    if (!args.description?.trim()) {
      throw new Error('Description is required')
    }

    const assignmentId = await ctx.db.insert('assignments', {
      batchSubjectId: args.batchSubjectId,
      teacherId: args.teacherId,
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      attachmentUrl: args.attachmentUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return assignmentId
  },
})

/**
 * Update an existing assignment
 */
export const updateAssignment = mutation({
  args: {
    assignmentId: v.id('assignments'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    attachmentUrl: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const assignment = await ctx.db.get(args.assignmentId)
    if (!assignment) {
      throw new Error('Assignment not found')
    }

    const updateData: Partial<Doc<'assignments'>> = {
      updatedAt: Date.now(),
    }

    if (args.title !== undefined) {
      if (!args.title.trim()) throw new Error('Title cannot be empty')
      updateData.title = args.title
    }

    if (args.description !== undefined) {
      if (!args.description.trim()) throw new Error('Description cannot be empty')
      updateData.description = args.description
    }

    if (args.dueDate !== undefined) {
      if (args.dueDate <= Date.now()) throw new Error('Due date must be in the future')
      updateData.dueDate = args.dueDate
    }

    if (args.attachmentUrl !== undefined) {
      updateData.attachmentUrl = args.attachmentUrl
    }

    await ctx.db.patch(args.assignmentId, updateData)
    return args.assignmentId
  },
})

/**
 * Delete an assignment
 */
export const deleteAssignment = mutation({
  args: { assignmentId: v.id('assignments') },
  async handler(ctx, args) {
    const assignment = await ctx.db.get(args.assignmentId)
    if (!assignment) {
      throw new Error('Assignment not found')
    }

    await ctx.db.delete(args.assignmentId)
    return { success: true }
  },
})
