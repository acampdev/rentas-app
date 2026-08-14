// src/components/depreciacion/DepreciacionUnificado.tsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Autocomplete,
  useTheme,
  alpha,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tab,
  Tabs,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { Depreciacion } from '../../models/Depreciacion';
import { useDepreciacionLogic } from '../../hooks/useDepreciacionLogic';

interface DepreciacionUnificadoProps {
  anioSeleccionado: number | null;
  tipoCasaSeleccionado: string | null;
  depreciaciones: Depreciacion[];
  onAnioChange: (anio: number | null) => void;
  onTipoCasaChange: (tipoCasa: string | null) => void;
  onRegistrar: (datos?: any) => void;
  onBuscar: () => void;
  loading?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`dep-tab-${index}`}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
);

const DepreciacionUnificado: React.FC<DepreciacionUnificadoProps> = (props) => {
  const theme = useTheme();
  const {
    tabValue, setTabValue,
    nivelAntiguedadSeleccionado, setNivelAntiguedadSeleccionado,
    materialEstructuralSeleccionado, setMaterialEstructuralSeleccionado,
    tiposCasa, nivelesAntiguedad, materialesEstructurales,
    estadosConservacion, handleConservacionChange,
    handleRegistrar, handleEditarDepreciacion,
    handleNuevo,
    filteredDepreciaciones
  } = useDepreciacionLogic(
    props.anioSeleccionado, props.tipoCasaSeleccionado, props.depreciaciones,
    props.onAnioChange, props.onTipoCasaChange, props.onRegistrar, props.onBuscar
  );

  const getMaterialColor = (m: string) => {
    if (m.toUpperCase().includes('CONCRETO')) return '#10b981'; // Emerald
    if (m.toUpperCase().includes('LADRILLO')) return '#f59e0b'; // Amber
    return '#6b7280'; // Gray
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      props.onBuscar();
    }
  };

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab icon={<SearchIcon />} iconPosition="start" label="Consultar Depreciación" />
          <Tab icon={<SaveIcon />} iconPosition="start" label="Registrar Depreciación" />
        </Tabs>
      </Box>

      {/* TAB 1: CONSULTAR */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ px: 3 }}>
          <Stack spacing={3}>
            {/* FILTRO EN UNA SOLA FILA CON FLEXBOX */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center', 
              bgcolor: alpha(theme.palette.grey[100], 0.5), 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
            }}>
              <Box sx={{ width: '120px', flexShrink: 0 }}>
                <TextField 
                  fullWidth
                  label="Año" 
                  type="number" 
                  value={props.anioSeleccionado || ''} 
                  onChange={(e) => props.onAnioChange(parseInt(e.target.value) || null)} 
                  onKeyPress={handleKeyPress}
                  size="small" 
                />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Autocomplete 
                  fullWidth
                  options={tiposCasa} 
                  value={tiposCasa.find(t => String(t.value) === String(props.tipoCasaSeleccionado)) || null} 
                  onChange={(_, v) => props.onTipoCasaChange(v?.value.toString() || null)} 
                  renderInput={(p) => <TextField {...p} label="Tipo Casa / Clasificación" size="small" />} 
                />
              </Box>

              <Button 
                variant="contained" 
                startIcon={props.loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />} 
                onClick={() => props.onBuscar()}
                disabled={props.loading}
                style={{ 
                  backgroundColor: '#3b82f6', // Azul para consulta
                  color: 'white',
                  fontWeight: 700,
                  height: '40px',
                  minWidth: '120px'
                }}
                sx={{ textTransform: 'none' }}
              >
                Buscar
              </Button>
            </Box>

            {/* TABLA DE RESULTADOS */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 1.5, 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DashboardIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                  TABLA DE DEPRECIACIÓN POR ANTIGÜEDAD Y MATERIAL
                </Typography>
              </Box>

              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>MATERIAL ESTRUCTURAL</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ANTIGÜEDAD</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>M. BUENO</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>BUENO</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>REGULAR</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>MALO</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ACCIONES</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.loading ? (
                      <TableRow><TableCell colSpan={7} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                    ) : filteredDepreciaciones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                          <Typography color="text.secondary">No se encontraron datos para los filtros seleccionados</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepreciaciones.map((d, i) => (
                        <TableRow key={i} hover>
                          <TableCell>
                            <Chip 
                              label={d.material} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontWeight: 600,
                                borderColor: getMaterialColor(d.material),
                                color: getMaterialColor(d.material),
                                bgcolor: alpha(getMaterialColor(d.material), 0.05)
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>{d.antiguedad}</Typography>
                          </TableCell>
                          <TableCell align="center"><Typography variant="body2" fontWeight={700}>{d.porcMuyBueno}%</Typography></TableCell>
                          <TableCell align="center"><Typography variant="body2">{d.porcBueno}%</Typography></TableCell>
                          <TableCell align="center"><Typography variant="body2">{d.porcRegular}%</Typography></TableCell>
                          <TableCell align="center"><Typography variant="body2" color="error.main">{d.porcMalo}%</Typography></TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleEditarDepreciacion(d)}
                                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        </Box>
      </TabPanel>

      {/* TAB 2: REGISTRAR */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ px: 3 }}>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
                <Box sx={{ width: '120px' }}>
                  <TextField fullWidth label="Año" type="number" value={props.anioSeleccionado || ''} onChange={(e) => props.onAnioChange(parseInt(e.target.value) || null)} size="small" />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Autocomplete fullWidth options={tiposCasa} value={tiposCasa.find(t => String(t.value) === String(props.tipoCasaSeleccionado)) || null} onChange={(_, v) => props.onTipoCasaChange(v?.value.toString() || null)} renderInput={(p) => <TextField {...p} label="Tipo Casa" size="small" />} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
                <Autocomplete sx={{ flexGrow: 1 }} options={nivelesAntiguedad} value={nivelesAntiguedad.find(n => n.value === nivelAntiguedadSeleccionado) || null} onChange={(_, v) => setNivelAntiguedadSeleccionado(v?.value.toString() || null)} renderInput={(p) => <TextField {...p} label="Rango de Antigüedad" size="small" />} />
                <Autocomplete sx={{ flexGrow: 1 }} options={materialesEstructurales} value={materialesEstructurales.find(m => m.value === materialEstructuralSeleccionado) || null} onChange={(_, v) => setMaterialEstructuralSeleccionado(v?.value.toString() || null)} renderInput={(p) => <TextField {...p} label="Material Estructural" size="small" />} />
              </Box>

              <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 1 }}>Porcentajes de Depreciación por Estado de Conservación:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {estadosConservacion.map((e, i) => (
                  <Box key={e.nombre} sx={{ p: 2, bgcolor: 'white', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="caption" display="block" fontWeight={700} color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase' }}>{e.nombre}</Typography>
                    <TextField 
                      fullWidth 
                      type="number" 
                      size="small" 
                      value={e.value} 
                      onChange={(ev) => handleConservacionChange(i, ev.target.value)} 
                      InputProps={{ endAdornment: '%' }} 
                    />
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  onClick={handleNuevo}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Nuevo
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={props.loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                  onClick={handleRegistrar} 
                  disabled={props.loading || !props.anioSeleccionado || !props.tipoCasaSeleccionado}
                  style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 700, minWidth: '150px' }}
                  sx={{ textTransform: 'none' }}
                >
                  Guardar Depreciación
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default DepreciacionUnificado;
