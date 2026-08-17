// src/components/contribuyentes/DeduccionBeneficio.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { NotificationService } from '../utils/Notification';
import SelectorContribuyente from '../modal/SelectorContribuyente';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface PredioData {
  codigoPredio: string;
  direccionCompleta: string;
}

interface ContribuyenteSeleccionado {
  codigoContribuyente: string;
  nombreCompleto: string;
  edad?: number;
}

interface ConsultaBeneficio {
  codigoContribuyente: string;
  nombreContribuyente: string;
  estado: string;
}

export const DeduccionBeneficio: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Estados para Tab 1: Registro Deducciones
  const [modalOpen, setModalOpen] = useState(false);
  const [contribuyenteSeleccionado, setContribuyenteSeleccionado] = useState<ContribuyenteSeleccionado | null>(null);
  const [nombrePensionista, setNombrePensionista] = useState<string>('');
  const [predios, setPredios] = useState<PredioData[]>([]);
  const [mostrarPredios, setMostrarPredios] = useState(false);

  // Estados para Tab 2: Consulta Pensionista
  const [codigoBusqueda, setCodigoBusqueda] = useState<string>('');
  const [resultadosConsulta, setResultadosConsulta] = useState<ConsultaBeneficio[]>([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleSeleccionarContribuyente = useCallback((contribuyente: any) => {
    const nombreCompleto = contribuyente.contribuyente || '';
    const codigoContribuyente = contribuyente.codigo?.toString() || '';

    setContribuyenteSeleccionado({
      codigoContribuyente,
      nombreCompleto,
      edad: contribuyente.edad
    });
    setNombrePensionista(nombreCompleto);
    setModalOpen(false);
  }, []);

  const handleBuscarPredios = useCallback(() => {
    if (contribuyenteSeleccionado) {
      const prediosEjemplo: PredioData[] = [
        {
          codigoPredio: 'P-001',
          direccionCompleta: 'Av. Principal 123, Distrito Lima'
        }
      ];
      setPredios(prediosEjemplo);
      setMostrarPredios(true);
    }
  }, [contribuyenteSeleccionado]);

  const aplicaBeneficio = useMemo((): boolean => {
    return predios.length === 1;
  }, [predios.length]);

  const handleAsignacionPensionista = useCallback(() => {
    if (!aplicaBeneficio) {
      NotificationService.error('No aplica al beneficio. El contribuyente debe tener exactamente un predio.');
      return;
    }
    console.log('Asignando beneficio de pensionista...');
    NotificationService.success('Beneficio de Pensionista asignado correctamente');

  }, [aplicaBeneficio]);

  const handleAdultoMayor = useCallback(() => {
    if (!aplicaBeneficio) {
      NotificationService.error('No aplica al beneficio. El contribuyente debe tener exactamente un predio.');
      return;
    }

    if (!contribuyenteSeleccionado?.edad || contribuyenteSeleccionado.edad < 60) {
      NotificationService.error('No aplica al beneficio de Adulto Mayor. Debe tener mas de 60 años.');
      return;
    }

    console.log('Asignando beneficio de adulto mayor...');
    NotificationService.success('Beneficio de Adulto Mayor asignado correctamente');
  }, [aplicaBeneficio, contribuyenteSeleccionado?.edad]);


  const handleBuscarBeneficio = useCallback(() => {
    setBusquedaRealizada(true);

    if (codigoBusqueda.trim() !== '') {
      const resultadosEjemplo: ConsultaBeneficio[] = [
        {
          codigoContribuyente: codigoBusqueda,
          nombreContribuyente: 'Juan Pérez García',
          estado: 'ACTIVO'
        }
      ];
      setResultadosConsulta(resultadosEjemplo);
    } else {
      setResultadosConsulta([]);
    }
  }, [codigoBusqueda]);

  const handleLimpiarConsulta = useCallback(() => {
    setCodigoBusqueda('');
    setResultadosConsulta([]);
    setBusquedaRealizada(false);
  }, []);

  const handleNuevo = useCallback(() => {
    setContribuyenteSeleccionado(null);
    setNombrePensionista('');
    setPredios([]);
    setMostrarPredios(false);
  }, []);

  return (
    <>
      <Paper elevation={2} sx={{ width: '100%', maxWidth: 1200, borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
          <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
            <Tab label="Registro Deducciones" sx={{ fontWeight: 600, textTransform: 'none' }} />
            <Tab label="Consulta Pensionista / Adulto Mayor" sx={{ fontWeight: 600, textTransform: 'none' }} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Button
                variant="contained"
                onClick={handleOpenModal}
                startIcon={<PersonIcon />}
                sx={{ 
                  minWidth: 200,
                  backgroundColor: '#10b981 !important',
                  color: 'white !important',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                  '&:hover': {
                    backgroundColor: '#059669 !important',
                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                  }
                }}
              >
                Seleccionar Contribuyente
              </Button>
              <TextField
                label="Contribuyente"
                value={nombrePensionista}
                sx={{ flex: 1, minWidth: 300, bgcolor: 'background.paper', borderRadius: 1 }}
                size="small"
                disabled
                placeholder="Seleccione un contribuyente..."
              />
              <Button
                variant="contained"
                onClick={handleBuscarPredios}
                disabled={!contribuyenteSeleccionado}
                startIcon={<SearchIcon />}
                sx={{ 
                  minWidth: 120,
                  backgroundColor: '#3b82f6 !important',
                  color: 'white !important',
                  fontWeight: 700,
                  height: '40px',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    backgroundColor: '#2563eb !important',
                    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important',
                    boxShadow: 'none'
                  }
                }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={handleNuevo}
                sx={{ 
                  minWidth: 120,
                  height: '40px',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: alpha(theme.palette.action.hover, 0.05)
                  }
                }}
              >
                Nuevo
              </Button>
            </Stack>

            {mostrarPredios && (
              <>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    maxHeight: 300,
                    borderRadius: 2,
                    overflowY: 'auto',
                    border: `1px solid ${theme.palette.divider}`,
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
                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.divider}` }}>
                          CÓDIGO PREDIO
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.divider}` }}>
                          DIRECCIÓN COMPLETA
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predios.length > 0 ? (
                        predios.map((predio, index) => (
                          <TableRow key={index} hover sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                            <TableCell sx={{ fontWeight: 600 }}>{predio.codigoPredio}</TableCell>
                            <TableCell>{predio.direccionCompleta}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">
                              No se encontraron predios para este contribuyente
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Alert severity={aplicaBeneficio ? 'success' : 'warning'} sx={{ mt: 2, borderRadius: 1.5 }}>
                  {aplicaBeneficio ? (
                    <Typography variant="body2">
                      <strong>SÍ APLICA AL BENEFICIO:</strong> El contribuyente tiene un solo predio registrado.
                    </Typography>
                  ) : (
                    <Typography variant="body2">
                      <strong>NO APLICA AL BENEFICIO:</strong> El contribuyente tiene {predios.length} predio(s) registrado(s).
                      Para aplicar al beneficio debe tener exactamente un predio.
                    </Typography>
                  )}
                </Alert>

                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleAsignacionPensionista}
                    disabled={!aplicaBeneficio}
                    startIcon={<CheckCircleIcon />}
                    sx={{ 
                      minWidth: 200, 
                      height: 45,
                      backgroundColor: '#10b981 !important',
                      color: 'white !important',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                      '&:hover': {
                        backgroundColor: '#059669 !important',
                        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: `${alpha('#10b981', 0.5)} !important`,
                        color: 'rgba(255, 255, 255, 0.7) !important',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Asignacion Pensionista
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleAdultoMayor}
                    disabled={!aplicaBeneficio}
                    startIcon={<CheckCircleIcon />}
                    sx={{ 
                      minWidth: 200, 
                      height: 45,
                      backgroundColor: '#6366f1 !important',
                      color: 'white !important',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
                      '&:hover': {
                        backgroundColor: '#4f46e5 !important',
                        boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: `${alpha('#6366f1', 0.5)} !important`,
                        color: 'rgba(255, 255, 255, 0.7) !important',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Adulto Mayor
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                label="Código Contribuyente"
                value={codigoBusqueda}
                onChange={(e) => setCodigoBusqueda(e.target.value)}
                sx={{ width: 250, bgcolor: 'background.paper', borderRadius: 1 }}
                size="small"
                placeholder="Ingrese codigo..."
              />
              <Button
                variant="contained"
                onClick={handleBuscarBeneficio}
                disabled={!codigoBusqueda.trim()}
                startIcon={<SearchIcon />}
                sx={{ 
                  backgroundColor: '#3b82f6 !important',
                  color: 'white !important',
                  fontWeight: 700,
                  height: '40px',
                  minWidth: '120px',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    backgroundColor: '#2563eb !important',
                    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important',
                    boxShadow: 'none'
                  }
                }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={handleLimpiarConsulta}
                sx={{ 
                  height: '40px',
                  minWidth: '120px',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: alpha(theme.palette.action.hover, 0.05)
                  }
                }}
              >
                Limpiar
              </Button>
            </Stack>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                maxHeight: 350,
                borderRadius: 2,
                overflowY: 'auto',
                border: `1px solid ${theme.palette.divider}`,
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
                    <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.divider}` }}>
                      CÓDIGO CONTRIBUYENTE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.divider}` }}>
                      NOMBRE CONTRIBUYENTE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.divider}` }} align="center">
                      ESTADO
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultadosConsulta.length > 0 ? (
                    resultadosConsulta.map((beneficio, index) => (
                      <TableRow key={index} hover sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{beneficio.codigoContribuyente}</TableCell>
                        <TableCell>{beneficio.nombreContribuyente}</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: beneficio.estado === 'ACTIVO' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                              color: beneficio.estado === 'ACTIVO' ? 'success.dark' : 'error.dark',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              border: `1px solid ${beneficio.estado === 'ACTIVO' ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2)}`
                            }}
                          >
                            {beneficio.estado}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          {busquedaRealizada
                            ? 'El contribuyente no cuenta con ningún beneficio'
                            : 'Ingrese un código de contribuyente y haga clic en Buscar'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {resultadosConsulta.length > 0 && (
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.08), borderRadius: 1.5, border: `1px solid ${alpha(theme.palette.success.main, 0.2)}` }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                  <strong>Beneficio encontrado:</strong> {resultadosConsulta.length} registro(s)
                </Typography>
              </Box>
            )}
          </Stack>
        </TabPanel>
      </Paper>

      <SelectorContribuyente
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSelectContribuyente={handleSeleccionarContribuyente}
      />
    </>
  );
};

export default DeduccionBeneficio;
