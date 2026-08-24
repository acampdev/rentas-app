import { Add, Search } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  TextField,
  useTheme,
} from "@mui/material";
import type { CajasController } from "../cajas.types";
import { cajaButtonSx } from "./cajasView.styles";

export function CajasFilters({
  controller: c,
}: {
  controller: CajasController;
}) {
  const theme = useTheme();
  const searchOnEnter = (key: string) => key === "Enter" && void c.buscar();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "minmax(220px, 1fr) minmax(150px, .65fr)",
          md: "minmax(250px, 1fr) minmax(150px, 180px) auto auto",
        },
        gap: 2,
        alignItems: "center",
        bgcolor: alpha(theme.palette.grey[100], 0.5),
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
      }}
    >
      <TextField
        fullWidth
        label="Descripción"
        value={c.descripcionBusqueda}
        onChange={(event) => c.setDescripcionBusqueda(event.target.value)}
        onKeyDown={(event) => searchOnEnter(event.key)}
        size="small"
        disabled={c.loading}
      />
      <TextField
        fullWidth
        label="Cod. Usuario"
        value={c.codUsuarioBusqueda}
        onChange={(event) =>
          c.setCodUsuarioBusqueda(event.target.value.replace(/\D/g, ""))
        }
        onKeyDown={(event) => searchOnEnter(event.key)}
        size="small"
        disabled={c.loading}
        inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
      />
      <Button
        variant="contained"
        startIcon={
          c.loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Search />
          )
        }
        onClick={c.buscar}
        disabled={c.loading}
        sx={{
          ...cajaButtonSx,
          bgcolor: "#3b82f6",
          color: "white",
          minWidth: 120,
        }}
      >
        Buscar
      </Button>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={c.limpiarBusqueda}
        disabled={c.loading}
        sx={cajaButtonSx}
      >
        Limpiar
      </Button>
    </Box>
  );
}
