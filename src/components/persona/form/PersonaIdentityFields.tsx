import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { PersonaFormController } from "./personaForm.types";

export const PersonaIdentityFields = ({
  controller,
}: {
  controller: PersonaFormController;
}) => (
  <>
    <Grid size={{ xs: 12, sm: 4 }}>
      <FormControl fullWidth required>
        <InputLabel shrink>Tipo de persona</InputLabel>
        <Select
          label="Tipo de persona"
          value={controller.selections.tipoPersona}
          displayEmpty
          onChange={(event) => controller.setTipoPersona(event.target.value)}
        >
          <MenuItem value="" disabled>
            Seleccione un tipo de persona
          </MenuItem>
          {controller.catalogs.tiposPersona.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <FormControl fullWidth required>
        <InputLabel shrink>Tipo de documento</InputLabel>
        <Select
          label="Tipo de documento"
          value={controller.selections.documento}
          displayEmpty
          onChange={(event) =>
            controller.cambiarTipoDocumento(event.target.value)
          }
        >
          <MenuItem value="" disabled>
            Seleccione un tipo de documento
          </MenuItem>
          {controller.catalogs.documentos.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField
        fullWidth
        required
        label="Número de documento"
        value={controller.values.numerodocumento}
        onChange={(event) =>
          controller.cambiarNumeroDocumento(event.target.value)
        }
        onBlur={() => void controller.consultarDocumento()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void controller.consultarDocumento();
          }
        }}
        slotProps={{
          htmlInput: {
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: controller.documentoConfig.maxLength,
          },
          input: {
            endAdornment: controller.consultandoDocumento ? (
              <CircularProgress size={20} />
            ) : undefined,
          },
        }}
        helperText={controller.documentoConfig.helperText}
      />
    </Grid>
  </>
);
