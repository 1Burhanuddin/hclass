'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  Chip,
  CircularProgress,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'

export interface EnhancedTableColumn {
  id: string
  label: string
  minWidth?: number
  align?: 'left' | 'right' | 'center'
  format?: (value: any) => string | React.ReactNode
  filterable?: boolean
  sortable?: boolean
  visible?: boolean
}

interface EnhancedTableProps {
  columns: EnhancedTableColumn[]
  rows: any[]
  onRowClick?: (row: any) => void
  loading?: boolean
  allowExport?: boolean
}

const PAGINATION_OPTIONS = [5, 15, 25, 50, 100]

export function EnhancedTable({
  columns: initialColumns,
  rows,
  onRowClick,
  loading = false,
  allowExport = false,
}: EnhancedTableProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    initialColumns.reduce(
      (acc, col) => ({
        ...acc,
        [col.id]: col.visible !== false,
      }),
      {}
    )
  )
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>(null)

  // Filter rows
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true
        const cellValue = String(row[key]).toLowerCase()
        return cellValue.includes(filterValue.toLowerCase())
      })
    })
  }, [rows, filters])

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.order === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.order === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredRows, sortConfig])

  // Paginate rows
  const paginatedRows = useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [sortedRows, page, rowsPerPage])

  // Visible columns
  const visibleColumnsList = useMemo(() => {
    return initialColumns.filter((col) => visibleColumns[col.id] !== false)
  }, [initialColumns, visibleColumns])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }))
    setPage(0)
  }

  const handleSort = (columnId: string) => {
    setSortConfig((prev) => {
      if (prev?.key === columnId) {
        return { key: columnId, order: prev.order === 'asc' ? 'desc' : 'asc' }
      }
      return { key: columnId, order: 'asc' }
    })
  }

  const handleColumnVisibilityChange = (columnId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  const handleExport = () => {
    const csv = [
      visibleColumnsList.map((c) => c.label).join(','),
      ...sortedRows.map((row) =>
        visibleColumnsList
          .map((col) => {
            const value = row[col.id]
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      {visibleColumnsList.some((col) => col.filterable) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            pb: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            flexShrink: 0,
            overflow: 'hidden',
            backgroundColor: '#fafafa',
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Filter inputs */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1, minWidth: 250 }}>
            {visibleColumnsList
              .filter((col) => col.filterable)
              .map((col) => (
                <TextField
                  key={col.id}
                  size="small"
                  placeholder={`Search ${col.label}...`}
                  value={filters[col.id] || ''}
                  onChange={(e) => handleFilterChange(col.id, e.target.value)}
                  sx={{
                    width: 150,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: '#1976d2',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
                      },
                    },
                  }}
                />
              ))}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {allowExport && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleExport}
                sx={{ 
                  borderRadius: '8px',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 26, 77, 0.04)',
                    borderColor: '#001a4d',
                  }
                }}
              >
                Export CSV
              </Button>
            )}

            <Button
              size="small"
              variant="outlined"
              startIcon={<ViewWeekIcon />}
              onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
              sx={{ 
                borderRadius: '8px',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  borderColor: '#1976d2',
                }
              }}
            >
              Columns
            </Button>

            <Menu
              anchorEl={columnMenuAnchor}
              open={Boolean(columnMenuAnchor)}
              onClose={() => setColumnMenuAnchor(null)}
            >
              {initialColumns.map((col) => (
                <MenuItem key={col.id}>
                  <Checkbox
                    checked={visibleColumns[col.id] !== false}
                    onChange={() => handleColumnVisibilityChange(col.id)}
                  />
                  {col.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      )}

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          width: '100%',
          boxShadow: 'none', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Table stickyHeader sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {visibleColumnsList.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  sx={{
                    minWidth: col.minWidth,
                    fontWeight: 700,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #e0e0e0',
                    color: '#1a1a1a',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: col.sortable ? '#f1f1f1' : '#f8f9fa',
                    },
                  }}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  {col.label}
                  {sortConfig?.key === col.id && (
                    <span style={{ marginLeft: '8px', color: '#001a4d' }}>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row, idx) => (
              <TableRow
                key={idx}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: onRowClick ? '#f0f7ff' : 'inherit',
                    boxShadow: onRowClick ? 'inset 0 0 0 1px #e3f2fd' : 'none',
                  },
                  '&:active': {
                    backgroundColor: onRowClick ? '#e3f2fd' : 'inherit',
                  },
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                {visibleColumnsList.map((col) => (
                  <TableCell key={col.id} align={col.align} sx={{ py: 1.5, color: '#424242' }}>
                    {col.format ? col.format(row[col.id]) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleColumnsList.length} align="center" sx={{ py: 4, color: '#999' }}>
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ borderTop: '1px solid #e0e0e0', flexShrink: 0, backgroundColor: '#fafafa', transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <TablePagination
          rowsPerPageOptions={PAGINATION_OPTIONS}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-root': {
              borderTop: 'none',
            },
            '& .MuiTablePagination-toolbar': {
              minHeight: '56px',
            },
            '& .MuiTablePagination-selectLabel': {
              color: '#424242',
              fontWeight: 500,
            },
            '& .MuiTablePagination-displayedRows': {
              color: '#424242',
            },
            '& .MuiIconButton-root': {
              color: '#001a4d',
              transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&.Mui-disabled': {
                color: '#ccc',
              },
            },
          }}
        />
      </Box>
    </Box>
  )
}

export default EnhancedTable
