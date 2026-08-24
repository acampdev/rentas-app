import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  Home as HomeIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface SelectorPredioFiltersProps {
  anio: number;
  codPredioBase: string;
  parametroBusqueda: string;
  loading: boolean;
  hasSearched: boolean;
  resultCount: number;
  totalCount: number;
  onAnioChange: (value: number) => void;
  onCodPredioBaseChange: (value: string) => void;
  onParametroBusquedaChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const SelectorPredioFilters = ({
  anio,
  codPredioBase,
  parametroBusqueda,
  loading,
  hasSearched,
  resultCount,
  totalCount,
  onAnioChange,
  onCodPredioBaseChange,
  onParametroBusquedaChange,
  onSearch,
  onClear,
}: SelectorPredioFiltersProps) => {
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onSearch();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 0,
        background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <FilterIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={600}>Búsqueda de Predios</Typography>
          {(codPredioBase || parametroBusqueda || hasSearched) && (
            <Chip
              label={hasSearched ? 'Búsqueda activa' : 'Filtros ingresados'}
              color="primary"
              size="small"
            />
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="flex-end" flexWrap="wrap">
          <Box sx={{ flex: '0 0 100px' }}>
            <TextField
              fullWidth
              label="Año"
              type="number"
              value={anio}
              onChange={(event) => onAnioChange(Number.parseInt(event.target.value, 10) || new Date().getFullYear())}
              onKeyDown={handleEnter}
              disabled={loading}
              size="small"
              slotProps={{ htmlInput: { min: 2020, max: new Date().getFullYear() + 1 } }}
            />
          </Box>

          <Box sx={{ flex: '0 0 160px' }}>
            <TextField
              fullWidth
              label="Código Predio"
              placeholder="Ej: 4"
              value={codPredioBase}
              onChange={(event) => onCodPredioBaseChange(event.target.value)}
              onKeyDown={handleEnter}
              disabled={loading}
              size="small"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><HomeIcon sx={{ fontSize: 18 }} /></InputAdornment>,
                  endAdornment: codPredioBase ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => onCodPredioBaseChange('')} disabled={loading}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            />
          </Box>

          <Box sx={{ flex: '0 1 300px', minWidth: 220 }}>
            <TextField
              fullWidth
              label="Parámetro Búsqueda"
              placeholder="Buscar..."
              value={parametroBusqueda}
              onChange={(event) => onParametroBusquedaChange(event.target.value)}
              onKeyDown={handleEnter}
              disabled={loading}
              size="small"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment>,
                  endAdornment: parametroBusqueda ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => onParametroBusquedaChange('')} disabled={loading}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={onSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              size="small"
              sx={actionButtonSx}
            >
              Buscar
            </Button>
            <Button variant="outlined" onClick={onClear} disabled={loading} size="small" sx={clearButtonSx}>
              Limpiar
            </Button>
          </Box>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {loading
            ? 'Buscando predios...'
            : hasSearched
              ? `${resultCount} predios encontrados`
              : `${totalCount} predios disponibles. Use código de predio para búsqueda específica.`}
        </Typography>
      </Box>
    </Paper>
  );
};

const actionButtonSx = {
  minWidth: 90,
  height: 40,
  backgroundColor: '#3b82f6 !important',
  color: 'white !important',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: 1.5,
  '&:hover': { backgroundColor: '#2563eb !important' },
  '&.Mui-disabled': {
    backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
    color: 'rgba(255, 255, 255, 0.7) !important',
  },
};

const clearButtonSx = {
  minWidth: 90,
  height: 40,
  borderColor: '#3b82f6 !important',
  color: '#3b82f6 !important',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: 1.5,
  '&:hover': { borderColor: '#2563eb !important', backgroundColor: `${alpha('#3b82f6', 0.04)} !important` },
};
