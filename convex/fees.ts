import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

/**
 * Get fees record by ID
 */
export const getFeesById = query({
  args: { feesId: v.id('fees') },
  async handler(ctx, args) {
    return await ctx.db.get(args.feesId)
  },
})

/**
 * Get fees for a specific student
 */
export const getStudentFees = query({
  args: { studentId: v.id('students') },
  async handler(ctx, args) {
    const fees = await ctx.db
      .query('fees')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .first()

    if (!fees) return null

    // Enrich with student and user details
    const student = await ctx.db.get(fees.studentId)
    const user = student ? await ctx.db.get(student.userId) : null

    return {
      ...fees,
      student,
      user,
    }
  },
})

/**
 * Get all fees records with student and user details
 */
export const getAllFees = query({
  async handler(ctx) {
    const allFees = await ctx.db.query('fees').collect()

    const enriched = await Promise.all(
      allFees.map(async (fee) => {
        const student = await ctx.db.get(fee.studentId)
        const user = student ? await ctx.db.get(student.userId) : null

        return {
          ...fee,
          student,
          user,
          studentName: user?.name || 'Unknown',
          studentEmail: user?.email || 'Unknown',
        }
      })
    )

    return enriched
  },
})

/**
 * Get fees by status
 */
export const getFeesByStatus = query({
  args: { status: v.union(v.literal('paid'), v.literal('partial'), v.literal('due')) },
  async handler(ctx, args) {
    const fees = await ctx.db
      .query('fees')
      .filter((q) => q.eq(q.field('status'), args.status))
      .collect()

    const enriched = await Promise.all(
      fees.map(async (fee) => {
        const student = await ctx.db.get(fee.studentId)
        const user = student ? await ctx.db.get(student.userId) : null

        return {
          ...fee,
          student,
          user,
        }
      })
    )

    return enriched
  },
})

/**
 * Get all students with due fees
 */
export const getFeesDueList = query({
  async handler(ctx) {
    const dueFees = await ctx.db
      .query('fees')
      .filter((q) => q.eq(q.field('status'), 'due'))
      .collect()

    // Sort by due amount (highest first)
    dueFees.sort((a, b) => b.dueAmount - a.dueAmount)

    const enriched = await Promise.all(
      dueFees.map(async (fee) => {
        const student = await ctx.db.get(fee.studentId)
        const user = student ? await ctx.db.get(student.userId) : null

        return {
          ...fee,
          student,
          user,
        }
      })
    )

    return enriched
  },
})

/**
 * Get fees summary statistics
 */
export const getFeesSummary = query({
  async handler(ctx) {
    const allFees = await ctx.db.query('fees').collect()

    const summary = {
      totalExpected: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      paidStudents: 0,
      partialStudents: 0,
      dueStudents: 0,
    }

    for (const fee of allFees) {
      summary.totalExpected += fee.totalFees
      summary.totalCollected += fee.paidAmount
      summary.totalOutstanding += fee.dueAmount

      if (fee.status === 'paid') {
        summary.paidStudents++
      } else if (fee.status === 'partial') {
        summary.partialStudents++
      } else if (fee.status === 'due') {
        summary.dueStudents++
      }
    }

    return summary
  },
})

/**
 * Create fees record for a student
 */
export const createFees = mutation({
  args: {
    studentId: v.id('students'),
    totalFees: v.number(),
  },
  async handler(ctx, args) {
    // Verify student exists
    const student = await ctx.db.get(args.studentId)
    if (!student) {
      throw new Error('Student not found')
    }

    // Check if fees already exist for this student
    const existingFees = await ctx.db
      .query('fees')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .first()

    if (existingFees) {
      throw new Error('Fees record already exists for this student')
    }

    // Create new fees record
    const feesId = await ctx.db.insert('fees', {
      studentId: args.studentId,
      totalFees: args.totalFees,
      paidAmount: 0,
      dueAmount: args.totalFees,
      status: 'due',
      paymentHistory: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return feesId
  },
})

/**
 * Record a fee payment
 */
export const recordFeePayment = mutation({
  args: {
    studentId: v.id('students'),
    amount: v.number(),
    date: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  async handler(ctx, args) {
    if (args.amount <= 0) {
      throw new Error('Payment amount must be greater than 0')
    }

    // Get existing fees record
    const currentFees = await ctx.db
      .query('fees')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .first()

    if (!currentFees) {
      throw new Error('Fees record not found for this student')
    }

    // Calculate new amounts
    const newPaidAmount = currentFees.paidAmount + args.amount
    const newDueAmount = Math.max(0, currentFees.totalFees - newPaidAmount)

    // Determine new status
    let newStatus: 'paid' | 'partial' | 'due'
    if (newDueAmount === 0) {
      newStatus = 'paid'
    } else if (newPaidAmount > 0) {
      newStatus = 'partial'
    } else {
      newStatus = 'due'
    }

    // Create payment history entry
    const paymentDate = args.date || Date.now()
    const newPaymentHistory = [...(currentFees.paymentHistory || []), {
      date: paymentDate,
      amount: args.amount,
      note: args.note,
    }]

    // Update fees record
    await ctx.db.patch(currentFees._id, {
      paidAmount: newPaidAmount,
      dueAmount: newDueAmount,
      status: newStatus,
      lastPaymentDate: paymentDate,
      paymentHistory: newPaymentHistory,
      updatedAt: Date.now(),
    })

    return await ctx.db.get(currentFees._id)
  },
})

/**
 * Update total fees for a student
 */
export const updateTotalFees = mutation({
  args: {
    studentId: v.id('students'),
    newTotal: v.number(),
  },
  async handler(ctx, args) {
    if (args.newTotal <= 0) {
      throw new Error('Total fees must be greater than 0')
    }

    // Get existing fees record
    const currentFees = await ctx.db
      .query('fees')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .first()

    if (!currentFees) {
      throw new Error('Fees record not found for this student')
    }

    // Calculate new due amount
    const newDueAmount = Math.max(0, args.newTotal - currentFees.paidAmount)

    // Determine new status
    let newStatus: 'paid' | 'partial' | 'due'
    if (newDueAmount === 0) {
      newStatus = 'paid'
    } else if (currentFees.paidAmount > 0) {
      newStatus = 'partial'
    } else {
      newStatus = 'due'
    }

    // Update fees record
    await ctx.db.patch(currentFees._id, {
      totalFees: args.newTotal,
      dueAmount: newDueAmount,
      status: newStatus,
      updatedAt: Date.now(),
    })

    return await ctx.db.get(currentFees._id)
  },
})

/**
 * Delete fees record
 */
export const deleteFees = mutation({
  args: { feesId: v.id('fees') },
  async handler(ctx, args) {
    const fees = await ctx.db.get(args.feesId)
    if (!fees) {
      throw new Error('Fees record not found')
    }

    await ctx.db.delete(args.feesId)
    return { deleted: true }
  },
})
