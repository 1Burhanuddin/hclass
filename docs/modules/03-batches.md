# Module 3: Batch Management

**Status:** ⏳ Not Started  
**Depends On:** Module 1 (Authentication)

---

## 📌 Objective

Create and manage class batches (e.g., "10th A", "11th B", "12th C"). Allow admins to:
- Create new batch
- View all batches
- Edit batch details
- Delete batch
- View students in batch

---

## ✨ Features

1. **Create Batch**
   - Form: name, class (dropdown 10-12), section (A-Z)
   - Auto-generate batch code: `CLASS-{class}{section}` (e.g., "CLASS-10A")

2. **View All Batches**
   - Table with all batches
   - Show: batch name, class, section, student count

3. **Edit Batch**
   - Modal to update batch details
   - Show warning if batch has students

4. **Delete Batch**
   - Soft delete (set inactive)
   - Show warning about associated students

5. **View Batch Students**
   - Click on batch → see all students in that batch
   - Quick transfer student option

---

## 🗄️ Database Schema Used

### Batches Table (New)
```
{
  _id: Id<"batches">,
  batchCode: string (unique, e.g., "CLASS-10A"),
  name: string (e.g., "10th A"),
  class: number (10, 11, 12),
  section: string ("A", "B", "C", etc.),
  studentCount: number (computed or stored),
  isActive: boolean (default: true),
  createdAt: number,
  updatedAt: number
}
```

### Students Table (Updated)
```
{
  _id: Id<"students">,
  userId: Id<"users">,
  batchId: Id<"batches">, // Reference to batch
  enrollmentNumber: string,
  joinDate: number,
  isActive: boolean
}
```

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getAllBatches()`**
   - Returns: Array of all active batches
   - Use: `.withIndex()` for efficient querying

2. **`getBatchById(batchId)`**
   - Input: `batchId`
   - Returns: Batch document

3. **`getBatchByCode(batchCode)`**
   - Input: `batchCode` (e.g., "CLASS-10A")
   - Returns: Batch document
   - Use: For quick lookup

4. **`getBatchStudents(batchId)`**
   - Input: `batchId`
   - Returns: Array of students in batch

5. **`getStudentCountByBatch(batchId)`**
   - Input: `batchId`
   - Returns: Number of active students

6. **`searchBatches(query)`**
   - Input: Search string (by name/code)
   - Returns: Filtered batches

### Mutations

1. **`createBatch(data)`**
   - Input:
     ```
     {
       name: string,
       class: number (10-12),
       section: string
     }
     ```
   - Generate: `batchCode = "CLASS-{class}{section}"`
   - Returns: Created batch ID
   - Validation: Batch code should be unique

2. **`updateBatch(batchId, data)`**
   - Input: `batchId`, `{ name?, class?, section? }`
   - Cannot change batch code (immutable)
   - Returns: Updated batch

3. **`deleteBatch(batchId)`**
   - Input: `batchId`
   - Sets: `isActive = false` (soft delete)
   - Validation: Check if batch has students (warning only)

4. **`updateBatchStudentCount(batchId)`**
   - Helper mutation to update student count
   - Triggered after student operations
   - Returns: Updated count

---

## 🎨 UI Components

### Batches Management Page (`/app/(admin)/batches/page.tsx`)

**Components:**

1. **CreateBatchButton**
   - Button → Opens create modal

2. **CreateBatchModal**
   - Form fields:
     - Name (text input)
     - Class (dropdown: 10, 11, 12)
     - Section (text input: A, B, C, D)
   - Auto-display: Generated batch code
   - Submit button

3. **BatchesTable**
   - Columns: batch code, name, class, section, student count, actions
   - Row actions: View Details, Edit, Delete
   - Pagination
   - Search bar

4. **EditBatchModal**
   - Pre-filled form
   - Cannot edit batch code (disabled)
   - Update button
   - Warning if students in batch

5. **BatchDetailsModal**
   - Show batch info
   - Show all students in batch (mini table/list)
   - Transfer student button (quick action)
   - Remove student button

---

## 🧪 Test Cases

- [ ] Admin can create new batch
- [ ] Batch code auto-generated correctly
- [ ] Batch code is unique (e.g., cannot create two "CLASS-10A")
- [ ] Batch stored in Convex
- [ ] Admin can view batch in table
- [ ] Admin can edit batch name
- [ ] Batch code cannot be changed (disabled in form)
- [ ] Admin can delete batch (soft delete)
- [ ] Deleted batch hidden from list
- [ ] Warning appears if deleting batch with students
- [ ] Search by batch name works
- [ ] Search by batch code works
- [ ] Admin can view students in batch
- [ ] Student count displayed correctly
- [ ] Batch code format is correct (CLASS-{class}{section})

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create Batches table in schema
- [ ] Implement all queries in `convex/batches.ts`
- [ ] Implement all mutations
- [ ] Add batch code uniqueness validation
- [ ] Add search index

### Next.js Frontend
- [ ] Create Batches page
- [ ] Create all components (table, modals)
- [ ] Implement create batch flow
- [ ] Implement edit batch flow
- [ ] Implement delete batch flow
- [ ] Add search/filter functionality

### Hooks & Utils
- [ ] Create `useGetBatches()` hook
- [ ] Create `useCreateBatch()` hook
- [ ] Create `useUpdateBatch()` hook
- [ ] Create `useDeleteBatch()` hook
- [ ] Create batch code generation util

### Validation & Error Handling
- [ ] Form validation (required fields, class range)
- [ ] Batch code uniqueness check
- [ ] Error messages for failed operations
- [ ] Success messages

### Testing
- [ ] Test all CRUD operations
- [ ] Test batch code generation
- [ ] Test search/filter
- [ ] Test soft delete

---

## 📝 Completion Checklist

- [ ] Batch management fully functional
- [ ] All CRUD operations working
- [ ] Batch code auto-generation working
- [ ] Search/filter working
- [ ] Student count displayed
- [ ] Error handling implemented
- [ ] Validation working
- [ ] Loading states implemented
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Batch code must be unique
- Consider: Can batch name/section be edited? Usually yes, but code stays same
- When deleting batch, do NOT delete students (just mark batch as inactive)
- Student count can be computed real-time or cached

**Mark as COMPLETE when:** Full batch CRUD working, batch codes unique and correctly formatted
