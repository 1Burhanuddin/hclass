# Module 10: Fees Module

**Status:** ⏳ Not Started  
**Depends On:** Modules 1-2, 9 (Auth, Users, Notifications)

---

## 📌 Objective

Implement fees management system for admins:
- Track student fees (total, paid, due)
- Record fee payments
- Send fee reminders to students
- Generate fee reports

---

## ✨ Features

1. **Student Fee Record**
   - Total fees amount
   - Paid amount
   - Due amount (auto-calculated)
   - Payment status (Paid, Partial, Due)

2. **Track Payments**
   - Record fee payment with date
   - Update paid amount
   - Automatic status update

3. **View Fee Status (Student)**
   - Show: Total fees, paid amount, due amount
   - Show: Status badge
   - Show: Payment history

4. **Admin Dashboard**
   - List all students with fee status
   - Filter by status (Paid, Partial, Due)
   - Collect due fees report

5. **Notifications**
   - Auto-send reminder when fee due
   - Notify when payment received

---

## 🗄️ Database Schema Used

### Fees Table (New)
```
{
  _id: Id<"fees">,
  studentId: Id<"students">,
  totalFees: number,
  paidAmount: number (default: 0),
  dueAmount: number (calculated: totalFees - paidAmount),
  status: "paid" | "partial" | "due",
  lastPaymentDate?: number (timestamp),
  paymentHistory?: Array<{
    date: number,
    amount: number,
    note?: string
  }>,
  createdAt: number,
  updatedAt: number
}
```

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getFeesById(feesId)`**
   - Input: `feesId`
   - Returns: Fee record

2. **`getStudentFees(studentId)`**
   - Input: `studentId`
   - Returns: Fees record for student

3. **`getAllFees()`**
   - Returns: All fees records
   - Join: With student and user details

4. **`getFeesByStatus(status)`**
   - Input: `status` ("paid" | "partial" | "due")
   - Returns: All fees with that status

5. **`getFeesDueList()`**
   - Returns: All students with due status
   - Sort: By due amount (highest first)

6. **`getFeesSummary()`**
   - Returns:
     ```
     {
       totalExpected: number,
       totalCollected: number,
       totalOutstanding: number,
       paidStudents: number,
       partialStudents: number,
       dueStudents: number
     }
     ```

---

### Mutations

1. **`createFees(data)`**
   - Input:
     ```
     {
       studentId: Id<"students">,
       totalFees: number
     }
     ```
   - Creates fee record with:
     - totalFees: provided amount
     - paidAmount: 0
     - dueAmount: totalFees
     - status: "due"
   - Returns: Created fees ID

2. **`recordFeePayment(data)`**
   - Input:
     ```
     {
       studentId: Id<"students">,
       amount: number,
       date?: number,
       note?: string
     }
     ```
   - Updates:
     - paidAmount += amount
     - dueAmount = totalFees - paidAmount
     - status: recalculate ("paid" if dueAmount === 0, "partial" if > 0, "due" if paid === 0)
     - lastPaymentDate: current timestamp
     - paymentHistory: append new payment
   - Returns: Updated fees record

3. **`updateTotalFees(studentId, newTotal)`**
   - Input: `studentId`, `newTotal`
   - Updates totalFees
   - Recalculates: dueAmount, status
   - Returns: Updated record

4. **`recordBulkPayments(payments)`** (Optional)
   - Input: Array of payment records
   - Bulk record payments
   - Returns: Updated records

---

## 🎨 UI Components

### Admin - Fees Management Page (`/app/(admin)/fees/page.tsx`)

**Components:**

1. **FeesSummaryCards**
   - Card 1: Total Expected
   - Card 2: Total Collected
   - Card 3: Outstanding Amount
   - Card 4: Students Status pie chart (Paid, Partial, Due)

2. **FeesTable**
   - Columns: Student Name, Total Fees, Paid Amount, Due Amount, Status, Last Payment, Actions
   - Row actions: Edit, Record Payment, Send Reminder
   - Filters: By status, by batch (optional)
   - Sort: By due amount
   - Pagination
   - Search by student name

3. **RecordPaymentModal**
   - Form fields:
     - Amount paid (text input)
     - Payment date (date picker)
     - Note (optional)
   - Shows: Current status, new status after payment
   - Submit button: "Record Payment"

4. **EditFeesModal**
   - Form fields:
     - Total fees (text input)
     - Paid amount (read-only, show from history)
   - Shows fee status and history
   - Update button

5. **PaymentHistoryPanel**
   - Show list of all payments for a student
   - Columns: Date, Amount, Note
   - Can add new payment from here

---

### Student - View Fees Page (`/app/(student)/fees/page.tsx`)

**Components:**

1. **FeesSummaryCard**
   - Show:
     - Total fees
     - Paid amount
     - Due amount
     - Status badge (Paid/Partial/Due)

2. **PaymentHistoryTable**
   - Show all payments made
   - Columns: Date, Amount, Note
   - Total paid at bottom

3. **DueAmountAlert** (if status is due)
   - Warning box: "Amount due: Rs. [amount]"
   - Message: "Please contact admin for payment"

---

### Admin Dashboard Widget

**FeesCard:**
- Show: "Total Outstanding: Rs. [amount]"
- Show: "3 Students Due"
- Quick links: View Due List, Record Payment

---

## 🧪 Test Cases

**Creating Fees:**
- [ ] Admin can create fee record for student
- [ ] Initial amount set correctly
- [ ] Status set to "due"

**Recording Payments:**
- [ ] Admin can record payment
- [ ] Paid amount updated correctly
- [ ] Due amount recalculated correctly
- [ ] Status updated based on amount:
  - [ ] paid === 0 → "due"
  - [ ] paid > 0 AND paid < total → "partial"
  - [ ] paid === total → "paid"
- [ ] Payment history tracked
- [ ] Last payment date updated

**Viewing Fees:**
- [ ] Admin sees all students with fees
- [ ] Student sees their own fees
- [ ] Filter by status works
- [ ] Summary cards calculate correctly
- [ ] Payment history displays

**Edge Cases:**
- [ ] Cannot pay more than due (validation)
- [ ] Cannot create fees for non-existent student
- [ ] Fees cannot be negative
- [ ] Status changes correctly on payment

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create Fees table in schema
- [ ] Add indexes (by student, status)
- [ ] Implement all queries
- [ ] Implement all mutations
- [ ] Add payment validation

### Next.js Frontend (Admin)
- [ ] Create fees management page
- [ ] Create fees table with all features
- [ ] Create record payment modal
- [ ] Create edit fees modal
- [ ] Implement filters and sorting
- [ ] Create payment history view
- [ ] Add summary cards

### Next.js Frontend (Student)
- [ ] Create student fees page
- [ ] Show fees summary
- [ ] Show payment history
- [ ] Show due amount alert

### Hooks & Utils
- [ ] Create `useGetFees()` hook
- [ ] Create `useRecordPayment()` hook
- [ ] Create `useUpdateTotalFees()` hook
- [ ] Create status calculation util
- [ ] Create amount formatting util

### Validation & Error Handling
- [ ] Validate payment amount (≤ due)
- [ ] Validate amounts (≥ 0)
- [ ] Error message on invalid amounts
- [ ] Success message on payment recorded
- [ ] Loading states

### Testing
- [ ] Test all CRUD operations
- [ ] Test payment recording
- [ ] Test status calculations
- [ ] Test summary calculations
- [ ] Test filters

---

## 📝 Completion Checklist

- [ ] Fees table created
- [ ] All queries implemented
- [ ] All mutations implemented
- [ ] Admin can view all fees
- [ ] Admin can record payments
- [ ] Status calculations correct
- [ ] Student view working
- [ ] Summary calculations correct
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Status logic: Pay attention to rounding (use integers, store as paise if needed)
- Payment history: Keep for audit trail
- Consider: Partial payment UI (show remaining due)
- Future: Email reminder when fee due (30 days before due date?)
- Future: Payment gateway integration (Phase 2)

**Mark as COMPLETE when:** Admin can record payments, status updates correctly, student sees accurate fees
