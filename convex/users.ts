import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()
  },
})

// Get all users (excluding soft-deleted)
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('deletedAt'), undefined))
      .collect()
  },
})

// Get all teachers (excluding soft-deleted)
export const getAllTeachers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('users')
      .filter((q) => q.and(q.eq(q.field('role'), 'teacher'), q.eq(q.field('deletedAt'), undefined)))
      .collect()
  },
})

// Get all students (excluding soft-deleted)
export const getAllStudents = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('users')
      .filter((q) => q.and(q.eq(q.field('role'), 'student'), q.eq(q.field('deletedAt'), undefined)))
      .collect()
  },
})

// Check if user exists
export const userExists = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()
    return !!user
  },
})

// Create new user (called on signup via webhook)
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user with this clerkId already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()

    if (existingUser) {
      return { userId: existingUser._id, role: existingUser.role, status: existingUser.status }
    }

    // Check if this is the first user - make them admin with approved status
    const allUsers = await ctx.db.query('users').collect()
    const isFirstUser = allUsers.length === 0
    const role = isFirstUser ? 'admin' : undefined
    const status = isFirstUser ? 'approved' : 'pending'

    const userId = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      role: role as 'admin' | undefined,
      status: status as 'approved' | 'pending' | undefined,
      isActive: isFirstUser,
      profileImage: undefined,
      createdAt: Date.now(),
    })

    return { userId, role, status }
  },
})

// Update user role
export const updateUserRole = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('student')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      status: 'approved',
      isActive: true,
    })

    // If role is being changed to teacher, create teacher record if it doesn't exist
    if (args.role === 'teacher') {
      const existingTeacher = await ctx.db
        .query('teachers')
        .filter((q) => q.eq(q.field('userId'), user._id))
        .first()

      if (!existingTeacher) {
        await ctx.db.insert('teachers', {
          userId: user._id,
          qualification: 'Not specified',
          joinDate: Date.now(),
        })
      }
    }

    return { success: true, role: args.role }
  },
})

// Update user details (admin action)
export const updateUserDetails = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('student')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new Error('User not found')
    }

    // If role is being changed to teacher, create teacher record if it doesn't exist
    if (args.role === 'teacher') {
      const existingTeacher = await ctx.db
        .query('teachers')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .first()

      if (!existingTeacher) {
        await ctx.db.insert('teachers', {
          userId: args.userId,
          qualification: 'Not specified',
          joinDate: Date.now(),
        })
      }
    }

    await ctx.db.patch(args.userId, {
      name: args.name,
      email: args.email,
      role: args.role,
    })

    return { success: true }
  },
})

// Deactivate user (soft delete)
export const deactivateUser = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new Error('User not found')
    }

    await ctx.db.patch(args.userId, {
      isActive: false,
      deletedAt: Date.now(),
    })

    return { success: true }
  },
})

// Delete user (hard delete - use with caution)
export const deleteUser = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new Error('User not found')
    }

    // Check if user has any dependencies (teachers, students)
    const asTeacher = await ctx.db
      .query('teachers')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .collect()

    const asStudent = await ctx.db
      .query('students')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .collect()

    if (asTeacher.length > 0 || asStudent.length > 0) {
      throw new Error('Cannot delete user with active roles. Deactivate instead.')
    }

    await ctx.db.delete(args.userId)
    return { success: true }
  },
})

// Get pending users (waiting for approval)
export const getPendingUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('users')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect()
  },
})

// Approve user and assign role
export const approveUser = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('student')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (user.status !== 'pending') {
      throw new Error('Only pending users can be approved')
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      status: 'approved',
      isActive: true,
    })

    // If role is teacher, create teacher record
    if (args.role === 'teacher') {
      const existingTeacher = await ctx.db
        .query('teachers')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .first()

      if (!existingTeacher) {
        await ctx.db.insert('teachers', {
          userId: args.userId,
          qualification: 'Not specified',
          joinDate: Date.now(),
        })
      }
    }

    return { success: true }
  },
})

// Reject user
export const rejectUser = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (user.status !== 'pending') {
      throw new Error('Only pending users can be rejected')
    }

    await ctx.db.patch(args.userId, {
      status: 'rejected',
    })

    return { success: true }
  },
})
