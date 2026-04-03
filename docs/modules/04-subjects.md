# Module 4: Subject Management

**Status:** ⏳ Not Started  
**Depends On:** Module 1 (Authentication)

---

## 📌 Objective

Create and manage subjects (e.g., Mathematics, Physics, Chemistry). These subjects can be assigned to batches with different teachers.

---

## ✨ Features

1. **Create Subject**
   - Form: name, subject code, description (optional)
   - Example: Name=Mathematics, Code=MATH

2. **View All Subjects**
   - Table with all subjects
   - Show: subject name, code, description

3. **Edit Subject**
   - Modal to update subject details

4. **Delete Subject**
   - Soft delete (set inactive)

5. **View Subject Details**
   - Show which batches use this subject
   - Show which teachers teach this subject

---

## 🗄️ Database Schema Used

### Subjects Table (New)
```
{
  _id: Id<"subjects">,
  name: string (e.g., "Mathematics"),
  code: string (unique, e.g., "MATH"),
  description?: string,
  isActive: boolean (default: true),
  createdAt: number,
  updatedAt: number
}
```

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getAllSubjects()`**
   - Returns: Array of all active subjects
   - Use: `.withIndex()` for efficiency

2. **`getSubjectById(subjectId)`**
   - Input: `subjectId`
   - Returns: Subject document

3. **`getSubjectByCode(code)`**
   - Input: `code` (e.g., "MATH")
   - Returns: Subject document
   - Use: For quick lookup

4. **`getSubjectBatches(subjectId)`**
   - Input: `subjectId`
   - Returns: Array of batches using this subject
   - Join: With BatchSubjects table

5. **`searchSubjects(query)`**
   - Input: Search string (by name/code)
   - Returns: Filtered subjects

### Mutations

1. **`createSubject(data)`**
   - Input:
     ```
     {
       name: string,
       code: string,
       description?: string
     }
     ```
   - Returns: Created subject ID
   - Validation: Code must be unique

2. **`updateSubject(subjectId, data)`**
   - Input: `subjectId`, `{ name?, code?, description? }`
   - Cannot change code once created (optional: allow change with validation)
   - Returns: Updated subject

3. **`deleteSubject(subjectId)`**
   - Input: `subjectId`
   - Sets: `isActive = false`
   - Validation: Warn if subject is in use (e.g., has batch mappings)

---

## 🎨 UI Components

### Subjects Management Page (`/app/(admin)/subjects/page.tsx`)

**Components:**

1. **CreateSubjectButton**
   - Button → Opens create modal

2. **CreateSubjectModal**
   - Form fields:
     - Name (text input)
     - Code (text input, uppercase auto-conversion)
     - Description (textarea, optional)
   - Submit button

3. **SubjectsTable**
   - Columns: code, name, description, actions
   - Row actions: View Details, Edit, Delete
   - Pagination
   - Search bar

4. **EditSubjectModal**
   - Pre-filled form
   - Update button
   - Delete button

5. **SubjectDetailsModal**
   - Show subject info
   - Show which batches use this subject
   - Show which teachers teach this subject

---

## 🧪 Test Cases

- [ ] Admin can create new subject
- [ ] Subject code is unique
- [ ] Subject stored in Convex
- [ ] Admin can view subject in table
- [ ] Subject code auto-converts to uppercase
- [ ] Admin can edit subject (name, description)
- [ ] Admin can delete subject (soft delete)
- [ ] Deleted subject hidden from list
- [ ] Search by subject name works
- [ ] Search by subject code works
- [ ] Warning appears when deleting subject in use
- [ ] Subject details show associated batches

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create Subjects table in schema
- [ ] Implement all queries in `convex/subjects.ts`
- [ ] Implement all mutations
- [ ] Add code uniqueness validation
- [ ] Add search index

### Next.js Frontend
- [ ] Create Subjects page
- [ ] Create all components (table, modals)
- [ ] Implement create subject flow
- [ ] Implement edit subject flow
- [ ] Implement delete subject flow
- [ ] Add search functionality

### Hooks & Utils
- [ ] Create `useGetSubjects()` hook
- [ ] Create `useCreateSubject()` hook
- [ ] Create `useUpdateSubject()` hook
- [ ] Create `useDeleteSubject()` hook
- [ ] Create code formatter util (uppercase)

### Validation & Error Handling
- [ ] Form validation (required fields)
- [ ] Subject code uniqueness check
- [ ] Error messages
- [ ] Success messages

### Testing
- [ ] Test all CRUD operations
- [ ] Test code uniqueness
- [ ] Test search
- [ ] Test soft delete

---

## 📝 Completion Checklist

- [ ] Subject management fully functional
- [ ] All CRUD operations working
- [ ] Subject code unique and uppercase
- [ ] Search/filter working
- [ ] Error handling implemented
- [ ] Validation working
- [ ] Loading states implemented
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Subject code should be unique and typically uppercase (e.g., MATH, PHYS, CHEM)
- Consider standard subject list for India: Math, Physics, Chemistry, Biology, English, Hindi, etc.
- Subject code should not change after creation (or require careful handling)
- When deleting, warn if subject is in use

**Mark as COMPLETE when:** Full subject CRUD working, code uniqueness enforced
