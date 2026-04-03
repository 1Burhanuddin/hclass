# Material UI Architecture & Global Components

## Overview

This project uses **Material UI (MUI)** v5 as the primary component library with a centralized theme system and reusable global components.

## Theme Configuration

**Location:** `src/lib/mui-theme.ts`

### Color Palette
- **Primary:** #1976d2 (Blue)
- **Secondary:** #dc004e (Pink)
- **Success:** #4caf50 (Green)
- **Error:** #f44336 (Red)
- **Warning:** #ff9800 (Orange)
- **Info:** #2196f3 (Light Blue)

### Typography
- Uses Roboto font family
- Custom font sizes for all heading levels (H1-H6)
- Font weight 600 for all headings

## Global Reusable Components

All global components are located in `src/components/shared/` and exported via `src/components/shared/index.ts`

### 1. PageHeader
**File:** `src/components/shared/PageHeader.tsx`

Used for consistent app-wide header with logo and user button.

```tsx
import { PageHeader } from '@/components/shared'

<PageHeader title="Dashboard" showLogo={true} />
```

### 2. PageContainer
**File:** `src/components/shared/PageContainer.tsx`

Container component for consistent page padding and max-width.

```tsx
import { PageContainer } from '@/components/shared'

<PageContainer py={4}>
  {/* Page content */}
</PageContainer>
```

### 3. StatsCard
**File:** `src/components/shared/StatsCard.tsx`

Display statistics with icon, value, and subtitle.

```tsx
import { StatsCard } from '@/components/shared'
import PeopleIcon from '@mui/icons-material/People'

<StatsCard
  title="Teachers"
  value={42}
  subtitle="Active teachers"
  icon={<PeopleIcon />}
  color="primary"
/>
```

### 4. LoadingSpinner
**File:** `src/components/shared/LoadingSpinner.tsx`

Full-screen centered loading indicator.

```tsx
import { LoadingSpinner } from '@/components/shared'

if (isLoading) return <LoadingSpinner />
```

### 5. ConfirmDialog
**File:** `src/components/shared/ConfirmDialog.tsx`

Confirmation dialog for user actions.

```tsx
import { ConfirmDialog } from '@/components/shared'

<ConfirmDialog
  open={dialogOpen}
  title="Delete Teacher?"
  message="This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={() => setDialogOpen(false)}
/>
```

## Component Organization

```
src/
├── components/
│   ├── shared/           ← Global reusable components
│   │   ├── index.ts      ← Export all shared components
│   │   ├── PageHeader.tsx
│   │   ├── PageContainer.tsx
│   │   ├── StatsCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ConfirmDialog.tsx
│   ├── admin/            ← Admin-specific components
│   ├── teacher/          ← Teacher-specific components
│   └── student/          ← Student-specific components
├── lib/
│   └── mui-theme.ts      ← Theme configuration
└── app/
    ├── layout.tsx        ← Layout with ThemeProvider
    ├── admin/
    ├── teacher/
    └── student/
```

## Usage Guidelines

### Using Shared Components
```tsx
import { PageContainer, StatsCard, LoadingSpinner } from '@/components/shared'
```

### Using MUI Components Directly
```tsx
import { Box, Button, Typography, Grid } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
```

### Styling Best Practices
- Use MUI's `sx` prop for component-specific styling
- Use `<Grid>` for responsive layouts
- Use `<Box>` for layout and spacing
- Avoid custom CSS - use MUI theming system

## NO MORE TAILWIND CSS

- Remove all Tailwind classes (e.g., `className="text-xl font-bold"`)
- Replace with MUI components and sx prop
- Use grid system for responsive layouts

## Future Component Additions

When creating new reusable components:
1. Add to `src/components/shared/ComponentName.tsx`
2. Export in `src/components/shared/index.ts`
3. Document here
4. Use only MUI components
5. Accept theme colors as props
