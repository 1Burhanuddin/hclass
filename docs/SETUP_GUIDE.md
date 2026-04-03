# Module 1 Setup: Clerk & Convex Integration

**Status:** In Progress ✨  
**Date:** April 2, 2026

---

## ✅ What Has Been Set Up

### Clerk Integration

✅ **Middleware:** `src/middleware.ts`
- Using `clerkMiddleware()` from `@clerk/nextjs/server`
- Proper configuration for App Router

✅ **Layout:** `src/app/layout.tsx`
- `ClerkProvider` wrapping entire app
- `ConvexClientProvider` for Convex
- Clerk components: `Show`, `UserButton`, `SignInButton`, `SignUpButton`

✅ **Pages:**
- `src/app/page.tsx` - Home page with sign-in/sign-up UI
- `src/app/auth/sign-in/page.tsx` - Sign-in page
- `src/app/auth/sign-up/page.tsx` - Sign-up page
- `src/app/dashboards/page.tsx` - Placeholder dashboard

✅ **Styling:**
- `src/app/globals.css` - Global styles with Tailwind

### Convex Backend

✅ **Schema:** `convex/schema.ts`
- 10 tables: users, teachers, students, batches, subjects, batchSubjects, attendance, assignments, notifications, fees
- Proper indexes for efficient queries
- Type-safe field definitions

✅ **Queries & Mutations:** `convex/users.ts`
- `getCurrentUser()` - Get current authenticated user
- `createUser()` - Create user on signup
- `getUserById()` - Get user by ID
- `getAllUsers()` - List all users with optional role filter
- `updateUserRole()` - Update user role
- `searchUsers()` - Search by name/email

✅ **Auth Helpers:** `convex/auth.ts`
- `auth.getUserIdentity()` - Get Clerk identity
- `isAdmin()` - Check if admin
- `isTeacher()` - Check if teacher
- `isStudent()` - Check if student

✅ **Convex Provider:** `src/lib/convex-provider.tsx`
- React Client setup
- Ready for Convex queries/mutations

✅ **Hooks:** `src/hooks/convex.ts`
- `useCurrentUser()` - Hook for current user
- `useCreateUser()` - Hook for creating user
- `useGetAllUsers()` - Hook for listing users
- `useUpdateUserRole()` - Hook for updating roles
- `useSearchUsers()` - Hook for searching
- `useIsAdmin/Teacher/Student()` - Role checking hooks

---

## 🚀 How to Get Started

### Step 1: Install Dependencies

```bash
cd /home/burhanuddin/Projects/hclass
npm install
```

### Step 2: Set Up Clerk

1. Go to **[clerk.com](https://clerk.com)** and create an account (free)
2. Create a new project
3. In Clerk dashboard, go to **API Keys**
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Step 3: Set Up Convex

1. Go to **[convex.dev](https://convex.dev)** and create an account (free)
2. Create a new project
3. In your terminal, run:
   ```bash
   npx convex init
   ```
   This will:
   - Prompt you to log in to Convex
   - Set up your project
   - Create `NEXT_PUBLIC_CONVEX_URL` automatically

### Step 4: Configure Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your credentials
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
```

### Step 5: Deploy Convex Schema

The schema is already created in `convex/schema.ts`. To deploy:

```bash
npx convex deploy
```

Or keep it in development mode:

```bash
npx convex dev
```

### Step 6: Start Development Servers

**Terminal 1 - Next.js Development Server:**
```bash
npm run dev
```

**Terminal 2 - Convex Development:**
```bash
npm run convex
```

### Step 7: Test Clerk

1. Open [http://localhost:3000](http://localhost:3000)
2. Click **"Sign Up"** button
3. Enter your email and password
4. Complete signup
5. You should see a user icon in the header
6. Redirected to dashboard

**✨ Congratulations!** Clerk is working!

### Step 8: Verify Convex Integration

1. Go to [http://localhost:3000/dashboards](http://localhost:3000/dashboards)
2. You should see your user info:
   - Email
   - Clerk User ID
3. Open Convex dashboard (shown during `npx convex dev`)
4. Check the **users** table - your user should be there!

---

## 📝 Project Structure After Setup

```
✅ src/
   ├── app/
   │   ├── layout.tsx (ClerkProvider + ConvexProvider)
   │   ├── page.tsx (Home)
   │   ├── globals.css
   │   ├── auth/
   │   │   ├── sign-in/page.tsx
   │   │   └── sign-up/page.tsx
   │   └── dashboards/
   │       └── page.tsx (Placeholder)
   │
   ├── lib/
   │   ├── constants.ts
   │   ├── utils.ts
   │   └── convex-provider.tsx (Convex Client)
   │
   ├── hooks/
   │   └── convex.ts (All Convex hooks)
   │
   └── types/
       └── index.ts

✅ convex/
   ├── schema.ts (10 tables defined)
   ├── users.ts (User queries & mutations)
   └── auth.ts (Auth helpers)

✅ src/middleware.ts (Clerk middleware)
✅ .env.local (Your credentials)
```

---

## 🧪 Quick Test: Create User on Signup

**What happens when you sign up:**

1. Clerk handles signup UI
2. User created in Clerk
3. **Webhook triggered** (you'll need to set this up for auto-sync)

**For now, manual test:**

1. Sign up at [http://localhost:3000](http://localhost:3000)
2. Go to dashboard
3. Your user info shows (from Clerk)
4. Manually create in Convex by calling mutation

**To auto-sync on signup:**
- Go to Clerk Dashboard → Webhooks
- Add webhook for Clerk → Convex
- (See Module 1 docs for details)

---

## 🔗 Important Links

- **Clerk Docs:** https://clerk.com/docs/nextjs/getting-started/quickstart
- **Convex Docs:** https://docs.convex.dev/quickstart
- **Clerk Dashboard:** https://dashboard.clerk.com/
- **Convex Dashboard:** https://dashboard.convex.dev/

---

## ⚠️ Common Issues & Solutions

### Issue: `NEXT_PUBLIC_CONVEX_URL is undefined`
**Solution:** Make sure `.env.local` has the URL and you ran `npm run dev` after setup

### Issue: "ClerkProvider must be used in a client component"
**Solution:** Ensure `src/middleware.ts` exists and app/layout.tsx is NOT using `'use client'`

### Issue: Convex queries return `undefined`
**Solution:** Make sure to run `npm run convex` in another terminal

### Issue: Can't sign up
**Solution:** Check Clerk credentials in `.env.local`

---

## ✅ Checklist: Setup Complete When...

- [ ] `npm install` completes successfully
- [ ] `.env.local` has Clerk keys
- [ ] `.env.local` has `NEXT_PUBLIC_CONVEX_URL`
- [ ] `npm run dev` runs on http://localhost:3000
- [ ] `npm run convex` shows schema deployed
- [ ] Home page shows Sign Up button (when not logged in)
- [ ] Can click Sign Up and go through flow
- [ ] After signup, see user icon in header
- [ ] Clerk dashboard shows new user
- [ ] Convex dashboard shows user in database
- [ ] Dashboard page shows your email/ID

---

## 🎯 Next Steps After Setup

Once Clerk + Convex is working:

1. **Create Role Selection Modal**
   - After signup, ask user their role (Admin/Teacher/Student)
   - Store in Convex users table

2. **Implement Role-Based Redirects**
   - /admin → Admin dashboard
   - /teacher → Teacher dashboard
   - /student → Student dashboard

3. **Build Admin Dashboard**
   - User management
   - Batch creation
   - Subject management

---

## 📞 Need Help?

- Check the terminal for error messages
- Look at [Clerk Docs](https://clerk.com/docs)
- Check [Convex Docs](https://docs.convex.dev)
- Review [Module 1: Auth Documentation](../modules/01-auth.md)

---

**Setup Status:** ✅ Ready for Testing  
**Next Phase:** Role selection and role-based dashboards  
**Time to Setup:** ~15-30 minutes (including creating accounts)
