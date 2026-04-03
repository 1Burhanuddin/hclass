# RMS Project UI Patterns Analysis

## Overview
The RMS project (Rajinfosys WMS) features a professional, production-grade UI with several advanced patterns worth implementing in hclass.

---

## 1. SIDEBAR - Collapsible with Hover Expansion

### Features:
- **Collapsed State**: Sidebar starts at minimal width (`collapsedWidth: 80px`)
- **Hover to Expand**: Sidebar automatically expands to full width (`width: 260px`) on hover
- **Smooth Transitions**: Transition duration: `200-300ms ease-in-out`
- **Responsive**: On mobile (breakpoint reached), sidebar becomes a fixed overlay that slides in
- **Smart Context**: Uses `VerticalNavContext` to manage state globally

### Key Files:
- `src/components/menu/VerticalNav.tsx` - Main sidebar component
- `src/contexts/verticalNavContext.ts` - Global state management
- `src/hooks/useVerticalNav.tsx` - Hook to access sidebar state

### CSS Pattern:
```css
/* Collapsed default state */
inline-size: 80px;
min-inline-size: 80px;

/* Expanded on hover/interaction */
.hovering & {
  inline-size: 260px;
}

/* Smooth transition */
transition: inline-size 200ms ease-in-out;
```

### Implementation Details:
- Uses `classnames` to toggle `.collapsed`, `.expanded`, `.hovered` classes
- Sidebar position: `sticky` (stays with scroll on desktop) or `fixed` (overlay on mobile)
- Z-index: `9` (desktop) or `100` (mobile overlay)
- Border: `1px solid #efefef` on the right edge

---

## 2. HEADER - Shape Changes on Scroll

### Features:
- **Dynamic Styling on Scroll**: Uses `useScrollTrigger` from MUI
- **Detached Header**: When scrolling, header gets border radius and shadow (becomes a floating card)
- **Blur Effect**: Optional backdrop blur effect on scroll (glassmorphism)
- **Sticky Position**: Header remains at top with `position: sticky`
- **Background Transition**: Changes background color/blur on scroll trigger

### Key Files:
- `src/components/layout/vertical/Navbar.tsx` - Header implementation

### CSS Patterns:

**Default (No Scroll):**
```css
.headerDetached {
  /* No shadow or radius at top */
}
```

**On Scroll (Trigger State):**
```css
.headerDetached.scrolled .navbar {
  box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.42);
  border-end-start-radius: var(--border-radius);
  border-end-end-radius: var(--border-radius);
}
```

**Blur Mode:**
```css
.headerBlur.scrolled.headerDetached .navbar {
  backdrop-filter: blur(9px);
  background-color: rgba(bg-color / 0.85);
}
```

### Technical Implementation:
```tsx
const trigger = useScrollTrigger({
  threshold: 0,
  disableHysteresis: true
})

// Apply 'scrolled' class when trigger = true
className: {
  scrolled: trigger
}
```

---

## 3. CONTENT LAYOUT - Card-Based with Borders

### Features:
- **Card Wrapper**: Main content is wrapped in `Card` component
- **Styled Border**: `1px solid var(--border-color)`
- **Shadow**: Professional box-shadow on Card
- **Padding**: Consistent padding around content
- **Nested Sections**: Headers in `CardContent`, tables in Card body

### Layout Structure:
```tsx
<Card>
  {/* Header Section */}
  <CardContent className='flex justify-end flex-wrap max-sm:flex-col sm:items-center gap-4'>
    <LinkButton variant='contained' color='primary'>
      Add New
    </LinkButton>
  </CardContent>

  {/* Table Section */}
  <CustomTable 
    rows={data}
    columns={columns}
    pagination
    filtering
  />

  {/* Dialog/Footer Section */}
  <DeleteDialog />
</Card>
```

### SCSS Variables Used:
```scss
--border-color: #efefef or inherited from theme
--mui-palette-background-paper: white or theme paper
--border-radius: 8px or theme radius
```

---

## 4. TABLE COMPONENT - CustomTable

### Features:
- **Advanced Pagination**: 5, 15, 25, 50, 100, 500, 1000, 10000 rows per page
- **Row Selection**: Checkbox or Radio column support
- **Filtering**: Column-specific filters with dropdown options
- **Sorting**: Click column headers to sort
- **CSV Export**: Built-in export functionality
- **Custom Cell Rendering**: Per-column custom render functions
- **Performance**: Memoized row components to prevent unnecessary re-renders
- **Column Visibility**: Toggle columns on/off via menu
- **Row Styling**: Custom row styles based on data
- **Sticky Headers**: Headers stay fixed when scrolling

### Table Features:
```typescript
interface ColumnProps {
  name: string              // Data field name
  title: string             // Display title
  filtering?: boolean       // Enable filter on column
  sorting?: boolean         // Enable sort on column
  primary?: boolean         // Primary/highlighted column
  defaultVisible?: boolean  // Initially visible
  filterOptions?: []        // Predefined filter options
  render?: (row) => React   // Custom cell renderer
  textAlign?: 'left'|'right'|'center'
}
```

### Pagination Options:
```typescript
const paginationList = [5, 15, 25, 50, 100, 500, 1000, 10000]
const defPageSize = 25
```

### Styling (SCSS):
```scss
.table {
  /* Sticky headers */
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: var(--mui-palette-customColors-tableHeaderBg);
  }

  /* Alternating row colors */
  tbody tr {
    border-block-end: 1px solid var(--border-color);

    &:nth-child(even) {
      background-color: #f5f5f5;
    }
  }

  /* Hover effect */
  tbody tr:hover {
    background-color: #f0f7ff;
  }

  /* Input styling in cells */
  .cellWithInput input {
    border-radius: 8px;
    padding: 6px 10px;
    border: 1px solid var(--border-color);

    &:focus {
      outline: 1px solid var(--mui-palette-primary-main);
    }
  }
}
```

### Key Performance Optimizations:
1. **Memoized Row Component**: Prevents re-renders of unchanged rows
2. **Map-based Row Lookup**: O(1) instead of O(n) for finding checked rows
3. **useCallback**: Memoized handlers to prevent function recreation
4. **useMemo**: Pre-computed total pages, checked rows map

### Column Visibility Control:
```tsx
<button onClick={() => setColumnVisibilityOpen(!columnVisibilityOpen)}>
  Columns
</button>

{/* Dropdown menu with column checkboxes */}
<Menu>
  {columns.map(col => (
    <MenuItem>
      <Checkbox 
        checked={visibleColumns[col.name]}
        onChange={() => toggleColumn(col.name)}
      />
      {col.title}
    </MenuItem>
  ))}
</Menu>
```

---

## 5. OVERALL LAYOUT STRUCTURE

### File Organization:
```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx          (Main wrapper)
│   │   ├── DashboardLayoutWrapper.tsx   (Provider wrapper)
│   │   └── vertical/
│   │       ├── Navbar.tsx               (Header)
│   │       ├── VerticalMenu.tsx         (Sidebar menu)
│   │       ├── NavToggle.tsx            (Sidebar toggle)
│   │       └── NavbarContent.tsx        (Header content)
│   ├── CustomTable.tsx                  (Table component)
│   └── menu/
│       └── VerticalNav.tsx              (Sidebar container)
├── contexts/
│   └── verticalNavContext.ts            (Sidebar state)
├── hooks/
│   └── useVerticalNav.tsx               (Sidebar hook)
└── styles/
    └── table.module.scss                (Table styles)
```

### Main Layout Pattern:
```tsx
<DashboardLayout
  navigation={<VerticalNav><VerticalMenu /></VerticalNav>}
  navbar={<Navbar />}
  footer={null}
>
  {/* Page content */}
</DashboardLayout>
```

---

## 6. DESIGN DETAILS

### Colors & Spacing:
- **Border Color**: `#efefef` or `var(--border-color)`
- **Header Background**: `white` or `var(--mui-palette-background-paper)`
- **Table Header BG**: `var(--mui-palette-customColors-tableHeaderBg)` (usually light gray)
- **Layout Padding**: `16px` or `24px`
- **Card Border Radius**: `8px` or `var(--border-radius)`

### Transitions:
- **Sidebar**: 200-300ms ease-in-out
- **Header**: 300ms ease-in, includes blur + shadow transitions
- **Table rows**: Instant (no transition to avoid jank)

### Z-index Stacking:
- Sidebar: 100 (mobile overlay) / 9 (desktop)
- Header: `var(--header-z-index)` (typically 10 on desktop)
- Backdrop: 1 (below sidebar)
- Table sticky header/footer: 1 (above table body)

---

## 7. KEY PATTERNS TO ADOPT

### ✅ Recommended for hclass:

1. **Sidebar Collapse + Hover**
   - Implement collapsible sidebar that expands on hover
   - Would replace current fixed sidebar with more space-efficient design

2. **Scroll-Triggered Header**
   - Add `useScrollTrigger` to Navbar
   - Apply rounded corners and shadow on scroll
   - Optional: Add blur effect

3. **Card-Based Content Layout**
   - Wrap page content in Card with border
   - Adds depth and visual separation

4. **Advanced Table Features**
   - Implement filtering, column visibility toggle
   - Add CSV export functionality
   - Improve pagination options (5, 15, 25, 50, 100)
   - Add sorting

5. **Consistent Styling System**
   - Use CSS variables for colors, spacing, shadows
   - Implement SCSS modules for encapsulated styles

---

## 8. IMPLEMENTATION ROADMAP

### Phase 1 (Quick Wins):
- [ ] Add `useScrollTrigger` to Navbar for scroll effects
- [ ] Update table pagination options
- [ ] Add Card wrapper to main pages
- [ ] Improve table styling (borders, hover effects)

### Phase 2 (Major Features):
- [ ] Implement collapsible sidebar with hover
- [ ] Add column visibility toggle to tables
- [ ] Add filtering to CustomTable
- [ ] Add CSV export functionality

### Phase 3 (Polish):
- [ ] Implement blur effects on header
- [ ] Add context state management for sidebar
- [ ] Profile performance optimizations
- [ ] Responsive breakpoints testing

---

## 9. CODE REFERENCES

### Files to Study in RMS:
1. `/src/components/menu/VerticalNav.tsx` - Sidebar implementation (200+ lines)
2. `/src/components/layout/vertical/Navbar.tsx` - Header with scroll trigger (180+ lines)
3. `/src/components/CustomTable.tsx` - Table component (230+ lines)
4. `/src/styles/table.module.scss` - Table styling (130+ lines)
5. `/src/pages/customer-management/customers/index.tsx` - Page using CustomTable

### Key Dependencies in RMS:
- `@mui/material` - useScrollTrigger, Card, Checkbox, etc.
- `@emotion/styled` - styled components for theming
- `react-csv` - CSV export via CSVLink
- `classnames` - conditional className generation
- `react-perfect-scrollbar` - Custom scroll support

---

## 10. QUICK COMPARISON TABLE

| Feature | Current hclass | RMS Pattern | Benefit |
|---------|---|---|---|
| Sidebar | Fixed, always visible | Collapsible + hover | More content space |
| Header | Static | Dynamic on scroll | Professional feel |
| Content | No wrapping | Card with border | Better visual hierarchy |
| Table | Basic pagination | Advanced (5-10000) | Flexible data viewing |
| Filters | None | Per-column | Better data discovery |
| Export | None | CSV built-in | User-friendly |
| Column Visibility | Fixed | Toggleable | Customizable view |
| Performance | Standard | Memoized rows | Better with large datasets |

---

## Summary

The RMS project demonstrates a professional, production-grade UI architecture with:
1. **Smart sidebar** that minimizes when not in use
2. **Interactive header** that responds to user scrolling
3. **Card-based layout** with clear visual separation
4. **Feature-rich tables** with pagination, filtering, sorting, export
5. **Performance optimizations** through memoization and smart re-renders
6. **Consistent design system** using CSS variables and theming

Adopting these patterns would significantly enhance the hclass interface while maintaining code maintainability and performance.
