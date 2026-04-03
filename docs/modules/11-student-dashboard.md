# Module 11: Student Dashboard

**Status:** ⏳ Not Started  
**Depends On:** Modules 1-10 (All complete)

---

## 📌 Objective

Create comprehensive student dashboard showing:
- Personal information
- Enrolled subjects and batches
- Attendance overview
- Assignments
- Fees status
- Notifications

---

## ✨ Features

1. **Dashboard Overview**
   - Welcome message: "Hello, [Student Name]"
   - Quick stats cards
   - Recent activity

2. **Personal Info Widget**
   - Name, Roll Number
   - Batch
   - Enrollment Date

3. **My Subjects**
   - Show all subjects in enrolled batch
   - Show teacher names
   - Quick links to assignments

4. **Attendance Widget**
   - Show: Overall attendance percentage
   - Show: Present/Absent/Leave count
   - Color code: Red (<75%), Yellow (75-85%), Green (>85%)
   - Link: View full attendance

5. **Assignments Widget**
   - Show: Upcoming assignments (next 7 days)
   - Show: Overdue assignments (red!!)
   - Show: Completed assignments
   - Link: View all assignments

6. **Fees Widget**
   - Show: Fees status
   - Show: Due amount (if any)
   - Color code: Green (paid), Yellow (partial), Red (due)
   - Link: View fee details

7. **Notifications Widget**
   - Show: Recent 5 notifications
   - Unread count badge
   - Link: View all notifications

8. **Sidebar Navigation**
   - Dashboard (current)
   - My Subjects
   - Attendance
   - Assignments
   - Fees
   - Notifications
   - Profile
   - Logout

---

## 🗄️ Database Schema Used

**No new tables:** Uses existing tables via queries

---

## 🔄 Convex Queries Used

1. **`getStudentDetails(studentId)`**
   - Get student info + user details

2. **`getStudentBatch(studentId)`**
   - Get enrolled batch

3. **`getBatchSubjects(batchId)`**
   - Get all subjects in batch

4. **`getStudentAttendanceStats(studentId)`**
   - Get attendance percentage and counts

5. **`getStudentAssignments(studentId)`**
   - Get all assignments for student's subjects

6. **`getStudentFees(studentId)`**
   - Get fees record

7. **`getStudentNotifications(studentId, limit: 5)`**
   - Get recent notifications

---

## 🎨 UI Components

### Student Dashboard Page (`/app/(student)/dashboard/page.tsx`)

**Overall Layout:**
- Sidebar (fixed or responsive)
- Header with user profile and logout
- Main content area with grid layout

**Components:**

1. **WelcomeHeader**
   - Greeting: "Hello, [Name]"
   - Quote or motivational message

2. **ProfileCard**
   - Show: Profile picture (if available)
   - Name, Roll Number, Batch
   - Enrollment date
   - Edit profile link (optional)

3. **QuickStatsCards**
   - Card grid (4-5 cards):
     - Attendance percentage (with color)
     - Subjects enrolled (count)
     - Assignments (count total)
     - Due fees (if any)
     - Unread notifications (count)

4. **MySubjectsWidget**
   - Title: "My Subjects"
   - Grid/List of subjects with:
     - Subject name
     - Teacher name
     - Quick link to assignments for subject
   - Show: Total subjects

5. **AttendanceWidget**
   - Title: "Your Attendance"
   - Large percentage display
   - Breakdown: Present (green), Absent (red), Leave (yellow)
   - Link: "View Detailed Attendance"
   - Circular progress indicator

6. **AssignmentsWidget**
   - Title: "Assignments"
   - Tabs or sections:
     - Upcoming (next 7 days)
     - Overdue (late)
     - All
   - Show: Preview of each (title, subject, due date)
   - Color code: Overdue (red), Due soon (yellow), Future (green)
   - Link: "View All Assignments"

7. **FeesWidget**
   - Title: "Fees Status"
   - Large status display:
     - Status badge (Paid/Partial/Due)
     - Total fees
     - Paid amount
     - Due amount (if >0)
   - Color code: Green (paid), Yellow (partial), Red (due)
   - Link: "View Fee Details"

8. **NotificationsWidget**
   - Title: "Recent Notifications"
   - Unread count badge
   - List: Recent 5 notifications
     - Title, date, unread indicator
   - Link: "View All Notifications"

9. **SidebarNavigation**
   - Logo/App name
   - Menu items (with icons):
     - Dashboard
     - Subjects
     - Attendance
     - Assignments
     - Fees
     - Notifications
     - Profile
   - Current page highlighted
   - Logout button at bottom
   - User profile section at top or bottom

10. **Header**
    - App name/logo (left)
    - Search bar (center, optional)
    - User menu (right):
      - Profile
      - Settings
      - Logout

---

### Responsive Design

**Mobile:**
- Sidebar hidden, hamburger menu
- Widgets stacked vertically
- Navigation bottom or slide-out drawer

**Tablet:**
- Sidebar narrower or collapsible
- 2-column widget layout

**Desktop:**
- Full sidebar
- 2-column widget layout

---

## 🧪 Test Cases

- [ ] Student sees their own dashboard only
- [ ] Welcome message displays correct name
- [ ] All widgets load with correct data
- [ ] Attendance percentage calculated correctly
- [ ] Subjects list shows correct count
- [ ] Assignments show upcoming and overdue correctly
- [ ] Fees status displays correct amount and color
- [ ] Notifications show recent items
- [ ] All navigation links work
- [ ] Logout button works
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states show while fetching data
- [ ] Error states handled gracefully
- [ ] Empty states shown (e.g., no assignments)

---

## 🔧 Implementation Checklist

### Convex Queries
- [ ] All required queries implemented
- [ ] Queries return joined/related data
- [ ] Queries are optimized

### Next.js Frontend
- [ ] Create student layout (sidebar, header)
- [ ] Create dashboard page
- [ ] Create all components listed above
- [ ] Implement responsive design
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states

### Styling & UX
- [ ] Material UI components integrated
- [ ] Tailwind CSS for additional styling
- [ ] Color coding consistent (attendance, assignments, fees)
- [ ] Icons used appropriately
- [ ] Typography hierarchy clear
- [ ] Spacing and layout balanced
- [ ] Hover effects on interactive elements

### Hooks & Utils
- [ ] Create hook to fetch all dashboard data
- [ ] Create helper functions for calculations
- [ ] Create formatting utils (dates, amounts, percentages)

### Navigation & Routing
- [ ] Sidebar navigation links work
- [ ] Current page highlighted in sidebar
- [ ] All child pages accessible and routed correctly

### Testing
- [ ] Test with different student data
- [ ] Test responsive layout on all breakpoints
- [ ] Test error states
- [ ] Test loading states
- [ ] Verify all data displays correctly

---

## 📝 Completion Checklist

- [ ] Dashboard layout created
- [ ] All widgets implemented and working
- [ ] Data loaded and displayed correctly
- [ ] Navigation working perfectly
- [ ] Responsive design verified
- [ ] Loading and error states working
- [ ] Empty states handled
- [ ] All links functional
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

## 🎉 PROJECT COMPLETION CHECKLIST

After this module, verify:

- [ ] All 11 modules complete and tested
- [ ] No hardcoded data anywhere
- [ ] All forms validated
- [ ] All business logic correct
- [ ] Database schema clean and normalized
- [ ] Convex queries optimized
- [ ] React components reusable
- [ ] Error handling comprehensive
- [ ] Loading states throughout
- [ ] Responsive design on all devices
- [ ] Code follows established patterns
- [ ] Documentation up to date
- [ ] No console errors
- [ ] Ready for production

---

**Notes:**
- This is the final module - completes full system
- Dashboard is entry point for students
- All 11 months of development complete
- Ready for deployment and testing
- Consider beta testing with real users

**Mark as COMPLETE when:** Dashboard fully functional, all data displays correctly, responsive on mobile
