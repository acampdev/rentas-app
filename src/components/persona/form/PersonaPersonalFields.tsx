import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { PersonaFormController } from "./personaForm.types";

export const PersonaPersonalFields = ({
  controller,
}: {
  controller: PersonaFormController;
}) => (
  <>
    <Grid size={{ xs: 12, sm: controller.isJuridica ? 12 : 4 }}>
      <TextField
        fullWidth
        required
        label={controller.isJuridica ? "Razón social" : "Nombres"}
        value={controller.values.nombres}
        onChange={(event) => controller.setField("nombres", event.target.value)}
      />
    </Grid>
    {!controller.isJuridica && (
      <>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Apellido paterno"
            value={controller.values.apellidopaterno}
            onChange={(event) =>
              controller.setField("apellidopaterno", event.target.value)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Apellido materno"
            value={controller.values.apellidomaterno}
            onChange={(event) =>
              controller.setField("apellidomaterno", event.target.value)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            type="date"
            label="Fecha de nacimiento"
            slotProps={{ inputLabel: { shrink: true } }}
            value={controller.values.fechanacimiento}
            onChange={(event) =>
              controller.setField("fechanacimiento", event.target.value)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel shrink>Estado civil</InputLabel>
            <Select
              label="Estado civil"
              value={controller.selections.estadoCivil}
              displayEmpty
              onChange={(event) =>
                controller.setField("codestadocivil", event.target.value)
              }
            >
              <MenuItem value="" disabled>
                Seleccione un estado civil
              </MenuItem>
              {controller.catalogs.estadosCiviles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel shrink>Sexo</InputLabel>
            <Select
              label="Sexo"
              value={controller.selections.sexo}
              displayEmpty
              onChange={(event) =>
                controller.setField("codsexo", event.target.value)
              }
            >
              <MenuItem value="" disabled>
                Seleccione un sexo
              </MenuItem>
              {controller.catalogs.sexos.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </>
    )}
  </>
);
