import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import type { EstadoCuentaAnual } from '../../../services/cuentaCorrienteService';
import { SolicitudSection } from './SolicitudSection';

interface DetalleDeudaSectionProps {
  contribuyenteCodigo: string;
  detalles: EstadoCuentaAnual[];
  loading: boolean;
  currentYear: number;
  deudaInsoluta: string;
}

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const MONTHS: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MonthlyPeriods = ({ row }: { row: EstadoCuentaAnual }) => (
  <Box sx={{ display: 'flex', gap: '3px', flexWrap: 'wrap', justifyContent: 'center' }}>
    {MONTHS.map((month) => {
      const charge = Number(row[`cargo${month}` as keyof EstadoCuentaAnual]) || 0;
      const payment = Number(row[`abono${month}` as keyof EstadoCuentaAnual]) || 0;
      const paid = charge > 0 && payment >= charge;
      const pending = charge > 0 && !paid;
      return (
        <Tooltip key={month} title={`Mes ${month}: Cargo S/ ${charge} - Abono S/ ${payment}`}>
          <Chip
            label={month}
            size="small"
            color={paid ? 'success' : pending ? 'error' : 'default'}
            variant={charge > 0 ? 'filled' : 'outlined'}
            sx={{ width: 22, height: 22, fontSize: '0.65rem', fontWeight: 'bold', '& .MuiChip-label': { px: 0.5 } }}
          />
        </Tooltip>
      );
    })}
  </Box>
);

export const DetalleDeudaSection = ({
  contribuyenteCodigo,
  detalles,
  loading,
  currentYear,
  deudaInsoluta,
}: DetalleDeudaSectionProps) => (
  <SolicitudSection title="Detalle de la Deuda" icon={<ReceiptIcon />}>
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 2, maxHeight: 300, overflowY: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 'bold', bgcolor: '#edf2fe' } }}>
            <TableCell sx={{ width: 80 }}>Año</TableCell>
            <TableCell>Tributo</TableCell>
            <TableCell align="center">Periodos Mensuales (1 .. 12)</TableCell>
            <TableCell align="right" sx={{ width: 130 }}>Saldo Neto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}><CircularProgress size={30} /><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Cargando detalle de cuenta corriente...</Typography></TableCell></TableRow>
          ) : detalles.length > 0 ? detalles.map((row, index) => (
            <TableRow key={`${row.anio}-${row.tributo || row.grupoTributo || index}`} hover>
              <TableCell sx={{ fontWeight: 'bold' }}>{row.anio}</TableCell>
              <TableCell sx={{ fontSize: '0.85rem' }}>{row.tributo || row.grupoTributo || 'IMPUESTO PREDIAL / ARBITRIOS'}</TableCell>
              <TableCell align="center"><MonthlyPeriods row={row} /></TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                S/ {Number(row.saldoNeto || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
              {contribuyenteCodigo ? `No se encontraron deudas para años anteriores a ${currentYear}.` : 'Seleccione un contribuyente para visualizar el detalle de la deuda.'}
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
      <Typography variant="body1" fontWeight="bold">Deuda Insoluta:</Typography>
      <TextField
        disabled
        size="small"
        value={`S/ ${Number(deudaInsoluta || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sx={{ width: 200, '& .MuiOutlinedInput-root': { fontWeight: 'bold', bgcolor: 'action.hover', color: 'primary.main', borderRadius: 2 } }}
        helperText="Suma de saldos netos (< año actual)"
      />
    </Box>
  </SolicitudSection>
);
