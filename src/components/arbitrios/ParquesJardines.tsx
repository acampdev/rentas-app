// src/components/arbitrios/ParquesJardines.tsx
import React, { useState, useMemo } from 'react';
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
  CircularProgress,
  Chip,
  alpha,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  DeleteOutline as ClearIcon,
  Forest as ParkIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useRutasOptions, useUbicacionAreaVerdeOptions } from '../../hooks/useConstantesOptions';
import { useParquesJardines } from '../../hooks/useParquesJardines';

/**
 * Componente para la gestión de arbitrios de Parques y Jardines
 * Incluye Registro de Tasas y Consulta en formato Matriz (Ubicación vs Ruta)
 */
const ParquesJardines: React.FC = () => {
  const theme = useTheme();
  const { options: rutasOptions, loading: loadingRutas } = useRutasOptions();
  const { options: ubicacionesOptions, loading: loadingUbicaciones } = useUbicacionAreaVerdeOptions();
  const {
    parquesJardines,
    loading,
    setAnio,
    crearParquesJardines,
    actualizarParquesJardines,
    recargar
  } = useParquesJardines();

  // Estados del Formulario de Registro
  const [anioReg, setAnioReg] = useState<number>(new Date().getFullYear());
  const [rutaSel, setRutaSel] = useState<any>(null);
  const [ubicacionSel, setUbicacionSel] = useState<any>(null);
  const [tasaVal, setTasaVal] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Estados de Consulta
  const [anioBusqueda, setAnioBusqueda] = useState<number>(new Date().getFullYear());
  const [mostrarTabla, setMostrarTabla] = useState(false);

  /**
   * Procesa el guardado o actualización de una tasa
   */
  const handleRegistro = async () => {
    if (!rutaSel || !ubicacionSel || !tasaVal) return;
    
    const datos = {
      anio: anioReg,
      codRuta: Number(rutaSel.value),
      codUbicacion: Number(ubicacionSel.value),
      tasaMensual: parseFloat(tasaVal) / 12
    };

    try {
      // Verificar si ya existe para decidir si es create o update
      const existente = parquesJardines.find(p => 
        p.anio === datos.anio && 
        p.codRuta === datos.codRuta && 
        p.codUbicacion === datos.codUbicacion
      );

      if (existente || isEditing) {
        await actualizarParquesJardines(datos);
      } else {
        await crearParquesJardines(datos);
      }
      
      handleLimpiar();
      recargar();
    } catch (error) {
      console.error('❌ [ParquesJardines] Error al registrar:', error);
    }
  };

  const handleLimpiar = () => {
    setRutaSel(null);
    setUbicacionSel(null);
    setTasaVal('');
    setIsEditing(false);
  };

  const handleBuscar = () => {
    console.log('🔍 [ParquesJardines] Consultando año:', anioBusqueda);
    setAnio(anioBusqueda);
    setMostrarTabla(true);
    // Forzar recarga inmediata
    setTimeout(() => recargar(), 100);
  };

  /**
   * Transforma los datos lineales en una matriz (Filas: Ubicaciones, Columnas: Rutas)
   */
  const { matrixData, availableRutas, availableUbicaciones } = useMemo(() => {
    if (!parquesJardines || parquesJardines.length === 0) {
      return { matrixData: [], availableRutas: rutasOptions, availableUbicaciones: ubicacionesOptions };
    }

    // 1. Determinar Rutas (Columnas) - Priorizar maestros
    let finalRutas = rutasOptions;
    if (rutasOptions.length === 0) {
      const names = Array.from(new Set(parquesJardines.map(p => p.nombreRuta).filter(Boolean)));
      finalRutas = names.map((n, i) => ({ value: i + 1, label: n!, id: i + 1 }));
    }

    // 2. Determinar Ubicaciones (Filas) - Priorizar maestros
    let finalUbicaciones = ubicacionesOptions;
    if (ubicacionesOptions.length === 0) {
      const names = Array.from(new Set(parquesJardines.map(p => p.ubicacionAreaVerde).filter(Boolean)));
      finalUbicaciones = names.map((n, i) => ({ value: i + 1, label: n!, id: i + 1 }));
    }

    const matrix = finalUbicaciones.map(ubic => {
      const row: any = { ubicacionLabel: ubic.label, codUbicacion: ubic.value };
      
      finalRutas.forEach(ruta => {
        const item = parquesJardines.find(p => {
          // Emparejamiento Híbrido: Por ID o por Nombre (fallback)
          const matchU = p.codUbicacion 
            ? String(p.codUbicacion) === String(ubic.value)
            : p.ubicacionAreaVerde?.toUpperCase() === ubic.label?.toUpperCase();
          
          const matchR = p.codRuta 
            ? String(p.codRuta) === String(ruta.value)
            : p.nombreRuta?.toUpperCase() === ruta.label?.toUpperCase();
            
          return matchU && matchR;
        });
        row[ruta.value] = item ? item.tasaMensual : null;
      });
      return row;
    });

    return { matrixData: matrix, availableRutas: finalRutas, availableUbicaciones: finalUbicaciones };
  }, [parquesJardines, rutasOptions, ubicacionesOptions]);

  /**
   * Carga una celda de la matriz en el formulario para edición
   */
  const handleTasaClick = (codRuta: string, codUbic: string, tasa: number) => {
    const ruta = availableRutas.find(r => String(r.value) === String(codRuta));
    const ubic = availableUbicaciones.find(u => String(u.value) === String(codUbic));
    
    setRutaSel(ruta || null);
    setUbicacionSel(ubic || null);
    setTasaVal((tasa * 12).toString());
    setAnioReg(anioBusqueda);
    setIsEditing(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* SECCIÓN 1: REGISTRO DE TASAS */}
      <Paper variant="outlined" sx={{ p: 3, mb: 5, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom display="flex" alignItems="center" gap={1}>
          <ParkIcon color="primary" fontSize="small" /> Registro de Tasas - Parques y Jardines
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* FILA 1: Campos con Flexbox para forzar expansión horizontal */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'flex-start' }}>
          <Box sx={{ width: '100px', flexShrink: 0 }}>
            <TextField 
              fullWidth 
              label="Año" 
              type="number" 
              size="small" 
              value={anioReg} 
              onChange={(e) => setAnioReg(parseInt(e.target.value))} 
            />
          </Box>
          {/* Box Tasa Anual */}
          <Box sx={{ width: '140px', flexShrink: 0 }}>
            <TextField 
              fullWidth 
              label="Tasa Anual" 
              type="number" 
              size="small" 
              value={tasaVal} 
              onChange={(e) => setTasaVal(e.target.value)} 
              InputProps={{ startAdornment: <Typography sx={{ mr: 1, fontWeight: 700, fontSize: '0.85rem' }}>S/</Typography> }} 
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '100px' }, flexShrink: 0 }}>
            <Autocomplete 
              fullWidth
              size="small" 
              options={rutasOptions} 
              loading={loadingRutas} 
              value={rutaSel} 
              onChange={(_, v) => setRutaSel(v)} 
              renderInput={(p) => <TextField {...p} label="Ruta" />} 
            />
          </Box>
          {/* Box Ubicación de Área Verde */}
          <Box sx={{ width: { xs: '100%', sm: '200px' }, flexShrink: 0 }}>
            <Autocomplete 
              fullWidth
              size="small" 
              options={ubicacionesOptions} 
              loading={loadingUbicaciones} 
              value={ubicacionSel} 
              onChange={(_, v) => setUbicacionSel(v)} 
              renderInput={(p) => <TextField {...p} label="Ubicación de Área Verde" />} 
            />
          </Box>
        </Box>

        {/* FILA 2: Botones alineados a la derecha */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />} 
            onClick={handleLimpiar} 
            sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary', height: '38px' }}
          >
            Limpiar
          </Button>
          <Button 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
            onClick={handleRegistro} 
            disabled={loading || !rutaSel || !ubicacionSel || !tasaVal}
            style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 700, minWidth: '160px', height: '38px' }}
            sx={{ textTransform: 'none' }}
          >
            {isEditing ? 'Actualizar Tasa' : 'Guardar Tasa'}
          </Button>
        </Box>
      </Paper>

      {/* SECCIÓN 2: CONSULTA (MATRIZ SEGÚN consultapj.png) */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom display="flex" alignItems="center" gap={1}>
          <DashboardIcon color="primary" fontSize="small" /> Consultar Tasas
        </Typography>
        <Divider sx={{ mb: 2.5 }} />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
          <TextField label="Filtrar por Año" type="number" size="small" value={anioBusqueda} onChange={(e) => setAnioBusqueda(parseInt(e.target.value))} onKeyPress={(e) => e.key === 'Enter' && handleBuscar()} sx={{ width: 150 }} />
          <Button 
            variant="contained" 
            startIcon={<SearchIcon />} 
            onClick={handleBuscar} 
            disabled={loading}
            style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 700, height: '40px' }}
            sx={{ textTransform: 'none' }}
          >
            Buscar
          </Button>
          {loading && <CircularProgress size={24} />}
        </Box>

        {mostrarTabla ? (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2,
              p: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 1,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                🌳 MATRIZ DE TASAS POR UBICACIÓN Y RUTA - AÑO {anioBusqueda}
              </Typography>
              <Chip label="Interactivo" color="success" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'auto', maxHeight: 600 }}>
              <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        fontWeight: 800, 
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRight: '2px solid rgba(0,0,0,0.1)',
                        zIndex: 3
                      }}
                      rowSpan={2}
                      align="center"
                    >
                      UBICACIÓN
                    </TableCell>
                    <TableCell 
                      colSpan={availableRutas.length} 
                      align="center"
                      sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.05), color: theme.palette.primary.main }}
                    >
                      RUTAS DE RECOLECCIÓN - TASA MENSUAL (S/)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {availableRutas.map((ruta) => (
                      <TableCell 
                        key={ruta.value} 
                        align="center"
                        sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02), fontSize: '0.75rem' }}
                      >
                        {ruta.label.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={availableRutas.length + 1} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={40} sx={{ mb: 2 }} />
                        <Typography color="text.secondary">Cargando matriz de tasas...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : matrixData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={availableRutas.length + 1} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">No se encontraron registros para el año {anioBusqueda}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    matrixData.map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell 
                          sx={{ 
                            fontWeight: 700, 
                            bgcolor: alpha(theme.palette.grey[50], 0.8),
                            borderRight: '2px solid rgba(0,0,0,0.1)',
                            position: 'sticky',
                            left: 0,
                            zIndex: 1
                          }}
                          align="left"
                        >
                          {row.ubicacionLabel}
                        </TableCell>
                        {availableRutas.map((ruta) => {
                          const tasa = row[ruta.value];
                          return (
                            <TableCell key={ruta.value} align="center" sx={{ p: 0.5 }}>
                              {tasa !== null ? (
                                <Tooltip title={`Editar: ${row.ubicacionLabel} - ${ruta.label}`} arrow>
                                  <Box
                                    onClick={() => handleTasaClick(String(ruta.value), String(row.codUbicacion), tasa)}
                                    sx={{
                                      cursor: 'pointer',
                                      p: 1,
                                      borderRadius: 1,
                                      bgcolor: alpha(theme.palette.success.main, 0.1),
                                      transition: 'all 0.2s',
                                      '&:hover': { 
                                        bgcolor: theme.palette.success.main,
                                        color: 'white',
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  >
                                    <Typography variant="body2" fontWeight={700}>
                                      S/ {tasa.toFixed(2)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', fontSize: '0.65rem' }}>
                                      Anual: S/ {(tasa * 12).toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              ) : (
                                <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                  -
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1, border: `1px dashed ${theme.palette.info.main}` }}>
              <Typography variant="caption" color="info.dark" display="flex" alignItems="center" gap={1}>
                💡 <strong>Tip:</strong> Haz clic en cualquier monto de tasa para cargar los datos en el formulario superior y actualizarlos.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: alpha('#eee', 0.2), borderRadius: 2, border: '2px dashed #ccc' }}>
            <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">Ingrese un año y presione "Buscar" para visualizar la matriz de Parques y Jardines</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ParquesJardines;
