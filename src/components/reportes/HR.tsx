// src/components/reportes/HR.tsx
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
  Person as PersonIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import SelectorContribuyente from '../modal/SelectorContribuyente';
import PrintHR from './modal/PrintHR';
import { useHR } from '../../hooks/useHR';

const HR: React.FC = () => {
  const theme = useTheme();

  // Hook para datos HR con React Query
  const { hrData, loading, buscarHR, limpiarHR } = useHR();

  // Estados tipados
  const [contribuyente, setContribuyente] = useState<any | null>(null);

  // Estados para modales
  const [modalContribuyenteOpen, setModalContribuyenteOpen] = useState(false);
  const [modalPrintOpen, setModalPrintOpen] = useState(false);

  const handleSelectContribuyente = (data: any) => {
    console.log('🔍 [HR] Contribuyente seleccionado:', data);
    setContribuyente({
      ...data,
      nombreCompleto: data?.contribuyente || data?.nombreCompleto || ''
    });
    setModalContribuyenteOpen(false);
    limpiarHR();
  };

  const handleBuscarHR = () => {
    if (contribuyente?.codigo) {
      buscarHR({ codContribuyente: contribuyente.codigo.toString() });
    }
  };

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
              <AssignmentIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Hoja de Resumen (HR)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consulta e Impresión de Hoja de Resumen por Contribuyente
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 2, mb: 3, border: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
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

              {/* Botones de acción */}
              <Box sx={{
                display: 'flex',
                gap: 1.5,
                flex: { xs: '1 1 100%', sm: '0 0 220px' },
                minWidth: { xs: '100%', sm: '220px' },
                m: 0
              }}>
                {/* Botón para buscar HR */}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  onClick={handleBuscarHR}
                  disabled={!contribuyente || loading}
                  sx={{
                    height: 40,
                    bgcolor: '#3b82f6 !important', // Color azul premium siempre visible
                    color: 'white !important',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
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

                {/* Botón para imprimir HR */}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PrintIcon />}
                  disabled={hrData.length === 0}
                  onClick={() => setModalPrintOpen(true)}
                  sx={{
                    height: 40,
                    bgcolor: '#10b981 !important', // Verde esmeralda premium siempre visible
                    color: 'white !important',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
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
            </Box>
          </Paper>

          {/* Tabla de HR */}
          <TableContainer 
            component={Paper} 
            variant="outlined" 
            sx={{ 
              maxHeight: 450, 
              overflowX: 'scroll',
              overflowY: 'scroll',
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
                  <TableCell sx={headerStyle}>DIRECCIÓN FISCAL</TableCell>
                  <TableCell sx={headerStyle}>TIPO</TableCell>
                  <TableCell align="center" sx={headerStyle}>% COND.</TableCell>
                  <TableCell align="right" sx={headerStyle}>AUTOAVALÚO</TableCell>
                  <TableCell align="right" sx={headerStyle}>IMP. PREDIAL</TableCell>
                  <TableCell align="right" sx={headerStyle}>TRIMESTRAL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                ) : hrData.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No se encontraron registros</Typography></TableCell></TableRow>
                ) : (
                  hrData.map((hr, i) => (
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
                      <TableCell><Chip label={hr.codPredio} size="small" variant="outlined" color="primary" sx={{ fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{hr.direccionFiscal}</TableCell>
                      <TableCell>
                        <Chip 
                          label={hr.tipoPredio} 
                          size="small" 
                          sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{hr.porcentajeCondomino}%</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>S/ {formatCurrency(hr.autoavaluo)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>S/ {formatCurrency(hr.impuestoPredial)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', color: theme.palette.success.main }}>S/ {formatCurrency(hr.impuestoTrimestral)}</TableCell>
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

      {/* Modal de Impresión de Formulario HR */}
      <PrintHR
        isOpen={modalPrintOpen}
        onClose={() => setModalPrintOpen(false)}
        contribuyente={contribuyente}
        hrData={hrData}
      />
    </Box>
  );
};

export default HR;
