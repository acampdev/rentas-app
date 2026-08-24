// src/components/persona/PersonaForm.tsx
import { Alert, Grid, Paper, Typography } from "@mui/material";
import SelectorDirecciones from "../modal/SelectorDirecciones";
import { PersonaAddressFields } from "./form/PersonaAddressFields";
import { PersonaFormActions } from "./form/PersonaFormActions";
import { PersonaIdentityFields } from "./form/PersonaIdentityFields";
import { PersonaPersonalFields } from "./form/PersonaPersonalFields";
import type { PersonaFormProps } from "./form/personaForm.types";
import { usePersonaMaintenanceForm } from "./form/usePersonaMaintenanceForm";

const PersonaForm = (props: PersonaFormProps) => {
  const controller = usePersonaMaintenanceForm(props);

  return (
    <Paper
      component="form"
      onSubmit={controller.guardar}
      elevation={0}
      sx={{ p: 3 }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        {controller.personaEnEdicion ? "Editar persona" : "Nueva persona"}
      </Typography>

      {controller.error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {controller.error}
        </Alert>
      )}
      {controller.mensajeConsulta && controller.estadoConsulta && (
        <Alert severity={controller.estadoConsulta} sx={{ mb: 2 }}>
          {controller.mensajeConsulta}
        </Alert>
      )}

      <Grid container spacing={2}>
        <PersonaIdentityFields controller={controller} />
        <PersonaPersonalFields controller={controller} />
        <PersonaAddressFields controller={controller} />
      </Grid>

      <SelectorDirecciones
        open={controller.selectorDireccionesOpen}
        onClose={() => controller.setSelectorDireccionesOpen(false)}
        onSelectDireccion={controller.setDireccionSeleccionada}
        direccionSeleccionada={controller.direccionSeleccionada}
        titulo="Seleccionar dirección de la persona"
      />
      <PersonaFormActions
        submitting={controller.submitting}
        onClear={controller.limpiar}
      />
    </Paper>
  );
};

export default PersonaForm;
