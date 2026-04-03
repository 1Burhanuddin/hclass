# Module 5: Batch-Subject-Teacher Mapping (CRITICAL)

**Status:** ⏳ Not Started  
**Depends On:** Modules 1, 2, 3, 4 (Auth, Users, Batches, Subjects)

---

## 📌 Objective

**CRITICAL MODULE** - This is the core relationship in the system. Map a specific teacher to a specific subject in a specific batch.

Example: Teacher "Mr. Sharma" teaches "Mathematics" to batch "10th A"

This mapping is used for:
- Attendance tracking
- Assignment creation
- Notification sending
- Teacher dashboard

---

## ✨ Features

1. **Create Mapping**
   - Select: Batch, Subject, Teacher
   - Validate: Batch + Subject doesn't already have mapping to different teacher
   - Allow: One batch-subject can have multiple teachers (e.g., lab assistant)

2. **View All Mappings**
   - Table: Show batch, subject, teacher
   - Filter by batch, subject, or teacher

3. **Edit Mapping**
   - Change teacher for a batch-subject
   - Show history/preview of change impact

4. **Delete Mapping**
   - Remove teacher from batch-subject
   - Validation: Check attendance/assignments exist (cannot delete if exists)

5. **View Teacher Assignments**
   - For a teacher: Show all batch-subject combinations
   - Used by teacher dashboard

---

## 🗄️ Database Schema Used

### BatchSubjects Table (New - CORE TABLE)
```
{
  _id: Id<"batchSubjects">,
  batchId: Id<"batches">,
  subjectId: Id<"subjects">,
  teacherId: Id<"teachers">,
  isActive: boolean (default: true),
  createdAt: number,
  updatedAt: number
}
```

**Unique Constraint:** (batchId, subjectId, teacherId) combination

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getAllBatchSubjects()`**
   - Returns: Array of all active mappings with full details
   - Join: Batch, Subject, Teacher(User) tables
   - Use: For admin listing

2. **`getBatchSubjectById(batchSubjectId)`**
   - Input: `batchSubjectId`
   - Returns: Mapping with full details

3. **`getBatchSubjectsByBatch(batchId)`**
   - Input: `batchId`
   - Returns: All subjects taught in this batch
   - Join: With Subjects and Teachers

4. **`getBatchSubjectsByTeacher(teacherId)`**
   - Input: `teacherId`
   - Returns: All batch-subject combinations for this teacher
   - Join: With Batches and Subjects
   - Use: For teacher dashboard

5. **`getBatchSubjectsBySubject(subjectId)`**
   - Input: `subjectId`
   - Returns: All batches where this subject is taught

6. **`searchBatchSubjects(query, filters?)`**
   - Input: Search string, optional filters (batch, subject, teacher)
   - Returns: Filtered mappings

7. **`getTeacherBatchSubjects(teacherId)`**
   - Alternative name for getBatchSubjectsByTeacher
   - Returns: Teacher's complete schedule

### Mutations

1. **`createBatchSubject(data)`**
   - Input:
     ```
     {
       batchId: Id<"batches">,
       subjectId: Id<"subjects">,
       teacherId: Id<"teachers">
     }
     ```
   - Validation:
     - Batch must exist and be active
     - Subject must exist and be active
     - Teacher must exist and be active
     - No duplicate mapping already exists
   - Returns: Created mapping ID

2. **`updateBatchSubject(batchSubjectId, data)`**
   - Input: `batchSubjectId`, `{ teacherId? }`
   - Allow changing teacher for same batch-subject
   - Validation: New teacher must exist and be active
   - Returns: Updated mapping

3. **`deleteBatchSubject(batchSubjectId)`**
   - Input: `batchSubjectId`
   - Validation: Check if attendance/assignments exist
     - If YES: Cannot delete (return error)
     - If NO: Allow soft delete
   - Returns: Confirmation or error

4. **`createMultipleBatchSubjects(mappings)`**
   - Bulk create for efficiency
   - Input: Array of mapping data
   - Returns: Array of created IDs
   - Use: When assigning multiple teachers to subjects in a batch

---

## 🎨 UI Components

### Batch-Subject-Teacher Mapping Page (`/app/(admin)/batch-subjects/page.tsx`)

**Components:**

1. **CreateMappingButton**
   - Button → Opens create modal

2. **CreateMappingModal**
   - Form fields (all required):
     - Batch (dropdown, loads all active batches)
     - Subject (dropdown, loads all active subjects)
     - Teacher (dropdown, loads all active teachers)
   - Show warning if mapping already exists
   - Show preview: "Mr. Sharma will teach Mathematics to 10th A"
   - Submit button

3. **BatchSubjectsTable**
   - Columns: batch (CLASS-10A), subject, teacher name, actions
   - Row actions: Edit (change teacher), Remove
   - Pagination
   - Advanced filters:
     - Filter by batch
     - Filter by subject
     - Filter by teacher

4. **EditMappingModal**
   - Pre-filled: Batch, Subject (disabled)
   - Allow changing: Teacher (dropdown)
   - Warning: Show if attendance/assignments attached
   - Update button

5. **DeleteConfirmationDialog**
   - Show: If attendance/assignments exist, show error
   - Otherwise: Show confirmation to delete
   - Delete button

---

## 🧪 Test Cases

- [ ] Admin can create batch-subject-teacher mapping
- [ ] Mapping data stored in Convex
- [ ] Admin can view mapping in table
- [ ] Duplicate mapping prevented (same batch+subject cannot have two teachers)
- [ ] Admin can edit mapping (change teacher)
- [ ] Admin can delete mapping (if no attendance/assignments)
- [ ] Cannot delete if attendance exists (error shown)
- [ ] Cannot delete if assignments exist (error shown)
- [ ] Filter by batch works
- [ ] Filter by subject works
- [ ] Filter by teacher works
- [ ] Teacher dashboard shows all assigned batch-subjects
- [ ] Batch shows all subjects with teachers
- [ ] Subject shows all batches where it's taught

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create BatchSubjects table in schema
- [ ] Add indexes for efficient queries (by batch, teacher, subject)
- [ ] Implement all queries in `convex/batchSubjects.ts`
- [ ] Implement all mutations
- [ ] Add duplicate mapping validation
- [ ] Add attendance/assignment existence check before delete

### Next.js Frontend
- [ ] Create Batch-Subject-Teacher page
- [ ] Create all components (table, modals)
- [ ] Implement create mapping flow
- [ ] Implement edit mapping flow
- [ ] Implement delete mapping flow
- [ ] Implement advanced filtering

### Hooks & Utils
- [ ] Create `useGetBatchSubjects()` hook
- [ ] Create `useGetTeacherBatchSubjects()` hook
- [ ] Create `useCreateBatchSubject()` hook
- [ ] Create `useUpdateBatchSubject()` hook
- [ ] Create `useDeleteBatchSubject()` hook

### Validation & Error Handling
- [ ] Form validation (all fields required)
- [ ] Duplicate mapping check before create
- [ ] Attendance/assignment existence check before delete
- [ ] Error messages (clear explanations)
- [ ] Success messages

### Testing
- [ ] Test all CRUD operations
- [ ] Test duplicate prevention
- [ ] Test delete constraints
- [ ] Test queries (by batch, teacher, subject)
- [ ] Test bulk operations

---

## 📝 Completion Checklist

- [ ] BatchSubjects table created and indexed
- [ ] All CRUD operations working
- [ ] Duplicate prevention working
- [ ] Delete constraints working
- [ ] All queries returning correct data
- [ ] Admin interface fully functional
- [ ] Filter/search working
- [ ] Error handling implemented
- [ ] Validation working
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**CRITICAL NOTES:**
- This is the CORE relationship of the system
- Every attendance, assignment, and notification is tied to a BatchSubject mapping
- Ensure data integrity (cannot delete if children exist)
- Design queries carefully for performance (this will be queried frequently)
- Consider caching teacher schedules (BatchSubjects for a teacher)
- Use indexes on: batchId, teacherId, subjectId

**Mark as COMPLETE when:** All queries return correct joined data, delete constraints work, filters functional
