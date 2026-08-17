// src/components/predio/pisos/ConsultaPisos.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Chip,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Layers as LayersIcon,
  Clear as ClearIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { usePisos } from '../../../hooks/usePisos';
import { Predio } from '../../../models/Predio';
import { NotificationService } from '../../utils/Notification';
import { useNavigate, useLocation } from 'react-router-dom';

const ConsultaPisos: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados locales para el predio y filtros de UI
  const [predio, setPredio] = useState<Predio | null>(null);
  const [filtrosUI, setFiltrosUI] = useState({
    anio: new Date().getFullYear(),
    codPredio: ''
  });
  const [pisoEditando, setPisoEditando] = useState<number | null>(null);

  // Hook de negocio con React Query
  const { 
    pisos, 
    loading, 
    consultarPisos, 
    obtenerPisoParaEdicion,
    eliminarPiso,
    setFiltros,
    filtros
  } = usePisos();

  // Efecto para recibir predio desde navegación
  useEffect(() => {
    const state = location.state as { codigoPredio?: string; predio?: Predio; codPredioBase?: string };
    if (state && (state.codigoPredio || state.codPredioBase)) {
      if (state.predio) setPredio(state.predio);
      
      // Obtener el código base limpio (por ejemplo, '8' en lugar de '20258')
      let codigoLimpio = (state.codPredioBase || '').trim();
      if (!codigoLimpio && state.codigoPredio) {
        const fullCode = state.codigoPredio.trim();
        // Si el código tiene más de 4 caracteres y comienza con 4 dígitos, extraemos el código base
        if (fullCode.length > 4 && /^\d{4}/.test(fullCode)) {
          codigoLimpio = fullCode.substring(4);
        } else {
          codigoLimpio = fullCode;
        }
      }
      
      const anioQuery = state.predio?.anio ? Number(state.predio.anio) : filtrosUI.anio;
      
      // Disparar búsqueda inicial
      consultarPisos({ 
        anio: anioQuery, 
        codPredioBase: codigoLimpio 
      });

      // Limpiar filtros de UI para no mostrar valores en las cajas
      setFiltrosUI({
        anio: new Date().getFullYear(),
        codPredio: ''
      });
    }
  }, [consultarPisos, filtrosUI.anio, location.state]);

  const handleBuscar = () => {
    if (!filtrosUI.codPredio.trim()) {
      NotificationService.warning('Debe ingresar un Código de Predio para realizar la búsqueda');
      return;
    }

    // Extraer código base si el usuario ingresó un código completo (ej: 20258 -> 8)
    let codPredioBaseVal = filtrosUI.codPredio.trim();
    if (codPredioBaseVal.length > 4 && /^\d{4}/.test(codPredioBaseVal)) {
      const anioStr = String(filtrosUI.anio);
      if (codPredioBaseVal.startsWith(anioStr)) {
        codPredioBaseVal = codPredioBaseVal.substring(anioStr.length);
      } else {
        codPredioBaseVal = codPredioBaseVal.substring(4);
      }
    }

    // Realizar la consulta de pisos
    consultarPisos({
      anio: filtrosUI.anio,
      codPredioBase: codPredioBaseVal
    });

    // Limpiar cajas del formulario
    setFiltrosUI({
      anio: new Date().getFullYear(),
      codPredio: ''
    });
  };

  const handleLimpiarTabla = () => {
    // Vaciar la consulta en React Query
    setFiltros({});
    // También limpiar los campos del filtro en la UI
    setFiltrosUI({
      anio: new Date().getFullYear(),
      codPredio: ''
    });
    setPredio(null);
    NotificationService.info('Resultados y filtros de búsqueda limpiados');
  };

  const handleEdit = async (piso: any) => {
    const anio = Number(piso.anio || filtros.anio || new Date().getFullYear());
    const codPredioCompleto = String(piso.codPredio || piso.codigoPredio || '').trim();
    const codPredioBase = String(
      piso.codPredioBase || filtros.codPredioBase ||
      (codPredioCompleto.startsWith(String(anio)) ? codPredioCompleto.substring(4) : codPredioCompleto)
    ).trim();
    const numeroPiso = Number(piso.numeroPiso);

    if (!codPredioBase || !numeroPiso) {
      NotificationService.error('No se pudo determinar el predio o número de piso para editar');
      return;
    }

    try {
      setPisoEditando(Number(piso.codPiso || piso.id || numeroPiso));
      const pisoCompleto = await obtenerPisoParaEdicion({ anio, codPredioBase, numeroPiso });

      if (!pisoCompleto) {
        NotificationService.warning('No se encontraron los datos completos del piso seleccionado');
        return;
      }

      const datosEdicion = {
        piso: pisoCompleto,
        predio: predio || {
          codPredio: pisoCompleto.codPredio || `${anio}${codPredioBase}`,
          codigoPredio: pisoCompleto.codPredio || `${anio}${codPredioBase}`,
          codPredioBase,
          anio
        },
        modoEdicion: 'editar'
      };
      navigate('/predio/pisos/registro', { state: { modoEdicion: 'editar', datosEdicion } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo consultar el piso seleccionado';
      NotificationService.error(message);
    } finally {
      setPisoEditando(null);
    }
  };

  const handleDelete = async (piso: any) => {
    if (window.confirm(`¿Seguro que desea eliminar el piso ${piso.numeroPiso || piso.item}?`)) {
      await eliminarPiso({
        anio: piso.anio || filtros.anio || new Date().getFullYear(),
        codPredio: String(piso.codPredio || `${filtros.anio || new Date().getFullYear()}${filtros.codPredioBase || ''}`),
        numeroPiso: piso.numeroPiso || 0,
        codPiso: piso.codPiso
      });
    }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(v);

  const headerStyle = {
    bgcolor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '0.813rem',
    whiteSpace: 'nowrap' as const,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    py: 1.5
  };

  const cellStyle = {
    fontSize: '0.813rem',
    whiteSpace: 'nowrap' as const,
    py: 1
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <LayersIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5" fontWeight={700}>Consulta de Pisos</Typography>
        </Stack>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start', bgcolor: alpha(theme.palette.grey[50], 0.5), p: 2, borderRadius: 2 }}>
          {/* Campo de año */}
          <TextField 
            label="Año" 
            type="number" 
            size="small" 
            sx={{ width: 100 }} 
            value={filtrosUI.anio || ''} 
            onChange={(e) => setFiltrosUI({ ...filtrosUI, anio: parseInt(e.target.value) || 0 })} 
          />
          {/* Campo de código de predio */}
          <TextField 
            label="Código Predio" 
            size="small" 
            sx={{ width: 150 }}
            value={filtrosUI.codPredio} 
            onChange={(e) => setFiltrosUI({ ...filtrosUI, codPredio: e.target.value })} 
          />
          {/* Botón para buscar pisos */}
          <Button 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />} 
            onClick={handleBuscar} 
            disabled={loading}
            sx={{
              bgcolor: '#3b82f6 !important', // Azul premium siempre visible
              color: 'white !important',
              fontSize: '0.813rem',
              fontWeight: 'bold',
              px: 3,
              height: 40,
              '&.Mui-disabled': {
                bgcolor: `${alpha('#3b82f6', 0.5)} !important`,
                color: 'rgba(255, 255, 255, 0.7) !important'
              }
            }}
          >
            Buscar
          </Button>
          {/* Botón Nuevo */}
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => {
              const codPredioActual = (filtros.codPredioBase || filtros.codPredio || '').trim();
              const anioActual = filtros.anio || new Date().getFullYear();
              navigate('/predio/pisos/registro', { 
                state: { 
                  modoEdicion: 'nuevo',
                  datosEdicion: {
                    predio: predio || (codPredioActual ? { codPredio: `${anioActual}${codPredioActual}`, anio: anioActual, codigoPredio: `${anioActual}${codPredioActual}` } : undefined)
                  }
                } 
              });
            }}
            sx={{
              bgcolor: '#10b981 !important', // Verde esmeralda premium
              color: 'white !important',
              fontSize: '0.813rem',
              fontWeight: 'bold',
              px: 3,
              height: 40
            }}
          >
            Nuevo
          </Button>
          {/* Botón Limpiar Tabla */}
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<ClearIcon />} 
            onClick={handleLimpiarTabla}
            sx={{
              borderColor: '#ef4444 !important',
              color: '#ef4444 !important',
              fontSize: '0.813rem',
              fontWeight: 'bold',
              px: 3,
              height: 40,
              '&:hover': {
                bgcolor: alpha('#ef4444', 0.08),
                borderColor: '#dc2626 !important'
              }
            }}
          >
            Limpiar Tabla
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.palette.primary.main}`, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
          <Typography variant="h6" fontWeight={600}>Pisos Registrados</Typography>
          <Stack direction="row" spacing={1}>
            {pisos.length > 0 && <Chip label={`ÁREA TOTAL: ${pisos[0].areaTotalConstruccion || 0} m2`} color="success" size="small" />}
            <Chip label={`${pisos.length} pisos`} color="primary" size="small" />
          </Stack>
        </Box>

        {/* Tabla de pisos */}
        <TableContainer 
          sx={{ 
            maxHeight: 500,
            maxWidth: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.divider, 0.05),
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.4),
              },
            },
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={headerStyle}>Item</TableCell>
                <TableCell align="center" sx={headerStyle}>Descripción</TableCell>
                <TableCell align="center" sx={headerStyle}>Valor Unitario</TableCell>
                <TableCell align="center" sx={headerStyle}>Incremento</TableCell>
                <TableCell align="center" sx={headerStyle}>Depreciación</TableCell>
                <TableCell align="center" sx={headerStyle}>Valor Único Depreciado</TableCell>
                <TableCell align="center" sx={headerStyle}>Valor Área Construida</TableCell>
                <TableCell align="center" sx={headerStyle}>Área Construida</TableCell>
                <TableCell align="center" sx={headerStyle}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
              ) : pisos.length > 0 ? (
                pisos.map((p: any) => (
                  <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" sx={cellStyle}>
                      <Chip 
                        label={p.item} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ ...cellStyle, fontWeight: 500 }}>{p.descripcion}</TableCell>
                    <TableCell align="center" sx={{ ...cellStyle, fontFamily: 'monospace', fontWeight: 600 }}>{formatCurrency(p.valorUnitario)}</TableCell>
                    <TableCell align="center" sx={{ ...cellStyle, fontFamily: 'monospace', color: p.incremento > 0 ? theme.palette.warning.dark : 'inherit' }}>{formatCurrency(p.incremento)}</TableCell>
                    <TableCell align="center" sx={cellStyle}>
                      <Chip 
                        label={`${p.porcentajeDepreciacion}%`} 
                        size="small" 
                        color={p.porcentajeDepreciacion > 50 ? 'error' : p.porcentajeDepreciacion > 20 ? 'warning' : 'default'}
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ ...cellStyle, fontFamily: 'monospace', fontWeight: 600, color: theme.palette.primary.main }}>{formatCurrency(p.valorUnicoDepreciado)}</TableCell>
                    <TableCell align="center" sx={{ ...cellStyle, fontFamily: 'monospace', fontWeight: 600, color: theme.palette.success.main }}>{formatCurrency(p.valorAreaConstruida)}</TableCell>
                    <TableCell align="center" sx={{ ...cellStyle, fontWeight: 'bold' }}>{p.areaConstruida} m²</TableCell>
                    <TableCell align="center" sx={cellStyle}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(p)}
                        disabled={pisoEditando !== null}
                      >
                        {pisoEditando === Number(p.codPiso || p.id || p.numeroPiso)
                          ? <CircularProgress size={18} />
                          : <EditIcon fontSize="small" />}
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(p)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No se encontraron resultados</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ConsultaPisos;
