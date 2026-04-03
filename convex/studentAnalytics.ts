import { query } from './_generated/server'
import { v } from 'convex/values'

// Interface for analytics data
interface AttendanceDataPoint {
  date: string
  percentage: number
  present: number
  total: number
}

interface GradeDataPoint {
  assessmentName: string
  grade: string
  percentage: number
  date: number
}

interface SubjectPerformance {
  subjectId: string
  subjectName: string
  averagePercentage: number
  assessmentCount: number
  grades: string[]
}

interface PerformanceSummary {
  overallAverage: number
  attendancePercentage: number
  totalAssessments: number
  subjectsStudied: number
  bestPerformingSubject: string
  lowestPerformingSubject: string
  trend: 'improving' | 'declining' | 'stable'
}

interface StudyRecommendation {
  type: 'strength' | 'weakness' | 'opportunity'
  message: string
  subject?: string
  priority: 'high' | 'medium' | 'low'
}

/**
 * Get student's attendance trend data
 */
export const getAttendanceTrend = query({
  args: { studentId: v.id('students'), days: v.optional(v.number()) },
  handler: async (ctx, { studentId, days = 30 }) => {
    const student = await ctx.db.get(studentId)
    if (!student) return null

    const now = Date.now()
    const daysInMs = (days || 30) * 24 * 60 * 60 * 1000
    const startDate = now - daysInMs

    // Get all attendance records for this student
    const attendanceRecords = await ctx.db
      .query('attendance')
      .filter((q) => q.eq(q.field('studentId'), studentId))
      .collect()

    // Filter records within the date range
    const filteredRecords = attendanceRecords.filter((r) => r.date >= startDate && r.date <= now)

    // Group by date and calculate statistics
    const dateMap = new Map<string, { present: number; total: number }>()

    filteredRecords.forEach((record) => {
      const dateStr = new Date(record.date).toISOString().split('T')[0]
      const existing = dateMap.get(dateStr) || { present: 0, total: 0 }

      existing.total += 1
      if (record.status === 'present') {
        existing.present += 1
      }

      dateMap.set(dateStr, existing)
    })

    // Convert to array and calculate percentages
    const trendData: AttendanceDataPoint[] = Array.from(dateMap.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, { present, total }]) => ({
        date,
        present,
        total,
        percentage: Math.round((present / total) * 100),
      }))

    return trendData
  },
})

/**
 * Get student's grade trend data
 */
export const getGradeTrend = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, { studentId }) => {
    const student = await ctx.db.get(studentId)
    if (!student) return null

    // Get all grades for this student
    const grades = await ctx.db
      .query('grades')
      .filter((q) => q.eq(q.field('studentId'), studentId))
      .collect()

    // Get batch subject info for subject names
    const batchSubjectMap = new Map()
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), student.batchId))
      .collect()

    for (const bs of batchSubjects) {
      const subject = await ctx.db.get(bs.subjectId)
      batchSubjectMap.set(bs._id, subject?.name || 'Unknown')
    }

    // Transform grades to trend data
    const trendData: GradeDataPoint[] = grades
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      .map((g) => ({
        assessmentName: g.assessmentName,
        grade: g.grade,
        percentage: g.percentage,
        date: g.createdAt || 0,
      }))

    return trendData
  },
})

/**
 * Get subject-wise performance breakdown
 */
export const getSubjectPerformance = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, { studentId }) => {
    const student = await ctx.db.get(studentId)
    if (!student) return null

    // Get all grades for this student
    const grades = await ctx.db
      .query('grades')
      .filter((q) => q.eq(q.field('studentId'), studentId))
      .collect()

    // Get batch subjects and their subject info
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), student.batchId))
      .collect()

    // Map subject IDs to names
    const subjectMap = new Map()
    for (const bs of batchSubjects) {
      const subject = await ctx.db.get(bs.subjectId)
      if (subject) {
        subjectMap.set(bs._id, { name: subject.name, id: bs.subjectId })
      }
    }

    // Group grades by batch subject
    const subjectPerformance = new Map<
      string,
      { name: string; percentages: number[]; grades: string[] }
    >()

    grades.forEach((g: any) => {
      const subjectInfo = subjectMap.get(g.batchSubjectId)
      if (subjectInfo) {
        const key = subjectInfo.name
        const existing = subjectPerformance.get(key) || { name: key, percentages: [] as number[], grades: [] as string[] }

        existing.percentages.push(g.percentage)
        existing.grades.push(g.grade)

        subjectPerformance.set(key, existing)
      }
    })

    // Calculate averages and format response
    const result: SubjectPerformance[] = Array.from(subjectPerformance.entries()).map(
      ([_, data]) => ({
        subjectId: _,
        subjectName: data.name,
        averagePercentage: Math.round(
          data.percentages.reduce((a, b) => a + b, 0) / data.percentages.length
        ),
        assessmentCount: data.percentages.length,
        grades: [...new Set(data.grades)].sort(),
      })
    )

    return result.sort((a, b) => b.averagePercentage - a.averagePercentage)
  },
})

/**
 * Get overall performance summary
 */
export const getPerformanceSummary = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, { studentId }) => {
    const student = await ctx.db.get(studentId)
    if (!student) return null

    // Get attendance data
    const attendanceRecords = await ctx.db
      .query('attendance')
      .filter((q) => q.eq(q.field('studentId'), studentId))
      .collect()

    const attendancePercentage =
      attendanceRecords.length > 0
        ? Math.round(
            (attendanceRecords.filter((r) => r.status === 'present').length /
              attendanceRecords.length) *
              100
          )
        : 0

    // Get grades data
    const grades = await ctx.db
      .query('grades')
      .filter((q) => q.eq(q.field('studentId'), studentId))
      .collect()

    const overallAverage =
      grades.length > 0 ? Math.round(grades.reduce((a, b) => a + b.percentage, 0) / grades.length) : 0

    // Get subject-wise data
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), student.batchId))
      .collect()

    const subjectPerformanceMap = new Map<string, number[]>()

    grades.forEach((g) => {
      const key = g.batchSubjectId
      const existing = subjectPerformanceMap.get(key) || []
      existing.push(g.percentage)
      subjectPerformanceMap.set(key, existing)
    })

    // Find best and worst subjects
    let bestSubject = 'N/A'
    let lowestSubject = 'N/A'
    let bestAvg = 0
    let lowestAvg = 100

    for (const [bsId, percentages] of subjectPerformanceMap.entries()) {
      const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length

      if (avg > bestAvg) {
        bestAvg = avg
        const bs = batchSubjects.find((x) => x._id === bsId)
        if (bs) {
          const subject = await ctx.db.get(bs.subjectId)
          bestSubject = subject?.name || 'Unknown'
        }
      }

      if (avg < lowestAvg) {
        lowestAvg = avg
        const bs = batchSubjects.find((x) => x._id === bsId)
        if (bs) {
          const subject = await ctx.db.get(bs.subjectId)
          lowestSubject = subject?.name || 'Unknown'
        }
      }
    }

    // Determine trend (improving, declining, stable)
    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    if (grades.length > 3) {
      const recentGrades = grades.slice(-5)
      const olderGrades = grades.slice(-10, -5)

      if (recentGrades.length > 0 && olderGrades.length > 0) {
        const recentAvg =
          recentGrades.reduce((a, b) => a + b.percentage, 0) / recentGrades.length
        const olderAvg = olderGrades.reduce((a, b) => a + b.percentage, 0) / olderGrades.length

        if (recentAvg > olderAvg + 5) {
          trend = 'improving'
        } else if (recentAvg < olderAvg - 5) {
          trend = 'declining'
        }
      }
    }

    const summary: PerformanceSummary = {
      overallAverage,
      attendancePercentage,
      totalAssessments: grades.length,
      subjectsStudied: batchSubjects.length,
      bestPerformingSubject: bestSubject,
      lowestPerformingSubject: lowestSubject,
      trend,
    }

    return summary
  },
})

/**
 * Get study recommendations based on performance
 */
export const getStudyRecommendations = query({
  args: { studentId: v.id('students') },
  handler: async (ctx, { studentId }) => {
    const student = await ctx.db.get(studentId)
    if (!student) return null

    const recommendations: StudyRecommendation[] = []

    // Get performance summary
    const attendance = await ctx.db
      .query('attendance')
      .filter((q) => q.eq(q.field('studentId'), studentId))
      .collect()

    const grades = await ctx.db
      .query('grades')
      .filter((q) => q.eq(q.field('studentId'), studentId))
      .collect()

    const attendancePercentage =
      attendance.length > 0
        ? (attendance.filter((r) => r.status === 'present').length / attendance.length) * 100
        : 0

    const overallAverage = grades.length > 0 ? grades.reduce((a, b) => a + b.percentage, 0) / grades.length : 0

    // Get subject performance
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), student.batchId))
      .collect()

    const subjectPerformanceMap = new Map<string, { name: string; avg: number }>()

    for (const bs of batchSubjects) {
      const subject = await ctx.db.get(bs.subjectId)
      const subjectGrades = grades.filter((g) => g.batchSubjectId === bs._id)

      if (subjectGrades.length > 0) {
        const avg = subjectGrades.reduce((a, b) => a + b.percentage, 0) / subjectGrades.length
        subjectPerformanceMap.set(bs._id, {
          name: subject?.name || 'Unknown',
          avg,
        })
      }
    }

    // Generate recommendations
    if (attendancePercentage > 90) {
      recommendations.push({
        type: 'strength',
        message: 'Great attendance! Keep maintaining regular classes.',
        priority: 'low',
      })
    } else if (attendancePercentage < 75) {
      recommendations.push({
        type: 'weakness',
        message: `Your attendance is ${Math.round(attendancePercentage)}%. Try to attend more classes regularly.`,
        priority: 'high',
      })
    }

    if (overallAverage > 85) {
      recommendations.push({
        type: 'strength',
        message: 'Excellent overall performance! Continue your current study approach.',
        priority: 'low',
      })
    } else if (overallAverage < 60) {
      recommendations.push({
        type: 'weakness',
        message: 'Your overall average is below 60%. Consider seeking additional help.',
        priority: 'high',
      })
    }

    // Subject-specific recommendations
    for (const [_, { name, avg }] of subjectPerformanceMap.entries()) {
      if (avg > 85) {
        recommendations.push({
          type: 'strength',
          subject: name,
          message: `Strong performance in ${name}!`,
          priority: 'low',
        })
      } else if (avg < 60) {
        recommendations.push({
          type: 'weakness',
          subject: name,
          message: `${name} needs more attention (${Math.round(avg)}%). Consider extra practice.`,
          priority: 'high',
        })
      } else if (avg < 75) {
        recommendations.push({
          type: 'opportunity',
          subject: name,
          message: `${name} can be improved with focused study.`,
          priority: 'medium',
        })
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  },
})
