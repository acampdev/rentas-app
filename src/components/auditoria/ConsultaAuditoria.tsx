// components/auditoria/ConsultaAuditoria.tsx 
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Assignment as LogIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuditorias } from '../../hooks/useAuditorias';
import { AuditoriaItem } from '../../services/auditoriaService';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  backgroundColor: '#10b981',
  color: theme.palette.common.white,
  whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  transition: 'background-color 0.2s ease',
}));

export const ConsultaAuditoria: React.FC = () => {
  const { auditorias, loading, error, cargarAuditorias } = useAuditorias();

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const auditoriasPaginadas = auditorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Cabecera con título y botón de recarga */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogIcon sx={{ color: '#10b981' }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#10b981' }}>
            Registros de Auditoría API
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={cargarAuditorias}
          sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
        >
          Actualizar Datos
        </Button>
      </Paper>

      {/* Estado de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de Resultados directa de la API */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: '#10b981' }} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Cargando datos desde la API...
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: '65vh', overflowX: 'auto', overflowY: 'auto' }}>
            <Table stickyHeader sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Fecha</StyledTableCell>
                  <StyledTableCell>Origen</StyledTableCell>
                  <StyledTableCell>Afectación</StyledTableCell>
                  <StyledTableCell>Antes</StyledTableCell>
                  <StyledTableCell>Después</StyledTableCell>
                  <StyledTableCell>Usuario</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditoriasPaginadas.length > 0 ? (
                  auditoriasPaginadas.map((audit: AuditoriaItem, idx: number) => (
                    <StyledTableRow key={audit.id || idx}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {audit.fecha || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {audit.origen || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {audit.afectacion || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" color={audit.antes !== null && audit.antes !== undefined ? 'text.primary' : 'text.disabled'} noWrap>
                          {audit.antes !== null && audit.antes !== undefined ? String(audit.antes) : 'null'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" color={audit.despues !== null && audit.despues !== undefined ? 'text.primary' : 'text.disabled'} noWrap>
                          {audit.despues !== null && audit.despues !== undefined ? String(audit.despues) : 'null'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#10b981' }}>
                          {audit.usuario || '-'}
                        </Typography>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <LogIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        No se encontraron registros de auditoría
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Verifique la respuesta de la API configurada para /api/auditoria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={auditorias.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ConsultaAuditoria;
