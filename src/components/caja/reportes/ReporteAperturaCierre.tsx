import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
  Grid
} from '@mui/material';
import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  createPdfHeader,
  createPdfFooter,
  createTable,
  pdfStyles,
  pdfMargins,
  generateAndDownloadPdf,
  createDivider,
  createInfoRow
} from '../../../utils/pdfUtils';

const datosAperturasCierres = [
  { fecha: '15/10/2024', cajero: 'Juan Pérez', horaApertura: '08:00 AM', horaCierre: '05:00 PM', montoInicial: 500.00, montoFinal: 3250.00, totalRecaudado: 2750.00, estado: 'Cerrado' },
  { fecha: '16/10/2024', cajero: 'María García', horaApertura: '08:00 AM', horaCierre: '05:00 PM', montoInicial: 500.00, montoFinal: 4120.00, totalRecaudado: 3620.00, estado: 'Cerrado' }
];

const ReporteAperturaCierre: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [cajero, setCajero] = useState('');

  const handleGenerarPDF = useCallback(() => {
    const datosTabla = datosAperturasCierres.map(d => ({
      fecha: d.fecha,
      cajero: d.cajero,
      horaApertura: d.horaApertura,
      horaCierre: d.horaCierre,
      montoInicial: `S/ ${d.montoInicial.toFixed(2)}`,
      montoFinal: `S/ ${d.montoFinal.toFixed(2)}`,
      totalRecaudado: `S/ ${d.totalRecaudado.toFixed(2)}`,
      estado: d.estado
    }));

    const columnas = [
      { header: 'Fecha', dataKey: 'fecha', width: 60, alignment: 'center' as const },
      { header: 'Cajero', dataKey: 'cajero', width: 80, alignment: 'left' as const },
      { header: 'H. Apertura', dataKey: 'horaApertura', width: 55, alignment: 'center' as const },
      { header: 'H. Cierre', dataKey: 'horaCierre', width: 55, alignment: 'center' as const },
      { header: 'Monto Inicial', dataKey: 'montoInicial', width: 60, alignment: 'right' as const },
      { header: 'Monto Final', dataKey: 'montoFinal', width: 60, alignment: 'right' as const },
      { header: 'Recaudado', dataKey: 'totalRecaudado', width: 60, alignment: 'right' as const },
      { header: 'Estado', dataKey: 'estado', width: 50, alignment: 'center' as const }
    ];

    const docDefinition: any = {
      pageSize: 'A4', pageOrientation: 'landscape', pageMargins: pdfMargins,
      header: () => ({ stack: [...createPdfHeader('REPORTE DE APERTURA Y CIERRE', `Total: ${datosTabla.length}`)] }),
      footer: (currentPage: number, pageCount: number) => createPdfFooter(currentPage, pageCount),
      content: [
        { columns: [{ width: '*', stack: [createInfoRow('Fecha', new Date().toLocaleDateString('es-PE')), createInfoRow('Hora', new Date().toLocaleTimeString('es-PE'))] }, { width: '*', stack: [createInfoRow('Cajero', cajero || 'Todos')] }], margin: [0, 0, 0, 15] },
        createDivider(), createTable(columnas, datosTabla), createDivider()
      ],
      styles: pdfStyles
    };
    generateAndDownloadPdf(docDefinition, 'reporte_apertura_cierre');
  }, [cajero]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}><ReceiptIcon color="primary" /> Reporte de Apertura y Cierre</Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><DatePicker label="Fecha Inicio" value={fechaInicio} onChange={(v: any) => setFechaInicio(v)} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><DatePicker label="Fecha Fin" value={fechaFin} onChange={(v: any) => setFechaFin(v)} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><TextField label="Cajero" value={cajero} onChange={(e) => setCajero(e.target.value)} fullWidth size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><Button variant="outlined" fullWidth onClick={() => { setFechaInicio(null); setFechaFin(null); setCajero(''); }} sx={{ height: 40 }}>Limpiar</Button></Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="error" startIcon={<DownloadIcon />} onClick={handleGenerarPDF} sx={{ minWidth: 250, height: 50 }}>Generar PDF</Button>
        </Box>
      </Stack>
    </LocalizationProvider>
  );
};

export default ReporteAperturaCierre;
