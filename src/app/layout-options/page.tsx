'use client'

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material'
import Link from 'next/link'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import VisibilityIcon from '@mui/icons-material/Visibility'

export default function LayoutComparison() {
  const options = [
    {
      id: 1,
      name: 'Option 1: Fixed Sidebar',
      description: 'Classic professional layout with fixed sidebar and clean header',
      features: [
        'Fixed sidebar (280px)',
        'Sticky header with search',
        'Traditional table layout',
        'Best for: Desktop-first apps',
        'Pros: Simple, familiar, good for data-heavy interfaces',
        'Cons: Limited mobile space',
      ],
      tags: ['Classic', 'Desktop-first', 'Professional'],
      pros: ['Simple navigation', 'Lots of screen space', 'Traditional feel'],
      cons: ['Less mobile-friendly', 'Fixed width'],
      colorAccent: '#1976d2',
      url: '/layout-options/option1',
    },
    {
      id: 2,
      name: 'Option 2: Collapsible Sidebar',
      description: 'Modern design with smooth animations and dark sidebar theme',
      features: [
        'Collapsible sidebar (260px → 80px)',
        'Smooth animations',
        'Dark theme accent color',
        'Best for: Desktop and tablet',
        'Pros: Space-efficient, modern feel, smooth transitions',
        'Cons: Requires animation support',
      ],
      tags: ['Modern', 'Animated', 'Dark-theme'],
      pros: ['Responsive design', 'Smooth animations', 'Icons + labels toggle'],
      cons: ['More complex code', 'Animation heavy'],
      colorAccent: '#2c3e50',
      url: '/layout-options/option2',
    },
    {
      id: 3,
      name: 'Option 3: Gradient Modern',
      description: 'Contemporary gradient design with card-based layout and modern aesthetics',
      features: [
        'Gradient header (purple-pink)',
        'Card-based KPI display',
        'Modern glassmorphic effects',
        'Best for: Modern, trendy apps',
        'Pros: Visually appealing, trendy, great for dashboards',
        'Cons: May not suit all audiences',
      ],
      tags: ['Gradient', 'Modern', 'Dashboard-focused'],
      pros: ['Visually stunning', 'Card-based layout', 'Great analytics view'],
      cons: ['Bold colors', 'May feel trendy too quickly'],
      colorAccent: '#667eea',
      url: '/layout-options/option3',
    },
    {
      id: 4,
      name: 'Option 3 Final: Gradient + Collapsible Sidebar',
      description: 'Gradient modern design with collapsible sidebar and real data from system',
      features: [
        'Collapsible sidebar navigation',
        'Gradient purple header',
        'Real data from Convex backend',
        'No emojis or placeholder content',
        'Best for: Production-ready dashboard',
        'Pros: Real data, clean, professional, fully functional',
        'Cons: Requires data integration setup',
      ],
      tags: ['Recommended', 'Real-data', 'Production-ready'],
      pros: ['Collapsible sidebar', 'Live system statistics', 'No placeholders', 'Production-ready'],
      cons: ['Requires Convex setup'],
      colorAccent: '#764ba2',
      url: '/layout-options/option3-final',
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
            Layout Design Options
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
            Choose Your Layout Design
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3, maxWidth: 600, mx: 'auto' }}>
            We've created three different layout options for the Harshdeep Classes Management System.
            Click on each option to view the full demo, then select the one you prefer.
          </Typography>
        </Box>

        {/* Options Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {options.map((option) => (
            <Grid item xs={12} md={6} lg={4} key={option.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${option.colorAccent}`,
                  transition: 'all 0.3s',
                  ':hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: option.colorAccent }}>
                    {option.name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#666', mb: 2.5 }}>
                    {option.description}
                  </Typography>

                  {/* Tags */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    {option.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: option.colorAccent, color: option.colorAccent }}
                      />
                    ))}
                  </Box>

                  {/* Pros */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#333', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <ThumbUpIcon sx={{ fontSize: 16, color: '#4caf50' }} /> Pros
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {option.pros.map((pro, idx) => (
                        <Typography key={idx} variant="body2" sx={{ color: '#666', fontSize: '0.85rem', mb: 0.5 }}>
                          • {pro}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  {/* Cons */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#333', mb: 1 }}
                    >
                      Considerations
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {option.cons.map((con, idx) => (
                        <Typography key={idx} variant="body2" sx={{ color: '#999', fontSize: '0.85rem', mb: 0.5 }}>
                          • {con}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ gap: 1, pt: 0 }}>
                  <Button
                    component={Link}
                    href={option.url}
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    sx={{ flex: 1, color: option.colorAccent, borderColor: option.colorAccent }}
                  >
                    View Demo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recommendation */}
        <Card sx={{ bgcolor: '#e8f5e9', border: '2px solid #4caf50', mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24, flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                  Our Recommendation
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  <strong>Option 3 Final (Gradient + Collapsible Sidebar)</strong> - This combines the best of all designs with a collapsible sidebar for better space management, a stunning gradient header, and most importantly, displays real data from your Convex backend with no placeholder content or emojis. This is the recommended production-ready layout that's professional and feature-complete.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Feature Comparison Table */}
        <Card>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Feature Comparison
            </Typography>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Option 1</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Option 2</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Option 3</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#4caf50', fontStyle: 'italic' }}>Option 3 Final</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Mobile Responsive', opt1: 'Fair', opt2: 'Excellent', opt3: 'Excellent', opt4: 'Excellent' },
                  { feature: 'Collapsible Sidebar', opt1: 'No', opt2: 'Yes', opt3: 'No', opt4: 'Yes' },
                  { feature: 'Animations', opt1: 'None', opt2: 'Smooth', opt3: 'Some', opt4: 'Some' },
                  { feature: 'Code Complexity', opt1: 'Simple', opt2: 'Medium', opt3: 'Medium', opt4: 'Medium' },
                  { feature: 'Visual Appeal', opt1: 'Professional', opt2: 'Modern', opt3: 'Stunning', opt4: 'Stunning' },
                  { feature: 'Real Data', opt1: 'No', opt2: 'No', opt3: 'No', opt4: 'Yes' },
                  { feature: 'Production Ready', opt1: 'Yes', opt2: 'Yes', opt3: 'Demo', opt4: 'Yes' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: row.feature === 'Production Ready' ? '#f9f9f9' : undefined }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{row.opt1}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{row.opt2}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{row.opt3}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: '#4caf50', fontWeight: 600 }}>{row.opt4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
