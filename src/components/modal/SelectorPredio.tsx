import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SelectorPredioFilters } from './selectorPredio/SelectorPredioFilters';
import { SelectorPredioResults } from './selectorPredio/SelectorPredioResults';
import type { SelectorPredioProps } from './selectorPredio/selectorPredio.types';
import { useSelectorPredio } from './selectorPredio/useSelectorPredio';

const SelectorPredio = ({
  isOpen,
  onClose,
  onSelectPredio,
  title = 'Selector de predios',
}: SelectorPredioProps) => {
  const theme = useTheme();
  const selector = useSelectorPredio({ isOpen, onClose, onSelectPredio });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, height: '85vh', maxHeight: 800, width: '90vw' } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
          <IconButton aria-label="cerrar" onClick={onClose} sx={{ color: theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SelectorPredioFilters
          anio={selector.anio}
          codPredioBase={selector.codPredioBase}
          parametroBusqueda={selector.parametroBusqueda}
          loading={selector.loading}
          hasSearched={selector.hasSearched}
          resultCount={selector.filteredPredios.length}
          totalCount={selector.predios.length}
          onAnioChange={selector.setAnio}
          onCodPredioBaseChange={selector.setCodPredioBase}
          onParametroBusquedaChange={selector.setParametroBusqueda}
          onSearch={selector.handleBuscar}
          onClear={selector.handleLimpiar}
        />
        <SelectorPredioResults
          loading={selector.loading}
          error={selector.error}
          hasSearched={selector.hasSearched}
          predios={selector.paginatedPredios}
          selectedPredio={selector.selectedPredio}
          order={selector.order}
          count={selector.filteredPredios.length}
          page={selector.page}
          rowsPerPage={selector.rowsPerPage}
          onSort={() => selector.setOrder(selector.order === 'asc' ? 'desc' : 'asc')}
          onSelect={selector.setSelectedPredio}
          onPageChange={(_event, newPage) => selector.setPage(newPage)}
          onRowsPerPageChange={selector.handleChangeRowsPerPage}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button
          onClick={selector.handleConfirm}
          variant="contained"
          disabled={!selector.selectedPredio}
          sx={{
            px: 4,
            height: 38,
            minWidth: 140,
            textTransform: 'none',
            borderRadius: 1.5,
            backgroundColor: '#3b82f6 !important',
            color: 'white !important',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#2563eb !important' },
            '&.Mui-disabled': {
              backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
              color: 'rgba(255, 255, 255, 0.7) !important',
            },
          }}
        >
          {selector.selectedPredio ? '✓ Seleccionar' : 'Seleccionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export type { SelectorPredioProps } from './selectorPredio/selectorPredio.types';
export default SelectorPredio;
