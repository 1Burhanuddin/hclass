# Module 8: Assignment Module

**Status:** ⏳ Not Started  
**Depends On:** Modules 1-7 (Complete foundation)

---

## 📌 Objective

Create assignment management system for teachers and students:
- Teacher creates and distributes assignments
- Students view assignments
- Optional: Track submissions

---

## ✨ Features

1. **Create Assignment (Teacher)**
   - Form:
     - Title
     - Description (with formatting)
     - Due date
     - Batch-Subject selection
     - Attachment upload (optional)
   - Save and broadcast to students

2. **View Assignments (Student)**
   - Show all assignments for enrolled subjects
   - Show: Title, Due Date, Status (Completed/Pending)
   - Filter: By subject, status
   - Mark as viewed/completed (optional)

3. **View Assignment Details**
   - Show description, due date, attachment
   - Download attachment if present

4. **Assignment List (Teacher)**
   - Show all assignments created by teacher
   - Show: Title, Batch-Subject, Due Date, Submission count (if enabled)
   - Edit, Delete options

---

## 🗄️ Database Schema Used

### Assignments Table (New)
```
{
  _id: Id<"assignments">,
  batchSubjectId: Id<"batchSubjects">,
  title: string,
  description: string,
  dueDate: number (timestamp),
  attachmentUrl?: string,
  teacherId: Id<"teachers">,
  createdAt: number,
  updatedAt: number
}
```

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getAssignmentsByBatchSubject(batchSubjectId)`**
   - Input: `batchSubjectId`
   - Returns: All assignments for batch-subject
   - Join: With teacher details

2. **`getStudentAssignments(studentId)`**
   - Input: `studentId`
   - Returns: All assignments for student's subjects
   - Join: With batch-subject, batch, subject, teacher details

3. **`getTeacherAssignments(teacherId)`**
   - Input: `teacherId`
   - Returns: All assignments created by teacher
   - Join: With batch-subject details

4. **`getAssignmentById(assignmentId)`**
   - Input: `assignmentId`
   - Returns: Assignment with all details

5. **`getUpcomingAssignments(studentId, daysAhead?)`**
   - Input: `studentId`, optional days (default: 7)
   - Returns: Assignments due in next N days

---

### Mutations

1. **`createAssignment(data)`**
   - Input:
     ```
     {
       batchSubjectId: Id<"batchSubjects">,
       title: string,
       description: string,
       dueDate: number,
       attachmentUrl?: string,
       teacherId: Id<"teachers">
     }
     ```
   - Validation:
     - Title and description required
     - Due date must be future
     - Batch-subject must exist
   - Returns: Created assignment ID

2. **`updateAssignment(assignmentId, data)`**
   - Input: `assignmentId`, partial data to update
   - Returns: Updated assignment

3. **`deleteAssignment(assignmentId)`**
   - Input: `assignmentId`
   - Soft delete (set deleted flag or hard delete)
   - Returns: Confirmation

---

## 🎨 UI Components

### Teacher - Create Assignment Page (`/app/(teacher)/assignments/create/page.tsx`)

**Components:**

1. **CreateAssignmentForm**
   - Form fields:
     - Batch-Subject dropdown (populated from teacher's assignments)
     - Title text input
     - Description textarea or rich editor
     - Due date picker
     - Attachment upload (drag-drop or file input)
   - Submit button: "Create Assignment"
   - Cancel button

2. **AssignmentPreview** (optional)
   - Show how assignment will appear to students

---

### Teacher - View Assignments Page (`/app/(teacher)/assignments/page.tsx`)

**Components:**

1. **AssignmentsTable**
   - Columns: Title, Batch-Subject, Due Date, Created Date, Actions
   - Row actions: View, Edit, Delete
   - Sort by due date
   - Pagination
   - Search by title

2. **EditAssignmentModal**
   - Pre-filled form
   - Same fields as create form
   - Update button

---

### Student - View Assignments Page (`/app/(student)/assignments/page.tsx`)

**Components:**

1. **AssignmentsGrid or List**
   - Show: Title, Subject, Batch, Due Date, Days remaining
   - Color code: Red (overdue), Yellow (due soon), Green (upcoming)
   - Clickable → Show details

2. **AssignmentDetailsPanel**
   - Show:
     - Title
     - Description (formatted)
     - Subject and Batch
     - Due date with countdown
     - Attachment download button
   - Action: Mark as viewed/completed (optional)

3. **FilterBar**
   - Filter by: Subject, Status (All/Pending/Completed/Overdue)
   - Sort by: Due date, Creation date

---

### Dashboard Widget

**Assignment Widget (Student Dashboard):**
- Show: "3 Upcoming Assignments"
- Show: "1 Overdue"
- List: First 3 assignments
- Link: "View All"

**Assignment Widget (Teacher Dashboard):**
- Show: "5 Assignments Created"
- Recent assignments list

---

## 🧪 Test Cases

**Creating Assignments:**
- [ ] Teacher can create assignment
- [ ] All required fields validated
- [ ] Due date must be future date
- [ ] Assignment saved to Convex
- [ ] Attachment uploaded successfully

**Viewing Assignments (Teacher):**
- [ ] Teacher sees only their assignments
- [ ] All assignments displayed correctly
- [ ] Edit assignment works
- [ ] Delete assignment works
- [ ] Search by title works

**Viewing Assignments (Student):**
- [ ] Student sees assignments for their subjects only
- [ ] Assignment details display correctly
- [ ] Attachment download works
- [ ] Filter by subject works
- [ ] Filter by status works
- [ ] Days remaining calculated correctly

**Edge Cases:**
- [ ] Cannot create assignment with past due date
- [ ] Cannot create assignment without title
- [ ] Students not in batch cannot see assignment
- [ ] Deleted assignments not shown

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create Assignments table in schema
- [ ] Add indexes (by batch-subject, teacher)
- [ ] Implement all queries
- [ ] Implement all mutations
- [ ] Add validation for due dates

### Next.js Frontend (Teacher)
- [ ] Create create assignment page
- [ ] Create create assignment form
- [ ] Create assignments list page
- [ ] Create edit modal
- [ ] Implement search/sort
- [ ] Implement delete functionality

### Next.js Frontend (Student)
- [ ] Create assignments page
- [ ] Create assignments grid/list view
- [ ] Create details panel/modal
- [ ] Implement filters
- [ ] Implement sorting
- [ ] Add attachment download

### Hooks & Utils
- [ ] Create `useCreateAssignment()` hook
- [ ] Create `useGetAssignments()` hook
- [ ] Create `useGetStudentAssignments()` hook
- [ ] Create date formatting utils
- [ ] Create status calculation utils (overdue, upcoming, etc.)

### Validation & Error Handling
- [ ] Form validation (required fields)
- [ ] Due date validation (future only)
- [ ] Error messages on failure
- [ ] Success message on create
- [ ] Loading states

### Testing
- [ ] Test all CRUD operations
- [ ] Test query filtering
- [ ] Test status calculations
- [ ] Test attachment handling
- [ ] Test student visibility

---

## 📝 Completion Checklist

- [ ] Assignments table created
- [ ] All queries implemented
- [ ] All mutations implemented
- [ ] Teacher create/edit/delete working
- [ ] Student view working
- [ ] Filters working
- [ ] Status calculations correct
- [ ] Validation working
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Consider: Rich text editor for descriptions (optional but nice-to-have)
- File upload: Can use Convex file API or third-party (Cloudinary, AWS S3)
- Status: Can be inferred from due date (overdue, due soon, upcoming)
- Consider: Optional submission tracking (Phase 2)
- Student can "mark as completed" (not submission, just personal note)

**Mark as COMPLETE when:** Teacher can create/edit/delete, students see correct assignments, filters work
