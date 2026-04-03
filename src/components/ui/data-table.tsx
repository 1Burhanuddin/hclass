'use client'

import {
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { ReactNode, useMemo } from 'react'

interface Column {
  id: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => ReactNode
  hideOnMobile?: boolean // New property to hide columns on mobile
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  onRowClick?: (row: any) => void
  emptyMessage?: string
  disabled?: boolean
}

export function DataTable({
  columns,
  data,
  loading,
  onRowClick,
  emptyMessage = 'No data found',
  disabled = false,
}: DataTableProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // Filter columns based on mobile visibility
  const visibleColumns = useMemo(() => {
    return columns.filter(col => !isMobile || !col.hideOnMobile)
  }, [columns, isMobile])
  
  return (
    <TableContainer sx={{ 
      borderRadius: '8px', 
      border: '1px solid #e0e0e0', 
      overflow: 'auto',
      maxWidth: '100%',
      width: '100%'
    }}>
      <MuiTable sx={{ minWidth: { xs: 300, sm: 650 } }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            {visibleColumns.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  fontWeight: 700,
                  color: '#1a1a1a',
                  border: 'none',
                  borderBottom: '2px solid #e0e0e0',
                  width: col.width,
                  minWidth: { xs: 80, sm: 120 },
                  maxWidth: { xs: 150, sm: 'none' },
                  textAlign: col.align || 'left',
                  backgroundColor: '#f8f9fa',
                  py: { xs: 1, sm: 2 },
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} sx={{ textAlign: 'center', py: 4, border: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: '#666' }}>
                  <CircularProgress size={20} />
                  <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Loading...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, idx) => (
              <TableRow
                key={idx}
                onClick={() => !disabled && onRowClick?.(row)}
                hover
                sx={{
                  cursor: disabled ? 'not-allowed' : onRowClick ? 'pointer' : 'default',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    bgcolor: disabled ? 'transparent' : '#f0f7ff',
                    boxShadow: disabled ? 'none' : 'inset 0 0 0 1px #e3f2fd'
                  },
                  borderBottom: '1px solid #f0f0f0',
                  opacity: disabled ? 0.6 : 1,
                  pointerEvents: disabled ? 'none' : 'auto',
                }}
              >
                {visibleColumns.map((col) => (
                  <TableCell 
                    key={col.id} 
                    sx={{ 
                      border: 'none', 
                      fontWeight: 500, 
                      color: '#424242', 
                      py: { xs: 1, sm: 1.5 },
                      px: { xs: 1, sm: 2 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      maxWidth: { xs: 150, sm: 'none' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: { xs: 'nowrap', sm: 'normal' }
                    }}
                  >
                    <Box sx={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: { xs: 'nowrap', sm: 'normal' }
                    }}>
                      {col.render ? col.render(row[col.id], row) : row[col.id]}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={visibleColumns.length} 
                sx={{ 
                  textAlign: 'center', 
                  py: 3, 
                  color: '#999', 
                  border: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
