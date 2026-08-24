import {
  Chip,
  CircularProgress,
  Paper,
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
import { Badge } from "@mui/icons-material";
import type { SelectorContribuyenteTableProps } from "./selectorContribuyente.types";

export const SelectorContribuyenteTable = ({
  contribuyentes,
  loading,
  seleccionado,
  onSelect,
  onConfirmImmediately,
}: SelectorContribuyenteTableProps) => {
  const theme = useTheme();
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 2,
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        "&::-webkit-scrollbar": { width: 8, height: 8 },
        "&::-webkit-scrollbar-track": {
          backgroundColor: alpha(theme.palette.divider, 0.05),
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: 1,
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.4),
          },
        },
      }}
    >
      <Table stickyHeader size="small">
        <TableHead
          sx={{
            "& .MuiTableCell-stickyHeader": {
              zIndex: 3,
              backgroundColor: theme.palette.background.paper,
              backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
              borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.25)}`,
              boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.08)}`,
              fontWeight: 700,
              py: 1.5,
            },
          }}
        >
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Contribuyente</TableCell>
            <TableCell>Documento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && contribuyentes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                <CircularProgress size={40} thickness={4} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Cargando padrón de contribuyentes...
                </Typography>
              </TableCell>
            </TableRow>
          ) : contribuyentes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                <Typography color="text.secondary">
                  No se encontraron contribuyentes
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            contribuyentes.map((item) => {
              const selected = seleccionado?.codigo === item.codigo;
              return (
                <TableRow
                  key={item.codigo}
                  hover
                  selected={selected}
                  onClick={() => onSelect(item)}
                  onDoubleClick={() => onConfirmImmediately(item)}
                  sx={{
                    cursor: "pointer",
                    "&.Mui-selected": {
                      bgcolor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
                      "&:hover": {
                        bgcolor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
                      },
                    },
                  }}
                >
                  <TableCell sx={{ py: 1 }}>
                    <Chip
                      label={item.codigo}
                      size="small"
                      variant="outlined"
                      color={selected ? "primary" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={selected ? 700 : 500}
                    >
                      {item.contribuyente}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.direccion || "Sin dirección registrada"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Badge fontSize="small" sx={{ color: "text.disabled" }} />
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {item.documento}
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
  );
};
