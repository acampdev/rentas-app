import {
  CheckCircle,
  Clear,
  Close,
  LocationOn,
  Refresh,
  Search,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  InputAdornment,
  Stack,
  TablePagination,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import type React from "react";
import { SelectorDireccionesTable } from "./SelectorDireccionesTable";
import type { SelectorDireccionesProps } from "./selectorDirecciones.types";
import { useSelectorDirecciones } from "./useSelectorDirecciones";

const SelectorDirecciones: React.FC<SelectorDireccionesProps> = (props) => {
  const theme = useTheme();
  const controller = useSelectorDirecciones(props);
  const titulo = props.titulo || "Seleccionar Dirección";

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      keepMounted={false}
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn color="primary" />
            <Typography variant="h6" fontWeight={700} color="primary.dark">
              {titulo}
            </Typography>
          </Stack>
          <IconButton
            onClick={props.onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre de vía, barrio, sector, tipo de vía..."
            value={controller.busqueda}
            onChange={(event) => controller.cambiarBusqueda(event.target.value)}
            size="small"
            sx={{ bgcolor: "background.paper", borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: controller.busqueda ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => controller.cambiarBusqueda("")}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
          <SelectorDireccionesTable
            direcciones={controller.direcciones}
            paginadas={controller.paginadas}
            selectedId={controller.selectedId}
            loading={controller.loading}
            error={controller.error}
            onSelect={controller.setSelectedId}
          />
          <TablePagination
            component="div"
            count={controller.filtradas.length}
            page={controller.page}
            onPageChange={(_, page) => controller.setPage(page)}
            rowsPerPage={controller.rowsPerPage}
            onRowsPerPageChange={(event) =>
              controller.cambiarFilas(Number(event.target.value))
            }
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.grey[100], 0.3),
        }}
      >
        <Button
          onClick={props.onClose}
          variant="outlined"
          color="inherit"
          sx={secondaryButtonSx}
        >
          Cancelar
        </Button>
        <Button
          onClick={controller.recargar}
          variant="outlined"
          startIcon={<Refresh />}
          disabled={controller.loading}
          sx={secondaryButtonSx}
        >
          Recargar
        </Button>
        <Button
          variant="contained"
          onClick={controller.seleccionar}
          disabled={!controller.selectedId}
          startIcon={<CheckCircle />}
          sx={{
            bgcolor: "#3b82f6 !important",
            color: "white !important",
            fontWeight: 700,
            height: 36,
            textTransform: "none",
            borderRadius: 1.5,
            boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
            "&:hover": {
              bgcolor: "#2563eb !important",
              boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
            },
            "&.Mui-disabled": {
              bgcolor: `${alpha("#3b82f6", 0.5)} !important`,
              color: "rgba(255, 255, 255, 0.7) !important",
              boxShadow: "none",
            },
          }}
        >
          Seleccionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const secondaryButtonSx = {
  textTransform: "none",
  borderRadius: 1.5,
  borderColor: "divider",
  color: "text.secondary",
  height: 36,
  "&:hover": { borderColor: "text.primary" },
} as const;

export default SelectorDirecciones;
