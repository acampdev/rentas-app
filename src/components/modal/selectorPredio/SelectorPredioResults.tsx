import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import type { Predio } from '../../../models/Predio';
import { SelectorPredioDesktopTable } from './SelectorPredioDesktopTable';
import { SelectorPredioMobileList } from './SelectorPredioMobileList';
import type { SelectorPredioPaginationProps } from './selectorPredio.types';

interface SelectorPredioResultsProps extends SelectorPredioPaginationProps {
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  predios: Predio[];
  selectedPredio: Predio | null;
  order: 'asc' | 'desc';
  onSort: () => void;
  onSelect: (predio: Predio) => void;
}

export const SelectorPredioResults = ({ loading, error, hasSearched, ...listProps }: SelectorPredioResultsProps) => (
  <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 2 }}>
    {loading ? (
      <State><CircularProgress size={30} /><Typography variant="body2" color="text.secondary">Cargando predios...</Typography></State>
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : listProps.count === 0 ? (
      <State>
        <HomeIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography color="text.secondary" variant="body2">
          {hasSearched ? 'No se encontraron predios con los criterios de búsqueda' : 'No hay predios disponibles'}
        </Typography>
      </State>
    ) : (
      <>
        <SelectorPredioDesktopTable {...listProps} />
        <SelectorPredioMobileList {...listProps} />
      </>
    )}
  </Box>
);

const State = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>{children}</Box>
);
