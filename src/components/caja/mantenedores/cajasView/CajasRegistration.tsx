import { Add, Save } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
} from "@mui/material";
import type { CajasController } from "../cajas.types";
import { cajaButtonSx } from "./cajasView.styles";

export function CajasRegistration({
  controller: c,
}: {
  controller: CajasController;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        bgcolor: alpha("#f5f5f5", 0.5),
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          label="Descripción Caja"
          value={c.descripcionRegistro}
          onChange={(event) => c.setDescripcionRegistro(event.target.value)}
          size="small"
          disabled={c.loading}
          placeholder="Ingrese descripción de la caja"
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={c.nuevoRegistro}
          disabled={c.loading}
          sx={cajaButtonSx}
        >
          Nuevo
        </Button>
        <Button
          variant="contained"
          startIcon={
            c.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Save />
            )
          }
          onClick={c.guardar}
          disabled={c.loading || !c.descripcionRegistro.trim()}
          sx={{
            ...cajaButtonSx,
            bgcolor: "#10b981 !important",
            color: "white",
            minWidth: 120,
          }}
        >
          {c.editando ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Paper>
  );
}
