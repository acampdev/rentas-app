import {
  SearchOff as SearchOffIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import type { TransferenciaPredioData } from "../../../../services/transferenciaService";
import { TransferenciaResultRow } from "./TransferenciaResultRow";

interface Props {
  results: TransferenciaPredioData[];
  onEdit: (row: TransferenciaPredioData) => void;
}

const columns = [
  ["Código", 80, "left"],
  ["Año", 70, "left"],
  ["Código Predio", 110, "left"],
  ["Cód. Vendedor", 110, "left"],
  ["Vendedor", 170, "left"],
  ["Cód. Comprador", 110, "left"],
  ["Comprador", 170, "left"],
  ["Porcentaje", 90, "right"],
  ["Fecha Minuta", 110, "left"],
  ["Documento", 110, "left"],
  ["Modo Transferencia", 150, "left"],
  ["Valor Transferencia", 130, "right"],
  ["Constructor", 90, "center"],
  ["Acciones", 80, "center"],
] as const;

function EmptyResults() {
  const theme = useTheme();
  return (
    <TableRow>
      <TableCell colSpan={14} align="center" sx={{ py: 8, border: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.grey[500], 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SearchOffIcon
              sx={{ fontSize: 32, color: theme.palette.grey[400] }}
            />
          </Box>
          <Box textAlign="center">
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontWeight={500}
            >
              No hay resultados para mostrar
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Utilice los filtros de busqueda para encontrar transferencias
            </Typography>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export function ConsultaTransferenciaResults({ results, onEdit }: Props) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                background: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TableChartIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Resultados de Busqueda
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lista de transferencias encontradas
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={`${results.length} registro${results.length !== 1 ? "s" : ""}`}
            size="small"
            color={results.length ? "primary" : "default"}
            variant={results.length ? "filled" : "outlined"}
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Box>
      <TableContainer sx={{ maxHeight: 420, overflowX: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map(([label, minWidth, align]) => (
                <TableCell
                  key={label}
                  align={align}
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    minWidth,
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.dark,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    fontSize: "0.8rem",
                    py: 1.5,
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length ? (
              results.map((row, index) => (
                <TransferenciaResultRow
                  key={`${row.codTransferencia}-${index}`}
                  row={row}
                  index={index}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <EmptyResults />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!!results.length && (
        <Box
          sx={{
            p: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.grey[500], 0.04),
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Mostrando {results.length} transferencia
            {results.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
