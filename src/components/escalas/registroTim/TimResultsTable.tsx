import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { TimData } from "../../../services/timService";
import type { TimSearchState } from "./registroTim.types";

interface Props {
  state: TimSearchState;
  deleting: boolean;
  onEdit: (record: TimData) => void;
  onDelete: (record: TimData) => void;
}

export function TimResultsTable({ state, deleting, onEdit, onDelete }: Props) {
  if (state.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }
  if (state.searched && !state.results.length) {
    return (
      <Alert severity="info">
        No se encontraron escalas TIM con los filtros especificados.
      </Alert>
    );
  }
  if (!state.results.length) return null;

  return (
    <TableContainer
      component={Paper}
      elevation={1}
      sx={{ borderRadius: 1, maxHeight: 400, overflow: "auto" }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {[
              "Cód. TIM",
              "Año",
              "Mes",
              "Tributo",
              "Tasa",
              "Resolución",
              "Vigencia",
              "Acciones",
            ].map((title) => (
              <TableCell
                key={title}
                sx={{ fontWeight: "bold" }}
                align={title === "Acciones" ? "center" : "left"}
              >
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {state.results.map((row) => (
            <TableRow key={row.codTIM} hover>
              <TableCell>{row.codTIM}</TableCell>
              <TableCell>{row.anio}</TableCell>
              <TableCell>{row.mes || `Mes ${row.periodo}`}</TableCell>
              <TableCell>
                {row.tributo || `Tributo ${row.codTributo}`}
              </TableCell>
              <TableCell>{row.tasa}</TableCell>
              <TableCell>
                {row.resolucion || `Resolución ${row.codResolucionInteres}`}
              </TableCell>
              <TableCell>
                {row.fechaInicio} a {row.fechaFin || "Indefinido"}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => onEdit(row)}
                  color="primary"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(row)}
                  color="error"
                  size="small"
                  disabled={deleting}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
