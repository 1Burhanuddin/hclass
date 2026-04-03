'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import NProgress from 'nprogress'
import { format } from 'date-fns'
import { DataCard } from '@/components/ui'

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  })

  // Get user record
  const userRecord = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )

  // Get all notifications for this user
  const notifications = useQuery(
    api.notifications.getUserNotifications,
    userRecord ? { userId: userRecord._id } : 'skip'
  )

  // Get unread count
  const unreadInfo = useQuery(
    api.notifications.getUnreadNotifications,
    userRecord ? { userId: userRecord._id } : 'skip'
  )

  const markAsReadMutation = useMutation(api.notifications.markNotificationAsRead)
  const markAllAsReadMutation = useMutation(api.notifications.markAllNotificationsAsRead)
  const deleteNotificationMutation = useMutation(api.notifications.deleteNotification)

  // Filter notifications based on read status
  const filteredNotifications =
    notifications && filterStatus !== 'all'
      ? notifications.filter((n: any) =>
          filterStatus === 'unread' ? !n.isRead : n.isRead
        )
      : notifications

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation({ notificationId: notificationId as any })
    } catch (err: any) {
      setError(err.message || 'Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true)
      if (userRecord) {
        await markAllAsReadMutation({ userId: userRecord._id })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to mark all as read')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotificationMutation({ notificationId: notificationId as any })
      setDeleteDialog({ open: false, id: null })
    } catch (err: any) {
      setError(err.message || 'Failed to delete notification')
    }
  }

  // Show loading only if user or queries haven't resolved yet
  if (!user || userRecord === undefined) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4">Your Notifications</Typography>
              {unreadInfo && unreadInfo.count > 0 && (
                <Chip
                  label={`${unreadInfo.count} unread`}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filter and actions */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={filterStatus}
          exclusive
          onChange={(e, newStatus) => {
            if (newStatus !== null) {
              setFilterStatus(newStatus)
            }
          }}
          size="small"
        >
          <ToggleButton value="all" aria-label="all notifications">
            All
          </ToggleButton>
          <ToggleButton value="unread" aria-label="unread notifications">
            Unread
          </ToggleButton>
          <ToggleButton value="read" aria-label="read notifications">
            Read
          </ToggleButton>
        </ToggleButtonGroup>

        {unreadInfo && unreadInfo.count > 0 && (
          <Button
            size="small"
            startIcon={<MarkEmailReadIcon />}
            onClick={handleMarkAllAsRead}
            disabled={loading}
          >
            Mark All As Read
          </Button>
        )}
      </Box>

      {/* Notifications List */}
      <DataCard>
        {!filteredNotifications ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#999', p: 3 }}>
            No notifications yet
          </Typography>
        ) : (
          <Box>
            {filteredNotifications.map((notification: any) => (
              <Box
                key={notification._id}
                sx={{
                  p: 2,
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' },
                  backgroundColor: notification.isRead ? '#fff' : '#f5f5f5',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: '#f9f9f9' },
                }}
                onClick={() => setExpandedId(expandedId === notification._id ? null : notification._id)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!notification.isRead && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#1976d2',
                          }}
                        />
                      )}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: notification.isRead ? 400 : 600,
                          wordBreak: 'break-word',
                        }}
                      >
                        {notification.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                      From: {notification.senderName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999', mt: 0.5, display: 'block' }}>
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy h:mm a')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    {!notification.isRead && (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification._id)
                        }}
                      >
                        Mark Read
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteDialog({ open: true, id: notification._id })
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Expanded message */}
                {expandedId === notification._id && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {notification.message}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </DataCard>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Delete Notification</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this notification?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
