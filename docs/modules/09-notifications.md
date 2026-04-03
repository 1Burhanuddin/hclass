# Module 9: Notification Module

**Status:** ⏳ Not Started  
**Depends On:** Modules 1-8 (Complete foundation)

---

## 📌 Objective

Implement notification system to send updates to:
- Individual students
- Entire batches
- All users (admin announcements)

Notification types: Assignment due, attendance alerts, fee reminders, etc.

---

## ✨ Features

1. **Send Notifications**
   - Types: Global, Batch, Individual Student
   - From: Admin, Teacher, System
   - Content: Title, Message

2. **Receive Notifications**
   - Show in dashboard
   - Mark as read/unread
   - View notification history

3. **Notification Preferences** (Optional Phase 2)
   - Choose notification types
   - Email notifications (optional)

---

## 🗄️ Database Schema Used

### Notifications Table (New)
```
{
  _id: Id<"notifications">,
  title: string,
  message: string,
  targetType: "global" | "batch" | "student",
  targetId?: Id<"batches"> | Id<"students">,
  senderId: Id<"users">,
  isRead: boolean (default: false),
  createdAt: number
}
```

---

## 🔄 Convex Queries & Mutations

### Queries

1. **`getAllNotifications()`**
   - Returns: All global notifications (newest first)

2. **`getBatchNotifications(batchId)`**
   - Input: `batchId`
   - Returns: All notifications for batch

3. **`getStudentNotifications(studentId, limit?)`**
   - Input: `studentId`, optional limit (default: 20)
   - Returns: All notifications for student (personal + batch + global)
   - Join: With sender details

4. **`getUnreadNotifications(studentId)`**
   - Input: `studentId`
   - Returns: Unread notifications count and list

5. **`searchNotifications(studentId, query)`**
   - Input: `studentId`, search string
   - Returns: Filtered notifications

---

### Mutations

1. **`createNotification(data)`**
   - Input:
     ```
     {
       title: string,
       message: string,
       targetType: "global" | "batch" | "student",
       targetId?: Id<"batches"> | Id<"students">,
       senderId: Id<"users">
     }
     ```
   - Validation:
     - If targetType is "batch" or "student", targetId must be provided
   - Returns: Created notification ID

2. **`markNotificationAsRead(notificationId)`**
   - Input: `notificationId`
   - Sets: `isRead = true`
   - Returns: Updated notification

3. **`markAllNotificationsAsRead(studentId)`**
   - Input: `studentId`
   - Sets all unread notifications to read
   - Returns: Updated count

4. **`deleteNotification(notificationId)`**
   - Input: `notificationId`
   - Soft or hard delete
   - Returns: Confirmation

5. **`createBulkNotifications(recipients, message)`** (Optional)
   - Input: Array of recipient IDs, message content
   - Bulk create notifications
   - Returns: Created IDs

---

## 🎨 UI Components

### Admin - Send Notification Page (`/app/(admin)/notifications/send/page.tsx`)

**Components:**

1. **SendNotificationForm**
   - Form fields:
     - Target type: Global / Batch / Student (radio buttons)
     - Target selector (conditional):
       - If Batch: Batch dropdown
       - If Student: Student search/select
       - If Global: None
     - Title text input
     - Message textarea
   - Submit button: "Send Notification"

---

### Notification Center (`/app/(admin|teacher|student)/notifications/page.tsx`)

**Components:**

1. **NotificationList**
   - List of notifications
   - Each item shows:
     - Sender name
     - Title
     - Preview of message
     - Date/time
     - Read/unread indicator
     - Click → Expand full message

2. **NotificationDetailsPanel**
   - Show when notification clicked:
     - Full message
     - Sender
     - Date/time
     - Mark as read/unread button
     - Delete button

3. **FilterBar**
   - Filter: Read/Unread
   - Sort: Newest first / Oldest first

4. **EmptyState**
   - Show if no notifications

---

### Dashboard Notification Widget

**NotificationsCard (Student Dashboard):**
- Show: "3 New Notifications"
- List recent 3 notifications
- View All link

**NotificationsCard (Teacher & Admin Dashboard):**
- Similar widget
- Show unread count

---

### Notification Bell Icon (Header)

**NotificationBell:**
- Show unread count badge
- Click → Dropdown showing recent notifications
- Mark as read from dropdown
- View All link

---

## 🧪 Test Cases

**Creating Notifications:**
- [ ] Admin can send global notification
- [ ] Admin can send batch notification
- [ ] Teacher can send batch notification (if assigned)
- [ ] Notification saved to Convex
- [ ] Required fields validated

**Receiving Notifications:**
- [ ] Student receives personal notifications
- [ ] Student receives batch notifications (if in batch)
- [ ] Student receives global notifications
- [ ] Unread count shows correctly

**Managing Notifications:**
- [ ] Can mark as read
- [ ] Can mark all as read
- [ ] Can delete notification
- [ ] Filter by read/unread works
- [ ] Sorting works

**Edge Cases:**
- [ ] Students not in batch don't see batch notifications
- [ ] Cannot send notification to non-existent student/batch
- [ ] Notifications appear in all user views

---

## 🔧 Implementation Checklist

### Convex Setup
- [ ] Create Notifications table
- [ ] Add indexes (by student, batch, read status)
- [ ] Implement all queries
- [ ] Implement all mutations
- [ ] Add validation for targetId

### Next.js Frontend (Admin)
- [ ] Create send notification page
- [ ] Create send notification form
- [ ] Implement form submission
- [ ] Create notifications center page

### Next.js Frontend (Teacher)
- [ ] Create send notification form (batch only)
- [ ] Create notifications center page

### Next.js Frontend (Student)
- [ ] Create notifications center page
- [ ] Show only relevant notifications
- [ ] Create notification bell widget
- [ ] Add unread badge

### Hooks & Utils
- [ ] Create `useSendNotification()` hook
- [ ] Create `useGetNotifications()` hook
- [ ] Create `useMarkAsRead()` hook
- [ ] Create `useGetUnreadCount()` hook

### UI Components (Reusable)
- [ ] NotificationBell component
- [ ] NotificationItem component
- [ ] NotificationList component

### Testing
- [ ] Test notification creation
- [ ] Test visibility (student, batch, global)
- [ ] Test mark as read
- [ ] Test filtering
- [ ] Test edge cases

---

## 📝 Completion Checklist

- [ ] Notifications table created
- [ ] All queries implemented
- [ ] All mutations implemented
- [ ] Admin can send notifications
- [ ] Students receive notifications
- [ ] Unread count working
- [ ] Mark as read working
- [ ] Delete working
- [ ] All test cases passed
- [ ] Code reviewed and documented

---

**Notes:**
- Simple notification system (no email/SMS for now)
- In-app notifications only
- Consider: Real-time notifications using Convex subscriptions
- Notification TTL: Keep for 30-90 days then archive
- Batch notifications: When teacher creates assignment → auto-notify batch students (Phase 2)

**Mark as COMPLETE when:** Notifications can be sent, received, and managed (read/unread/delete)
