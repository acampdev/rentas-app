// src/components/reportes/ReportesPredios.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  MenuItem,
  TextField,
  Chip,
  alpha,
  useTheme,
  Grid,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Home as PredioIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Assignment as AssignIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useConsultaPredios } from '../../hooks/useConsultaPredios';
import { useAuthContext } from '../../context/AuthContext';
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

const ReportesPredios: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthContext();
  const { predios, loading, cargarPredios } = useConsultaPredios();

  const [filtros, setFiltros] = useState({
    uso: 'todos',
    estado: 'todos'
  });

  const prediosFiltrados = useMemo(() => {
    let result = predios;
    if (filtros.uso !== 'todos') {
      result = result.filter(p => p.codUso?.toString() === filtros.uso);
    }
    if (filtros.estado !== 'todos') {
      result = result.filter(p => p.codEstado?.toString() === filtros.estado);
    }
    return result;
  }, [predios, filtros]);

  const stats = useMemo(() => ({
    total: predios.length,
    activos: predios.filter(p => p.codEstado?.toString() === '0201').length,
    inactivos: predios.filter(p => p.codEstado?.toString() !== '0201').length
  }), [predios]);

  const handleGenerarPDF = useCallback(() => {
    if (prediosFiltrados.length === 0) {
      alert('No hay datos para generar el reporte');
      return;
    }

    const datosTabla = prediosFiltrados.map(p => ({
      codigo: p.codPredio,
      finca: p.numeroFinca || '-',
      direccion: p.direccionCompleta || 'Sin dirección',
      uso: p.nombreUso || 'Desconocido',
      area: `${p.areaTerreno?.toFixed(2) || '0.00'} m²`,
      estado: p.codEstado?.toString() === '0201' ? 'Activo' : 'Inactivo'
    }));

    const columnas = [
      { header: 'Código', dataKey: 'codigo', width: 60, alignment: 'center' as const },
      { header: 'N° Finca', dataKey: 'finca', width: 60, alignment: 'center' as const },
      { header: 'Dirección', dataKey: 'direccion', width: 180, alignment: 'left' as const },
      { header: 'Uso', dataKey: 'uso', width: 80, alignment: 'center' as const },
      { header: 'Área Terreno', dataKey: 'area', width: 70, alignment: 'right' as const },
      { header: 'Estado', dataKey: 'estado', width: 60, alignment: 'center' as const }
    ];

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: pdfMargins,
      header: () => ({
        stack: [
          ...createPdfHeader(
            'REPORTE CONSOLIDADO DE PREDIOS',
            `Registros filtrados: ${datosTabla.length}`
          )
        ]
      }),
      footer: (currentPage: number, pageCount: number) => createPdfFooter(currentPage, pageCount),
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                createInfoRow('Fecha reporte', new Date().toLocaleDateString('es-PE')),
                createInfoRow('Total predios en sistema', stats.total.toString()),
                createInfoRow('Predios activos', stats.activos.toString())
              ]
            },
            {
              width: '*',
              stack: [
                createInfoRow('Filtro Uso', filtros.uso === 'todos' ? 'Todos' : filtros.uso),
                createInfoRow('Filtro Estado', filtros.estado === 'todos' ? 'Todos' : filtros.estado),
                createInfoRow('Usuario', user?.nombreCompleto || user?.username || 'Usuario autenticado')
              ]
            }
          ],
          margin: [0, 0, 0, 15]
        },
        createDivider(),
        createTable(columnas, datosTabla),
        createDivider(),
        {
          text: 'Notas del Reporte',
          style: 'subheader',
          margin: [0, 10, 0, 5]
        },
        {
          text: 'Este documento muestra el estado actual de los registros de la propiedad inmueble en la jurisdicción. Las áreas y usos están sujetos a verificación de campo.',
          fontSize: 8,
          italics: true,
          color: 'grey'
        }
      ],
      styles: pdfStyles
    };

    generateAndDownloadPdf(docDefinition, 'reporte_predios_municipal');
  }, [prediosFiltrados, stats, filtros, user]);

  return (
    <Stack spacing={4}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 56, height: 56, borderRadius: 2 }}>
          <PredioIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Exportación de Padrón de Predios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consolidado de unidades inmobiliarias, usos y estados de conservación.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.01), height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <FilterIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Criterios de Selección</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Uso"
                  value={filtros.uso}
                  onChange={(e) => setFiltros({ ...filtros, uso: e.target.value })}
                  size="small"
                >
                  <MenuItem value="todos">Todos los usos</MenuItem>
                  <MenuItem value="0101">Vivienda</MenuItem>
                  <MenuItem value="0102">Comercio</MenuItem>
                  <MenuItem value="0103">Industria</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Estado Predio"
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                  size="small"
                >
                  <MenuItem value="todos">Todos los estados</MenuItem>
                  <MenuItem value="0201">Activo</MenuItem>
                  <MenuItem value="0202">Baja</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 0.5 }}>Filtros aplicados:</Typography>
              <Chip label={`Uso: ${filtros.uso}`} size="small" variant="outlined" />
              <Chip label={`Estado: ${filtros.estado}`} size="small" variant="outlined" />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.01), height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoIcon color="warning" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Estado de Inventario</Typography>
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Total Registrados</Typography>
                <Typography variant="body1" fontWeight={700}>{stats.total}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Predios Activos</Typography>
                <Typography variant="body2" fontWeight={600} color="success.main">{stats.activos}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">En Situación de Baja</Typography>
                <Typography variant="body2" fontWeight={600} color="error.main">{stats.inactivos}</Typography>
              </Box>
            </Stack>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AssignIcon />}
              onClick={() => cargarPredios()}
              sx={{ mt: 3, borderRadius: 2 }}
              disabled={loading}
            >
              Sincronizar Datos
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          onClick={handleGenerarPDF}
          disabled={loading || prediosFiltrados.length === 0}
          sx={{ 
            minWidth: 320, 
            height: 56, 
            borderRadius: 3, 
            fontWeight: 800, 
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          {loading ? 'Consultando base de datos...' : 'Descargar Inventario de Predios'}
        </Button>
      </Box>
    </Stack>
  );
};

export default ReportesPredios;
