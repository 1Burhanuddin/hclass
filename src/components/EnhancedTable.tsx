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
            borderBottom: '1px solid #efefef',
            flexShrink: 0,
            overflow: 'hidden',
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
                sx={{ borderRadius: '8px' }}
              >
                Export CSV
              </Button>
            )}

            <Button
              size="small"
              variant="outlined"
              startIcon={<ViewWeekIcon />}
              onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
              sx={{ borderRadius: '8px' }}
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
      <Box sx={{ flex: 1, overflow: 'auto', width: '100%' }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #efefef', height: '100%' }}>
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

          <Table stickyHeader>
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
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      backgroundColor: col.sortable ? '#e8e8e8' : '#f5f5f5',
                    },
                  }}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  {col.label}
                  {sortConfig?.key === col.id && (
                    <span style={{ marginLeft: '8px' }}>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
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
                  '&:hover': {
                    backgroundColor: onRowClick ? '#f0f7ff' : 'inherit',
                  },
                  borderBottom: '1px solid #efefef',
                }}
              >
                {visibleColumnsList.map((col) => (
                  <TableCell key={col.id} align={col.align}>
                    {col.format ? col.format(row[col.id]) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleColumnsList.length} align="center" sx={{ py: 4 }}>
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* Pagination */}
      <Box sx={{ borderTop: '1px solid #efefef', flexShrink: 0 }}>
        <TablePagination
          rowsPerPageOptions={PAGINATION_OPTIONS}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  )
}

export default EnhancedTable
