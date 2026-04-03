# 🚀 Quick Start: Clerk + Convex

**Time to get running: ~15-30 minutes**

---

## 1️⃣ Install Dependencies

```bash
cd /home/burhanuddin/Projects/hclass
npm install
```

---

## 2️⃣ Create Clerk Account & Get Keys

1. Go to **https://clerk.com** → Sign up (free)
2. Create new project
3. Go to **API Keys**
4. Copy:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...
   CLERK_SECRET_KEY = sk_test_...
   ```

---

## 3️⃣ Create Convex Account & Deploy

1. Go to **https://convex.dev** → Sign up (free)
2. Create new project

**In your terminal:**
```bash
npx convex init
```

This will:
- Ask you to log in
- Create your deployment
- Automatically set `NEXT_PUBLIC_CONVEX_URL` in `.env.local`

---

## 4️⃣ Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Clerk keys:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CONVEX_URL=https://... (auto-filled by convex init)
```

---

## 5️⃣ Deploy Convex Schema

```bash
npx convex deploy
```

Or use dev mode:
```bash
npx convex dev
```

---

## 6️⃣ Start Development

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run convex
```

Open **http://localhost:3000**

---

## ✨ Test It Out

1. Click **"Sign Up"** button
2. Enter email + password
3. Complete signup
4. ✅ See user icon in header (Clerk working!)
5. Go to **http://localhost:3000/dashboards**
6. ✅ See your user info (Convex working!)

---

## 📁 What Was Created For You

```
✅ Clerk Integration:
   - Middleware with clerkMiddleware()
   - ClerkProvider in layout
   - Sign-in, Sign-up, Home pages

✅ Convex Backend:
   - 10-table database schema
   - User CRUD operations
   - Auth helpers

✅ Frontend:
   - Convex client provider
   - Custom hooks for queries/mutations
   - TypeScript types pre-defined

✅ Ready-to-Use:
   - All routes configured
   - Environment variables template
   - SETUP_GUIDE.md with details
```

---

## 🎯 What's Next After Testing

Once you see everything working:

1. **Read Module 1 Docs:**
   ```
   /docs/modules/01-auth.md
   ```

2. **Add Role Selection:**
   - After signup, ask user their role
   - Admin / Teacher / Student

3. **Implement Role-Based Redirects:**
   - /admin → Admin dashboard
   - /teacher → Teacher dashboard
   - /student → Student dashboard

4. **Build Module 2: User Management**

---

## 🆘 Troubleshooting

**Page shows blank?**
→ Make sure both terminals are running (`npm run dev` and `npm run convex`)

**Can't sign up?**
→ Check Clerk credentials in `.env.local`

**Can't see user data on dashboard?**
→ Make sure `NEXT_PUBLIC_CONVEX_URL` is set

**"Cannot find module"?**
→ Run `npm install` again

---

## 📚 Documentation

- **Full Setup Guide:** `SETUP_GUIDE.md`
- **Module 1:** `docs/modules/01-auth.md`
- **Project Plan:** `docs/PROJECT_PLAN.md`
- **Clerk Docs:** https://clerk.com/docs
- **Convex Docs:** https://docs.convex.dev

---

**✨ Let me know when you've set up Clerk and Convex, and I'll help you with the next steps!**
