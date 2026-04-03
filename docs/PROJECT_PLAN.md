# Harshdeep Classes Management System - Project Plan

## 📋 Project Overview

**Harshdeep Classes Management System** is a full-stack web application designed to streamline the management of educational classes, students, teachers, attendance, assignments, and fees. The system supports three primary roles: Admin, Teacher, and Student.

### Key Features:
- Role-based access control (Admin, Teacher, Student)
- Batch and subject management
- Teacher-subject-batch mapping
- Attendance tracking
- Assignment management
- Notification system
- Fee management and tracking
- Real-time data synchronization

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **Material UI (MUI)** for component library (exclusive, no Tailwind CSS)
- **React 18+** with hooks
- **Clerk** for authentication UI

### 📐 Design Approach
- **Admin Side:** Desktop-first (optimized for 1920px+ screens, teachers/admins manage data on desktops)
- **Student Side:** Mobile-first (responsive design prioritizing mobile experience for student access)
- **Shared Components:** Material UI components with responsive `sx` prop for all screen sizes

### Backend
- **Convex.dev** - Backend-as-a-Service
  - Queries for data fetching
  - Mutations for data modification
  - Real-time state management
  - Database (JSON-like normalized structure)

### Authentication
- **Clerk** - Complete user authentication and session management

### State Management
- ✅ **Convex hooks** for server state (`useQuery`, `useMutation`)
- ✅ **React useState** for local UI state
- ✅ **Context API** (only if absolutely necessary)
- ❌ **NO Redux**

---

## 📁 Folder Structure

```
hclass/
├── docs/
│   ├── PROJECT_PLAN.md (this file)
│   └── modules/
│       ├── 01-auth.md
│       ├── 02-users.md
│       ├── 03-batches.md
│       ├── 04-subjects.md
│       ├── 05-mapping.md
│       ├── 06-teacher-dashboard.md
│       ├── 07-attendance.md
│       ├── 08-assignments.md
│       ├── 09-notifications.md
│       ├── 10-fees.md
│       └── 11-student-dashboard.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   ├── (admin)/
│   │   ├── (teacher)/
│   │   └── (student)/
│   ├── components/
│   │   ├── shared/
│   │   ├── admin/
│   │   ├── teacher/
│   │   └── student/
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   ├── context/
│   └── types/
│
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   ├── http.ts
│   ├── auth.ts
│   ├── users.ts
│   ├── batches.ts
│   ├── subjects.ts
│   ├── batchSubjects.ts
│   ├── attendance.ts
│   ├── assignments.ts
│   ├── notifications.ts
│   └── fees.ts
│
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── convex.json
└── .env.local
```

---

## 👥 Role Definitions

### Admin
- Create/manage teachers and students
- Create batches (e.g., 10th A, 11th B)
- Create subjects
- Map teachers to batch-subject combinations
- View dashboard with system overview
- Manage fee records

### Teacher
- View assigned batch-subject combinations
- Mark attendance for students
- Create and manage assignments
- View student performance
- Send notifications to batches/students

### Student
- View assigned subjects (via batch)
- View attendance records
- View assignments
- View notifications
- View fee status

---

## 🗄️ Database Schema (Convex)

### Users Table
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

### Students Table
```
{
  _id: Id<"students">,
  userId: Id<"users">,
  batchId: Id<"batches">,
  enrollmentNumber: string,
  joinDate: number (timestamp)
}
```

### Teachers Table
```
{
  _id: Id<"teachers">,
  userId: Id<"users">,
  qualification: string,
  experience: number,
  joinDate: number (timestamp)
}
```

### Batches Table
```
{
  _id: Id<"batches">,
  name: string (e.g., "10th A"),
  class: number (10, 11, 12),
  section: string ("A", "B", "C"),
  createdAt: number (timestamp)
}
```

### Subjects Table
```
{
  _id: Id<"subjects">,
  name: string (e.g., "Mathematics"),
  code: string (e.g., "MATH"),
  description?: string,
  createdAt: number (timestamp)
}
```

### BatchSubjects Table (CORE RELATIONSHIP)
```
{
  _id: Id<"batchSubjects">,
  batchId: Id<"batches">,
  subjectId: Id<"subjects">,
  teacherId: Id<"teachers">,
  createdAt: number (timestamp)
}
```

### Attendance Table
```
{
  _id: Id<"attendance">,
  studentId: Id<"students">,
  batchSubjectId: Id<"batchSubjects">,
  date: number (timestamp),
  status: "present" | "absent" | "leave",
  remark?: string,
  createdAt: number (timestamp)
}
```

### Assignments Table
```
{
  _id: Id<"assignments">,
  batchSubjectId: Id<"batchSubjects">,
  title: string,
  description: string,
  dueDate: number (timestamp),
  attachmentUrl?: string,
  createdAt: number (timestamp)
}
```

### Notifications Table
```
{
  _id: Id<"notifications">,
  title: string,
  message: string,
  targetType: "global" | "batch" | "student",
  targetId?: Id<"batches"> | Id<"students">,
  senderId: Id<"users">,
  isRead: boolean (default: false),
  createdAt: number (timestamp)
}
```

### Fees Table
```
{
  _id: Id<"fees">,
  studentId: Id<"students">,
  totalFees: number,
  paidAmount: number,
  dueAmount: number,
  status: "paid" | "partial" | "due",
  lastPaymentDate?: number (timestamp),
  updatedAt: number (timestamp)
}
```

---

## 🎯 Module Breakdown (Execution Order)

| # | Module | Status | Objective |
|---|--------|--------|-----------|
| 1 | Authentication & Role Setup | ✅ Complete | Clerk integration + role-based routing |
| 2 | User Management (Admin) | ✅ Complete | Create/manage teachers & students |
| 3 | Batch Management | ✅ Complete | Create batches, manage sections |
| 4 | Subject Management | ✅ Complete | Create subjects for batches |
| 5 | Batch-Subject-Teacher Mapping | ✅ Complete | Core relationship mapping |
| 6 | Teacher Dashboard | 🟡 In Progress | View assignments, attendance tools |
| 7 | Attendance Module | ⏳ Not Started | Mark and track attendance |
| 8 | Assignment Module | ⏳ Not Started | Create, distribute, track assignments |
| 9 | Notification Module | ⏳ Not Started | Send alerts to users |
| 10 | Fees Module | ⏳ Not Started | Manage student fees |
| 11 | Student Dashboard | ⏳ Not Started | View subjects, fees, assignments |

---

## ⚙️ Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Clerk**
   - Create project on [clerk.com](https://clerk.com)
   - Add environment variables (see .env.local template)

3. **Set up Convex**
   ```bash
   npm install convex
   npx convex init
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

---

## 📝 Development Rules (STRICT)

- ✅ Build ONE module at a time
- ✅ Complete module before moving to next
- ✅ No hardcoded data
- ✅ All features properly validated
- ✅ Use Convex for all server state
- ✅ Use React hooks for UI state
- ✅ Write clean, modular code
- ❌ NO Redux
- ❌ NO mixing incomplete features
- ❌ NO skipping modules

---

## 🚀 Next Steps

1. Read [Module 1: Authentication & Role Setup](./modules/01-auth.md)
2. Implement Convex queries/mutations
3. Build Next.js pages and components
4. Test thoroughly
5. Mark module complete
6. Proceed to next module

---

**Last Updated:** April 2, 2026
**Status:** Documentation Complete, Ready for Module 1
