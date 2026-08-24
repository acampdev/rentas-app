import { Edit, Home, LocationOn } from "@mui/icons-material";
import {
  Alert,
  alpha,
  Box,
  Fade,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { Barrio } from "../../models/Barrio";
import type { BarrioOrder, BarrioOrderBy } from "./barrioList.types";

interface Props {
  rows: Barrio[];
  loading: boolean;
  query: string;
  selected?: Barrio | null;
  order: BarrioOrder;
  orderBy: BarrioOrderBy;
  getSectorName: (code?: number) => string;
  onSort: (field: BarrioOrderBy) => void;
  onRowClick?: (row: Barrio) => void;
  onEdit?: (row: Barrio) => void;
}

const columns: {
  id: BarrioOrderBy | "acciones";
  label: string;
  width: string;
  align?: "center";
}[] = [
  { id: "id", label: "N°", width: "10%", align: "center" },
  { id: "nombre", label: "Nombre del Barrio", width: "45%" },
  { id: "sector", label: "Sector", width: "30%" },
  { id: "acciones", label: "Acciones", width: "15%", align: "center" },
];

const LoadingRows = () => (
  <>
    {Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export const BarrioListTable = ({
  rows,
  loading,
  query,
  selected,
  order,
  orderBy,
  getSectorName,
  onSort,
  onRowClick,
  onEdit,
}: Props) => {
  const theme = useTheme();
  return (
    <TableContainer
      sx={{
        height: 400,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflowY: "auto",
      }}
    >
      <Table stickyHeader size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "left"}
                sx={{
                  fontWeight: 700,
                  fontSize: ".875rem",
                  bgcolor: "#f0f7ff",
                  color: "primary.main",
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  textTransform: "uppercase",
                  width: column.width,
                  zIndex: 3,
                }}
              >
                {column.id === "acciones" ? (
                  column.label
                ) : (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => onSort(column.id as BarrioOrderBy)}
                  >
                    {column.label}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <LoadingRows />
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Home sx={{ fontSize: 48, color: "text.disabled" }} />
                  <Alert severity="info" variant="outlined">
                    {query
                      ? `No se encontraron barrios con "${query}"`
                      : "No hay barrios registrados"}
                  </Alert>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <Fade in key={row.id} timeout={300 + index * 50}>
                <TableRow
                  hover
                  selected={selected?.id === row.id}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        fontWeight: 600,
                      }}
                    >
                      {row.id}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Home sx={{ fontSize: 18, color: "secondary.main" }} />
                      <Typography variant="body2" noWrap fontWeight={500}>
                        {row.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "info.dark",
                        fontWeight: 500,
                      }}
                    >
                      <LocationOn sx={{ fontSize: 16, color: "info.main" }} />
                      {getSectorName(row.codSector)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {onEdit && (
                      <Stack direction="row" justifyContent="center">
                        <Tooltip title="Editar barrio">
                          <IconButton
                            size="small"
                            color="primary"
                            disabled={loading}
                            onClick={(event) => {
                              event.stopPropagation();
                              onEdit(row);
                            }}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.16,
                                ),
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              </Fade>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
