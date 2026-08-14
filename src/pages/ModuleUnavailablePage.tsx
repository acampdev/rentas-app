import { Construction, ArrowBack } from '@mui/icons-material';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

interface ModuleUnavailablePageProps {
  title: string;
  description?: string;
}

const ModuleUnavailablePage = ({ title, description }: ModuleUnavailablePageProps) => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', minHeight: '60vh', placeItems: 'center', p: 3 }}>
        <Paper variant="outlined" sx={{ maxWidth: 560, p: 5, textAlign: 'center', borderRadius: 3 }}>
          <Stack spacing={2.5} alignItems="center">
            <Construction color="warning" sx={{ fontSize: 64 }} />
            <Typography variant="h4" component="h1" fontWeight={700}>{title}</Typography>
            <Typography color="text.secondary">
              {description ?? 'Este módulo todavía no está disponible. No se muestran datos de demostración.'}
            </Typography>
            <Button startIcon={<ArrowBack />} variant="outlined" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default ModuleUnavailablePage;
