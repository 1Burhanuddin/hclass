# Setting Up and Running the Development Environment

## Quick Start

To run the complete Harshdeep Classes Management System with all 11 modules:

### Option 1: Using the startup script (Recommended)
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Manual startup (Two terminals needed)

**Terminal 1 - Start Convex Backend:**
```bash
npx convex dev
```
This will:
- Connect to your Convex deployment
- Deploy all functions (notifications, fees, assignments, etc.)
- Watch for changes and hot-reload
- Display "ready!" when successful

**Terminal 2 - Start Next.js Frontend:**
```bash
npm run dev
```
This will:
- Start the Next.js development server
- Default port: 3000 (or next available if busy)
- Hot-reload on file changes
- Display all routes including admin, teacher, and student dashboards

## Important Notes

### First-time Setup
1. Make sure Convex is deployed and ready (`npx convex dev`)
2. Wait for "Convex functions ready!" message before starting npm run dev
3. This ensures all backend functions are registered and available

### Port Information
- If port 3000 is busy, Next.js will try: 3001, 3002, 3003, etc.
- Check the terminal output for the actual port being used
- Example: `- Local: http://localhost:3008`

### Common Issues

**Error: "Could not find public function for 'fees:getAllFees'"**
- This means Convex backend isn't fully deployed yet
- Solution: Ensure `npx convex dev` has completed and shows "ready!"
- Wait a few seconds after Convex is ready before starting Next.js

**Port Already in Use**
- Next.js will automatically find the next available port
- Check terminal output for the actual port
- Or kill existing processes: `pkill -f "next|convex"`

## Module Routes

Once running, access the application at http://localhost:3000 (or your actual port):

### Admin Routes
- Dashboard: `/admin/dashboard`
- Fees Management: `/admin/fees`
- Notifications: `/admin/notifications/send`
- Assignments: `/admin/assignments`
- Attendance: `/admin/attendance`

### Teacher Routes
- Dashboard: `/teacher`
- Attendance: `/teacher/attendance`
- Notifications: `/teacher/notifications`

### Student Routes
- Dashboard: `/student`
- Assignments: `/student/assignments`
- Fees: `/student/fees`
- Notifications: `/student/notifications`

## Build and Deployment

### Production Build
```bash
npm run build
```
Generates optimized build with 40/40 routes compiled.

### Deploy to Production
1. Ensure Convex deployment is configured
2. Push to your production branch
3. Deploy command: `npm run build && npm run start`

## Debugging

### Check Build Status
```bash
npm run build 2>&1 | grep -E "(✓|Failed|Error)"
```

### View Convex Logs
```bash
npx convex logs
```

### Reset Convex (careful!)
```bash
npx convex dev --reset-all
```
