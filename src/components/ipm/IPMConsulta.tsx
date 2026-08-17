import { useState } from 'react';
import { Box, Button, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import type { IPMData } from '../../services/ipmService';

interface IPMConsultaProps {
  registros: IPMData[];
  anio: number;
  loading?: boolean;
  onBuscar: (anio: number) => void;
  onEditar: (registro: IPMData) => void;
}

const formatNumber = (value: number, digits: number) => new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: digits, maximumFractionDigits: digits
}).format(value);

const IPMConsulta = ({ registros, anio, loading = false, onBuscar, onEditar }: IPMConsultaProps) => {
  const [anioFiltro, setAnioFiltro] = useState(anio);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField label="Año" type="number" size="small" value={anioFiltro} onChange={(event) => setAnioFiltro(Number(event.target.value))} sx={{ width: { xs: '100%', sm: 120 } }} />
        <Button variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />} onClick={() => onBuscar(anioFiltro)} disabled={loading || !anioFiltro} sx={{ height: 40, width: { xs: '100%', sm: 'auto' } }}>Buscar</Button>
      </Box>
      <TableContainer sx={{ width: '100%', maxHeight: { xs: 360, sm: 440 }, overflowX: 'auto', overflowY: 'auto' }}>
        <Table stickyHeader size="small" sx={{ minWidth: 760, '& th, & td': { whiteSpace: 'nowrap' } }}>
          <TableHead><TableRow>
            <TableCell>Año</TableCell><TableCell>Mes</TableCell><TableCell align="right">Índice</TableCell>
            <TableCell align="right">Variación mensual</TableCell><TableCell align="right">Variación acumulada</TableCell><TableCell align="center">Acciones</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {registros.length === 0 && !loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No se encontraron registros IPM</Typography></TableCell></TableRow>
            ) : registros.map((registro) => (
              <TableRow key={`${registro.anio}-${registro.codMes}`} hover>
                <TableCell>{registro.anio}</TableCell><TableCell>{registro.mes}</TableCell>
                <TableCell align="right">{formatNumber(registro.indice, 6)}</TableCell>
                <TableCell align="right">{formatNumber(registro.variacionMensual, 2)} %</TableCell>
                <TableCell align="right">{formatNumber(registro.variacionAcumulada, 2)} %</TableCell>
                <TableCell align="center"><Tooltip title="Editar IPM"><IconButton size="small" color="primary" onClick={() => onEditar(registro)}><EditIcon fontSize="small" /></IconButton></Tooltip></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default IPMConsulta;
