import MoneyIcon from "@mui/icons-material/AttachMoney";
import {
  Alert,
  alpha,
  Box,
  Chip,
  Fade,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import type { ArancelData } from "../../../services/arancelService";
import { formatCurrency } from "../../../utils/formatters";
import {
  getArancelRowKey,
  isSameArancel,
} from "./selectorDireccionArancel.adapters";

interface SelectorArancelTableProps {
  rows: ArancelData[];
  totalRows: number;
  loading: boolean;
  useGeneralApi: boolean;
  selectedArancel: ArancelData | null;
  anioSeleccionado: number | null;
  codDireccionBusqueda: number | null;
  onSelect: (value: ArancelData) => void;
}

export const SelectorArancelTable = ({
  rows,
  totalRows,
  loading,
  useGeneralApi,
  selectedArancel,
  anioSeleccionado,
  codDireccionBusqueda,
  onSelect,
}: SelectorArancelTableProps) => {
  const theme = useTheme();
  const hasSearchCriteria =
    useGeneralApi || Boolean(anioSeleccionado && codDireccionBusqueda);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={index}
            height={60}
            sx={{ mb: 1, borderRadius: 1 }}
            animation="wave"
          />
        ))}
      </Box>
    );
  }

  if (hasSearchCriteria && totalRows === 0) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        {useGeneralApi
          ? "No se encontraron aranceles con los criterios de búsqueda especificados"
          : `No se encontraron aranceles para el año ${anioSeleccionado} y código de dirección ${codDireccionBusqueda}`}
      </Alert>
    );
  }

  if (!hasSearchCriteria) return null;

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 2,
        maxHeight: { xs: 250, sm: 300, md: 350 },
        overflow: "auto",
        "& .MuiTable-root": {
          borderCollapse: "separate",
          minWidth: { xs: 500, sm: 600, md: 700 },
        },
        "&::-webkit-scrollbar": { width: 8, height: 8 },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: alpha(theme.palette.primary.main, 0.3),
          borderRadius: 2,
        },
      }}
    >
      <Table size="medium" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                width: 100,
              }}
            >
              Año
            </TableCell>
            {useGeneralApi && (
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                Dirección Completa
              </TableCell>
            )}
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                width: 150,
              }}
            >
              Costo Arancel
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((arancel, index) => (
            <Fade in key={getArancelRowKey(arancel, index)}>
              <TableRow
                hover
                selected={isSameArancel(selectedArancel, arancel)}
                onClick={() => onSelect(arancel)}
                sx={{
                  cursor: "pointer",
                  "&:nth-of-type(even)": {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                  },
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  },
                }}
              >
                <TableCell align="center">
                  <Chip
                    label={arancel.anio}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                {useGeneralApi && (
                  <TableCell sx={{ minWidth: 300 }}>
                    <Typography variant="body2" noWrap fontWeight={500}>
                      {arancel.direccionCompleta || "N/A"}
                    </Typography>
                  </TableCell>
                )}
                <TableCell align="right">
                  <Chip
                    label={formatCurrency(arancel.costoArancel)}
                    color="success"
                    size="small"
                    icon={<MoneyIcon />}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
