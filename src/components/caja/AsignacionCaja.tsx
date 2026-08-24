import { Box, Paper, useTheme } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import { AsignacionCajaFilters } from './asignacion/AsignacionCajaFilters';
import { AsignacionCajaForm } from './asignacion/AsignacionCajaForm';
import { AsignacionCajaHeader } from './asignacion/AsignacionCajaHeader';
import { AsignacionCajaTable } from './asignacion/AsignacionCajaTable';
import { TabPanel } from './asignacion/TabPanel';
import type { AsignacionCajaProps } from './asignacion/asignacionCaja.types';
import { useAsignacionCajaController } from './asignacion/useAsignacionCajaController';

const AsignacionCaja = ({ codigoSupervisor }: AsignacionCajaProps) => {
  const theme = useTheme();
  const controller = useAsignacionCajaController(codigoSupervisor);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 0 }}>
        <Paper
          elevation={3}
          sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, mb: 3 }}
        >
          <AsignacionCajaHeader
            activeTab={controller.activeTab}
            editing={Boolean(controller.editing)}
            onTabChange={controller.setActiveTab}
          />
          <TabPanel value={controller.activeTab} index={0}>
            <AsignacionCajaForm controller={controller} />
          </TabPanel>
          <TabPanel value={controller.activeTab} index={1}>
            <AsignacionCajaFilters controller={controller} />
            <AsignacionCajaTable controller={controller} />
          </TabPanel>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export type { AsignacionCajaProps } from './asignacion/asignacionCaja.types';
export default AsignacionCaja;
