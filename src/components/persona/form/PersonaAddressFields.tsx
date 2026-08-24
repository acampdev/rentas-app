import LocationIcon from "@mui/icons-material/LocationOn";
import { Button, Grid, TextField } from "@mui/material";
import type { PersonaFormController } from "./personaForm.types";

export const PersonaAddressFields = ({
  controller,
}: {
  controller: PersonaFormController;
}) => (
  <>
    <Grid size={{ xs: 12, sm: 3 }}>
      <TextField
        fullWidth
        label="Teléfono"
        value={controller.values.telefono}
        onChange={(event) =>
          controller.setField("telefono", event.target.value)
        }
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 3 }}>
      <Button
        type="button"
        fullWidth
        variant="outlined"
        size="small"
        startIcon={<LocationIcon />}
        onClick={() => controller.setSelectorDireccionesOpen(true)}
        sx={{
          height: 40,
          fontWeight: 700,
          textTransform: "none",
          borderRadius: 1,
        }}
      >
        Direcciones
      </Button>
    </Grid>
    <Grid size={{ xs: 12, sm: 3 }}>
      <TextField
        fullWidth
        label="N.º Finca"
        value={controller.values.nFinca}
        onChange={(event) => controller.setField("nFinca", event.target.value)}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 3 }}>
      <TextField
        fullWidth
        label="Otro N.º"
        value={controller.values.otroNumero}
        onChange={(event) =>
          controller.setField("otroNumero", event.target.value)
        }
      />
    </Grid>
    <Grid size={{ xs: 12 }}>
      <TextField
        fullWidth
        disabled
        label="Dirección seleccionada"
        value={controller.direccionCompleta}
        placeholder="Seleccione una dirección"
        slotProps={{ input: { readOnly: true } }}
        sx={{
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "text.primary",
          },
          "& .MuiInputLabel-root.Mui-disabled": { color: "text.secondary" },
        }}
      />
    </Grid>
  </>
);
