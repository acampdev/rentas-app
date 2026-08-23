import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { PersonaDireccionFields } from "./PersonaDireccionFields";
import { PersonaIdentidadFields } from "./PersonaIdentidadFields";
import { PersonaNaturalFields } from "./PersonaNaturalFields";
import type { PersonaFormProps } from "./personaForm.types";
import { usePersonaFormController } from "./usePersonaFormController";

const errorText = (error: unknown): string | null => {
  if (!error) return null;
  return error instanceof Error ? error.message : String(error);
};

const PersonaFormMUI = ({
  form,
  isJuridica = false,
  onOpenDireccionModal,
  direccion,
  getDireccionTextoCompleto,
  disablePersonaFields = false,
}: PersonaFormProps) => {
  const controller = usePersonaFormController({ form, isJuridica });
  const loadingCatalogs = controller.loadingTipoDocumento || controller.loadingEstadoCivil || controller.loadingSexo;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={0} sx={{ p: { xs: 1, sm: 1.5 }, borderRadius: 2, border: 1, borderColor: "divider" }}>
        {controller.hasLoadingErrors && <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>Algunas opciones no pudieron cargarse. Se están usando los valores disponibles.</Alert>}
        {controller.mensajeConsulta && <Alert severity={controller.estadoConsulta} sx={{ mb: 2 }}>{controller.mensajeConsulta}</Alert>}

        <Stack spacing={1.5}>
          <PersonaIdentidadFields form={form} isJuridica={isJuridica} disabled={disablePersonaFields} options={controller.tipoDocumentoOptions} loadingOptions={controller.loadingTipoDocumento} optionsError={controller.errorTipoDocumento} documentoConfig={controller.documentoConfig} consultandoDocumento={controller.consultandoDocumento} />
          {!isJuridica && <PersonaNaturalFields form={form} disabled={disablePersonaFields} sexOptions={controller.sexoOptions} civilStatusOptions={controller.estadoCivilOptions} loadingSex={controller.loadingSexo} loadingCivilStatus={controller.loadingEstadoCivil} sexError={controller.errorSexo} civilStatusError={controller.errorEstadoCivil} />}
          <PersonaDireccionFields form={form} direccion={direccion} nFinca={controller.nFinca} otroNumero={controller.otroNumero} disabled={disablePersonaFields} juridica={isJuridica} onOpen={onOpenDireccionModal} getText={getDireccionTextoCompleto} />

          {errorText(controller.errorPersona) && <Alert severity="error">{errorText(controller.errorPersona)}</Alert>}
          {errorText(controller.errorContribuyente) && <Alert severity="error">{errorText(controller.errorContribuyente)}</Alert>}
          {loadingCatalogs && <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 1 }}><CircularProgress size={20} sx={{ mr: 1 }} /><Typography variant="caption" color="text.secondary">Cargando opciones...</Typography></Box>}
        </Stack>
      </Paper>
    </Box>
  );
};

export default PersonaFormMUI;
