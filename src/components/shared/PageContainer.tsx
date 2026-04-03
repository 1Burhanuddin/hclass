'use client'

import { Container, Box, ContainerProps } from '@mui/material'
import { ReactNode } from 'react'

interface PageContainerProps extends ContainerProps {
  children: ReactNode
  py?: number
}

export function PageContainer({ children, py = 4, ...props }: PageContainerProps) {
  return (
    <Container maxWidth="lg" {...props}>
      <Box py={py}>{children}</Box>
    </Container>
  )
}
