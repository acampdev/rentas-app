import EditIcon from "@mui/icons-material/Edit";
import LocationIcon from "@mui/icons-material/LocationOn";
import {
  Alert,
  alpha,
  Box,
  CircularProgress,
  Fade,
  IconButton,
  Paper,
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
} from "@mui/material";
import type { DireccionData } from "../../../services/direccionService";
import type {
  DireccionHeadCell,
  DireccionOrder,
  DireccionSortKey,
} from "./direccionList.types";

interface Props {
  rows: DireccionData[];
  selected?: DireccionData | null;
  searchTerm: string;
  loading: boolean;
  order: DireccionOrder;
  orderBy: DireccionSortKey;
  onSort: (property: DireccionSortKey) => void;
  onEdit: (direccion: DireccionData) => void;
}

const columns: DireccionHeadCell[] = [
  { id: "codigo", label: "Código", width: "80px", align: "center" },
  { id: "descripcion", label: "Dirección Completa", width: "400px" },
  { id: "rutaNombre", label: "Ruta", width: "120px" },
  { id: "zonaNombre", label: "Zona", width: "120px" },
  {
    id: "ubicacionAreaVerdeNombre",
    label: "Ubicación Área Verde",
    width: "180px",
  },
  { id: "actions", label: "Acciones", width: "90px", align: "center" },
];

const EmptyRows = ({ searchTerm }: { searchTerm: string }) => (
  <TableRow>
    <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <LocationIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Alert severity="info" variant="outlined">
          {searchTerm
            ? `No se encontraron direcciones con "${searchTerm}"`
            : "No hay direcciones registradas"}
        </Alert>
      </Box>
    </TableCell>
  </TableRow>
);

export const DireccionTable = ({
  rows,
  selected,
  searchTerm,
  loading,
  order,
  orderBy,
  onSort,
  onEdit,
}: Props) => (
  <TableContainer
    component={Paper}
    elevation={3}
    sx={(theme) => ({
      width: "100%",
      height: 450,
      maxHeight: 450,
      borderRadius: 2,
      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      overflow: "auto",
      background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
      "&::-webkit-scrollbar": { width: 12, height: 12 },
      "&::-webkit-scrollbar-thumb": {
        bgcolor: alpha(theme.palette.primary.main, 0.6),
        borderRadius: 6,
        border: `2px solid ${theme.palette.background.paper}`,
      },
    })}
  >
    <Table stickyHeader size="medium" sx={{ minWidth: 820 }}>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.align ?? "left"}
              sx={(theme) => ({
                width: column.width,
                minWidth: column.width,
                maxWidth: column.width,
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderBottom: `2px solid ${theme.palette.primary.dark}`,
                textTransform: "uppercase",
                zIndex: 2,
              })}
              sortDirection={orderBy === column.id ? order : false}
            >
              {column.id === "actions" ? (
                column.label
              ) : (
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={() => onSort(column.id as DireccionSortKey)}
                  sx={{ color: "inherit !important" }}
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
          <TableRow>
            <TableCell colSpan={columns.length} align="center">
              <CircularProgress size={30} />
            </TableCell>
          </TableRow>
        ) : rows.length === 0 ? (
          <EmptyRows searchTerm={searchTerm} />
        ) : (
          rows.map((direccion, index) => (
            <Fade in key={direccion.id} timeout={300 + index * 50}>
              <TableRow
                selected={selected?.id === direccion.id}
                sx={(theme) => ({
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                  },
                  "&:nth-of-type(even):not(.Mui-selected)": {
                    bgcolor: alpha(theme.palette.grey[100], 0.3),
                  },
                })}
              >
                <TableCell align="center">
                  {direccion.codigo || direccion.id}
                </TableCell>
                <TableCell>{direccion.descripcion || "-"}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {direccion.rutaNombre || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {direccion.zonaNombre || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {direccion.ubicacionAreaVerdeNombre || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(direccion)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            </Fade>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);
