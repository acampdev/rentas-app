// src/components/reportes/PU.tsx
import React, { useState } from 'react';
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
  Chip,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Print as PrintIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import SelectorContribuyente from '../modal/SelectorContribuyente';
import PrintPU from './modal/PrintPU';
import { usePU } from '../../hooks/usePU';

const PU: React.FC = () => {
  const theme = useTheme();

  // Hook para datos PU con React Query
  const { puData, loading, buscarPU, limpiarPU } = usePU();

  // Estados tipados
  const [contribuyente, setContribuyente] = useState<any | null>(null);
  const [codPredio, setCodPredio] = useState<string>('');

  // Estados para modales
  const [modalContribuyenteOpen, setModalContribuyenteOpen] = useState(false);
  const [modalPrintOpen, setModalPrintOpen] = useState(false);

  const handleSelectContribuyente = (data: any) => {
    console.log('🔍 [PU] Contribuyente seleccionado:', data);
    setContribuyente({
      ...data,
      nombreCompleto: data?.contribuyente || data?.nombreCompleto || ''
    });
    setCodPredio('');
    setModalContribuyenteOpen(false);
    limpiarPU();
  };

  const handleBuscarPU = () => {
    if (contribuyente?.codigo && codPredio) {
      buscarPU({
        codContribuyente: contribuyente.codigo.toString(),
        codPredio: codPredio.trim()
      });
    }
  };

  // Local filter of PU data by Predio Code
  const filteredPuData = React.useMemo(() => {
    if (!codPredio) return puData;
    return puData.filter(item => item.codPredio.trim().includes(codPredio.trim()));
  }, [puData, codPredio]);

  const formatCurrency = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-PE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 4 
    }).format(num || 0);
  };

  const headerStyle = {
    bgcolor: '#edf2fe',
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    py: 1.5,
    px: 1,
    whiteSpace: 'nowrap' as const
  };

  return (
    <Box sx={{ p: 0 }}>
      <Paper 
        elevation={3}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          mb: 3
        }}
      >
        <Box sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          p: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }}>
              <HomeIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Predio Urbano (PU)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consulta e Impresión de Ficha PU por Contribuyente
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2, mb: 3, border: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
            {/* Campos de entrada */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: 2, 
              alignItems: { xs: 'stretch', sm: 'flex-end' } 
            }}>
              {/* Botón para seleccionar contribuyente */}
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => setModalContribuyenteOpen(true)}
                sx={{
                  height: 40,
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: 'none',
                  flex: { xs: '1 1 100%', sm: '0 0 180px' },
                  minWidth: { xs: '100%', sm: '180px' },
                  m: 0
                }}
              >
                Seleccionar Contribuyente
              </Button>

              {/* Código Contribuyente */}
              <Box sx={{
                flex: { xs: '1 1 100%', sm: '0 0 90px' },
                minWidth: { xs: '100%', sm: '90px' }
              }}>
                <TextField
                  fullWidth
                  size="small"
                  margin="none"
                  label="Código"
                  value={contribuyente?.codigo || ''}
                  InputProps={{
                    readOnly: true
                  }}
                  placeholder="---"
                  sx={{
                    m: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 40,
                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                    }
                  }}
                />
              </Box>

              {/* Nombre Contribuyente */}
              <Box sx={{
                flex: { xs: '1 1 100%', sm: '1 1 200px' },
                minWidth: { xs: '100%', sm: '200px' }
              }}>
                <TextField
                  fullWidth
                  size="small"
                  margin="none"
                  label="Nombre del contribuyente"
                  value={contribuyente?.contribuyente || contribuyente?.nombreCompleto || ''}
                  InputProps={{
                    readOnly: true
                  }}
                  placeholder="Seleccione un contribuyente..."
                  sx={{
                    m: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 40,
                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                    }
                  }}
                />
              </Box>

              {/* Código Predio */}
              <Box sx={{
                flex: { xs: '1 1 100%', sm: '0 0 140px' },
                minWidth: { xs: '100%', sm: '140px' }
              }}>
                <TextField
                  fullWidth
                  size="small"
                  margin="none"
                  label="Código Predio"
                  type="number"
                  value={codPredio}
                  onChange={(e) => setCodPredio(e.target.value)}
                  placeholder="Ingrese código..."
                  sx={{
                    m: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 40,
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Botones de acción (Nueva fila alineada a la derecha) */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'flex-end',
              gap: 1.5,
              mt: 2
            }}>
              {/* Botón para buscar PU */}
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                onClick={handleBuscarPU}
                disabled={!contribuyente || !codPredio || loading}
                sx={{
                  height: 40,
                  width: { xs: '100%', sm: '150px' },
                  bgcolor: '#3b82f6 !important', // Color azul premium siempre visible
                  color: 'white !important',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#2563eb !important',
                    boxShadow: theme.shadows[4]
                  },
                  '&.Mui-disabled': {
                    bgcolor: `${alpha('#3b82f6', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important',
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? '...' : 'Buscar'}
              </Button>

              {/* Botón para imprimir PU */}
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                disabled={filteredPuData.length === 0}
                onClick={() => setModalPrintOpen(true)}
                sx={{
                  height: 40,
                  width: { xs: '100%', sm: '150px' },
                  bgcolor: '#10b981 !important', // Verde esmeralda premium siempre visible
                  color: 'white !important',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#059669 !important',
                    boxShadow: theme.shadows[4]
                  },
                  '&.Mui-disabled': {
                    bgcolor: `${alpha('#10b981', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important',
                    boxShadow: 'none'
                  }
                }}
              >
                Imprimir
              </Button>
            </Box>
          </Paper>

          {/* Tabla de PU */}
          <TableContainer 
            component={Paper} 
            variant="outlined" 
            sx={{ 
              maxHeight: 450, 
              overflowX: 'auto',
              overflowY: 'auto',
              borderRadius: 2,
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: alpha(theme.palette.grey[100], 0.5),
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: alpha(theme.palette.primary.main, 0.3),
                borderRadius: 2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.5),
                }
              },
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerStyle}>COD. PREDIO</TableCell>
                  <TableCell sx={headerStyle}>DIRECCIÓN</TableCell>
                  <TableCell sx={headerStyle}>ESTADO</TableCell>
                  <TableCell sx={headerStyle}>TIPO</TableCell>
                  <TableCell align="center" sx={headerStyle}>ÁREA TERRENO</TableCell>
                  <TableCell align="right" sx={headerStyle}>VAL. UNITARIO</TableCell>
                  <TableCell align="center" sx={headerStyle}>DEPREC.</TableCell>
                  <TableCell align="right" sx={headerStyle}>AUTOAVALÚO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                ) : filteredPuData.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No se encontraron registros</Typography></TableCell></TableRow>
                ) : (
                  filteredPuData.map((pu, i) => (
                    <TableRow 
                      key={i} 
                      hover
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                        '&:nth-of-type(even)': {
                          bgcolor: alpha(theme.palette.grey[50], 0.3),
                        }
                      }}
                    >
                      <TableCell><Chip label={pu.codPredio} size="small" variant="outlined" color="primary" sx={{ fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{pu.direccion}</TableCell>
                      <TableCell>
                        <Chip 
                          label={pu.estadoPredio} 
                          size="small" 
                          color={pu.estadoPredio === 'EN CONSTRUCCION' ? 'warning' : 'success'} 
                          sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{pu.tipoPredio}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{pu.areaTerreno} m²</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>S/ {formatCurrency(pu.valorUnitario)}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{pu.depreciacion}%</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', color: theme.palette.success.main }}>S/ {formatCurrency(pu.autoavaluo)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
      
      {/* Modal Selector de Contribuyente */}
      <SelectorContribuyente
        isOpen={modalContribuyenteOpen}
        onClose={() => setModalContribuyenteOpen(false)}
        onSelectContribuyente={handleSelectContribuyente}
        title="Buscar Contribuyente"
        selectedId={contribuyente?.codigo}
      />

      {/* Modal de Impresión de Formulario PU */}
      <PrintPU
        isOpen={modalPrintOpen}
        onClose={() => setModalPrintOpen(false)}
        contribuyente={contribuyente}
        puData={filteredPuData}
      />
    </Box>
  );
};

export default PU;
