import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { Autocomplete, Box, CircularProgress, InputAdornment, Skeleton, TextField } from "@mui/material";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { ContribuyenteFormValues } from "../../hooks/useContribuyenteForm";
import type { OptionFormat } from "../../hooks/useConstantesOptions";
import type { DocumentoConfig } from "./personaForm.types";
import { soloLetras, soloNumeros } from "./personaForm.validators";

interface Props {
  form: UseFormReturn<ContribuyenteFormValues>;
  isJuridica: boolean;
  disabled: boolean;
  options: OptionFormat[];
  loadingOptions: boolean;
  optionsError: unknown;
  documentoConfig: DocumentoConfig;
  consultandoDocumento: boolean;
}

const fieldSx = { "& .MuiInputBase-root": { bgcolor: "action.hover" } };

export const PersonaIdentidadFields = ({ form, isJuridica, disabled, options, loadingOptions, optionsError, documentoConfig, consultandoDocumento }: Props) => {
  const { control, formState: { errors } } = form;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "205px 150px minmax(180px, 1fr)", lg: isJuridica ? "205px 150px minmax(220px, 1fr) 150px" : "205px 150px minmax(180px, 1fr) 150px 150px" }, gap: 1.5, alignItems: "start" }}>
      {loadingOptions ? <Skeleton variant="rounded" height={40} /> : (
        <Controller name="tipoDocumento" control={control} rules={{ required: "Tipo de documento es requerido" }} render={({ field }) => (
          <Autocomplete options={options} value={options.find((option) => String(option.value) === String(field.value)) || null} getOptionLabel={(option) => option.label} isOptionEqualToValue={(a, b) => String(a.value) === String(b.value)} onBlur={field.onBlur} onChange={(_, value) => {
            field.onChange(value?.value || "");
            form.setValue("numeroDocumento", "", { shouldDirty: true, shouldValidate: false });
            form.clearErrors("numeroDocumento");
          }} disabled={disabled} size="small" renderInput={(params) => <TextField {...params} label="Tipo Documento" error={Boolean(errors.tipoDocumento || optionsError)} helperText={String(errors.tipoDocumento?.message || (optionsError ? "Error al cargar opciones" : ""))} sx={fieldSx} slotProps={{ input: { ...params.InputProps, startAdornment: <><InputAdornment position="start"><BadgeIcon fontSize="small" /></InputAdornment>{params.InputProps.startAdornment}</> } }} />} />
        )} />
      )}

      <Controller name="numeroDocumento" control={control} rules={{ required: "Requerido", pattern: { value: documentoConfig.pattern, message: documentoConfig.errorMessage } }} render={({ field }) => (
        <TextField {...field} fullWidth size="small" label="Número de Documento" placeholder={documentoConfig.placeholder} disabled={disabled} error={Boolean(errors.numeroDocumento)} helperText={String(errors.numeroDocumento?.message || "")} onChange={(event) => field.onChange(soloNumeros(event.target.value, documentoConfig.maxLength))} slotProps={{ htmlInput: { maxLength: documentoConfig.maxLength, inputMode: "numeric", pattern: "[0-9]*" }, input: { startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" /></InputAdornment>, endAdornment: consultandoDocumento ? <CircularProgress size={18} /> : undefined } }} sx={fieldSx} />
      )} />

      <Controller name={isJuridica ? "razonSocial" : "nombres"} control={control} rules={{ required: "Este campo es requerido", pattern: isJuridica ? undefined : { value: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/, message: "Solo se permiten letras" } }} render={({ field }) => (
        <TextField {...field} fullWidth size="small" label={isJuridica ? "Razón Social" : "Nombres"} disabled={disabled} error={Boolean(isJuridica ? errors.razonSocial : errors.nombres)} helperText={String((isJuridica ? errors.razonSocial : errors.nombres)?.message || "")} onChange={(event) => field.onChange(isJuridica ? event.target.value : soloLetras(event.target.value))} slotProps={{ input: { startAdornment: <InputAdornment position="start">{isJuridica ? <BusinessIcon fontSize="small" /> : <PersonIcon fontSize="small" />}</InputAdornment> } }} sx={fieldSx} />
      )} />

      {isJuridica ? <PhoneField form={form} disabled={disabled} /> : <>
        <NameField form={form} name="apellidoPaterno" label="Ap. Paterno" disabled={disabled} />
        <NameField form={form} name="apellidoMaterno" label="Ap. Materno" disabled={disabled} />
      </>}
    </Box>
  );
};

const NameField = ({ form, name, label, disabled }: { form: UseFormReturn<ContribuyenteFormValues>; name: "apellidoPaterno" | "apellidoMaterno"; label: string; disabled: boolean }) => (
  <Controller name={name} control={form.control} rules={{ pattern: { value: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/, message: "Solo se permiten letras" } }} render={({ field, fieldState }) => <TextField {...field} fullWidth size="small" label={label} disabled={disabled} error={Boolean(fieldState.error)} helperText={fieldState.error?.message || ""} onChange={(event) => field.onChange(soloLetras(event.target.value))} sx={fieldSx} />} />
);

export const PhoneField = ({ form, disabled }: { form: UseFormReturn<ContribuyenteFormValues>; disabled: boolean }) => (
  <Controller name="telefono" control={form.control} rules={{ pattern: { value: /^[0-9]{0,9}$/, message: "Teléfono inválido (máximo 9 dígitos)" } }} render={({ field, fieldState }) => <TextField {...field} fullWidth size="small" label="Teléfono" disabled={disabled} error={Boolean(fieldState.error)} helperText={fieldState.error?.message || ""} onChange={(event) => field.onChange(soloNumeros(event.target.value, 9))} slotProps={{ htmlInput: { maxLength: 9, inputMode: "tel" }, input: { startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment> } }} sx={fieldSx} />} />
);
