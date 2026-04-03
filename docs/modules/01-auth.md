# Module 1: Authentication & Role Setup

**Status:** ⏳ Not Started  
**Priority:** CRITICAL (Foundation for all other modules)

---

## 📌 Objective

Integrate Clerk for user authentication and establish role-based access control (Admin, Teacher, Student). Set up protected routes and middleware for role-based routing.

---

## ✨ Features

1. **Clerk Integration**
   - Sign up / Sign in UI
   - User session management
   - Email verification

2. **Role Assignment**
   - Assign role when user created
   - Three roles: Admin, Teacher, Student
   - Store role in Users table

3. **Protected Routes**
   - `/admin/*` - Only admin can access
   - `/teacher/*` - Only teacher can access
   - `/student/*` - Only student can access

4. **Middleware & Redirects**
   - Redirect unauthenticated users to sign-in
   - Redirect authenticated users to role-based dashboard

5. **Admin Dashboard Route**
   - `/` (root) → redirects to `/admin` (if admin) or `/teacher` (if teacher) or `/student` (if student)

---

## 🗄️ Database Schema Used

### Users Table (New)
```
{
  _id: Id<"users">,
  clerkId: string (unique),
  name: string,
  email: string,
  role: "admin" | "teacher" | "student",
  profileImage?: string,
  createdAt: number (timestamp)
}
```

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getCurrentUser()`**
   - Input: `clerkId` (from Clerk context)
   - Output: User document or null
   - Purpose: Fetch current user details and role

2. **`getUserById(userId)`**
   - Input: `userId` (Convex ID)
   - Output: User document
   - Purpose: Get user details by ID

### Mutations

1. **`createUser(data)`**
   - Input: 
     ```
     {
       clerkId: string,
       name: string,
       email: string,
       role: "admin" | "teacher" | "student",
       profileImage?: string
     }
     ```
   - Output: Created user ID
   - Purpose: Create user in Convex when user signs up via Clerk
   - Trigger: Use Clerk webhook to call this on signup

2. **`updateUserRole(clerkId, role)`**
   - Input: `clerkId`, new `role`
   - Output: Updated user document
   - Purpose: Allow admin to change user roles (future feature)

---

## 🎨 UI Components

### 1. SignInPage (`/app/(auth)/sign-in/page.tsx`)
- Clerk SignIn component
- Redirect to role-based dashboard after sign-in

### 2. SignUpPage (`/app/(auth)/sign-up/page.tsx`)
- Clerk SignUp component
- Role selection modal (after signup)
- Store role in Convex

### 3. RootLayout (`/app/layout.tsx`)
- ClerkProvider wrapper
- Route protection middleware
- Global auth check

### 4. ProtectedLayout (for each role)
- Sidebar navigation (role-specific)
- Header with user profile
- Logout button

---

## 🧪 Test Cases

- [ ] User can sign up with email
- [ ] User can sign in with email
- [ ] After signup, role selection modal appears
- [ ] User role is stored in Convex Users table
- [ ] Unauthenticated user is redirected to sign-in
- [ ] Admin can access `/admin` route
- [ ] Teacher can access `/teacher` route
- [ ] Student can access `/student` route
- [ ] Non-admin cannot access `/admin` route
- [ ] Non-teacher cannot access `/teacher` route
- [ ] Non-student cannot access `/student` route
- [ ] Root route redirects to role-based dashboard
- [ ] User profile displays in header
- [ ] Logout clears session

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create `convex/schema.ts` with Users table
- [ ] Create `convex/users.ts` with queries/mutations
- [ ] Set up Clerk webhook integration

### Next.js Frontend
- [ ] Install `@clerk/nextjs`
- [ ] Create `ClerkProvider` wrapper
- [ ] Create auth pages (`/app/(auth)/sign-in`, `/app/(auth)/sign-up`)
- [ ] Create role selection component
- [ ] Set up middleware for route protection

### Types & Utils
- [ ] Create `src/types/index.ts` with role types
- [ ] Create helper functions for role checking

### Testing
- [ ] Test all auth flows manually
- [ ] Test role-based access
- [ ] Verify Convex integration

---

## 📝 Completion Checklist

- [ ] Clerk integration complete
- [ ] Users table created in Convex
- [ ] All queries/mutations implemented
- [ ] Auth pages created
- [ ] Role-based routing working
- [ ] Protected routes enforced
- [ ] Root redirect logic implemented
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Clerk handles session management; Convex stores role data
- Make sure Clerk webhooks are configured for `user.created` event
- Role selection can be optional (default to "student")
- Consider using Convex pre-built functions for Clerk integration

**Mark as COMPLETE when:** All test cases pass AND role-based redirects work correctly
