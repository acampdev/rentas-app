import { Construction } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Paper, Stack, Typography } from '@mui/material';
import MainLayout from '../layout/MainLayout';

const DemoPage = () => (
  <MainLayout>
    <Box sx={{ display: 'grid', minHeight: '60vh', placeItems: 'center', p: 3 }}>
      <Paper variant="outlined" sx={{ maxWidth: 640, p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Construction color="warning" sx={{ fontSize: 64 }} />
          <Typography variant="h4" component="h1" fontWeight={700}>
            Módulo no disponible
          </Typography>
          <Alert severity="warning" variant="outlined" sx={{ width: '100%', textAlign: 'left' }}>
            <AlertTitle>Dashboard pendiente de integración</AlertTitle>
            Las estadísticas y actividades todavía no están conectadas a una API municipal. No se muestran cifras de demostración.
          </Alert>
        </Stack>
      </Paper>
    </Box>
  </MainLayout>
);

export default DemoPage;
