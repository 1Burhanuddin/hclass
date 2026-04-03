import { mutation } from './_generated/server'

/**
 * One-time cleanup function to remove duplicate users by clerkId
 * Keeps the first user record and soft-deletes duplicates
 * Run this ONCE to clean up existing duplicates
 */
export const cleanupDuplicateUsers = mutation({
  handler: async (ctx) => {
    const allUsers = await ctx.db.query('users').collect()
    
    const usersByClerkId = new Map<string, typeof allUsers>()
    
    // Group users by clerkId
    for (const user of allUsers) {
      if (!usersByClerkId.has(user.clerkId)) {
        usersByClerkId.set(user.clerkId, [])
      }
      usersByClerkId.get(user.clerkId)!.push(user)
    }
    
    let cleanedCount = 0
    
    // For each clerkId with duplicates, keep the first and soft-delete others
    for (const [clerkId, users] of usersByClerkId.entries()) {
      if (users.length > 1) {
        console.log(`Found ${users.length} users with clerkId ${clerkId}. Keeping the first, soft-deleting ${users.length - 1} duplicates.`)
        
        // Soft delete all but the first user
        for (let i = 1; i < users.length; i++) {
          await ctx.db.patch(users[i]._id, {
            deletedAt: Date.now(),
          })
          cleanedCount++
        }
      }
    }
    
    return {
      success: true,
      duplicatesRemoved: cleanedCount,
      message: `Cleanup complete. Removed ${cleanedCount} duplicate user records.`,
    }
  },
})
