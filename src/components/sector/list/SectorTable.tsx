import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  alpha,
  Box,
  Fade,
  IconButton,
  Paper,
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
import type { Sector } from "../../../models/Sector";
import type {
  SectorHeadCell,
  SectorOrder,
  SectorSortKey,
} from "./sectorList.types";

interface Props {
  sectors: Sector[];
  selectedSector?: Sector | null;
  searchTerm: string;
  loading: boolean;
  order: SectorOrder;
  orderBy: SectorSortKey;
  onSort: (property: SectorSortKey) => void;
  onEdit: (sector: Sector) => void;
}

const headCells: SectorHeadCell[] = [
  { id: "id", label: "N°", sortable: true, align: "center" },
  { id: "nombre", label: "Nombre del Sector", sortable: true },
  { id: "nombreCuadrante", label: "Cuadrante", sortable: true },
  { id: "unidadUrbana", label: "UnidUrbana", sortable: true, align: "center" },
  { id: "acciones", label: "Acciones", align: "center" },
];

const SkeletonRows = () => (
  <>
    {Array.from({ length: 5 }, (_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell align="center">
          <Skeleton width={40} />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell align="center">
          <Skeleton width={60} />
        </TableCell>
        <TableCell align="center">
          <Skeleton width={40} />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export const SectorTable = ({
  sectors,
  selectedSector,
  searchTerm,
  loading,
  order,
  orderBy,
  onSort,
  onEdit,
}: Props) => {
  const theme = useTheme();
  const border = `1px solid ${alpha(theme.palette.divider, 0.5)}`;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        width: "100%",
        height: { xs: 300, sm: 350, md: 400 },
        maxHeight: { xs: 300, sm: 350, md: 400 },
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": { width: 8 },
        "&::-webkit-scrollbar-track": {
          bgcolor: alpha(theme.palette.grey[200], 0.5),
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: alpha(theme.palette.primary.main, 0.3),
          borderRadius: 2,
        },
      }}
    >
      <Table stickyHeader size="medium">
        <TableHead>
          <TableRow>
            {headCells.map((cell) => (
              <TableCell
                key={cell.id}
                align={cell.align ?? "left"}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  bgcolor: "#f0f7ff",
                  color: "primary.main",
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  zIndex: 2,
                }}
              >
                {cell.sortable ? (
                  <TableSortLabel
                    active={orderBy === cell.id}
                    direction={orderBy === cell.id ? order : "asc"}
                    onClick={() => onSort(cell.id as SectorSortKey)}
                  >
                    {cell.label}
                  </TableSortLabel>
                ) : (
                  cell.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <SkeletonRows />
          ) : sectors.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={headCells.length}
                align="center"
                sx={{ py: 6 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                  <Alert severity="info" variant="outlined">
                    {searchTerm
                      ? `No se encontraron sectores con "${searchTerm}"`
                      : "No hay sectores registrados"}
                  </Alert>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            sectors.map((sector, index) => (
              <Fade in key={sector.id} timeout={300 + index * 100}>
                <TableRow
                  hover
                  selected={selectedSector?.id === sector.id}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    },
                    "&:nth-of-type(even):not(.Mui-selected)": {
                      bgcolor: alpha(theme.palette.grey[100], 0.3),
                    },
                  }}
                >
                  <TableCell align="center" sx={{ borderBottom: border }}>
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
                      {sector.id}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: border }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <BusinessIcon color="secondary" />
                      <Box>
                        <Typography fontWeight={500}>
                          {sector.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Sector #{sector.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottom: border }}>
                    <Typography variant="body2" color="text.secondary">
                      {sector.nombreCuadrante || "Sin cuadrante"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: border }}>
                    {sector.unidadUrbana || "-"}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: border }}>
                    <Tooltip title="Editar sector" arrow>
                      <IconButton
                        size="small"
                        color="primary"
                        disabled={loading}
                        onClick={() => onEdit(sector)}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
