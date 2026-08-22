import type { FC } from 'react';
import { CompareArrows as MovementsIcon } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Paper, Stack, Typography } from '@mui/material';

const ReporteMovimientosCaja: FC = () => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
        <MovementsIcon color="primary" />
        Reporte de Movimientos
      </Typography>
    </Box>

    <Paper variant="outlined" sx={{ p: 3 }}>
      <Alert severity="warning" variant="outlined">
        <AlertTitle>Módulo no disponible</AlertTitle>
        El reporte de movimientos de caja todavía no está conectado a una API municipal.
        No se muestran movimientos ni se generan documentos con datos simulados.
      </Alert>
    </Paper>
  </Stack>
);

export default ReporteMovimientosCaja;
