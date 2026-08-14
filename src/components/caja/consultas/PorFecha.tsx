import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

interface ReciboData {
  id: string;
  numeroRecibo: string;
  fecha: Date;
  contribuyente: string;
  rucDni: string;
  concepto: string;
  monto: number;
  estado: 'CANCELADO' | 'ANULADO';
  cajero: string;
}

interface PorFechaProps {
  onExportPdf?: () => void;
}

const PorFecha: React.FC<PorFechaProps> = () => {
  const theme = useTheme();
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
  const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [recibos, setRecibos] = useState<ReciboData[]>([]);
  const [totalRecaudado, setTotalRecaudado] = useState(0);

  const handleBuscar = () => {
    setLoading(true);
    setTimeout(() => {
      const mock: ReciboData[] = [
        { id: '1', numeroRecibo: 'R-2024-001234', fecha: new Date(), contribuyente: 'Garcia Lopez Juan Carlos', rucDni: '12345678', concepto: 'Impuesto Predial - 2024', monto: 1250.50, estado: 'CANCELADO', cajero: 'Maria Rodriguez' }
      ];
      setRecibos(mock);
      setTotalRecaudado(1250.50);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => { handleBuscar(); }, []);

  const headerStyle = { bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">Filtros de Búsqueda</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <DatePicker label="Fecha Inicio" value={fechaInicio} onChange={(v: any) => setFechaInicio(v)} slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }} />
            <DatePicker label="Fecha Fin" value={fechaFin} onChange={(v: any) => setFechaFin(v)} slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }} />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar} disabled={loading}>Buscar</Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { setFechaInicio(new Date()); setFechaFin(new Date()); }}>Limpiar</Button>
          </Box>
        </Paper>

        {recibos.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), flex: 1 }}>
              <Typography variant="caption">Total Recaudado</Typography>
              <Typography variant="h5" fontWeight="bold">S/ {totalRecaudado.toFixed(2)}</Typography>
            </Paper>
          </Box>
        )}

        {loading ? <CircularProgress /> : recibos.length === 0 ? <Alert severity="info">No hay resultados</Alert> : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead><TableRow>
                <TableCell sx={headerStyle}>N° RECIBO</TableCell>
                <TableCell sx={headerStyle}>FECHA</TableCell>
                <TableCell sx={headerStyle}>CONTRIBUYENTE</TableCell>
                <TableCell align="right" sx={headerStyle}>MONTO</TableCell>
                <TableCell align="center" sx={headerStyle}>ACCIONES</TableCell>
              </TableRow></TableHead>
              <TableBody>
                {recibos.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{r.numeroRecibo}</TableCell>
                    <TableCell>{format(r.fecha, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{r.contribuyente}</TableCell>
                    <TableCell align="right">S/ {r.monto.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary"><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="primary"><PrintIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default PorFecha;
