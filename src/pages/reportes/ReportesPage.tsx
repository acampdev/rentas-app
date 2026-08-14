// src/pages/reportes/ReportesPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Container,
  alpha,
  useTheme,
  Stack,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  PictureAsPdf as PdfIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import MainLayout from '../../layout/MainLayout';
import ReportesContribuyentes from '../../components/reportes/ReportesContribuyentes';
import ReportesPredios from '../../components/reportes/ReportesPredios';
import ReportesRecaudacion from '../../components/reportes/ReportesRecaudacion';
import ReportesCuentas from '../../components/reportes/ReportesCuentas';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reportes-tabpanel-${index}`}
      aria-labelledby={`reportes-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

const ReportesPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout>
      <Box 
        sx={{ 
          minHeight: '100vh',
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
          pb: 8
        }}
      >
        {/* Institutional Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 0, 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            py: 3,
            mb: 4
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={2}>
              <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" />} 
                aria-label="breadcrumb"
                sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
              >
                <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  Inicio
                </Link>
                <Typography color="text.primary">Reportes</Typography>
              </Breadcrumbs>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    color: 'primary.main'
                  }}
                >
                  <AssessmentIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.5px">
                    Centro de Reportes y Análisis
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Gestione la información estratégica de la municipalidad mediante herramientas analíticas.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Paper>

        <Container maxWidth="xl">
          {/* Main Content Area */}
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider',
              overflow: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), px: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: '4px 4px 0 0'
                  },
                  '& .MuiTab-root': {
                    minHeight: 72,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: 3,
                    transition: 'all 0.2s',
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }
                }}
              >
                <Tab icon={<PdfIcon />} iconPosition="start" label="Contribuyentes" />
                <Tab icon={<PdfIcon />} iconPosition="start" label="Predios" />
                <Tab icon={<DashboardIcon />} iconPosition="start" label="Dashboard Recaudación" />
                <Tab icon={<ReceiptIcon />} iconPosition="start" label="Cuentas Corrientes" />
              </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <TabPanel value={tabValue} index={0}>
                <ReportesContribuyentes />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <ReportesPredios />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <ReportesRecaudacion />
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <ReportesCuentas />
              </TabPanel>
            </Box>
          </Paper>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default ReportesPage;
