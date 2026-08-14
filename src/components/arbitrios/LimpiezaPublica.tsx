// src/components/arbitrios/LimpiezaPublica.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  alpha,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Calculate as CalculateIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useListaUsosOptions } from '../../hooks/useConstantesOptions';
import { useLimpiezaPublica } from '../../hooks/useLimpiezaPublica';
import { LimpiezaPublicaData } from '../../services/limpiezaPublicaService';
import { NotificationService } from '../utils/Notification';

interface ZonaOption {
  id: number;
  label: string;
}

/**
 * Componente para la gestión de arbitrios de Limpieza Pública
 * Soporta Casa Habitación y Otros Usos mediante tabs.
 */
const LimpiezaPublica: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { options: usosOptions } = useListaUsosOptions();
  const {
    limpiezaPublica,
    limpiezaPublicaOtros,
    loading,
    setAnio,
    crearLimpiezaPublica,
    actualizarLimpiezaPublica,
    crearLimpiezaPublicaOtros,
    actualizarLimpiezaPublicaOtros,
    eliminarLimpiezaPublica,
    recargar
  } = useLimpiezaPublica();

  // Estados del Formulario de Registro
  const [anioRegistro, setAnioRegistro] = useState<number>(new Date().getFullYear());
  const [zonaSel, setZonaSel] = useState<ZonaOption | null>(null);
  const [criterioSel, setCriterioSel] = useState<any>(null);
  const [tasaVal, setTasaVal] = useState<string>('');
  const [registroEditando, setRegistroEditando] = useState<LimpiezaPublicaData | null>(null);

  // Estados de Consulta
  const [anioBusqueda, setAnioBusqueda] = useState<number>(new Date().getFullYear());

  const zonas: ZonaOption[] = Array.from({ length: 16 }, (_, i) => ({ id: i + 1, label: `Zona ${i + 1}` }));

  // Memorizar y ordenar los criterios de uso
  const filteredCriterioOptions = useMemo(() => {
    return [...usosOptions.filter(o => !o.label?.toUpperCase().includes('CASA'))].sort((a, b) => {
      const labelA = a.label || '';
      const labelB = b.label || '';
      const isCTA = labelA.toUpperCase().startsWith('CT');
      const isCTB = labelB.toUpperCase().startsWith('CT');

      if (isCTA && !isCTB) return -1;
      if (!isCTA && isCTB) return 1;

      if (isCTA && isCTB) {
        const numA = parseInt(labelA.match(/\d+/)?.[0] || '0', 10);
        const numB = parseInt(labelB.match(/\d+/)?.[0] || '0', 10);
        if (numA !== numB) return numA - numB;
      }

      return labelA.localeCompare(labelB);
    });
  }, [usosOptions]);

  // Limpiar formulario al cambiar entre Casa Habitación y Otros Usos
  useEffect(() => {
    handleLimpiar();
  }, [tabValue]);

  /**
   * Procesa el guardado o actualización de una tasa
   */
  const handleRegistro = async () => {
    console.log('🔘 [LimpiezaPublica] Click en Guardar/Actualizar Tasa. Estados actuales:', {
      tabValue,
      anioRegistro,
      tasaVal,
      zonaSel,
      criterioSel,
      registroEditando
    });

    const isCasaHabitacion = tabValue === 0;
    if (!tasaVal) {
      console.warn('⚠️ [LimpiezaPublica] Registro cancelado: tasaVal está vacío');
      return;
    }

    const datos: any = { 
      anio: anioRegistro, 
      tasaMensual: parseFloat(tasaVal)
    };

    if (registroEditando) {
      datos.codigo = registroEditando.codigo;
    }

    if (isCasaHabitacion) {
      if (!zonaSel) {
        console.warn('⚠️ [LimpiezaPublica] Registro cancelado: zonaSel está vacío para Casa Habitación');
        return;
      }
      datos.codZona = zonaSel.id;
    } else {
      if (!criterioSel) {
        console.warn('⚠️ [LimpiezaPublica] Registro cancelado: criterioSel está vacío para Otros Usos');
        return;
      }
      // Se extrae el número del label (ej. "CT 07 LIMP. - OTROS USOS" -> 7)
      const match = (criterioSel.label || '').match(/\d+/);
      datos.codCriterio = match ? parseInt(match[0], 10) : (parseInt(criterioSel.value) % 100);
    }
    
    try {
      console.log('🚀 [LimpiezaPublica] Enviando datos al API:', datos);
      if (isCasaHabitacion) { // Casa Habitación
        if (registroEditando) await actualizarLimpiezaPublica(datos);
        else await crearLimpiezaPublica(datos);
      } else { // Otros Usos
        if (registroEditando) await actualizarLimpiezaPublicaOtros(datos);
        else await crearLimpiezaPublicaOtros(datos);
      }
      console.log('✅ [LimpiezaPublica] Tasa registrada con éxito!');
      handleLimpiar();
      recargar();
    } catch (error) {
      console.error('❌ [LimpiezaPublica] Error al registrar tasa:', error);
      NotificationService.error('Error al registrar tasa: ' + (error as Error).message);
    }
  };

  /**
   * Resetea los campos del formulario
   */
  const handleLimpiar = () => {
    setZonaSel(null);
    setCriterioSel(null);
    setTasaVal('');
    setRegistroEditando(null);
  };

  /**
   * Ejecuta la consulta de tasas para el año seleccionado
   */
  const handleBuscar = () => {
    setAnio(anioBusqueda);
  };

  /**
   * Carga los datos de una fila en el formulario para edición
   */
  const handleEditar = (row: LimpiezaPublicaData) => {
    setRegistroEditando(row);
    setAnioRegistro(row.anio || anioBusqueda);
    setTasaVal(row.tasaMensual.toString());
    if (tabValue === 0) {
      setZonaSel(zonas.find(z => z.id === row.codZona) || null);
      setCriterioSel(null);
    } else {
      setZonaSel(null);
      
      // Extraer el código del criterio de uso desde row.criterioUso si row.codCriterio es null
      let codCriterio = row.codCriterio;
      if (codCriterio === null && row.criterioUso) {
        const match = row.criterioUso.match(/\d+/);
        if (match) {
          codCriterio = parseInt(match[0], 10);
        }
      }
      
      // Búsqueda robusta por número extraído de la etiqueta (label)
      let foundOption = null;
      if (codCriterio !== null) {
        foundOption = usosOptions.find(o => {
          const match = (o.label || '').match(/\d+/);
          return match ? parseInt(match[0], 10) === codCriterio : false;
        });
      }
      if (!foundOption && row.criterioUso) {
        const cleanUso = row.criterioUso.toUpperCase().trim();
        foundOption = usosOptions.find(o => {
          const cleanOptLabel = (o.label || '').toUpperCase().trim();
          return cleanOptLabel === cleanUso || cleanOptLabel.includes(cleanUso) || cleanUso.includes(cleanOptLabel);
        });
      }
      
      setCriterioSel(foundOption || null);
    }
    
    // Scroll suave hacia arriba para facilitar la edición
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Elimina una tasa previa confirmación
   */
  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta tasa?')) {
      try {
        await eliminarLimpiezaPublica(id);
        recargar();
      } catch (error) {
        console.error('❌ [LimpiezaPublica] Error al eliminar tasa:', error);
      }
    }
  };

  const currentList = tabValue === 0 ? limpiezaPublica : limpiezaPublicaOtros;
  const isButtonDisabled = loading || !tasaVal || (tabValue === 0 ? !zonaSel : !criterioSel);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, v) => setTabValue(v)} 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: alpha('#f5f5f5', 0.8)
          }}
        >
          <Tab icon={<HomeIcon />} iconPosition="start" label="Casa Habitación" />
          <Tab icon={<BusinessIcon />} iconPosition="start" label="Otros Usos" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* SECCIÓN 1: FORMULARIO DE REGISTRO */}
          <Paper variant="outlined" sx={{ p: 3, mb: 5, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom display="flex" alignItems="center" gap={1}>
              <CalculateIcon color="primary" fontSize="small" /> Registro de Tasas
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {/* FORMULARIO DE REGISTRO CON FLEXBOX ADAPTABLE */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              alignItems: 'center',
              width: '100%'
            }}>
              {/* Campo para seleccionar año */}
              <Box sx={{ width: { xs: '100%', sm: '100px' }, flexShrink: 0 }}>
                <TextField 
                  fullWidth
                  label="Año" 
                  type="number" 
                  size="small" 
                  value={anioRegistro} 
                  onChange={(e) => setAnioRegistro(parseInt(e.target.value))} 
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '140px' }, flexShrink: 0 }}>
                {/* Campo para seleccionar tasa mensual */}
                <TextField 
                  fullWidth
                  label="Tasa Mensual" 
                  type="number" 
                  size="small" 
                  value={tasaVal} 
                  onChange={(e) => setTasaVal(e.target.value)} 
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1, fontWeight: 700, fontSize: '0.85rem' }}>S/</Typography> }} 
                />
              </Box>
              {/* Campo para seleccionar zona de servicio */}
              {tabValue === 0 && (
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '200px' } }}>
                  <Autocomplete 
                    fullWidth
                    size="small" 
                    options={zonas} 
                    value={zonaSel} 
                    onChange={(_, v) => setZonaSel(v)} 
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    renderInput={(p) => <TextField {...p} label="Zona de Servicio" />} 
                  />
                </Box>
              )}
              {/* Campo para seleccionar criterio de uso */}
              {tabValue !== 0 && (
                <Box sx={{ flexGrow: 1.5, minWidth: { xs: '100%', sm: '250px' } }}>
                  <Autocomplete 
                    fullWidth
                    size="small" 
                    options={filteredCriterioOptions}
                    value={criterioSel} 
                    onChange={(_, v) => setCriterioSel(v)} 
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    renderInput={(p) => <TextField {...p} label="Criterio de Uso" />} 
                  />
                </Box>
              )}
              {/* Botones de Acción (Alineados y adaptables) */}
              <Stack 
                direction="row" 
                spacing={1.5} 
                sx={{ 
                  flexShrink: 0,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'flex-end', sm: 'flex-start' }
                }}
              >
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={handleLimpiar}
                  sx={{ color: 'text.secondary', borderColor: 'divider', textTransform: 'none', fontWeight: 600, height: '38px' }}
                >
                  Nuevo
                </Button>
                {/* Botón para guardar la tasa */}
                <Button 
                  variant="contained" 
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  onClick={handleRegistro} 
                  disabled={isButtonDisabled}
                  sx={{ 
                    backgroundColor: '#10b981 !important', 
                    color: 'white !important',
                    fontWeight: 700,
                    minWidth: '160px',
                    height: '38px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#059669 !important'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#f3f4f6 !important',
                      color: '#9ca3af !important',
                      border: '1px solid #e5e7eb'
                    }
                  }}
                >
                  {registroEditando ? 'Actualizar Tasa' : 'Guardar Tasa'}
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* SECCIÓN 2: CONSULTA DE TASAS EXISTENTES */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom display="flex" alignItems="center" gap={1}>
              <SearchIcon color="primary" fontSize="small" /> Consultar Tasas
            </Typography>
            <Divider sx={{ mb: 2.5 }} />
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <TextField 
                label="Filtrar por Año" 
                type="number" 
                size="small" 
                value={anioBusqueda} 
                onChange={(e) => setAnioBusqueda(parseInt(e.target.value))} 
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                sx={{ width: 150 }} 
              />
              <Button 
                variant="contained" 
                startIcon={<SearchIcon />} 
                onClick={handleBuscar} 
                disabled={loading}
                style={{ 
                  backgroundColor: '#3b82f6', 
                  color: 'white',
                  fontWeight: 700,
                  height: '40px',
                  minWidth: '100px'
                }}
                sx={{ 
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#2563eb !important' }
                }}
              >
                Buscar
              </Button>
              {loading && <CircularProgress size={24} />}
            </Box>
            {/* Tabla de resultados de la consulta */}
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 500, borderRadius: 2 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.07), width: '25%' }}>
                      {tabValue === 0 ? 'Zona de Servicios' : 'Criterio de Uso'}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.07), width: '25%' }}>Tasa Mensual (S/ x m2)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.07), width: '25%' }}>Tasa Anual (S/)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.07), width: '25%' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">No se encontraron tasas registradas para el año {anioBusqueda}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentList.map((row, i) => (
                      <TableRow 
                        key={row.codigo || i} 
                        hover
                        sx={{
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: `${alpha(theme.palette.primary.main, 0.03)} !important`
                          }
                        }}
                      >
                        <TableCell align="center">
                          {tabValue === 0 ? (
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                              {row.nombreZona || `Zona ${row.codZona}`}
                            </Typography>
                          ) : (
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                              {row.criterioUso || `Criterio ${row.codCriterio}`}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`S/ ${row.tasaMensual.toFixed(3)}`} 
                            size="small" 
                            color="success" 
                            variant="outlined" 
                            sx={{ fontWeight: 700, minWidth: '95px', borderRadius: '6px' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={800} color="primary.main">
                            S/ {row.tasaAnual.toFixed(3)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Editar">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleEditar(row)}
                                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => row.codigo && handleEliminar(row.codigo)}
                                sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LimpiezaPublica;
