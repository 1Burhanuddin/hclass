'use client'

import { Box, CircularProgress, Typography } from '@mui/material'

export function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #fafafa 100%)',
      }}
    >
      <CircularProgress 
        size={48}
        sx={{
          color: '#001a4d',
          animation: 'spin-smooth 1s linear infinite',
          '@keyframes spin-smooth': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />
      <Typography variant="body2" sx={{ color: '#666' }}>
        Loading...
      </Typography>
    </Box>
  )
}
