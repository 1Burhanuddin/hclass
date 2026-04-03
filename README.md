/**
 * README - HCLASS MANAGEMENT SYSTEM
 * 
 * This is the complete documentation and setup for the Harshdeep Classes Management System.
 */

# Harshdeep Classes Management System

A comprehensive full-stack classroom management application built with Next.js, Convex, and Clerk.

## 📚 Documentation

**Start here:** [/docs/PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)

All module documentation is in `/docs/modules/`:
- Module 1: Authentication & Role Setup
- Module 2: User Management (Admin)
- Module 3: Batch Management
- Module 4: Subject Management
- Module 5: Batch-Subject-Teacher Mapping (CRITICAL)
- Module 6: Teacher Dashboard
- Module 7: Attendance Module
- Module 8: Assignment Module
- Module 9: Notification Module
- Module 10: Fees Module
- Module 11: Student Dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account (clerk.com)
- Convex account (convex.dev)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

3. Start development server:
```bash
npm run dev
```

4. In another terminal, start Convex:
```bash
npm run convex
```

## 📁 Project Structure

```
hclass/
├── docs/                     # Complete documentation
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utilities and constants
│   ├── hooks/               # React hooks
│   ├── context/             # Context API (if needed)
│   └── types/               # TypeScript types
├── convex/                  # Backend + database schema
├── public/                  # Static assets
└── package.json
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Material UI, Tailwind CSS
- **Backend:** Convex.dev (Queries & Mutations)
- **Auth:** Clerk
- **Database:** Convex (JSON-like normalized)
- **State:** Convex hooks + React useState

## 📝 Development Guidelines

✅ Build ONE module at a time
✅ Complete module before proceeding
✅ All features validated
✅ Use Convex for server state
✅ Use React hooks for UI state
❌ NO Redux
❌ NO hardcoded data
❌ NO mixing incomplete features

## 🎯 Next Steps

1. Read [/docs/PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)
2. Start with [/docs/modules/01-auth.md](./docs/modules/01-auth.md)
3. Implement one module at a time
4. Mark each module complete in documentation
5. Proceed to next module

## 📚 For First-Time Setup

1. **Clerk Setup:**
   - Create project on clerk.com
   - Get NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
   - Add to .env.local

2. **Convex Setup:**
   - Run `npm run convex` to initialize
   - Deploy schema to Convex
   - Get NEXT_PUBLIC_CONVEX_URL

3. **First Dev Run:**
   - `npm install`
   - `npm run dev` (Next.js on :3000)
   - `npm run convex` (Convex on :3210)

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Material UI Docs](https://mui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)

---

**Status:** Documentation Complete ✅
**Ready For:** Module 1 Implementation
