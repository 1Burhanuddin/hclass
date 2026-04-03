import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createGrade = mutation({
  args: {
    studentId: v.id('students'),
    batchSubjectId: v.id('batchSubjects'),
    teacherId: v.id('teachers'),
    assessmentType: v.string(),
    assessmentName: v.string(),
    score: v.number(),
    maxScore: v.number(),
    comments: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const { studentId, batchSubjectId, teacherId, assessmentType, assessmentName, score, maxScore, comments } = args

    // Validate score
    if (score < 0 || score > maxScore) {
      throw new Error('Score must be between 0 and maxScore')
    }

    // Calculate percentage and grade
    const percentage = Math.round((score / maxScore) * 100)
    const grade = calculateGrade(percentage)

    const gradeId = await ctx.db.insert('grades', {
      studentId,
      batchSubjectId,
      teacherId,
      assessmentType,
      assessmentName,
      score,
      maxScore,
      percentage,
      grade,
      comments,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return {
      _id: gradeId,
      studentId,
      batchSubjectId,
      teacherId,
      assessmentType,
      assessmentName,
      score,
      maxScore,
      percentage,
      grade,
      comments,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  },
})

export const updateGrade = mutation({
  args: {
    gradeId: v.id('grades'),
    score: v.number(),
    maxScore: v.number(),
    comments: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const { gradeId, score, maxScore, comments } = args

    // Validate score
    if (score < 0 || score > maxScore) {
      throw new Error('Score must be between 0 and maxScore')
    }

    // Calculate percentage and grade
    const percentage = Math.round((score / maxScore) * 100)
    const grade = calculateGrade(percentage)

    await ctx.db.patch(gradeId, {
      score,
      maxScore,
      percentage,
      grade,
      comments,
      updatedAt: Date.now(),
    })

    const updated = await ctx.db.get(gradeId)
    return updated
  },
})

export const deleteGrade = mutation({
  args: {
    gradeId: v.id('grades'),
  },
  async handler(ctx, args) {
    await ctx.db.delete(args.gradeId)
    return { success: true }
  },
})

export const getStudentGrades = query({
  args: {
    studentId: v.id('students'),
  },
  async handler(ctx, args) {
    const grades = await ctx.db
      .query('grades')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .collect()

    // Enrich with student, batch, subject, and teacher info
    const enrichedGrades = await Promise.all(
      grades.map(async (grade) => {
        const student = await ctx.db.get(grade.studentId)
        const batchSubject = await ctx.db.get(grade.batchSubjectId)
        const teacher = await ctx.db.get(grade.teacherId)
        const user = student ? await ctx.db.get(student.userId) : null
        const teacherUser = teacher ? await ctx.db.get(teacher.userId) : null
        const subject = batchSubject ? await ctx.db.get(batchSubject.subjectId) : null

        return {
          ...grade,
          studentName: user?.name || 'Unknown',
          subjectName: subject?.name || 'Unknown',
          teacherName: teacherUser?.name || 'Unknown',
        }
      })
    )

    return enrichedGrades
  },
})

export const getGradesByBatchSubject = query({
  args: {
    batchSubjectId: v.id('batchSubjects'),
  },
  async handler(ctx, args) {
    const grades = await ctx.db
      .query('grades')
      .withIndex('by_batchSubject', (q) => q.eq('batchSubjectId', args.batchSubjectId))
      .collect()

    // Enrich with student info
    const enrichedGrades = await Promise.all(
      grades.map(async (grade) => {
        const student = await ctx.db.get(grade.studentId)
        const user = student ? await ctx.db.get(student.userId) : null

        return {
          ...grade,
          studentName: user?.name || 'Unknown',
        }
      })
    )

    return enrichedGrades
  },
})

export const getGradesByTeacher = query({
  args: {
    teacherId: v.id('teachers'),
  },
  async handler(ctx, args) {
    const grades = await ctx.db
      .query('grades')
      .withIndex('by_teacher', (q) => q.eq('teacherId', args.teacherId))
      .collect()

    // Enrich with student and subject info
    const enrichedGrades = await Promise.all(
      grades.map(async (grade) => {
        const student = await ctx.db.get(grade.studentId)
        const user = student ? await ctx.db.get(student.userId) : null
        const batchSubject = await ctx.db.get(grade.batchSubjectId)
        const subject = batchSubject ? await ctx.db.get(batchSubject.subjectId) : null

        return {
          ...grade,
          studentName: user?.name || 'Unknown',
          subjectName: subject?.name || 'Unknown',
        }
      })
    )

    return enrichedGrades
  },
})

export const getAllGrades = query({
  args: {},
  async handler(ctx) {
    const grades = await ctx.db.query('grades').collect()

    // Enrich with all related info
    const enrichedGrades = await Promise.all(
      grades.map(async (grade) => {
        const student = await ctx.db.get(grade.studentId)
        const user = student ? await ctx.db.get(student.userId) : null
        const batchSubject = await ctx.db.get(grade.batchSubjectId)
        const subject = batchSubject ? await ctx.db.get(batchSubject.subjectId) : null
        const teacher = await ctx.db.get(grade.teacherId)
        const teacherUser = teacher ? await ctx.db.get(teacher.userId) : null

        return {
          ...grade,
          studentName: user?.name || 'Unknown',
          subjectName: subject?.name || 'Unknown',
          teacherName: teacherUser?.name || 'Unknown',
        }
      })
    )

    return enrichedGrades
  },
})

// Helper function to calculate grade based on percentage
function calculateGrade(percentage: number): 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F' {
  if (percentage >= 95) return 'A+'
  if (percentage >= 90) return 'A'
  if (percentage >= 85) return 'A-'
  if (percentage >= 80) return 'B+'
  if (percentage >= 75) return 'B'
  if (percentage >= 70) return 'B-'
  if (percentage >= 65) return 'C+'
  if (percentage >= 60) return 'C'
  if (percentage >= 55) return 'C-'
  if (percentage >= 50) return 'D'
  return 'F'
}
