# Quick Start Guide

## The Fastest Way to Get the App Running

### One Command (Recommended)
```bash
chmod +x start-dev.sh && ./start-dev.sh
```

### OR Two Terminals 

**Terminal 1:**
```bash
npx convex dev
```
Wait for: `✔ Convex functions ready!`

**Terminal 2:**
```bash
npm run dev
```
Wait for: `✓ Ready in XXms`

**Then open:** http://localhost:3000

## That's It!

You now have access to:
- Admin dashboards at `/admin`
- Teacher dashboards at `/teacher`
- Student dashboards at `/student`

## If You Get an Error

The most common error is: "Could not find public function for 'fees:getAllFees'"

**This means:** Convex backend wasn't ready when Next.js started

**Fix:** Kill everything and start fresh:
```bash
pkill -f "npm\|convex\|node"
sleep 2
npx convex dev  # Terminal 1 - wait for ready!
npm run dev     # Terminal 2
```

## All 11 Modules

✅ Authentication & Roles
✅ User Management  
✅ Batch Management
✅ Subject Management
✅ Teacher Assignment Mapping
✅ Teacher Dashboard
✅ Attendance System
✅ Assignment Module
✅ Notification System (Module 9)
✅ Fees Management (Module 10)
✅ Student Dashboard (Module 11)

Ready to use!
