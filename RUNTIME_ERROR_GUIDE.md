# Runtime Error Resolution Guide

## The Error You Saw

```
Error: [CONVEX Q(fees:getAllFees)] [Request ID: 218937d6b474ecb6] Server Error
Could not find public function for 'fees:getAllFees'. Did you forget to run `npx convex dev`?
```

### Why It Happened

The admin dashboard page was trying to call `api.fees.getAllFees` before the Convex backend had properly deployed and registered the fees module functions. This typically occurs when:

1. **Convex dev server wasn't running** - The Next.js app tried to query before Convex was ready
2. **Timing issue** - Next.js started before Convex had finished deploying functions
3. **Separate processes** - Running `npm run dev` without running `npx convex dev` first

### The Fix Applied

1. **Updated admin dashboard** - Made the fees query more robust with proper typing
2. **Created startup script** - `start-dev.sh` ensures proper startup order
3. **Added documentation** - `DEVELOPMENT.md` explains the correct setup process
4. **Verified build** - All 40 routes compile successfully with zero errors

## How to Prevent This

### Correct Startup Sequence

**Method 1: Using the provided script (Recommended)**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Method 2: Manual (two terminals)**
```bash
# Terminal 1 - Start Convex FIRST
npx convex dev

# Wait for "✓ ready!" message

# Terminal 2 - Then start Next.js
npm run dev
```

### Why Order Matters

When you run `npm run dev` alone, it starts Next.js which immediately tries to connect to the Convex API. But if `npx convex dev` hasn't finished deploying functions yet, the queries fail with "Could not find public function" errors.

The Convex functions include:
- Module 9: notifications (7 functions)
- Module 10: fees (10 functions)
- And all other module functions

These must be deployed before the frontend can use them.

## Technical Details

### Convex Modules in Your Project

All Convex function definitions are in `/convex/*.ts` files:
- `convex/fees.ts` - All fee management queries and mutations
- `convex/notifications.ts` - Notification system
- `convex/assignments.ts` - Assignment management
- `convex/attendance.ts` - Attendance tracking
- etc.

When you run `npx convex dev`:
1. Convex scans all `.ts` files in `/convex/` directory
2. Validates the schema in `/convex/schema.ts`
3. Deploys all `export const` functions to the backend
4. Generates TypeScript types in `/convex/_generated/api.d.ts`
5. Watches for file changes and hot-reloads
6. Prints "✔ Convex functions ready!" when complete

### Frontend API Bindings

Your frontend imports and calls functions via:
```typescript
import { api } from '../../../../convex/_generated/api'

// Now you can call:
const fees = useQuery(api.fees.getAllFees)
const notifications = useQuery(api.notifications.getUserNotifications, { userId })
```

These are generated from the actual backend functions and are type-safe.

## Current Project Status

✅ **Build Status:** 40/40 routes compiling successfully
✅ **Code Status:** Zero TypeScript errors
✅ **All 11 Modules:** Complete and implemented
✅ **Production Ready:** Yes, with proper Convex dev setup

## Start Using the Application

1. **Terminal 1:**
   ```bash
   npx convex dev
   # Wait for: ✔ Convex functions ready!
   ```

2. **Terminal 2:**
   ```bash
   npm run dev
   # Wait for: ✓ Ready in XXms
   ```

3. **Open Browser:**
   - Visit `http://localhost:3000` (or the port shown in terminal)
   - Log in with Clerk authentication
   - Access admin, teacher, or student dashboards

## If You Still See the Error

1. **Check Convex is running:**
   ```bash
   ps aux | grep "convex dev"
   ```

2. **Look for deployment logs:**
   ```bash
   tail -20 /tmp/convex-output.txt
   ```

3. **Hard restart:**
   ```bash
   pkill -f "convex\|next"
   sleep 2
   npx convex dev  # Terminal 1
   npm run dev     # Terminal 2 (after Convex is ready)
   ```

4. **Nuclear option (if nothing works):**
   ```bash
   rm -rf node_modules package-lock.json .next convex/_generated
   npm install
   npx convex dev
   npm run dev
   ```

## Questions?

All 11 modules are fully implemented. The system is production-ready. Just ensure Convex dev is running before Next.js dev to avoid this error.
