import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import { Autocomplete, Box, InputAdornment, Skeleton, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { ContribuyenteFormValues } from "../../hooks/useContribuyenteForm";
import type { OptionFormat } from "../../hooks/useConstantesOptions";
import { fechaFormulario } from "./personaForm.validators";
import { PhoneField } from "./PersonaIdentidadFields";

interface Props {
  form: UseFormReturn<ContribuyenteFormValues>;
  disabled: boolean;
  sexOptions: OptionFormat[];
  civilStatusOptions: OptionFormat[];
  loadingSex: boolean;
  loadingCivilStatus: boolean;
  sexError: unknown;
  civilStatusError: unknown;
}

const SelectField = ({ form, name, label, options, loading, error, disabled }: { form: UseFormReturn<ContribuyenteFormValues>; name: "sexo" | "estadoCivil"; label: string; options: OptionFormat[]; loading: boolean; error: unknown; disabled: boolean }) => loading ? <Skeleton variant="rounded" height={40} /> : (
  <Controller name={name} control={form.control} render={({ field, fieldState }) => <Autocomplete options={options} value={options.find((option) => String(option.value) === String(field.value)) || null} getOptionLabel={(option) => option.label} isOptionEqualToValue={(a, b) => String(a.value) === String(b.value)} onBlur={field.onBlur} onChange={(_, value) => field.onChange(value?.value || "")} disabled={disabled} size="small" renderInput={(params) => <TextField {...params} label={label} error={Boolean(fieldState.error || error)} helperText={String(fieldState.error?.message || (error ? "Error al cargar opciones" : ""))} slotProps={{ input: { ...params.InputProps, startAdornment: <><InputAdornment position="start"><FamilyRestroomIcon fontSize="small" /></InputAdornment>{params.InputProps.startAdornment}</> } }} />} />} />
);

export const PersonaNaturalFields = ({ form, disabled, sexOptions, civilStatusOptions, loadingSex, loadingCivilStatus, sexError, civilStatusError }: Props) => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "160px 170px 190px 160px" }, gap: 1.5, alignItems: "start" }}>
    <Controller name="fechaNacimiento" control={form.control} render={({ field, fieldState }) => <DatePicker value={fechaFormulario(field.value)} onChange={field.onChange} label="Fecha Nac." disabled={disabled} format="dd/MM/yyyy" slotProps={{ textField: { size: "small", fullWidth: true, error: Boolean(fieldState.error), helperText: fieldState.error?.message || "", slotProps: { input: { startAdornment: <InputAdornment position="start"><CalendarMonthIcon fontSize="small" /></InputAdornment> } } } }} />} />
    <SelectField form={form} name="sexo" label="Sexo" options={sexOptions} loading={loadingSex} error={sexError} disabled={disabled} />
    <SelectField form={form} name="estadoCivil" label="Est. Civil" options={civilStatusOptions} loading={loadingCivilStatus} error={civilStatusError} disabled={disabled} />
    <PhoneField form={form} disabled={disabled} />
  </Box>
);
