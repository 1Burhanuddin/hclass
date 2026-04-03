# Module 2: User Management (Admin)

**Status:** ⏳ Not Started  
**Depends On:** Module 1 (Authentication)

---

## 📌 Objective

Build admin panel for creating and managing teachers and students. Allow admins to:
- Create new teacher account
- Create new student account
- View all users
- Edit user details
- Delete users (with permissions)

---

## ✨ Features

1. **Create Teacher**
   - Form: name, email, qualification, experience
   - Auto-generate login credentials (via Clerk)
   - Store in Teachers table

2. **Create Student**
   - Form: name, email, batch (dropdown)
   - Auto-generate login credentials
   - Store in Students table

3. **User Listing**
   - Table: Show all teachers
   - Table: Show all students
   - Filter by role
   - Search by name/email

4. **Edit User Details**
   - Modal: Update name, email, qualification
   - Permissions: Only admin can edit

5. **Delete User**
   - Soft delete option
   - Confirm dialog

---

## 🗄️ Database Schema Used

### Users Table
```
{
  _id: Id<"users">,
  clerkId: string,
  name: string,
  email: string,
  role: "admin" | "teacher" | "student",
  profileImage?: string,
  isActive: boolean (default: true),
  createdAt: number
}
```

### Teachers Table (New)
```
{
  _id: Id<"teachers">,
  userId: Id<"users">,
  qualification: string,
  experience: number, // in years
  joinDate: number,
  isActive: boolean (default: true)
}
```

### Students Table (New)
```
{
  _id: Id<"students">,
  userId: Id<"users">,
  batchId: Id<"batches">, // Reference to batch
  enrollmentNumber: string (unique),
  joinDate: number,
  isActive: boolean (default: true)
}
```

---

## 🔄 Convex Queries & Mutations

### Teachers

**Queries:**
1. `getAllTeachers()`
   - Returns: Array of teacher objects with user details
   - Uses: `.withIndex("byUserId")` for joins

2. `getTeacherById(teacherId)`
   - Input: `teacherId`
   - Returns: Teacher with full user details

3. `searchTeachers(query)`
   - Input: Search string
   - Returns: Filtered teachers list

**Mutations:**
1. `createTeacher(userData, teacherData)`
   - Input:
     ```
     {
       clerkId: string,
       name: string,
       email: string,
       qualification: string,
       experience: number
     }
     ```
   - Creates user + teacher record
   - Returns: `teacherId`

2. `updateTeacher(teacherId, data)`
   - Input: `teacherId`, `{ qualification?, experience?, name?, email? }`
   - Updates teacher record
   - Also updates user table if name/email changed

3. `deleteTeacher(teacherId)`
   - Input: `teacherId`
   - Sets `isActive = false` (soft delete)

### Students

**Queries:**
1. `getAllStudents()`
   - Returns: Array of student objects with user details

2. `getStudentById(studentId)`
   - Input: `studentId`
   - Returns: Student with full user details

3. `getStudentsByBatch(batchId)`
   - Input: `batchId`
   - Returns: All active students in batch

4. `searchStudents(query)`
   - Input: Search string
   - Returns: Filtered students list

**Mutations:**
1. `createStudent(userData, studentData)`
   - Input:
     ```
     {
       clerkId: string,
       name: string,
       email: string,
       batchId: Id<"batches">,
       enrollmentNumber: string
     }
     ```
   - Creates user + student record
   - Auto-generate enrollmentNumber if not provided
   - Returns: `studentId`

2. `updateStudent(studentId, data)`
   - Input: `studentId`, update data
   - Updates student record + user table

3. `deleteStudent(studentId)`
   - Input: `studentId`
   - Sets `isActive = false` (soft delete)

4. `transferStudentToBatch(studentId, newBatchId)`
   - Input: `studentId`, `newBatchId`
   - Transfers student to another batch

---

## 🎨 UI Components

### Admin Dashboard Layout
- Sidebar with navigation (Teachers, Students, Batches, etc.)
- Main content area

### Teachers Management Page (`/app/(admin)/teachers/page.tsx`)

**Components:**
1. **CreateTeacherButton**
   - Button → Opens modal

2. **CreateTeacherModal**
   - Form fields: name, email, qualification, experience
   - Submit button with loading state
   - Error handling

3. **TeachersTable**
   - Columns: name, email, qualification, experience, actions
   - Row actions: Edit, Delete
   - Pagination
   - Search/filter bar

4. **EditTeacherModal**
   - Pre-filled form
   - Update button
   - Delete button

### Students Management Page (`/app/(admin)/students/page.tsx`)

**Components:**
1. **CreateStudentButton**
   - Button → Opens modal

2. **CreateStudentModal**
   - Form fields: name, email, batch (dropdown), enrollmentNumber (optional)
   - Batch selector
   - Submit with validation

3. **StudentsTable**
   - Columns: name, email, batch, enrollmentNumber, actions
   - Row actions: Edit, Transfer, Delete
   - Pagination
   - Filter by batch

4. **EditStudentModal**
   - Similar to teacher modal
   - Option to transfer batch

---

## 🧪 Test Cases

### Teachers
- [ ] Admin can create new teacher
- [ ] Teacher data is stored in Convex (Users + Teachers table)
- [ ] Admin can view teacher in table
- [ ] Admin can edit teacher (name, qualification, experience)
- [ ] Admin can delete teacher (soft delete)
- [ ] Deleted teacher is hidden from list
- [ ] Search by teacher name works
- [ ] All required fields are validated

### Students
- [ ] Admin can create new student
- [ ] Student data is stored (Users + Students table)
- [ ] Admin can view student in table
- [ ] Admin can edit student details
- [ ] Admin can transfer student to batch
- [ ] Admin can delete student (soft delete)
- [ ] Search by student name works
- [ ] Filter by batch works
- [ ] EnrollmentNumber is unique

### UI/UX
- [ ] Forms have proper validation messages
- [ ] Loading states show during API calls
- [ ] Error messages display for failed operations
- [ ] Success messages show after operation
- [ ] Pagination works correctly
- [ ] Delete confirmation appears

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Update schema with Teachers and Students tables
- [ ] Add indexes for searching
- [ ] Implement all queries in `convex/users.ts`
- [ ] Implement all mutations
- [ ] Add validation (unique emails, enrollmentNumbers)

### Next.js Frontend
- [ ] Create admin dashboard layout
- [ ] Create Teachers page with components
- [ ] Create Students page with components
- [ ] Create modals for create/edit
- [ ] Add form validation
- [ ] Add loading and error states

### Hooks & Utils
- [ ] Create `useGetTeachers()` hook
- [ ] Create `useCreateTeacher()` hook
- [ ] Create `useGetStudents()` hook
- [ ] Create `useCreateStudent()` hook
- [ ] Create form validation utils

### UI Components (Reusable)
- [ ] Modal component (reusable)
- [ ] Table component (reusable)
- [ ] Form component (reusable)
- [ ] Button with loading state

### Testing
- [ ] Test all CRUD operations
- [ ] Test search/filter
- [ ] Test validation
- [ ] Test error handling

---

## 📝 Completion Checklist

- [ ] Teachers table operations fully functional
- [ ] Students table operations fully functional
- [ ] All UI components created
- [ ] Form validation working
- [ ] Search/filter working
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Success messages implemented
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Use Convex helper functions for efficient queries
- Consider implementing batch operations (bulk create, bulk delete)
- EnrollmentNumber should be auto-generated: `STD-{YEAR}-{BATCH}-{SERIAL}`
- Consider soft deletes for data integrity

**Mark as COMPLETE when:** Full CRUD working for both teachers and students, all validations pass
