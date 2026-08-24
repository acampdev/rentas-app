import {
  alpha,
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
  useTheme,
} from "@mui/material";
import type { PUData } from "../../../services/puService";

interface Props {
  data: PUData[];
  loading: boolean;
}

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(Number(value) || 0);

export function PUTable({ data, loading }: Props) {
  const theme = useTheme();
  const headerStyle = {
    bgcolor: "#edf2fe",
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    whiteSpace: "nowrap" as const,
  };

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ maxHeight: 450, overflow: "auto", borderRadius: 2 }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {[
              "COD. PREDIO",
              "DIRECCIÓN",
              "ESTADO",
              "TIPO",
              "ÁREA TERRENO",
              "VAL. UNITARIO",
              "DEPREC.",
              "AUTOAVALÚO",
            ].map((label, index) => (
              <TableCell
                key={label}
                align={
                  index === 4 || index === 6
                    ? "center"
                    : index > 4
                      ? "right"
                      : "left"
                }
                sx={headerStyle}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                <Typography color="text.secondary">
                  No se encontraron registros
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((pu, index) => (
              <TableRow
                key={`${pu.codPredio}-${index}`}
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
                    label={pu.codPredio}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.8rem" }}>
                  {pu.direccion}
                </TableCell>
                <TableCell>
                  <Chip
                    label={pu.estadoPredio}
                    size="small"
                    color={
                      pu.estadoPredio === "EN CONSTRUCCION"
                        ? "warning"
                        : "success"
                    }
                    sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.8rem" }}>
                  {pu.tipoPredio}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                >
                  {pu.areaTerreno} m²
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                >
                  S/ {formatCurrency(pu.valorUnitario)}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                >
                  {pu.depreciacion}%
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "success.main",
                  }}
                >
                  S/ {formatCurrency(pu.autoavaluo)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
