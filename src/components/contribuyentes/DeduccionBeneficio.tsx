import { Construction } from '@mui/icons-material';
import { Alert, AlertTitle, Paper, Stack, Typography } from '@mui/material';

/**
 * La gestión de deducciones y beneficios permanece deshabilitada hasta contar
 * con contratos de API reales para consulta, validación y asignación.
 */
export const DeduccionBeneficio = () => (
  <Paper variant="outlined" sx={{ maxWidth: 760, mx: 'auto', p: 3, borderRadius: 2 }}>
    <Alert
      severity="warning"
      variant="outlined"
      icon={<Construction />}
      role="status"
    >
      <AlertTitle>Módulo no disponible</AlertTitle>
      <Stack spacing={1}>
        <Typography variant="body2">
          La gestión de deducciones, pensionistas y beneficios de adulto mayor todavía no está
          conectada a una API municipal real.
        </Typography>
        <Typography variant="body2">
          No se muestran contribuyentes, predios ni estados de beneficio simulados y las acciones
          de asignación permanecerán deshabilitadas hasta completar esa integración.
        </Typography>
      </Stack>
    </Alert>
  </Paper>
);

export default DeduccionBeneficio;
