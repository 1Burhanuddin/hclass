'use client'

import { Card, CardContent, CardProps } from '@mui/material'

interface DataCardProps extends CardProps {}

export function DataCard({ children, ...props }: DataCardProps) {
  return (
    <Card sx={{ boxShadow: 'none', border: '1px solid #f0f0f0', ...props.sx }}>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
