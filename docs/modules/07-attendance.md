# Module 7: Attendance Module

**Status:** ⏳ Not Started  
**Depends On:** Modules 1-6 (Complete foundation)

---

## 📌 Objective

Implement comprehensive attendance tracking system for teachers and students:
- Mark attendance (present, absent, leave)
- Bulk marking interface
- View attendance history
- Generate attendance reports

---

## ✨ Features

1. **Mark Attendance**
   - Teacher selects: Date, Batch-Subject
   - Show all students in batch
   - Options: Present, Absent, Leave, Late
   - Bulk mark: Mark all as present, then override specific
   - Submit and save

2. **View Attendance History**
   - Student: Can view their own attendance
   - Teacher: Can view for their batch-subjects
   - Show: Date-wise attendance
   - Filter: Date range, status

3. **Attendance Report**
   - Month-wise summary
   - Percentage calculation
   - Export to CSV/PDF (future)

4. **Attendance Stats**
   - Dashboard card: "Your Attendance: 85%"
   - Show: Total present, absent, leave

---

## 🗄️ Database Schema Used

### Attendance Table (New)
```
{
  _id: Id<"attendance">,
  studentId: Id<"students">,
  batchSubjectId: Id<"batchSubjects">,
  date: number (timestamp - start of day),
  status: "present" | "absent" | "leave",
  remark?: string (optional note),
  createdAt: number,
  updatedAt: number
}
```

**Unique Constraint:** (studentId, batchSubjectId, date)

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getAttendanceByStudent(studentId)`**
   - Input: `studentId`
   - Returns: All attendance records for student
   - Join: With batchSubject, batch, subject details

2. **`getAttendanceByBatchSubject(batchSubjectId, startDate?, endDate?)`**
   - Input: `batchSubjectId`, optional date range
   - Returns: All attendance records for batch-subject
   - Join: With student details

3. **`getAttendanceByDate(batchSubjectId, date)`**
   - Input: `batchSubjectId`, specific `date`
   - Returns: All attendance records for that date in batch-subject

4. **`getStudentAttendanceStats(studentId, startDate?, endDate?)`**
   - Input: `studentId`, optional date range
   - Returns: 
     ```
     {
       totalDays: number,
       presentDays: number,
       absentDays: number,
       leaveDays: number,
       percentage: number
     }
     ```

5. **`getBatchSubjectAttendanceStats(batchSubjectId, startDate?, endDate?)`**
   - Input: `batchSubjectId`
   - Returns: Attendance stats for all students in batch-subject

6. **`searchAttendance(studentId, filters)`**
   - Input: `studentId`, filters (status, date range)
   - Returns: Filtered attendance records

### Mutations

1. **`markAttendance(data)`**
   - Input:
     ```
     {
       studentId: Id<"students">,
       batchSubjectId: Id<"batchSubjects">,
       date: number,
       status: "present" | "absent" | "leave",
       remark?: string
     }
     ```
   - Check: If same (studentId, batchSubjectId, date) exists → Update instead
   - Returns: Created/updated attendance ID

2. **`markBulkAttendance(records)`**
   - Input: Array of attendance records (same structure as markAttendance)
   - Bulk insert/update
   - Returns: Array of IDs

3. **`updateAttendance(attendanceId, data)`**
   - Input: `attendanceId`, `{ status?, remark? }`
   - Returns: Updated attendance record

4. **`deleteAttendance(attendanceId)`**
   - Input: `attendanceId`
   - Soft delete: Set status to null or delete record
   - Returns: Confirmation

---

## 🎨 UI Components

### Attendance Page (`/app/(teacher)/attendance/page.tsx`)

**Main Components:**

1. **AttendanceMarkingPage**
   - Layout: Two column or tabbed
   - Left/Tab 1: Attendance form
   - Right/Tab 2: Attendance history

2. **MarkAttendanceForm**
   - Form fields (top of page):
     - Date picker (default: today)
     - Batch-Subject dropdown (populated by teacher's assignment)
     - Fetch button to load students

   - Students list below:
     - Table/Grid showing:
       - Student name
       - Roll number
       - Status buttons: Present, Absent, Leave (toggle)
       - Optional remark field
     
   - Bulk actions:
     - Button: "Mark All Present"
     - Button: "Mark All Absent"
     - Button: "Clear All"
   
   - Submit button: "Save Attendance"

3. **AttendanceHistoryView**
   - Form fields:
     - Date range picker (from, to)
     - Batch-Subject dropdown
     - Status filter (All, Present, Absent, Leave)
   
   - Results table:
     - Columns: Date, Student Name, Status, Remark
     - Sort by date descending
     - Pagination
     - Export button (CSV)

4. **StudentAttendancePage** (`/app/(student)/attendance/page.tsx`)
   - Show personal attendance stats
   - Attendance percentage
   - Month-wise attendance calendar
   - List of attendance records (scrollable)

---

### Student Dashboard Integration

**Attendance Widget:**
- Show: "Your Attendance: 85%"
- Click → Show details or go to attendance page

---

## 🧪 Test Cases

**Marking Attendance:**
- [ ] Teacher can mark attendance for their batch-subjects
- [ ] All students in batch-subject appear in form
- [ ] Attendance records saved to Convex
- [ ] Mark all present works (bulk)
- [ ] Mark all absent works (bulk)
- [ ] Individual student status can be changed
- [ ] Remarks can be added to attendance
- [ ] Can override previously marked attendance for same date

**Viewing Attendance:**
- [ ] Student can view their attendance
- [ ] Student sees correct percentage
- [ ] Teacher can view batch-subject attendance
- [ ] Filter by date range works
- [ ] Filter by status works
- [ ] Attendance stats calculated correctly

**Edge Cases:**
- [ ] Cannot mark attendance for future dates
- [ ] Cannot mark attendance for student not in batch
- [ ] Duplicate attendance prevented (upsert on same date)
- [ ] Attendance counts exclude inactive students

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create Attendance table in schema
- [ ] Add indexes (by student, batch-subject, date)
- [ ] Implement all queries
- [ ] Implement all mutations
- [ ] Add duplicate prevention (upsert logic)

### Next.js Frontend (Teacher)
- [ ] Create attendance page
- [ ] Create attendance marking form
- [ ] Create students list UI
- [ ] Implement bulk marking
- [ ] Create attendance history view
- [ ] Implement filters and sorting

### Next.js Frontend (Student)
- [ ] Create student attendance page
- [ ] Show attendance stats
- [ ] Show attendance records
- [ ] Add calendar view (optional)

### Hooks & Utils
- [ ] Create `useMarkAttendance()` hook
- [ ] Create `useGetAttendance()` hook
- [ ] Create `useGetStudentAttendanceStats()` hook
- [ ] Create percentage calculation util
- [ ] Create date formatting utils

### Validation & Error Handling
- [ ] Form validation (date required, batch-subject required)
- [ ] Error for invalid dates (future dates)
- [ ] Success message after save
- [ ] Error message if save fails
- [ ] Loading states during save

### Testing
- [ ] Test all CRUD operations
- [ ] Test bulk marking
- [ ] Test duplicate prevention
- [ ] Test calculations (percentage)
- [ ] Test queries with joined data

---

## 📝 Completion Checklist

- [ ] Attendance table created and indexed
- [ ] All queries implemented
- [ ] All mutations implemented
- [ ] Marking UI fully functional
- [ ] Bulk marking works
- [ ] History view works
- [ ] Stats calculation correct
- [ ] Student view shows correct data
- [ ] Duplicate prevention working
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Date should be stored as start of day (timestamp at 00:00)
- Percentage: (presentDays / totalDays) * 100
- Consider: Should leave days count towards or away from percentage? (Usually away)
- Bulk operations improve UX (mark all present, then override)
- Consider: Calendar view for better visualization
- Monthly reports helpful for parents/admin

**Mark as COMPLETE when:** Marking works, bulk operations work, stats calculated correctly, student view shows data
