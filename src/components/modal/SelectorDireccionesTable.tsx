import { Apartment, Info } from "@mui/icons-material";
import {
  Alert,
  CircularProgress,
  Paper,
  Radio,
  Stack,
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
import type { DireccionData } from "../../services/direccionService";

interface Props {
  direcciones: DireccionData[];
  paginadas: DireccionData[];
  selectedId: number | null;
  loading: boolean;
  error: unknown;
  onSelect: (id: number) => void;
}

export const SelectorDireccionesTable = ({
  direcciones,
  paginadas,
  selectedId,
  loading,
  error,
  onSelect,
}: Props) => {
  const theme = useTheme();
  const headerSx = {
    fontWeight: 700,
    bgcolor: alpha(theme.palette.primary.main, 0.12),
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  };

  return (
    <Stack spacing={2}>
      {Boolean(error) && (
        <Alert severity="warning">
          {typeof error === "string" ? error : "Error al cargar direcciones"}
        </Alert>
      )}
      {direcciones.length === 0 && !loading && (
        <Alert severity="info" icon={<Info />}>
          No se encontraron direcciones. Intente recargar los datos.
        </Alert>
      )}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          maxHeight: 320,
          borderRadius: 2,
          overflowY: "auto",
          border: `1px solid ${theme.palette.divider}`,
          "&::-webkit-scrollbar": { width: 8, height: 8 },
          "&::-webkit-scrollbar-track": {
            backgroundColor: alpha(theme.palette.divider, 0.05),
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: 4,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.4),
            },
          },
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={headerSx}
                padding="checkbox"
                width={70}
                align="center"
              >
                SEL.
              </TableCell>
              <TableCell sx={headerSx}>DIRECCIÓN COMPLETA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : paginadas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron direcciones
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginadas.map((direccion, index) => {
                const selected = selectedId === direccion.id;
                return (
                  <TableRow
                    key={`direccion-${direccion.id || index}-${index}`}
                    hover
                    onClick={() => onSelect(direccion.id)}
                    selected={selected}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: selected
                        ? alpha(theme.palette.primary.main, 0.04)
                        : "inherit",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08,
                        ),
                      },
                    }}
                  >
                    <TableCell padding="checkbox" align="center">
                      <Radio checked={selected} size="small" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: selected ? 600 : 400 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Apartment
                          sx={{
                            fontSize: 16,
                            color: selected ? "primary.main" : "text.secondary",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: selected ? 600 : 400 }}
                        >
                          {direccion.descripcion || "-"}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
