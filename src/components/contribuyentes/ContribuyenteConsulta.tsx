// src/components/contribuyentes/ContribuyenteConsulta.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Stack,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  Avatar,
  Skeleton,
  Container,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useConstantesOptions } from '../../hooks/useConstantesOptions';
import { constanteService } from '../../services';

export interface Contribuyente {
  codigo: string | number;
  contribuyente: string;
  documento: string;
  direccion: string;
  telefono?: string;
  tipoPersona?: 'natural' | 'juridica' | string;
  tipoContribuyente?: string;
  esExonerado?: boolean | null;
  esPensionista?: boolean | null;
  estado?: 'activo' | 'inactivo';
}

interface ContribuyenteConsultaProps {
  contribuyentes: Contribuyente[];
  onBuscar: (filtro: any) => void;
  onNuevo?: () => void;
  onEditar: (codigo: string | number) => void;
  loading?: boolean;
}

const ContribuyenteConsulta: React.FC<ContribuyenteConsultaProps> = ({
  contribuyentes,
  onBuscar,
  onNuevo,
  onEditar,
  loading = false
}) => {
  const theme = useTheme();

  // Estados locales para filtros de búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState<string>('');
  const [codigoContribuyente, setCodigoContribuyente] = useState<string>('');
  const [codTipoContribuyente, setCodTipoContribuyente] = useState<string>('');
  const [esExonerado, setEsExonerado] = useState<string>('');
  const [esPensionista, setEsPensionista] = useState<string>('');

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);

  // Opciones de tipo de contribuyente
  const { options: tiposContribuyenteOptions } = useConstantesOptions(
    'tipos-contribuyente',
    () => constanteService.obtenerTiposContribuyente()
  );

  const handleBuscar = () => {
    const payload = {
      parametroBusqueda: (textoBusqueda || '').trim(),
      codigoContribuyente: (codigoContribuyente || '').trim(),
      codTipoContribuyente: codTipoContribuyente || '',
      esExonerado: esExonerado || '',
      esPensionista: esPensionista || ''
    };

    console.log('🔍 [ContribuyenteConsulta] Clic en Buscar. Payload enviado:', payload);
    onBuscar(payload);
    setPage(0);
  };

  const handleLimpiar = () => {
    console.log('🧹 [ContribuyenteConsulta] Limpiando filtros de búsqueda');
    setTextoBusqueda('');
    setCodigoContribuyente('');
    setCodTipoContribuyente('');
    setEsExonerado('');
    setEsPensionista('');
    onBuscar({});
    setPage(0);
  };

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const contribuyentesPaginados = useMemo(() => {
    return contribuyentes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [contribuyentes, page, rowsPerPage]);

  const getTipoPersonaIcon = (tipo?: string, size = 20) => {
    const cleanTipo = String(tipo || '').toLowerCase();
    return (cleanTipo === 'juridica' || cleanTipo === '0302') 
      ? <BusinessIcon sx={{ fontSize: size }} /> 
      : <PersonIcon sx={{ fontSize: size }} />;
  };

  const getTipoPersonaColor = (tipo?: string) => {
    const cleanTipo = String(tipo || '').toLowerCase();
    return (cleanTipo === 'juridica' || cleanTipo === '0302') ? 'primary' : 'secondary';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Paper 
        elevation={2}
        sx={{ 
          borderRadius: 2,
          background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
          border: '1px solid',
          borderColor: 'divider',
          mb: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Consulta de Contribuyentes
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Busca y gestiona la información de contribuyentes registrados
              </Typography>
            </Box>
          </Box>
          {onNuevo && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={onNuevo}
            >
              Nuevo Contribuyente
            </Button>
          )}
        </Box>
      </Paper>

      <Stack spacing={3}>
        <Paper elevation={2} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            {/* SECCIÓN DE FILTROS DE BÚSQUEDA */}
            <Box sx={{ 
              mb: 3, 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2, 
              bgcolor: alpha(theme.palette.grey[100], 0.3), 
              p: 2.5, 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
            }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                {/* 1. Búsqueda por Nombre o Documento */}
                <TextField
                  variant="outlined"
                  label="Nombre o Documento"
                  placeholder="Ej: Marcelo ó 72252468"
                  value={textoBusqueda}
                  onChange={(e) => setTextoBusqueda(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                  size="small"
                  sx={{ bgcolor: 'background.paper', borderRadius: 1, minWidth: 240, flexGrow: 1 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                    endAdornment: textoBusqueda && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setTextoBusqueda('')}><ClearIcon fontSize="small" /></IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* 2. Código Contribuyente */}
                <TextField
                  variant="outlined"
                  label="Cód. Contribuyente"
                  placeholder="Ej: 21"
                  type="text"
                  value={codigoContribuyente}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      setCodigoContribuyente(val);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                  size="small"
                  sx={{ bgcolor: 'background.paper', borderRadius: 1, width: 160 }}
                />

                {/* 3. Tipo Contribuyente */}
                <FormControl size="small" sx={{ minWidth: 180, bgcolor: 'background.paper' }}>
                  <InputLabel>Tipo Contribuyente</InputLabel>
                  <Select
                    value={codTipoContribuyente}
                    label="Tipo Contribuyente"
                    onChange={(e) => setCodTipoContribuyente(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {tiposContribuyenteOptions.map((opt) => (
                      <MenuItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Fila de RadioButtons para Exonerado y Pensionista */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                {/* 4. Exonerado (Radio Group: Sí / No con toggle) */}
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 1.5, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mr: 1 }}>
                    Exonerado:
                  </Typography>
                  <RadioGroup
                    row
                    value={esExonerado}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEsExonerado(prev => prev === val ? '' : val);
                    }}
                  >
                    <FormControlLabel 
                      value="1" 
                      control={<Radio size="small" color="success" />} 
                      label={<Typography variant="body2" fontWeight={esExonerado === '1' ? 700 : 400}>Sí</Typography>} 
                    />
                    <FormControlLabel 
                      value="0" 
                      control={<Radio size="small" />} 
                      label={<Typography variant="body2" fontWeight={esExonerado === '0' ? 700 : 400}>No</Typography>} 
                    />
                  </RadioGroup>
                </Box>

                {/* 5. Pensionista (Radio Group: Sí / No con toggle) */}
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 1.5, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mr: 1 }}>
                    Pensionista:
                  </Typography>
                  <RadioGroup
                    row
                    value={esPensionista}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEsPensionista(prev => prev === val ? '' : val);
                    }}
                  >
                    <FormControlLabel 
                      value="1" 
                      control={<Radio size="small" color="primary" />} 
                      label={<Typography variant="body2" fontWeight={esPensionista === '1' ? 700 : 400}>Sí</Typography>} 
                    />
                    <FormControlLabel 
                      value="0" 
                      control={<Radio size="small" />} 
                      label={<Typography variant="body2" fontWeight={esPensionista === '0' ? 700 : 400}>No</Typography>} 
                    />
                  </RadioGroup>
                </Box>

                {/* Botones Acciones */}
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleBuscar} 
                    startIcon={<SearchIcon />}
                    sx={{ 
                      backgroundColor: '#3b82f6 !important',
                      color: 'white !important',
                      fontWeight: 700,
                      height: '38px',
                      minWidth: '110px',
                      textTransform: 'none',
                      borderRadius: 1.5,
                      '&:hover': { backgroundColor: '#2563eb !important' }
                    }}
                  >
                    Buscar
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleLimpiar} 
                    startIcon={<ClearIcon />}
                    sx={{ 
                      height: '38px',
                      minWidth: '100px',
                      textTransform: 'none',
                      borderRadius: 1.5
                    }}
                  >
                    Limpiar
                  </Button>
                </Box>
              </Box>
            </Box>

            {loading ? (
              <Stack spacing={2}>{[...Array(5)].map((_, i) => <Skeleton key={i} variant="rectangular" height={60} />)}</Stack>
            ) : contribuyentes.length === 0 ? (
              <Alert severity="info">No se encontraron contribuyentes para el criterio seleccionado.</Alert>
            ) : (
              <>
                {/* Tabla Desktop */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <PersonIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                        RESULTADOS DE LA BÚSQUEDA DE CONTRIBUYENTES
                      </Typography>
                    </Box>
                    <TableContainer
                      sx={{
                        maxHeight: 450,
                        overflowX: 'auto',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        '&::-webkit-scrollbar': { height: 10, width: 10 },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.35),
                          borderRadius: 5
                        }
                      }}
                    >
                      <Table stickyHeader size="small" sx={{ minWidth: 1080 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>CÓDIGO</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>CONTRIBUYENTE</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>DOCUMENTO</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>DIRECCIÓN</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>TIPO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>EXONERADO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>PENSIONISTA</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>ACCIONES</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {contribuyentesPaginados.map((item) => (
                            <TableRow key={item.codigo} hover>
                              <TableCell sx={{ fontWeight: 600 }}>
                                <Chip 
                                  label={item.codigo} 
                                  size="small" 
                                  variant="outlined" 
                                  color="primary" 
                                  sx={{ fontWeight: 700 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                                    {getTipoPersonaIcon(item.tipoContribuyente || item.tipoPersona, 14)}
                                  </Avatar>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.contribuyente}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>{item.documento || '-'}</TableCell>
                              <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.direccion || '-'}
                              </TableCell>
                              <TableCell align="center">
                                <Chip 
                                  label={item.tipoContribuyente || 'Natural'} 
                                  size="small" 
                                  color={getTipoPersonaColor(item.tipoContribuyente || item.tipoPersona) as any} 
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={item.esExonerado === true ? 'SÍ' : (item.esExonerado === false ? 'NO' : '-')}
                                  size="small"
                                  color={item.esExonerado === true ? 'success' : 'default'}
                                  variant="filled"
                                  sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={item.esPensionista === true ? 'SÍ' : (item.esPensionista === false ? 'NO' : '-')}
                                  size="small"
                                  color={item.esPensionista === true ? 'info' : 'default'}
                                  variant="filled"
                                  sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Editar Contribuyente">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => onEditar(item.codigo)} 
                                    color="primary"
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                                    }}
                                  >
                                    <EditIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>

                {/* Mobile Cards */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <Stack spacing={2}>
                    {contribuyentesPaginados.map((item) => (
                      <Card key={item.codigo} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32 }}>{getTipoPersonaIcon(item.tipoContribuyente || item.tipoPersona)}</Avatar>
                              <Typography variant="subtitle2" fontWeight={700}>{item.contribuyente}</Typography>
                            </Stack>
                            <Tooltip title="Editar Contribuyente">
                              <IconButton size="small" onClick={() => onEditar(item.codigo)} color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Typography variant="body2" color="text.secondary">Doc: {item.documento || '-'}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>Dir: {item.direccion || '-'}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip label={`Exonerado: ${item.esExonerado === true ? 'SÍ' : 'NO'}`} size="small" color={item.esExonerado === true ? 'success' : 'default'} />
                            <Chip label={`Pensionista: ${item.esPensionista === true ? 'SÍ' : 'NO'}`} size="small" color={item.esPensionista === true ? 'info' : 'default'} />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>

                <TablePagination
                  component="div"
                  count={contribuyentes.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 12, 24]}
                />
              </>
            )}
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ContribuyenteConsulta;
