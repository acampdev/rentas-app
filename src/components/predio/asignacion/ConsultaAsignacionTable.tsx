import {
  Edit as EditIcon,
  Home as HomeIcon,
  PersonRemove as PersonRemoveIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box, Chip, Fade, IconButton, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip, Typography, alpha, useTheme,
} from "@mui/material";
import type { AsignacionPredio } from "../../../services/asignacionService";
import { ASIGNACION_COLUMNS } from "./asignacionTable.config";

interface ConsultaAsignacionTableProps {
  asignaciones: AsignacionPredio[];
  loading: boolean;
  hasFilters: boolean;
  onEditar: (item: AsignacionPredio) => void;
  onDesasignar: (item: AsignacionPredio) => void;
}

export const ConsultaAsignacionTable = ({
  asignaciones, loading, hasFilters, onEditar, onDesasignar,
}: ConsultaAsignacionTableProps) => {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: `2px solid ${theme.palette.primary.main}`, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: "primary.main", color: "common.white", display: "flex" }}><HomeIcon /></Box>
          <Typography variant="h6" fontWeight={700}>Predios asignados</Typography>
        </Box>
        <Chip label={`${asignaciones.length} asignaciones`} color="primary" size="small" sx={{ fontWeight: 700 }} />
      </Box>

      <TableContainer sx={{ maxHeight: 450, overflow: "auto", scrollbarGutter: "stable" }}>
        <Table stickyHeader size="small" aria-label="Predios asignados" sx={{ minWidth: 1850 }}>
          <TableHead><TableRow>
            {ASIGNACION_COLUMNS.map((column) => (
              <TableCell key={column.key} align={column.align} sx={{ minWidth: column.width, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.dark", fontWeight: 800, fontSize: "0.7rem", letterSpacing: 0.3, borderBottom: `2px solid ${theme.palette.primary.main}`, py: 1.5, whiteSpace: "nowrap" }}>
                {column.label}
              </TableCell>
            ))}
            <TableCell align="center" sx={{ minWidth: 90, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.dark", fontWeight: 800, fontSize: "0.7rem", borderBottom: `2px solid ${theme.palette.primary.main}` }}>
              ACCIONES
            </TableCell>
          </TableRow></TableHead>
          <TableBody>
            {!asignaciones.length ? (
              <TableRow><TableCell colSpan={ASIGNACION_COLUMNS.length + 1} align="center" sx={{ py: 7 }}>
                <Stack alignItems="center" spacing={2}>
                  <SearchIcon sx={{ fontSize: 55, color: alpha(theme.palette.primary.main, 0.35) }} />
                  <Typography variant="h6" color="text.secondary">
                    {hasFilters ? "No se encontraron asignaciones" : "Ingrese criterios de búsqueda"}
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    {hasFilters ? "No hay predios asignados con los criterios especificados" : "Ingrese un año o contribuyente para buscar asignaciones"}
                  </Typography>
                </Stack>
              </TableCell></TableRow>
            ) : asignaciones.map((item, index) => (
              <Fade in key={String(item.id)} timeout={Math.min(200 + index * 40, 600)}>
                <TableRow hover sx={{ "&:nth-of-type(even)": { bgcolor: alpha(theme.palette.primary.main, 0.025) } }}>
                  {ASIGNACION_COLUMNS.map((column) => (
                    <TableCell key={column.key} align={column.align} sx={{ py: 1.25, fontSize: "0.75rem", borderBottomColor: alpha(theme.palette.divider, 0.55), maxWidth: column.width }}>
                      {column.render(item)}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title={`Editar asignación del predio ${item.codPredio}`}>
                        <span><IconButton size="small" color="primary" disabled={loading} onClick={() => onEditar(item)} aria-label={`Editar predio ${item.codPredio}`}><EditIcon fontSize="small" /></IconButton></span>
                      </Tooltip>
                      <Tooltip title={`Desasignar predio ${item.codPredio}`}>
                        <span><IconButton size="small" color="error" disabled={loading} onClick={() => onDesasignar(item)} aria-label={`Desasignar predio ${item.codPredio}`}><PersonRemoveIcon fontSize="small" /></IconButton></span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              </Fade>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

