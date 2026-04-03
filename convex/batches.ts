import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Get all batches
export const getAllBatches = query({
  handler: async (ctx) => {
    return await ctx.db.query('batches').collect()
  },
})

// Get batch by ID
export const getBatchById = query({
  args: { batchId: v.id('batches') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.batchId)
  },
})

// Get batches by class
export const getBatchesByClass = query({
  args: { class: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('batches')
      .filter((q) => q.eq(q.field('class'), args.class))
      .collect()
  },
})

// Create batch
export const createBatch = mutation({
  args: {
    name: v.string(),
    class: v.number(),
    section: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if batch already exists for this class and section
    const existing = await ctx.db
      .query('batches')
      .filter(
        (q) =>
          q.and(
            q.eq(q.field('class'), args.class),
            q.eq(q.field('section'), args.section)
          )
      )
      .collect()

    if (existing.length > 0) {
      throw new Error(`Batch ${args.class}${args.section} already exists`)
    }

    const batchId = await ctx.db.insert('batches', {
      name: args.name,
      class: args.class,
      section: args.section,
      isActive: true,
      createdAt: Date.now(),
    })

    return { success: true, batchId }
  },
})

// Update batch
export const updateBatch = mutation({
  args: {
    batchId: v.id('batches'),
    name: v.string(),
    section: v.string(),
  },
  handler: async (ctx, args) => {
    const batch = await ctx.db.get(args.batchId)

    if (!batch) {
      throw new Error('Batch not found')
    }

    await ctx.db.patch(args.batchId, {
      name: args.name,
      section: args.section,
    })

    return { success: true }
  },
})

// Delete batch
export const deleteBatch = mutation({
  args: {
    batchId: v.id('batches'),
  },
  handler: async (ctx, args) => {
    const batch = await ctx.db.get(args.batchId)

    if (!batch) {
      throw new Error('Batch not found')
    }

    // Check if batch has any students
    const students = await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('batchId'), args.batchId))
      .collect()

    if (students.length > 0) {
      throw new Error(
        `Cannot delete batch with ${students.length} enrolled students. Remove students first.`
      )
    }

    // Check if batch has any batch-subject mappings
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('batchId'), args.batchId))
      .collect()

    if (batchSubjects.length > 0) {
      throw new Error(
        `Cannot delete batch with ${batchSubjects.length} subject mappings. Remove mappings first.`
      )
    }

    await ctx.db.delete(args.batchId)
    return { success: true }
  },
})
