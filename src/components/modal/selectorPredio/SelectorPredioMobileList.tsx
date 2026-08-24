import { Box, Chip, Paper, Radio, Stack, Typography, alpha, useTheme } from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Terrain as TerrainIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';
import { getPredioAddress, getPredioCode, getPredioKey } from '../selectorPredio.utils';
import { SelectorPredioPagination } from './SelectorPredioPagination';
import type { SelectorPredioListProps } from './selectorPredio.types';

export const SelectorPredioMobileList = ({
  predios,
  selectedPredio,
  count,
  page,
  rowsPerPage,
  onSelect,
  onPageChange,
  onRowsPerPageChange,
}: SelectorPredioListProps) => {
  const theme = useTheme();
  const selectedKey = getPredioKey(selectedPredio);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        <Stack spacing={1} sx={{ py: 1 }}>
          {predios.map((predio, index) => {
            const currentKey = getPredioKey(predio);
            const isSelected = selectedKey !== null && selectedKey === currentKey;
            const predioCode = getPredioCode(predio);
            return (
              <Paper
                key={currentKey || index}
                onClick={() => onSelect(predio)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                  bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                  borderRadius: 2,
                  '&:hover': { boxShadow: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) },
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <HomeIcon sx={{ fontSize: 16, color: isSelected ? 'primary.main' : 'text.secondary' }} />
                    <Chip label={predioCode || 'Sin código'} size="small" color={isSelected ? 'primary' : 'default'} variant={isSelected ? 'filled' : 'outlined'} />
                  </Stack>
                  <Radio checked={isSelected} size="small" />
                </Stack>

                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <LocationIcon sx={{ fontSize: 14, color: 'primary.main', mt: 0.3 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">DIRECCIÓN</Typography>
                      <Typography variant="body2" fontWeight={isSelected ? 600 : 500}>{getPredioAddress(predio)}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ bgcolor: alpha(theme.palette.grey[50], 0.5), p: 1.5, borderRadius: 1 }}>
                    <Value icon={<TerrainIcon />} label="ÁREA" value={`${predio.areaTerreno?.toFixed(1) || '0.0'} m²`} />
                    <Value icon={<MoneyIcon color="success" />} label="AUTOAVALÚO" value={formatCurrency(predio.autoavaluo || 0)} />
                  </Stack>

                  {predio.conductor && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PersonIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                      <Box><Typography variant="caption" color="text.secondary">CONDUCTOR</Typography><Typography variant="body2">{predio.conductor}</Typography></Box>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>
      <SelectorPredioPagination mobile count={count} page={page} rowsPerPage={rowsPerPage} onPageChange={onPageChange} onRowsPerPageChange={onRowsPerPageChange} />
    </Box>
  );
};

const Value = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box sx={{ flex: 1 }}>
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ '& svg': { fontSize: 12 } }}>
      {icon}<Typography variant="caption" color="text.secondary">{label}</Typography>
    </Stack>
    <Typography variant="body2" fontWeight={600}>{value}</Typography>
  </Box>
);
