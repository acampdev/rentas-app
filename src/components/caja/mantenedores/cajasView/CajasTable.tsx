import { Dashboard, Delete, Edit } from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { CajasController } from "../cajas.types";

export function CajasTable({ controller: c }: { controller: CajasController }) {
  const theme = useTheme();
  const headerSx = {
    whiteSpace: "nowrap",
    fontWeight: 700,
    bgcolor: alpha(theme.palette.primary.main, 0.05),
  };
  return (
    <Paper
      variant="outlined"
      sx={{ minWidth: 0, borderRadius: 2, overflow: "hidden" }}
    >
      <Box
        sx={{
          p: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Dashboard color="primary" fontSize="small" />
        <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
          TABLA DE CAJAS REGISTRADAS
        </Typography>
      </Box>
      <TableContainer
        sx={{
          maxHeight: { xs: 360, sm: 440, md: 500 },
          overflow: "auto",
          scrollbarGutter: "stable",
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              {[
                "COD. CAJA",
                "DESCRIPCIÓN",
                "USUARIO",
                "NUM. CAJA",
                "ESTADO",
              ].map((label) => (
                <TableCell key={label} sx={headerSx}>
                  {label}
                </TableCell>
              ))}
              <TableCell align="center" sx={headerSx}>
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {c.loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : c.cajas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">
                    No se encontraron cajas registradas para los filtros
                    especificados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              c.cajasPaginadas.map((caja) => (
                <TableRow key={caja.codCaja} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{caja.codCaja}</TableCell>
                  <TableCell>{caja.descripcion}</TableCell>
                  <TableCell>{caja.usuario || "-"}</TableCell>
                  <TableCell>{caja.numcaja}</TableCell>
                  <TableCell>
                    <Chip
                      label={caja.estado}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderColor:
                          caja.estado === "DISPONIBLE" ? "#10b981" : "#6b7280",
                        color:
                          caja.estado === "DISPONIBLE" ? "#10b981" : "#6b7280",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => c.editar(caja)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => void c.eliminar(caja)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={c.cajas.length}
        page={c.currentPage}
        onPageChange={(_, page) => c.setPage(page)}
        rowsPerPage={c.rowsPerPage}
        onRowsPerPageChange={(event) => {
          c.setRowsPerPage(Number(event.target.value));
          c.setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        sx={{ borderTop: 1, borderColor: "divider" }}
      />
    </Paper>
  );
}
