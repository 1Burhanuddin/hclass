import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Get all subjects
export const getAllSubjects = query({
  handler: async (ctx) => {
    return await ctx.db.query('subjects').collect()
  },
})

// Get subject by ID
export const getSubjectById = query({
  args: { subjectId: v.id('subjects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.subjectId)
  },
})

// Create subject
export const createSubject = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if subject with same code already exists
    const existing = await ctx.db
      .query('subjects')
      .filter((q) => q.eq(q.field('code'), args.code))
      .collect()

    if (existing.length > 0) {
      throw new Error(`Subject with code ${args.code} already exists`)
    }

    const subjectId = await ctx.db.insert('subjects', {
      name: args.name,
      code: args.code,
      description: args.description || undefined,
      isActive: true,
      createdAt: Date.now(),
    })

    return { success: true, subjectId }
  },
})

// Update subject
export const updateSubject = mutation({
  args: {
    subjectId: v.id('subjects'),
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.subjectId)

    if (!subject) {
      throw new Error('Subject not found')
    }

    // Check if code is being changed and if new code already exists
    if (subject.code !== args.code) {
      const existing = await ctx.db
        .query('subjects')
        .filter((q) => q.eq(q.field('code'), args.code))
        .collect()

      if (existing.length > 0) {
        throw new Error(`Subject with code ${args.code} already exists`)
      }
    }

    await ctx.db.patch(args.subjectId, {
      name: args.name,
      code: args.code,
      description: args.description || undefined,
    })

    return { success: true }
  },
})

// Delete subject
export const deleteSubject = mutation({
  args: {
    subjectId: v.id('subjects'),
  },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.subjectId)

    if (!subject) {
      throw new Error('Subject not found')
    }

    // Check if subject has any batch mappings
    const batchSubjects = await ctx.db
      .query('batchSubjects')
      .filter((q) => q.eq(q.field('subjectId'), args.subjectId))
      .collect()

    if (batchSubjects.length > 0) {
      throw new Error(
        `Cannot delete subject with ${batchSubjects.length} batch mappings. Remove mappings first.`
      )
    }

    await ctx.db.delete(args.subjectId)
    return { success: true }
  },
})

// Initialize predefined subjects for a class
export const initializePredefinedSubjects = mutation({
  args: {
    classNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const predefinedSubjects: Record<number, { name: string; code: string }[]> = {
      9: [
        { name: 'Mathematics', code: 'MATH' },
        { name: 'Science', code: 'SCI' },
        { name: 'Social Studies', code: 'SS' },
        { name: 'English', code: 'ENG' },
        { name: 'Gujarati', code: 'GUJ' },
        { name: 'Hindi', code: 'HIN' },
      ],
      10: [
        { name: 'Mathematics', code: 'MATH' },
        { name: 'Science', code: 'SCI' },
        { name: 'Social Studies', code: 'SS' },
        { name: 'English', code: 'ENG' },
        { name: 'Gujarati', code: 'GUJ' },
        { name: 'Hindi', code: 'HIN' },
      ],
      11: [
        { name: 'Physics', code: 'PHY' },
        { name: 'Chemistry', code: 'CHEM' },
        { name: 'Mathematics', code: 'MATH' },
        { name: 'Biology', code: 'BIO' },
        { name: 'English', code: 'ENG' },
      ],
      12: [
        { name: 'Physics', code: 'PHY' },
        { name: 'Chemistry', code: 'CHEM' },
        { name: 'Mathematics', code: 'MATH' },
        { name: 'Biology', code: 'BIO' },
        { name: 'English', code: 'ENG' },
      ],
    }

    const subjects = predefinedSubjects[args.classNumber]
    if (!subjects) {
      throw new Error(`No predefined subjects for class ${args.classNumber}`)
    }

    const createdSubjects = []

    for (const subject of subjects) {
      // Check if subject already exists
      const existing = await ctx.db
        .query('subjects')
        .filter((q) => q.eq(q.field('code'), subject.code))
        .collect()

      if (existing.length === 0) {
        const subjectId = await ctx.db.insert('subjects', {
          name: subject.name,
          code: subject.code,
          isActive: true,
          createdAt: Date.now(),
        })
        createdSubjects.push({ _id: subjectId, ...subject })
      } else {
        createdSubjects.push(existing[0])
      }
    }

    return { success: true, subjects: createdSubjects }
  },
})
