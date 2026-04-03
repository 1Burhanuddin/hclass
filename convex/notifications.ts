import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

/**
 * Get all notifications for current user
 * - Students see: personal + batch + global notifications
 * - Teachers see: personal + global notifications
 * - Admins see: personal + global notifications
 */
export const getUserNotifications = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const limit = args.limit || 20

    // Get user to check role and batch (if student)
    const user = await ctx.db.get(args.userId)
    if (!user) return null

    let notifications: any[] = []

    if (user.role === 'student') {
      // Get student record to find batch
      const student = await ctx.db
        .query('students')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .first()

      if (student) {
        // Get notifications: personal + batch + global
        const batchNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'batch'),
              q.eq(q.field('targetId'), student.batchId)
            )
          )
          .collect()

        const personalNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'student'),
              q.eq(q.field('targetId'), student._id)
            )
          )
          .collect()

        const globalNotifications = await ctx.db
          .query('notifications')
          .filter((q) => q.eq(q.field('targetType'), 'global'))
          .collect()

        notifications = [...personalNotifications, ...batchNotifications, ...globalNotifications]
      }
    } else {
      // Teachers and Admins see: personal (user targetType) + global notifications
      const personalNotifications = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(
            q.eq(q.field('targetType'), 'user'),
            q.eq(q.field('targetId'), args.userId)
          )
        )
        .collect()

      const globalNotifications = await ctx.db
        .query('notifications')
        .filter((q) => q.eq(q.field('targetType'), 'global'))
        .collect()

      notifications = [...personalNotifications, ...globalNotifications]
    }

    // Sort by newest first and limit
    notifications = notifications
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)

    // Enrich with sender details
    const enriched = await Promise.all(
      notifications.map(async (notification) => {
        const sender = (await ctx.db.get(notification.senderId)) as any
        return {
          ...notification,
          senderName: sender?.name || 'Unknown',
          senderEmail: sender?.email || '',
        }
      })
    )

    return enriched
  },
})

/**
 * Get unread notifications for a user
 */
export const getUnreadNotifications = query({
  args: { userId: v.id('users') },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId)
    if (!user) return null

    let unreadNotifications: any[] = []

    if (user.role === 'student') {
      // Get student record
      const student = await ctx.db
        .query('students')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .first()

      if (student) {
        // Get unread notifications: personal + batch + global
        const batchNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'batch'),
              q.eq(q.field('targetId'), student.batchId),
              q.eq(q.field('isRead'), false)
            )
          )
          .collect()

        const personalNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'student'),
              q.eq(q.field('targetId'), student._id),
              q.eq(q.field('isRead'), false)
            )
          )
          .collect()

        const globalNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'global'),
              q.eq(q.field('isRead'), false)
            )
          )
          .collect()

        unreadNotifications = [...personalNotifications, ...batchNotifications, ...globalNotifications]
      }
    } else {
      // Teachers and Admins: personal (user targetType) + global unread
      const personalNotifications = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(
            q.eq(q.field('targetType'), 'user'),
            q.eq(q.field('targetId'), args.userId),
            q.eq(q.field('isRead'), false)
          )
        )
        .collect()

      const globalNotifications = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(q.eq(q.field('targetType'), 'global'), q.eq(q.field('isRead'), false))
        )
        .collect()

      unreadNotifications = [...personalNotifications, ...globalNotifications]
    }

    return {
      count: unreadNotifications.length,
      notifications: unreadNotifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    }
  },
})

/**
 * Get all global notifications
 */
export const getGlobalNotifications = query({
  args: { limit: v.optional(v.number()) },
  async handler(ctx, args) {
    const limit = args.limit || 20

    const notifications = await ctx.db
      .query('notifications')
      .filter((q) => q.eq(q.field('targetType'), 'global'))
      .order('desc')
      .take(limit)

    // Enrich with sender details
    const enriched = await Promise.all(
      notifications.map(async (notification) => {
        const sender = (await ctx.db.get(notification.senderId)) as any
        return {
          ...notification,
          senderName: sender?.name || 'Unknown',
          senderEmail: sender?.email || '',
        }
      })
    )

    return enriched
  },
})

/**
 * Get batch-specific notifications
 */
export const getBatchNotifications = query({
  args: {
    batchId: v.id('batches'),
    limit: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const limit = args.limit || 20

    const notifications = await ctx.db
      .query('notifications')
      .filter((q) =>
        q.and(
          q.eq(q.field('targetType'), 'batch'),
          q.eq(q.field('targetId'), args.batchId)
        )
      )
      .order('desc')
      .take(limit)

    // Enrich with sender details
    const enriched = await Promise.all(
      notifications.map(async (notification) => {
        const sender = (await ctx.db.get(notification.senderId)) as any
        return {
          ...notification,
          senderName: sender?.name || 'Unknown',
          senderEmail: sender?.email || '',
        }
      })
    )

    return enriched
  },
})

/**
 * Create a notification
 */
export const createNotification = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    targetType: v.union(v.literal('global'), v.literal('batch'), v.literal('student'), v.literal('user')),
    targetId: v.optional(v.union(v.id('batches'), v.id('students'), v.id('users'))),
    senderId: v.id('users'),
  },
  async handler(ctx, args) {
    // Validation
    if (args.targetType !== 'global' && !args.targetId) {
      throw new Error('targetId is required for batch, student, and user notifications')
    }

    if (args.targetType === 'batch') {
      // Verify batch exists
      const batch = await ctx.db.get(args.targetId as any)
      if (!batch) {
        throw new Error('Batch not found')
      }
    } else if (args.targetType === 'student') {
      // Verify student exists
      const student = await ctx.db.get(args.targetId as any)
      if (!student) {
        throw new Error('Student not found')
      }
    } else if (args.targetType === 'user') {
      // Verify user exists
      const user = await ctx.db.get(args.targetId as any)
      if (!user) {
        throw new Error('User not found')
      }
    }

    // Create notification
    const notificationId = await ctx.db.insert('notifications', {
      title: args.title,
      message: args.message,
      senderId: args.senderId,
      targetType: args.targetType,
      targetId: args.targetId,
      isRead: false,
      createdAt: Date.now(),
    })

    return notificationId
  },
})

/**
 * Mark notification as read
 */
export const markNotificationAsRead = mutation({
  args: { notificationId: v.id('notifications') },
  async handler(ctx, args) {
    const notification = await ctx.db.get(args.notificationId)
    if (!notification) {
      throw new Error('Notification not found')
    }

    await ctx.db.patch(args.notificationId, { isRead: true })
    return await ctx.db.get(args.notificationId)
  },
})

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = mutation({
  args: { userId: v.id('users') },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId)
    if (!user) {
      throw new Error('User not found')
    }

    let concernedNotifications: any[] = []

    if (user.role === 'student') {
      // Get student record
      const student = await ctx.db
        .query('students')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .first()

      if (student) {
        // Get all unread notifications for this student
        const batchNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'batch'),
              q.eq(q.field('targetId'), student.batchId),
              q.eq(q.field('isRead'), false)
            )
          )
          .collect()

        const personalNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'student'),
              q.eq(q.field('targetId'), student._id),
              q.eq(q.field('isRead'), false)
            )
          )
          .collect()

        const globalNotifications = await ctx.db
          .query('notifications')
          .filter((q) =>
            q.and(
              q.eq(q.field('targetType'), 'global'),
              q.eq(q.field('isRead'), false)
            )
          )
          .collect()

        concernedNotifications = [...personalNotifications, ...batchNotifications, ...globalNotifications]
      }
    } else {
      // Teachers and Admins: personal (user targetType) + global unread
      const personalNotifications = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(
            q.eq(q.field('targetType'), 'user'),
            q.eq(q.field('targetId'), args.userId),
            q.eq(q.field('isRead'), false)
          )
        )
        .collect()

      const globalNotifications = await ctx.db
        .query('notifications')
        .filter((q) =>
          q.and(q.eq(q.field('targetType'), 'global'), q.eq(q.field('isRead'), false))
        )
        .collect()

      concernedNotifications = [...personalNotifications, ...globalNotifications]
    }

    // Mark all as read
    for (const notification of concernedNotifications) {
      await ctx.db.patch(notification._id, { isRead: true })
    }

    return { updatedCount: concernedNotifications.length }
  },
})

/**
 * Delete a notification
 */
export const deleteNotification = mutation({
  args: { notificationId: v.id('notifications') },
  async handler(ctx, args) {
    const notification = await ctx.db.get(args.notificationId)
    if (!notification) {
      throw new Error('Notification not found')
    }

    await ctx.db.delete(args.notificationId)
    return { deleted: true }
  },
})

/**
 * Search notifications for a user
 */
export const searchNotifications = query({
  args: {
    userId: v.id('users'),
    query: v.string(),
  },
  async handler(ctx, args) {
    if (!args.query.trim()) {
      return []
    }

    // For now, this does a simple client-side filter
    // In production, you might want Convex search
    const allNotifications = await ctx.db.query('notifications').collect()

    const searchTerm = args.query.toLowerCase()
    const filtered = allNotifications.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm) ||
        n.message.toLowerCase().includes(searchTerm)
    )

    // Enrich with sender details
    const enriched = await Promise.all(
      filtered.map(async (notification) => {
        const sender = (await ctx.db.get(notification.senderId)) as any
        return {
          ...notification,
          senderName: sender?.name || 'Unknown',
          senderEmail: sender?.email || '',
        }
      })
    )

    return enriched.slice(0, 20)
  },
})
