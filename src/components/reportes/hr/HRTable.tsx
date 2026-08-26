import {
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import type { HRData } from "../../../services/hrService";
import { formatHRCurrency, getHRHeaderStyle } from "./hr.utils";

interface Props {
  rows: HRData[];
  loading: boolean;
}

export const HRTable = ({ rows, loading }: Props) => {
  const theme = useTheme();
  const headerStyle = getHRHeaderStyle(theme);
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        maxHeight: 450,
        overflow: "scroll",
        borderRadius: 2,
        "&::-webkit-scrollbar": { width: 8, height: 8 },
        "&::-webkit-scrollbar-track": {
          bgcolor: alpha(theme.palette.grey[100], 0.5),
          borderRadius: 2,
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: alpha(theme.palette.primary.main, 0.3),
          borderRadius: 2,
          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.5) },
        },
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyle}>COD. PREDIO</TableCell>
            <TableCell sx={headerStyle}>DIRECCIÓN FISCAL</TableCell>
            <TableCell sx={headerStyle}>TIPO</TableCell>
            <TableCell align="center" sx={headerStyle}>
              % COND.
            </TableCell>
            <TableCell align="right" sx={headerStyle}>
              AUTOAVALÚO
            </TableCell>
            <TableCell align="right" sx={headerStyle}>
              IMP. PREDIAL
            </TableCell>
            <TableCell align="right" sx={headerStyle}>
              TRIMESTRAL
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Typography color="text.secondary">
                  No se encontraron registros
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={`${row.codPredio}-${index}`}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                  "&:nth-of-type(even)": {
                    bgcolor: alpha(theme.palette.grey[50], 0.3),
                  },
                }}
              >
                <TableCell>
                  <Chip
                    label={row.codPredio || "—"}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.8rem" }}>
                  {row.direccionFiscal}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.tipoPredio}
                    size="small"
                    sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="center" sx={numberSx}>
                  {row.porcentajeCondomino}%
                </TableCell>
                <TableCell align="right" sx={numberSx}>
                  S/ {formatHRCurrency(row.autoavaluo)}
                </TableCell>
                <TableCell align="right" sx={numberSx}>
                  S/ {formatHRCurrency(row.impuestoPredial)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ ...numberSx, fontWeight: 700, color: "success.main" }}
                >
                  S/ {formatHRCurrency(row.impuestoTrimestral)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const numberSx = {
  fontWeight: 600,
  fontFamily: "monospace",
  fontSize: "0.8rem",
};
