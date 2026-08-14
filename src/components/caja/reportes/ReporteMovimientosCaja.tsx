import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Download as DownloadIcon,
  CompareArrows as MovementsIcon
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
  createDivider
} from '../../../utils/pdfUtils';

const datosMovimientos = [
  { fecha: '18/10/2024', hora: '09:15 AM', tipoMovimiento: 'Pago', concepto: 'Impuesto Predial 2024', contribuyente: 'Juan Pérez', monto: 1500.00, formaPago: 'Efectivo', cajero: 'María García' }
];

const ReporteMovimientosCaja: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [tipoMovimiento, setTipoMovimiento] = useState('todos');
  const [formaPago, setFormaPago] = useState('todos');

  const handleGenerarPDF = useCallback(() => {
    const datosTabla = datosMovimientos.map(m => ({
      fecha: m.fecha, hora: m.hora, tipo: m.tipoMovimiento, concepto: m.concepto, contribuyente: m.contribuyente, monto: `S/ ${m.monto.toFixed(2)}`, formaPago: m.formaPago
    }));
    const columnas = [
      { header: 'Fecha', dataKey: 'fecha', width: 55, alignment: 'center' as const },
      { header: 'Hora', dataKey: 'hora', width: 50, alignment: 'center' as const },
      { header: 'Tipo', dataKey: 'tipo', width: 50, alignment: 'center' as const },
      { header: 'Concepto', dataKey: 'concepto', width: 120, alignment: 'left' as const },
      { header: 'Contribuyente', dataKey: 'contribuyente', width: 90, alignment: 'left' as const },
      { header: 'Monto', dataKey: 'monto', width: 60, alignment: 'right' as const },
      { header: 'Forma Pago', dataKey: 'formaPago', width: 60, alignment: 'center' as const }
    ];
    const docDefinition: any = {
      pageSize: 'A4', pageOrientation: 'landscape', pageMargins: pdfMargins,
      header: () => ({ stack: [...createPdfHeader('REPORTE DE MOVIMIENTOS', `Total: ${datosTabla.length}`)] }),
      footer: (currentPage: number, pageCount: number) => createPdfFooter(currentPage, pageCount),
      content: [createDivider(), createTable(columnas, datosTabla), createDivider()],
      styles: pdfStyles
    };
    generateAndDownloadPdf(docDefinition, 'reporte_movimientos_caja');
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Stack spacing={3}>
        <Box><Typography variant="h6" display="flex" alignItems="center" gap={1}><MovementsIcon color="primary" /> Reporte de Movimientos</Typography></Box>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><DatePicker label="Fecha Inicio" value={fechaInicio} onChange={(v: any) => setFechaInicio(v)} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><DatePicker label="Fecha Fin" value={fechaFin} onChange={(v: any) => setFechaFin(v)} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><TextField select label="Tipo" value={tipoMovimiento} onChange={(e) => setTipoMovimiento(e.target.value)} fullWidth size="small"><MenuItem value="todos">Todos</MenuItem><MenuItem value="Pago">Pagos</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><TextField select label="Forma Pago" value={formaPago} onChange={(e) => setFormaPago(e.target.value)} fullWidth size="small"><MenuItem value="todos">Todas</MenuItem><MenuItem value="Efectivo">Efectivo</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><Button variant="outlined" fullWidth onClick={() => { setFechaInicio(null); setFechaFin(null); setTipoMovimiento('todos'); setFormaPago('todos'); }} sx={{ height: 40 }}>Limpiar</Button></Grid>
          </Grid>
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><Button variant="contained" color="error" startIcon={<DownloadIcon />} onClick={handleGenerarPDF} sx={{ minWidth: 250, height: 50 }}>Generar PDF</Button></Box>
      </Stack>
    </LocalizationProvider>
  );
};

export default ReporteMovimientosCaja;
