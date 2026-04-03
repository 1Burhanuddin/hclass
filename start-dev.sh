#!/bin/bash
# Start the complete development environment

cd /home/burhanuddin/Projects/hclass

# Kill any existing processes
pkill -f "npm run dev\|convex dev\|npx next" 2>/dev/null || true
sleep 2

# Start Convex dev (must run first)
echo "Starting Convex dev server..."
npx convex dev --until-deployed &
CONVEX_PID=$!

# Wait for Convex to be ready
sleep 10

# Start Next.js dev server
echo "Starting Next.js dev server..."
npm run dev

# Cleanup on exit
trap "kill $CONVEX_PID 2>/dev/null || true" EXIT
