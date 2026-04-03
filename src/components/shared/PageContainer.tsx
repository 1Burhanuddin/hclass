'use client'

import { Container, Box, ContainerProps } from '@mui/material'
import { ReactNode } from 'react'

interface PageContainerProps extends ContainerProps {
  children: ReactNode
  py?: number
}

export function PageContainer({ children, py = 4, ...props }: PageContainerProps) {
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        width: '100%',
        maxWidth: '100%',
        px: { xs: 2, sm: 3 },
        overflow: 'hidden',
        ...props.sx 
      }} 
      {...props}
    >
      <Box py={py} sx={{ width: '100%', overflow: 'hidden' }}>
        {children}
      </Box>
    </Container>
  )
}
