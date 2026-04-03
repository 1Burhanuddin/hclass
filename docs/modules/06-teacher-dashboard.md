# Module 6: Teacher Dashboard

**Status:** ⏳ Not Started  
**Depends On:** Modules 1-5 (Complete foundation)

---

## 📌 Objective

Create a comprehensive teacher dashboard showing:
- Assigned batch-subject combinations
- Quick access to attendance marking
- Assignment creation interface
- Student list for each batch-subject
- Notifications

---

## ✨ Features

1. **Dashboard Overview**
   - Welcome message: "Hello, [Teacher Name]"
   - Summary cards: Total batches, total subjects, total students
   - Quick actions buttons

2. **My Classes/Subjects**
   - Show all batch-subject combinations assigned to teacher
   - Cards showing: Batch name (10th A), Subject (Math), Student count
   - Click to expand → View full class details

3. **Class Details View**
   - Show all students in batch
   - Quick action buttons:
     - Mark Attendance (for today)
     - View Full Attendance (history)
     - Create Assignment
     - View Assignments

4. **Notifications**
   - Show recent notifications
   - Mark as read/unread
   - Filter by type

5. **Quick Actions**
   - Buttons on dashboard:
     - Mark Attendance (opens modal)
     - Create Assignment (opens modal)
     - Send Notification
     - View Reports

---

## 🗄️ Database Schema Used

**No new tables:** Uses existing tables:
- Users
- Teachers
- BatchSubjects (CORE - lists teacher's assignments)
- Batches
- Students
- Attendance
- Assignments
- Notifications

---

## 🔄 Convex Queries Used

1. **`getTeacherBatchSubjects(teacherId)`**
   - Returns: All batch-subject combinations for teacher
   - Join: With batch and subject details

2. **`getBatchSubjectStudents(batchSubjectId)`**
   - Returns: All students in this batch-subject mapping
   - Join: With student and user details

3. **`getTeacherNotifications(teacherId)`**
   - Returns: Recent notifications for teacher
   - Filter: Unread or last 7 days

4. **`getTeacherAssignments(teacherId)`**
   - Returns: All assignments created by teacher
   - Filter: Optional - by batch-subject

---

## 🎨 UI Components

### Teacher Dashboard Page (`/app/(teacher)/dashboard/page.tsx`)

**Layout:**
- Sidebar: Navigation (Dashboard, Attendance, Assignments, Notifications, Profile)
- Main content: Dashboard content
- Header: User profile, logout

**Components:**

1. **WelcomeCard**
   - Greeting: "Hello, [Name]"
   - Profile info
   - Quick stats

2. **StatsCards**
   - Card 1: Total Batches
   - Card 2: Total Subjects
   - Card 3: Total Students
   - Each showing quick number

3. **MyClassesGrid**
   - Grid of class cards
   - Each card shows:
     - Batch name (CLASS-10A)
     - Subject name (Mathematics)
     - Teacher name (Your name / co-teacher)
     - Student count
     - Click → Expand to details

4. **ClassDetailsPanel**
   - Show when class card clicked
   - Content:
     - Class info
     - StudentsList (mini table)
     - Quick action buttons:
       - Mark Attendance Today
       - View Attendance History
       - Create Assignment
       - Browse Assignments

5. **AttendanceButton/Modal**
   - Quick button: "Mark Attendance"
   - Opens modal:
     - Select class/batch-subject (dropdown)
     - Select date (date picker)
     - Show all students with checkboxes
     - Bulk mark: Present/Absent
     - Individual override: Student-wise status
     - Submit button

6. **AssignmentButton/Modal**
   - Quick button: "Create Assignment"
   - Opens modal:
     - Select class/batch-subject
     - Form fields: Title, Description, Due Date, Attachment
     - Submit button

7. **NotificationsPanel**
   - Show recent 5-10 notifications
   - List: Title, Date, Read status
   - Mark as read button
   - "View All" link to notifications page

8. **QuickActionsBar**
   - Floating or sticky buttons:
     - Mark Attendance
     - Create Assignment
     - Send Message/Notification
     - View Reports

---

## 🧪 Test Cases

- [ ] Teacher sees only their assigned classes/subjects
- [ ] Dashboard shows correct student count for each class
- [ ] Student list can be viewed for each class
- [ ] Quick attendance marking opens modal
- [ ] Quick assignment creation opens modal
- [ ] Notifications display correctly
- [ ] Mark as read updates notification
- [ ] Filter notifications by type works
- [ ] Class cards are clickable and expandable
- [ ] All quick action buttons functional
- [ ] Stats cards show correct counts
- [ ] Dashboard responsive on mobile
- [ ] Loading states show during data fetch

---

## 🔧 Implementation Checklist

### Convex Queries
- [ ] Query: getTeacherBatchSubjects (with joins)
- [ ] Query: getBatchSubjectStudents (with joins)
- [ ] Query: getTeacherNotifications
- [ ] Query: getTeacherAssignments

### Next.js Frontend
- [ ] Create teacher layout (sidebar, header)
- [ ] Create dashboard page
- [ ] Create all components listed above
- [ ] Implement responsive design
- [ ] Add loading states
- [ ] Add error states

### Hooks & Utils
- [ ] Create `useGetTeacherBatchSubjects()` hook
- [ ] Create `useGetBatchSubjectStudents()` hook
- [ ] Create `useGetTeacherNotifications()` hook
- [ ] Create helper functions for formatting

### Styling & UX
- [ ] Material UI components used correctly
- [ ] Tailwind for additional styling
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Loading spinners
- [ ] Error boundaries
- [ ] Empty states (no classes, no notifications)

### Testing
- [ ] Test all queries with sample data
- [ ] Test UI responsiveness
- [ ] Test modal opening/closing
- [ ] Test button interactions
- [ ] Test loading states

---

## 📝 Completion Checklist

- [ ] Dashboard layout created
- [ ] All queries implemented and working
- [ ] All components created
- [ ] Teacher sees only their classes
- [ ] Quick actions functional
- [ ] Responsive design implemented
- [ ] Loading and error states handled
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Dashboard is gateway for teacher to access all features
- Make quick actions prominent (buttons floating or sticky)
- Consider caching teacher's batch-subjects (this won't change often)
- Use skeleton loaders for better UX
- Consider dark mode support
- Student count can be cached or calculated real-time

**Mark as COMPLETE when:** Dashboard shows correct data, all quick actions work, responsive on mobile
