import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const markAttendance = mutation({
  args: {
    studentId: v.id('students'),
    batchSubjectId: v.id('batchSubjects'),
    date: v.number(),
    status: v.union(v.literal('present'), v.literal('absent'), v.literal('leave')),
    remark: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    
    // Check if attendance already exists for this student, batch-subject, and date
    const existingAttendance = await ctx.db
      .query('attendance')
      .withIndex('by_student_batchSubject_date', (q) =>
        q.eq('studentId', args.studentId).eq('batchSubjectId', args.batchSubjectId).eq('date', args.date)
      )
      .first()

    if (existingAttendance) {
      // Update existing record
      return await ctx.db.patch(existingAttendance._id, {
        status: args.status,
        remark: args.remark,
        updatedAt: now,
      })
    } else {
      // Create new record
      return await ctx.db.insert('attendance', {
        ...args,
        createdAt: now,
        updatedAt: now,
      })
    }
  },
})

export const markBulkAttendance = mutation({
  args: {
    records: v.array(
      v.object({
        studentId: v.id('students'),
        batchSubjectId: v.id('batchSubjects'),
        date: v.number(),
        status: v.union(v.literal('present'), v.literal('absent'), v.literal('leave')),
        remark: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const results = []

    for (const record of args.records) {
      // Check if attendance already exists
      const existingAttendance = await ctx.db
        .query('attendance')
        .withIndex('by_student_batchSubject_date', (q) =>
          q.eq('studentId', record.studentId).eq('batchSubjectId', record.batchSubjectId).eq('date', record.date)
        )
        .first()

      if (existingAttendance) {
        // Update existing record
        await ctx.db.patch(existingAttendance._id, {
          status: record.status,
          remark: record.remark,
          updatedAt: now,
        })
        results.push(existingAttendance._id)
      } else {
        // Create new record
        const id = await ctx.db.insert('attendance', {
          ...record,
          createdAt: now,
          updatedAt: now,
        })
        results.push(id)
      }
    }

    return results
  },
})

export const getAttendanceByBatchSubject = query({
  args: {
    batchSubjectId: v.id('batchSubjects'),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let attendanceQuery = ctx.db
      .query('attendance')
      .withIndex('by_batchSubject_date', (q) => q.eq('batchSubjectId', args.batchSubjectId))

    if (args.startDate && args.endDate) {
      attendanceQuery = attendanceQuery.filter((q) => 
        q.and(
          q.gte(q.field('date'), args.startDate!),
          q.lte(q.field('date'), args.endDate!)
        )
      )
    }

    const attendance = await attendanceQuery.collect()

    // Fetch related student details
    const attendanceWithStudents = await Promise.all(
      attendance.map(async (record) => {
        const student = await ctx.db.get(record.studentId)
        const user = student ? await ctx.db.get(student.userId) : null
        return {
          ...record,
          student,
          user,
        }
      })
    )

    return attendanceWithStudents
  },
})

export const getAttendanceByDate = query({
  args: {
    batchSubjectId: v.id('batchSubjects'),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query('attendance')
      .withIndex('by_batchSubject_date', (q) => q.eq('batchSubjectId', args.batchSubjectId))
      .filter((q) => q.eq(q.field('date'), args.date))
      .collect()

    // Fetch related student details
    const attendanceWithStudents = await Promise.all(
      attendance.map(async (record) => {
        const student = await ctx.db.get(record.studentId)
        const user = student ? await ctx.db.get(student.userId) : null
        return {
          ...record,
          student,
          user,
        }
      })
    )

    return attendanceWithStudents
  },
})

export const getAttendanceByStudent = query({
  args: {
    studentId: v.id('students'),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let attendanceQuery = ctx.db
      .query('attendance')
      .withIndex('by_student_date', (q) => q.eq('studentId', args.studentId))

    if (args.startDate && args.endDate) {
      attendanceQuery = attendanceQuery.filter((q) => 
        q.and(
          q.gte(q.field('date'), args.startDate!),
          q.lte(q.field('date'), args.endDate!)
        )
      )
    }

    const attendance = await attendanceQuery.collect()

    // Fetch related batch-subject details
    const attendanceWithBatchSubjects = await Promise.all(
      attendance.map(async (record) => {
        const batchSubject = await ctx.db.get(record.batchSubjectId)
        if (batchSubject) {
          const batch = await ctx.db.get(batchSubject.batchId)
          const subject = await ctx.db.get(batchSubject.subjectId)
          const teacher = await ctx.db.get(batchSubject.teacherId)
          const teacherUser = teacher ? await ctx.db.get(teacher.userId) : null
          
          return {
            ...record,
            batchSubject,
            batch,
            subject,
            teacher,
            teacherUser,
          }
        }
        return record
      })
    )

    return attendanceWithBatchSubjects
  },
})

export const getStudentAttendanceStats = query({
  args: {
    studentId: v.id('students'),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let attendanceQuery = ctx.db
      .query('attendance')
      .withIndex('by_student_date', (q) => q.eq('studentId', args.studentId))

    if (args.startDate && args.endDate) {
      attendanceQuery = attendanceQuery.filter((q) => 
        q.and(
          q.gte(q.field('date'), args.startDate!),
          q.lte(q.field('date'), args.endDate!)
        )
      )
    }

    const attendance = await attendanceQuery.collect()

    const totalDays = attendance.length
    const presentDays = attendance.filter(a => a.status === 'present').length
    const absentDays = attendance.filter(a => a.status === 'absent').length
    const leaveDays = attendance.filter(a => a.status === 'leave').length

    return {
      totalDays,
      presentDays,
      absentDays,
      leaveDays,
      percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
    }
  },
})

export const getBatchSubjectAttendanceStats = query({
  args: {
    batchSubjectId: v.id('batchSubjects'),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query('attendance')
      .withIndex('by_batchSubject_date', (q) => q.eq('batchSubjectId', args.batchSubjectId))
      .collect()

    // Group by student
    const studentStats = new Map()
    
    attendance.forEach(record => {
      if (!studentStats.has(record.studentId)) {
        studentStats.set(record.studentId, {
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          leaveDays: 0,
        })
      }
      
      const stats = studentStats.get(record.studentId)
      stats.totalDays++
      
      if (record.status === 'present') stats.presentDays++
      else if (record.status === 'absent') stats.absentDays++
      else if (record.status === 'leave') stats.leaveDays++
    })

    // Fetch student details and calculate percentages
    const statsWithStudents = await Promise.all(
      Array.from(studentStats.entries()).map(async ([studentId, stats]: [any, any]) => {
        const student = await ctx.db.get(studentId as any)
        const user = student ? await ctx.db.get((student as any).userId) : null
        
        return {
          studentId,
          student,
          user,
          ...stats,
          percentage: stats.totalDays > 0 ? Math.round((stats.presentDays / stats.totalDays) * 100) : 0,
        }
      })
    )

    return statsWithStudents
  },
})

export const updateAttendance = mutation({
  args: {
    attendanceId: v.id('attendance'),
    status: v.union(v.literal('present'), v.literal('absent'), v.literal('leave')),
    remark: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.patch(args.attendanceId, {
      status: args.status,
      remark: args.remark,
      updatedAt: now,
    })
  },
})

export const deleteAttendance = mutation({
  args: {
    attendanceId: v.id('attendance'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.attendanceId)
  },
})
