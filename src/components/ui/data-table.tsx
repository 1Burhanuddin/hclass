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
} from '@mui/material'
import { ReactNode } from 'react'

interface Column {
  id: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => ReactNode
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
  return (
    <TableContainer sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
      <MuiTable>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  fontWeight: 700,
                  color: '#1a1a1a',
                  border: 'none',
                  borderBottom: '2px solid #e0e0e0',
                  width: col.width,
                  textAlign: col.align || 'left',
                  backgroundColor: '#f8f9fa',
                  py: 2,
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
              <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4, border: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: '#666' }}>
                  <CircularProgress size={20} />
                  <Typography>Loading...</Typography>
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
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ border: 'none', fontWeight: 500, color: '#424242', py: 1.5 }}>
                    {col.render ? col.render(row[col.id], row) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 3, color: '#999', border: 'none' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
