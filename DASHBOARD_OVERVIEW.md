# Student & Teacher Dashboard Overview

## STUDENT DASHBOARD (`/student`)

### Layout
- Desktop-first responsive design with Material-UI
- Mobile drawer navigation on smaller screens
- Maximum width container (lg breakpoint)
- Padding: 16px on mobile, 24px on tablet, 32px on desktop

### Header Section
```
Welcome back, [Student Name]
```
- Large h4 typography, bold font weight

### Summary Cards Row (4 Cards - Responsive Grid)
**Card 1: Pending Assignments** 
- Icon: AssignmentIcon (blue #1976d2)
- Display: Count of unsubmitted assignments
- Responsive: xs=full width, sm=half width, md=1/4 width

**Card 2: Unread Notifications**
- Icon: NotificationsIcon with badge (orange #ff9800)
- Display: Count of unread notifications
- Badge shows actual count

**Card 3: Fees Status**
- Icon: ReceiptIcon (red #ff6b6b)
- Display: Current fee status (Paid/Pending/Overdue)

**Card 4: Amount Due**
- Icon: ReceiptIcon (green #4caf50)
- Display: ₹ formatted amount due

### Content Sections

#### Recent Assignments Section (Left Column - md width 50%)
- Card with title "Recent Assignments" + "View All" link
- Table showing:
  - Title column
  - Status column (with Chip badge - green for submitted)
  - Due Date column (right aligned)
- Shows last 3 assignments
- Empty state message if none exist

#### Fees Summary Section (Right Column - md width 50%)
- Card with title "Fees Summary" + "View Details" link
- Displays:
  - Total Fees: ₹ amount
  - Amount Paid: ₹ amount (green text #4caf50)
  - Amount Due: ₹ amount (red text #f44336)
  - Payment Progress: Linear progress bar with percentage
  - Status Chip (colored based on status)
- Empty state if no fees data

#### Recent Notifications Section (Full Width)
- Card showing latest notifications
- Displays notification title, date, and type
- Click to navigate to full notifications page

### Statistics Calculated
- Pending assignments count
- Unread notifications count
- Fees status and amounts
- Overall profile information

### Available Sub-Pages
- `/student/assignments` - View and submit assignments
- `/student/assignments/[id]` - Individual assignment details
- `/student/grades` - View grades
- `/student/fees` - Fee management
- `/student/notifications` - All notifications
- `/student/analytics` - Performance analytics

---

## TEACHER DASHBOARD (`/teacher`)

### Layout
- Similar responsive design to student dashboard
- Drawer navigation on mobile
- Maximum width container
- Professional admin-style interface

### Header Section
```
Welcome back, [Teacher Name]
```
- Large h4 typography, bold font weight

### Summary Cards Row (4 Cards - Responsive Grid)
**Card 1: My Batches**
- Icon: ClassIcon (blue #1976d2)
- Display: Count of batches assigned to teacher
- Calculated from batch-subject mappings

**Card 2: Students**
- Icon: PeopleIcon (orange #ff9800)
- Display: Total students across all batches
- Calculated from student enrollment data

**Card 3: Subjects**
- Icon: BookIcon (green #4caf50)
- Display: Count of unique subjects taught
- Calculated from batch-subject mappings

**Card 4: Pending Grades**
- Typography display in card
- Display: Count of assignments awaiting grades
- Calculated from assignment status

### Content Sections

#### Batch Assignments Section (Left Column - md width 50%)
- Card with title "Batch Assignments" + link
- Table showing:
  - Batch name
  - Subject
  - Student count
  - Actions (Grade, View)
- Shows filtered assignments for this teacher
- Empty state if none

#### Class Schedule / Subjects Section (Right Column - md width 50%)
- Card showing teacher's subjects and schedule
- Displays:
  - Subject names
  - Batch information
  - Schedule times (if available)

### Data Retrieved
- Teacher profile from Clerk auth
- Teacher record from database
- Batch-subject mappings
- Batch information
- Student enrollment data
- Subject information
- Assignment data for the teacher

### Available Sub-Pages
- `/teacher/grades` - Grade management and input
- `/teacher/notifications` - Teacher notifications
- Navigation menu also includes:
  - `/teacher/attendance` - Attendance marking (future)
  - `/admin/assignments` - Assignment management

### Key Features
- Real-time stats calculated from database
- Protected routes (requires teacher role)
- Batch filtering based on teacher assignment
- Student count aggregation
- Grade status tracking

---

## SHARED DESIGN PATTERNS

### Navigation Layout
Both use responsive Material-UI AppBar with:
- Menu icon button (visible on mobile/tablet)
- Dashboard title
- Notifications icon with badge
- User menu (Clerk UserButton)

### Sidebar/Drawer Navigation
**Student:**
- Dashboard
- Assignments
- Grades
- Fees
- Notifications
- Analytics

**Teacher:**
- Dashboard
- Attendance
- Assignments (links to admin)
- Notifications
- Grades

### Color Scheme
- Primary: #1976d2 (Blue)
- Success: #4caf50 (Green)
- Warning: #ff9800 (Orange)
- Error: #f44336 (Red)
- Backgrounds: #f5f5f5, #ffffff

### Typography
- Headings: Bold font weight (600-700)
- Body: Regular weight (400-500)
- Card titles: h6 variant, 600 weight
- Secondary text: textSecondary color

### Interactive Elements
- Material-UI Cards with hover state
- Responsive Grid system
- Action buttons with Link components
- Status Chips with color coding
- Tables with hover effects
- Linear progress bars for numeric progress

### Authentication
- Both dashboards protected by Clerk middleware
- Role-based access (student vs teacher validation)
- Automatic redirect to sign-in if not authenticated
- Automatic redirect to dashboard if wrong role

### Responsive Breakpoints
- xs: Mobile (full width components)
- sm: Tablet (2 cards per row)
- md: Desktop (4 cards per row, 2 columns for detail sections)
- lg: Large desktop (content max-width constraint)

---

## DEVELOPMENT SERVER STATUS
- **URL**: http://localhost:3003
- **Student Dashboard**: http://localhost:3003/student
- **Teacher Dashboard**: http://localhost:3003/teacher
- **Status**: Both fully implemented and protected
- **Build**: Successful (44 pages compiled)
- **Authentication**: Clerk integration active
