/**
 * TEMPORARY SCRIPT - Run this ONCE to clean up duplicate users
 * 
 * Usage:
 * 1. Add this temporarily to your app (e.g., visit it as a page or run it in a component)
 * 2. It will call the cleanup mutation and display the result
 * 3. Delete this file after running
 */

'use client'

import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material'

export default function CleanupDuplicatesPage() {
  const cleanupDuplicates = useMutation(api.cleanupDuplicateUsers.cleanupDuplicateUsers)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleCleanup = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await cleanupDuplicates()
      setResult(res)
    } catch (err) {
      setError('Failed to cleanup duplicates: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Cleanup Duplicate Users
      </Typography>
      
      <Typography sx={{ mb: 3, color: '#666' }}>
        This will remove duplicate user records from the database, keeping the first record for each user.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>{result.message}</Typography>
          <Typography sx={{ fontSize: '0.875rem' }}>
            Duplicates removed: <strong>{result.duplicatesRemoved}</strong>
          </Typography>
        </Alert>
      )}

      <Button 
        onClick={handleCleanup} 
        variant="contained" 
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Cleanup in progress...
          </>
        ) : (
          'Run Cleanup'
        )}
      </Button>

      {result && (
        <Typography sx={{ mt: 3, fontSize: '0.875rem', color: '#999', fontStyle: 'italic' }}>
          ✓ Cleanup complete! You can now delete this page/component.
        </Typography>
      )}
    </Box>
  )
}
