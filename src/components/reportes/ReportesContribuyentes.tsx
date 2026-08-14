// src/components/reportes/ReportesContribuyentes.tsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
  MenuItem,
  Chip,
  Alert,
  alpha,
  useTheme,
  Grid,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useContribuyentes } from '../../hooks/useContribuyentes';
import {
  createPdfHeader,
  createPdfFooter,
  createTable,
  pdfStyles,
  pdfMargins,
  generateAndDownloadPdf,
  createDivider,
  createInfoRow
} from '../../utils/pdfUtils';

const ReportesContribuyentes: React.FC = () => {
  const theme = useTheme();
  const { contribuyentes, loading, cargarContribuyentes } = useContribuyentes();

  const [filtros, setFiltros] = useState({
    tipoPersona: 'todos',
    tipoDocumento: 'todos'
  });

  React.useEffect(() => {
    if (contribuyentes.length === 0) {
      cargarContribuyentes();
    }
  }, []);

  const handleGenerarPDF = useCallback(() => {
    // Filtrar contribuyentes
    let contribuyentesFiltrados = contribuyentes;

    if (filtros.tipoPersona !== 'todos') {
      contribuyentesFiltrados = contribuyentesFiltrados.filter(
        c => c.tipoPersona === filtros.tipoPersona
      );
    }

    if (contribuyentesFiltrados.length === 0) {
      alert('No hay datos para generar el reporte');
      return;
    }

    // Preparar datos para la tabla
    const datosTabla = contribuyentesFiltrados.map(c => ({
      codigo: c.codigo,
      tipo: c.tipoPersona === 'juridica' ? 'Jurídica' : 'Natural',
      documento: c.documento,
      nombre: c.contribuyente,
      direccion: c.direccion || 'Sin dirección',
      telefono: c.telefono || 'Sin teléfono'
    }));

    // Definir columnas
    const columnas = [
      { header: 'Código', dataKey: 'codigo', width: 50, alignment: 'center' as const },
      { header: 'Tipo', dataKey: 'tipo', width: 60, alignment: 'center' as const },
      { header: 'Documento', dataKey: 'documento', width: 80, alignment: 'center' as const },
      { header: 'Nombre/Razón Social', dataKey: 'nombre', width: 150, alignment: 'left' as const },
      { header: 'Dirección', dataKey: 'direccion', width: 120, alignment: 'left' as const },
      { header: 'Teléfono', dataKey: 'telefono', width: 70, alignment: 'center' as const }
    ];

    // Crear documento PDF
    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: pdfMargins,
      header: () => ({
        stack: [
          ...createPdfHeader(
            'REPORTE DE CONTRIBUYENTES',
            `Total de registros: ${datosTabla.length}`
          )
        ]
      }),
      footer: (currentPage: number, pageCount: number) => createPdfFooter(currentPage, pageCount),
      content: [
        // Información del reporte
        {
          columns: [
            {
              width: '*',
              stack: [
                createInfoRow('Fecha de generación', new Date().toLocaleDateString('es-PE')),
                createInfoRow('Hora', new Date().toLocaleTimeString('es-PE')),
                createInfoRow('Total de contribuyentes', datosTabla.length.toString())
              ]
            },
            {
              width: '*',
              stack: [
                createInfoRow('Filtro Tipo Persona', filtros.tipoPersona === 'todos' ? 'Todos' : filtros.tipoPersona === 'natural' ? 'Natural' : 'Jurídica'),
                createInfoRow('Estado del sistema', 'Activo'),
                createInfoRow('Usuario', 'Sistema')
              ]
            }
          ],
          margin: [0, 0, 0, 15]
        },
        createDivider(),
        // Tabla de contribuyentes
        createTable(columnas, datosTabla),
        // Resumen
        createDivider(),
        {
          text: 'Resumen Estadístico',
          style: 'subheader',
          margin: [0, 10, 0, 10]
        },
        {
          columns: [
            {
              width: '*',
              stack: [
                createInfoRow('Personas Naturales', datosTabla.filter(d => d.tipo === 'Natural').length.toString()),
                createInfoRow('Personas Jurídicas', datosTabla.filter(d => d.tipo === 'Jurídica').length.toString())
              ]
            },
            {
              width: '*',
              stack: [
                createInfoRow('Con Teléfono', datosTabla.filter(d => d.telefono !== 'Sin teléfono').length.toString()),
                createInfoRow('Sin Teléfono', datosTabla.filter(d => d.telefono === 'Sin teléfono').length.toString())
              ]
            }
          ]
        }
      ],
      styles: pdfStyles
    };

    // Generar y descargar PDF
    generateAndDownloadPdf(docDefinition, 'reporte_contribuyentes');
  }, [contribuyentes, filtros]);

  const stats = {
    naturales: contribuyentes.filter(c => c.tipoPersona === 'natural').length,
    juridicas: contribuyentes.filter(c => c.tipoPersona === 'juridica').length,
    total: contribuyentes.length
  };

  return (
    <Stack spacing={4}>
      {/* Description Section */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', width: 56, height: 56, borderRadius: 2 }}>
          <PdfIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Exportación de Padrón de Contribuyentes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Genere un documento oficial consolidado con la información de los ciudadanos y empresas registradas.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Panel */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              bgcolor: alpha(theme.palette.primary.main, 0.01),
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <FilterIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Criterios de Filtrado
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Persona"
                  value={filtros.tipoPersona}
                  onChange={(e) => setFiltros({ ...filtros, tipoPersona: e.target.value })}
                  size="small"
                >
                  <MenuItem value="todos">Todos los tipos</MenuItem>
                  <MenuItem value="natural">Persona Natural</MenuItem>
                  <MenuItem value="juridica">Persona Jurídica</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Documento"
                  value={filtros.tipoDocumento}
                  onChange={(e) => setFiltros({ ...filtros, tipoDocumento: e.target.value })}
                  size="small"
                  disabled
                >
                  <MenuItem value="todos">Todos los documentos</MenuItem>
                  <MenuItem value="dni">DNI</MenuItem>
                  <MenuItem value="ruc">RUC</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 0.5 }}>Filtros activos:</Typography>
              {filtros.tipoPersona === 'todos' ? (
                <Chip label="Ninguno" size="small" variant="outlined" sx={{ borderStyle: 'dashed' }} />
              ) : (
                <Chip
                  label={`Tipo: ${filtros.tipoPersona === 'natural' ? 'Natural' : 'Jurídica'}`}
                  color="primary"
                  size="small"
                  onDelete={() => setFiltros({ ...filtros, tipoPersona: 'todos' })}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats Panel */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              bgcolor: alpha(theme.palette.info.main, 0.01),
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoIcon color="info" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Resumen de Datos
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Total Contribuyentes</Typography>
                <Typography variant="body1" fontWeight={700}>{stats.total}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                  <Typography variant="body2" color="text.secondary">Personas Naturales</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={600}>{stats.naturales}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">Personas Jurídicas</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={600}>{stats.juridicas}</Typography>
              </Box>
            </Stack>

            <Alert severity="info" sx={{ mt: 2, py: 0, '& .MuiAlert-icon': { pt: 1.5 } }}>
              <Typography variant="caption">
                Los datos se sincronizaron por última vez hace unos instantes.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Button Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          onClick={handleGenerarPDF}
          disabled={loading || contribuyentes.length === 0}
          sx={{ 
            minWidth: 320, 
            height: 56, 
            borderRadius: 3, 
            fontWeight: 800, 
            fontSize: '1.1rem',
            textTransform: 'none',
            boxShadow: theme.shadows[6]
          }}
        >
          {loading ? 'Preparando datos...' : 'Descargar Reporte en PDF'}
        </Button>
      </Box>
    </Stack>
  );
};

export default ReportesContribuyentes;
