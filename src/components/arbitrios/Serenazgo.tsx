import { logger } from '../../utils/logger';
// src/components/arbitrios/Serenazgo.tsx
import React, { useState, useMemo, useCallback } from 'react';
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
  alpha,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  DeleteOutline as ClearIcon,
  Security as SecurityIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useGrupoUsoOptions } from '../../hooks/useConstantesOptions';
import { useSerenazgo } from '../../hooks/useSerenazgo';
import { useSectores } from '../../hooks/useSectores';

/**
 * Componente para la gestión de arbitrios de Serenazgo
 * Incluye Registro de Tasas y Consulta en formato Matriz (Cuadrante vs Uso)
 */
const Serenazgo: React.FC = () => {
  const theme = useTheme();
  const { options: usosOptions, loading: loadingUsos } = useGrupoUsoOptions();
  const {
    serenazgo,
    loading,
    setAnio,
    crearSerenazgo,
    actualizarSerenazgo,
    recargar
  } = useSerenazgo();
  const { cuadrantes: cuadrantesAPI } = useSectores();

  // Estados del Formulario de Registro
  const [anioReg, setAnioReg] = useState<number>(new Date().getFullYear());
  const [usoSel, setUsoSel] = useState<any>(null);
  const [cuadranteVal, setCuadranteVal] = useState<string>('1');
  const [tasaVal, setTasaVal] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Estados de Consulta
  const [anioBusqueda, setAnioBusqueda] = useState<number>(new Date().getFullYear());
  const [mostrarTabla, setMostrarTabla] = useState(false);

  // Definición de Cuadrantes desde la API (con limpieza de prefijos como "C01 - ")
  const cuadrantes = useMemo(() => {
    if (!cuadrantesAPI || cuadrantesAPI.length === 0) {
      return Array.from({ length: 8 }, (_, i) => ({ id: i + 1, label: `Cuadrante ${i + 1}` }));
    }
    return cuadrantesAPI.map(c => {
      const labelLimpio = c.descripcion 
        ? c.descripcion.replace(/^C\d+\s*-\s*/i, '').trim()
        : `Cuadrante ${c.codCuadrante}`;
      return {
        id: c.codCuadrante,
        label: labelLimpio
      };
    });
  }, [cuadrantesAPI]);

  // Función para emparejar nombres de cuadrantes de manera ultra flexible
  const matchCuadranteNombre = useCallback((nombreCuadrante?: string, numCuadrante?: number) => {
    if (!nombreCuadrante || !numCuadrante) return false;
    const matchNumbers = nombreCuadrante.match(/\d+/g);
    if (matchNumbers) {
      return matchNumbers.some(numStr => parseInt(numStr, 10) === numCuadrante);
    }
    return false;
  }, []);

  /**
   * Procesa el guardado o actualización de una tasa
   */
  const handleRegistro = async () => {
    if (!usoSel || !tasaVal || !cuadranteVal) return;
    
    const datos = {
      anio: anioReg,
      codGrupoUso: Number(usoSel.value),
      codCuadrante: Number(cuadranteVal),
      tasaMensual: parseFloat(tasaVal) / 12
    };

    try {
      if (isEditing) await actualizarSerenazgo(datos);
      else await crearSerenazgo(datos);
      
      handleLimpiar();
      recargar();
    } catch (error) {
      logger.error('❌ Error al registrar:', error);
    }
  };

  const handleLimpiar = () => {
    setUsoSel(null);
    setCuadranteVal('1');
    setTasaVal('');
    setIsEditing(false);
  };

  const handleBuscar = () => {
    logger.log('🔍 [Serenazgo] Buscando para año:', anioBusqueda);
    setAnio(anioBusqueda);
    setMostrarTabla(true);
    // Forzar recarga inmediata
    setTimeout(() => recargar(), 100);
  };

  /**
   * Transforma los datos lineales del API en una matriz para la tabla
   */
  const { matrixData, availableGroups } = useMemo(() => {
    if (!serenazgo || serenazgo.length === 0) {
      logger.log('⚠️ [Serenazgo] No hay datos para el año', anioBusqueda);
      return { matrixData: [], availableGroups: usosOptions };
    }

    logger.log('📊 [Serenazgo] Procesando matriz con', serenazgo.length, 'registros');

    // 1. Identificar todos los grupos de uso presentes en la data o en las opciones
    let finalGroups = usosOptions;
    if (usosOptions.length === 0) {
      const uniqueNames = Array.from(new Set(serenazgo.map(s => s.grupoUso).filter(Boolean)));
      finalGroups = uniqueNames.map((name, idx) => ({ value: idx + 1, label: name!, id: idx + 1 }));
    }

    // 2. Identificar cuadrantes (de la API y los que vengan en la data)
    const codigosCuadrantes = Array.from(new Set([
      ...cuadrantes.map(c => c.id),
      ...serenazgo.map(s => Number(s.codCuadrante)).filter(id => !isNaN(id) && id > 0)
    ])).sort((a, b) => a - b);

    const matrix = codigosCuadrantes.map(numCuadrante => {
      const cuadranteObj = cuadrantes.find(c => c.id === numCuadrante);
      const labelCuadrante = cuadranteObj ? cuadranteObj.label : `Cuadrante ${numCuadrante}`;
      const row: any = { cuadrante: labelCuadrante, numCuadrante };
      
      finalGroups.forEach(uso => {
        // Búsqueda robusta por ID o por Nombre (ya que el API devuelve IDs null a veces)
        const item = serenazgo.find(s => {
          const matchC = s.codCuadrante 
            ? Number(s.codCuadrante) === numCuadrante 
            : (s.nombreCuadrante ? (
                s.nombreCuadrante.toUpperCase().includes(labelCuadrante.toUpperCase()) ||
                matchCuadranteNombre(s.nombreCuadrante, numCuadrante)
              ) : false);
          
          const matchG = s.codGrupoUso 
            ? String(s.codGrupoUso) === String(uso.value)
            : s.grupoUso?.toUpperCase() === uso.label?.toUpperCase();
            
          return matchC && matchG;
        });
        row[uso.value] = item ? item.tasaMensual : null;
      });
      return row;
    });

    return { matrixData: matrix, availableGroups: finalGroups };
  }, [serenazgo, usosOptions, anioBusqueda, cuadrantes, matchCuadranteNombre]);

  /**
   * Carga una celda de la matriz en el formulario para editar
   */
  const handleTasaClick = (codUso: string, numCuadrante: number, tasa: number) => {
    const uso = availableGroups.find(o => 
      String(o.value) === String(codUso) || 
      o.label?.toUpperCase() === String(codUso).toUpperCase()
    );
    
    setUsoSel(uso || null);
    setCuadranteVal(numCuadrante.toString());
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
          <SecurityIcon color="primary" fontSize="small" /> Registro de Tasas - Serenazgo
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'flex-start' }}>
          {/* Campo para seleccionar año */}
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
          {/* Campo para seleccionar cuadrante */}
          <Box sx={{ width: '180px', flexShrink: 0 }}>
            <Autocomplete
              fullWidth
              size="small"
              options={cuadrantes}
              value={cuadrantes.find(c => String(c.id) === cuadranteVal) || null}
              onChange={(_, v) => setCuadranteVal(v ? String(v.id) : '1')}
              renderInput={(p) => <TextField {...p} label="Cuadrante" />}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '180px' }, flexShrink: 0 }}>
            <Autocomplete 
              fullWidth
              size="small" 
              options={usosOptions} 
              loading={loadingUsos}
              value={usoSel} 
              onChange={(_, v) => setUsoSel(v)} 
              renderInput={(p) => <TextField {...p} label="Grupo de Uso del Predio" />} 
            />
          </Box>  
          {/* Campo para seleccionar tasa anual */}
          <Box sx={{ width: '140px', flexShrink: 0 }}>
            <TextField 
              fullWidth 
              label="Tasa Anual" 
              type="number" 
              size="small" 
              value={tasaVal} 
              onChange={(e) => setTasaVal(e.target.value)} 
              InputProps={{ 
                startAdornment: <Typography sx={{ mr: 1, fontWeight: 700, fontSize: '0.85rem' }}>S/</Typography> 
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
          {/* Botón para limpiar los campos */}
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />} 
            onClick={handleLimpiar} 
            sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary', height: '38px' }}
          >
            Limpiar
          </Button>
          {/* Botón para guardar la tasa */}
          <Button 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
            onClick={handleRegistro} 
            style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              fontWeight: 700, 
              minWidth: '160px',
              height: '38px'
            }}
            sx={{ textTransform: 'none' }}
          >
            {isEditing ? 'Actualizar Tasa' : 'Guardar Tasa'}
          </Button>
        </Box>
      </Paper>

      {/* SECCIÓN 2: CONSULTA (MATRIZ) */}
      <Box sx={{ mb: 3 }}>
        {/* Título de la sección */}
        <Typography variant="subtitle1" fontWeight={700} gutterBottom display="flex" alignItems="center" gap={1}><DashboardIcon color="primary" fontSize="small" /> Matriz de Tasas</Typography>
        <Divider sx={{ mb: 2.5 }} />
        {/* Campo para seleccionar año */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
          <TextField label="Año" type="number" size="small" value={anioBusqueda} onChange={(e) => setAnioBusqueda(parseInt(e.target.value))} onKeyPress={(e) => e.key === 'Enter' && handleBuscar()} sx={{ width: 120 }} />
          {/* Botón para buscar las tasas */}
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar} disabled={loading} style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 700, height: '40px' }} sx={{ textTransform: 'none' }}>Buscar</Button>
          {loading && <CircularProgress size={24} />}
        </Box>

        {/* Si hay datos, mostrar la tabla */}
        {mostrarTabla ? (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'auto', maxHeight: 600 }}>
            {/* Tabla de tasas */}
            <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRight: '2px solid rgba(0,0,0,0.1)', zIndex: 3 }} rowSpan={2} align="center">CUADRANTE</TableCell>
                  <TableCell colSpan={availableGroups.length} align="center" sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.05), color: theme.palette.primary.main }}>GRUPOS DE USO - TASA MENSUAL (S/)</TableCell>
                </TableRow>
                <TableRow>
                  {availableGroups.map((uso) => (
                    <TableCell key={uso.value} align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.02), fontSize: '0.75rem' }}>{uso.label.toUpperCase()}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {matrixData.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.grey[50], 0.8), borderRight: '2px solid rgba(0,0,0,0.1)', position: 'sticky', left: 0, zIndex: 1 }} align="center">{row.cuadrante}</TableCell>
                    {availableGroups.map((uso) => {
                      const tasa = row[uso.value];
                      return (
                        <TableCell key={uso.value} align="center" sx={{ p: 0.5 }}>
                          {tasa !== null ? (
                            <Tooltip title={`Editar: ${row.cuadrante} - ${uso.label}`} arrow>
                              <Box
                                onClick={() => handleTasaClick(String(uso.value), row.numCuadrante, tasa)}
                                sx={{
                                  cursor: 'pointer', p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.1), transition: 'all 0.2s',
                                  '&:hover': { bgcolor: theme.palette.success.main, color: 'white', transform: 'scale(1.05)' }
                                }}
                              >
                                <Typography variant="body2" fontWeight={700}>S/ {tasa.toFixed(2)}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', fontSize: '0.65rem' }}>Anual: S/ {(tasa * 12).toFixed(2)}</Typography>
                              </Box>
                            </Tooltip>
                          ) : <Typography variant="caption" color="text.disabled">-</Typography>}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: alpha('#eee', 0.2), borderRadius: 2, border: '2px dashed #ccc' }}>
            <Typography color="text.secondary">Ingrese un año y presione "Buscar" para visualizar las tasas</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Serenazgo;
