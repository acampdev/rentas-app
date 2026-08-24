import { Box, Tab, Tabs, Typography, alpha, useTheme } from '@mui/material';
import { Person as PersonIcon, Receipt as ReceiptIcon, Today as TodayIcon } from '@mui/icons-material';

interface AsignacionCajaHeaderProps {
  activeTab: number;
  editing: boolean;
  onTabChange: (value: number) => void;
}

export const AsignacionCajaHeader = ({ activeTab, editing, onTabChange }: AsignacionCajaHeaderProps) => {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.04)})`, borderBottom: `2px solid ${theme.palette.primary.main}`, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}><ReceiptIcon fontSize="large" /></Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Asignación de Caja</Typography>
            <Typography variant="body2" color="text.secondary">Gestión de Asignaciones de Cajeros, Cajas y Turnos de Atención</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Tabs value={activeTab} onChange={(_event, value: number) => onTabChange(value)}>
          <Tab label={editing ? 'Editar Asignación' : 'Asignar Cajero'} icon={<PersonIcon />} iconPosition="start" sx={{ fontWeight: 600 }} />
          <Tab label="Cajeros Asignados" icon={<TodayIcon />} iconPosition="start" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>
    </>
  );
};
