// src/components/predio/transferencia/ReporteAlcabala.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  alpha,
  useTheme,
  Stack,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Print as PrintIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  SearchOff as SearchOffIcon,
  FindInPage as FindInPageIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, startOfYear } from 'date-fns';
import SelectorPredio from '../../modal/SelectorPredio';
import { Predio } from '../../../models/Predio';

// Interfaz para el formulario de filtro
interface FiltroReporteData {
  predio: Predio | null;
  codigoPredio: string;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
}

// Interfaz para los datos del reporte
interface ReporteData {
  id: number;
  fechaOperacion: string;
  codigoPredio: string;
  direccion: string;
  vendedor: string;
  comprador: string;
  valorVenta: number;
  impuesto: number;
  estado: string;
}

const ReporteAlcabala: React.FC = () => {
  const theme = useTheme();

  // Estado para el modal
  const [openModalPredio, setOpenModalPredio] = useState(false);

  // Estado del formulario de filtro
  const [filtroData, setFiltroData] = useState<FiltroReporteData>({
    predio: null,
    codigoPredio: '',
    fechaDesde: startOfYear(new Date()),
    fechaHasta: new Date()
  });

  // Estado para los resultados del reporte
  const [resultados, setResultados] = useState<ReporteData[]>([]);

  // Estado para indicar si se ha realizado una busqueda
  const [hasBuscado, setHasBuscado] = useState(false);

  // Handler para seleccionar predio
  const handleSelectPredio = (predio: Predio) => {
    const codigoPredio = predio.codPredioBase || predio.codigoPredio || (predio as any).codPredio || '';
    setFiltroData(prev => ({
      ...prev,
      predio: predio,
      codigoPredio: String(codigoPredio)
    }));
    setOpenModalPredio(false);
  };

  // Handler para nuevo - limpia el filtro y resultados
  const handleNuevo = () => {
    // Limpiar formulario de filtros
    setFiltroData({
      predio: null,
      codigoPredio: '',
      fechaDesde: startOfYear(new Date()),
      fechaHasta: new Date()
    });
    // Limpiar resultados
    setResultados([]);
    // Resetear estado de busqueda
    setHasBuscado(false);
    console.log('Formulario limpiado - listo para nueva busqueda');
  };

  // Handler para buscar
  const handleBuscar = () => {
    console.log('Buscando con filtros:', {
      codigoPredio: filtroData.codigoPredio,
      fechaDesde: filtroData.fechaDesde ? format(filtroData.fechaDesde, 'dd/MM/yyyy') : null,
      fechaHasta: filtroData.fechaHasta ? format(filtroData.fechaHasta, 'dd/MM/yyyy') : null
    });
    // Marcar que se ha realizado una busqueda
    setHasBuscado(true);
    // Aqui se implementara la logica de busqueda con el servicio
    // Por ahora dejamos los resultados vacios
    setResultados([]);
  };

  // Handler para imprimir
  const handleImprimir = () => {
    console.log('Imprimiendo reporte con filtros:', {
      codigoPredio: filtroData.codigoPredio,
      fechaDesde: filtroData.fechaDesde ? format(filtroData.fechaDesde, 'dd/MM/yyyy') : null,
      fechaHasta: filtroData.fechaHasta ? format(filtroData.fechaHasta, 'dd/MM/yyyy') : null
    });
    // Aqui se implementara la logica de impresion
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        {/* Formulario de Filtros */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {/* Header del filtro */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`
              }}
            >
              <SearchIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Filtros del Reporte
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Seleccione los criterios para generar el reporte de alcabala
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} alignItems="center">
            {/* Button Buscar Predio */}
            <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => setOpenModalPredio(true)}
                fullWidth
                sx={{
                  height: 40,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 6px 12px ${alpha(theme.palette.primary.main, 0.35)}`
                  }
                }}
              >
                Buscar Predio
              </Button>
            </Grid>

            {/* Codigo Predio */}
            <Grid size={{ xs: 12, sm: 4, md: 1 }}>
              <TextField
                label="Codigo Predio"
                value={filtroData.codigoPredio}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: alpha(theme.palette.grey[500], 0.1),
                    fontWeight: 600
                  }
                }}
              />
            </Grid>

            {/* Fecha Desde */}
            <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
              <DatePicker
                label="De"
                value={filtroData.fechaDesde}
                onChange={(newValue) => setFiltroData(prev => ({ ...prev, fechaDesde: newValue as Date | null }))}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                      )
                    }
                  }
                }}
              />
            </Grid>
            {/* Fecha Hasta */}
            <Grid size={{ xs: 12, sm: 4, md: 1.5 }}>
              <DatePicker
                label="Hasta"
                value={filtroData.fechaHasta}
                onChange={(newValue) => setFiltroData(prev => ({ ...prev, fechaHasta: newValue as Date | null }))}
                format="dd/MM/yyyy"
                minDate={filtroData.fechaDesde || undefined}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                      )
                    }
                  }
                }}
              />
            </Grid>

            {/* Buttons: Nuevo, Buscar, Imprimir */}
            <Grid size={{ xs: 12, sm: 12, md: 4.5 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1.5,
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  width: '100%'
                }}
              >
                {/* Button Nuevo */}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleNuevo}
                  sx={{
                    height: 40,
                    minWidth: 100,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2
                    }
                  }}
                >
                  Nuevo
                </Button>

                {/* Button Buscar */}
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleBuscar}
                  sx={{
                    height: 40,
                    minWidth: 100,
                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                    boxShadow: `0 4px 8px ${alpha(theme.palette.info.main, 0.25)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
                      boxShadow: `0 6px 12px ${alpha(theme.palette.info.main, 0.35)}`
                    }
                  }}
                >
                  Buscar
                </Button>

                {/* Button Imprimir */}
                <Button
                  variant="contained"
                  startIcon={<PrintIcon />}
                  onClick={handleImprimir}
                  color="success"
                  sx={{
                    height: 40,
                    minWidth: 110,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    boxShadow: `0 4px 8px ${alpha(theme.palette.success.main, 0.25)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                      boxShadow: `0 6px 12px ${alpha(theme.palette.success.main, 0.35)}`
                    }
                  }}
                >
                  Imprimir
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Area de Resultados/Preview del Reporte */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 8px ${alpha(theme.palette.success.main, 0.25)}`
                }}
              >
                <PrintIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  Vista Previa del Reporte
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  El reporte se mostrara aqui despues de buscar
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Contenido del reporte */}
          <Box
            sx={{
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4
            }}
          >
            {!hasBuscado ? (
              // Estado inicial - No se ha buscado aun
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FindInPageIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />
                </Box>
                <Box textAlign="center">
                  <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                    Listo para buscar
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                    Seleccione un predio y rango de fechas, luego presione Buscar
                  </Typography>
                </Box>
              </Box>
            ) : resultados.length === 0 ? (
              // Se busco pero no hay resultados
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SearchOffIcon sx={{ fontSize: 32, color: theme.palette.warning.main }} />
                </Box>
                <Box textAlign="center">
                  <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                    No se encontraron resultados
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                    Intente con otros criterios de busqueda o presione Nuevo para limpiar
                  </Typography>
                </Box>
              </Box>
            ) : (
              // Hay resultados - Mostrar tabla o contenido
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Se encontraron {resultados.length} registro(s)
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Modal para seleccionar Predio */}
        <SelectorPredio
          isOpen={openModalPredio}
          onClose={() => setOpenModalPredio(false)}
          onSelectPredio={handleSelectPredio}
          title="Seleccionar Predio"
        />
      </Box>
    </LocalizationProvider>
  );
};

export default ReporteAlcabala;
