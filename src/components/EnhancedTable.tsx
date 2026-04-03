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
  Button,
  Menu,
  MenuItem,
  Checkbox,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
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
  hideOnMobile?: boolean // New property to hide columns on mobile
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>(null)

  // Filter rows (no filtering since search bars are removed)
  const filteredRows = useMemo(() => {
    return rows
  }, [rows])

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

  // Visible columns with mobile responsiveness
  const visibleColumnsList = useMemo(() => {
    return initialColumns.filter((col) => {
      const isVisible = visibleColumns[col.id] !== false
      const shouldHideOnMobile = isMobile && col.hideOnMobile
      return isVisible && !shouldHideOnMobile
    })
  }, [initialColumns, visibleColumns, isMobile])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
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
      {/* Toolbar - Only show export and column controls, no search bars */}
      {(allowExport || initialColumns.length > 0) && (
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            p: { xs: 1, sm: 2 },
            pb: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px solid #e0e0e0',
            flexShrink: 0,
            overflow: 'hidden',
            backgroundColor: '#fafafa',
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {allowExport && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleExport}
                sx={{
                  borderRadius: '8px',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
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
              startIcon={<ViewWeekIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
              sx={{
                borderRadius: '8px',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 },
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  borderColor: '#1976d2',
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Columns</Box>
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
          maxWidth: '100%',
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
        }}
      >
        <Table stickyHeader sx={{ width: '100%', minWidth: { xs: 300, sm: 650 } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {visibleColumnsList.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  sx={{
                    minWidth: { xs: Math.min(col.minWidth || 100, 120), sm: col.minWidth },
                    maxWidth: { xs: 150, sm: 'none' },
                    fontWeight: 700,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #e0e0e0',
                    color: '#1a1a1a',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 1, sm: 1.5 },
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: col.sortable ? '#f1f1f1' : '#f8f9fa',
                    },
                  }}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  <Box sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    {col.label}
                    {sortConfig?.key === col.id && (
                      <span style={{ color: '#001a4d', fontSize: '0.875rem' }}>
                        {sortConfig.order === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsList.length}
                  align="center"
                  sx={{
                    py: 4,
                    color: '#666',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <CircularProgress size={20} />
                    Loading...
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <>
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
                      <TableCell
                        key={col.id}
                        align={col.align}
                        sx={{
                          py: { xs: 1, sm: 1.5 },
                          px: { xs: 1, sm: 2 },
                          color: '#424242',
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
                          {col.format ? col.format(row[col.id]) : row[col.id]}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {paginatedRows.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumnsList.length}
                      align="center"
                      sx={{
                        py: 4,
                        color: '#999',
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{
        borderTop: '1px solid #e0e0e0',
        flexShrink: 0,
        backgroundColor: '#fafafa',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'auto'
      }}>
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
              minHeight: { xs: '48px', sm: '56px' },
              px: { xs: 1, sm: 2 },
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 0 }
            },
            '& .MuiTablePagination-selectLabel': {
              color: '#424242',
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              mb: { xs: 0, sm: 0 }
            },
            '& .MuiTablePagination-displayedRows': {
              color: '#424242',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              mb: { xs: 0, sm: 0 }
            },
            '& .MuiTablePagination-select': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '& .MuiIconButton-root': {
              color: '#001a4d',
              transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              p: { xs: 0.5, sm: 1 },
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
