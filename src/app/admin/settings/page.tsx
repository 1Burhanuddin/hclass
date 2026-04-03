'use client'

import { useState } from 'react'
import {
  Box,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'

interface SystemSettings {
  schoolName: string
  schoolEmail: string
  academicYear: string
  allowPublicRegistration: boolean
  maintenanceMode: boolean
  maxUploadSize: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    schoolName: 'Harshdeep Classes',
    schoolEmail: 'info@harshdeepclasses.com',
    academicYear: '2025-2026',
    allowPublicRegistration: false,
    maintenanceMode: false,
    maxUploadSize: '10',
  })

  const [saveLoading, setSaveLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    setSaveLoading(true)
    setMessage(null)
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      localStorage.setItem('system-settings', JSON.stringify(settings))
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            System Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Configure system-wide settings and preferences
          </Typography>
        </Box>
      </Grid>

      {/* Alerts */}
      {message && (
        <Grid item xs={12}>
          <Alert severity={message.type}>{message.text}</Alert>
        </Grid>
      )}

      {/* School Information */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 'none', border: '1px solid #f0f0f0' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1976d2' }}>
              School Information
            </Typography>
            
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="School Name"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  fullWidth
                  disabled={saveLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="School Email"
                  type="email"
                  value={settings.schoolEmail}
                  onChange={(e) => setSettings({ ...settings, schoolEmail: e.target.value })}
                  fullWidth
                  disabled={saveLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Academic Year"
                  value={settings.academicYear}
                  onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  fullWidth
                  disabled={saveLoading}
                  placeholder="e.g., 2025-2026"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Max Upload Size (MB)"
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                  fullWidth
                  disabled={saveLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* System Preferences */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 'none', border: '1px solid #f0f0f0' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1976d2' }}>
              System Preferences
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowPublicRegistration}
                    onChange={(e) => setSettings({ ...settings, allowPublicRegistration: e.target.checked })}
                    disabled={saveLoading}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>Allow Public Registration</Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>
                      Allow new users to sign up without admin invitation
                    </Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />

              <Divider sx={{ my: 1 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    disabled={saveLoading}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>Maintenance Mode</Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>
                      Restrict access to admin and show maintenance message to others
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Action Buttons */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            sx={{ borderRadius: '8px', py: 1.2, px: 3 }}
            disabled={saveLoading}
            onClick={() => {
              // Reset to defaults
              setSettings({
                schoolName: 'Harshdeep Classes',
                schoolEmail: 'info@harshdeepclasses.com',
                academicYear: '2025-2026',
                allowPublicRegistration: false,
                maintenanceMode: false,
                maxUploadSize: '10',
              })
              setMessage(null)
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: '8px', py: 1.2, px: 3, minWidth: '120px' }}
            disabled={saveLoading}
            onClick={handleSave}
          >
            {saveLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={18} sx={{ color: 'inherit' }} /> Saving...
              </Box>
            ) : (
              'Save Settings'
            )}
          </Button>
        </Box>
      </Grid>

      {/* Info Section */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', bgcolor: '#f9f9f9' }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: '#666' }}>
              <strong>Note:</strong> Settings are stored locally in your browser. For persistent storage across accounts and devices, 
              please contact your administrator to integrate with server-side configuration management.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
