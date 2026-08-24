import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { PredioFormData } from "../../../hooks/usePredioForm";
import type { OptionFormat } from "../../../hooks/useConstantesOptions";

type AutocompleteName =
  | "estadoPredio"
  | "tipoPredio"
  | "clasificacionPredio"
  | "usoPredio"
  | "condicionPropiedad"
  | "conductor";

interface Props {
  name: AutocompleteName;
  label: string;
  options: OptionFormat[];
  loading: boolean;
  loadError: string | null;
  control: Control<PredioFormData>;
  errors: FieldErrors<PredioFormData>;
  required?: boolean;
  disabled?: boolean;
}

export const PredioAutocomplete = ({
  name,
  label,
  options,
  loading,
  loadError,
  control,
  errors,
  required = true,
  disabled = false,
}: Props) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Autocomplete
        {...field}
        options={options}
        getOptionLabel={(option) => option?.label || ""}
        getOptionKey={(option) =>
          String(option?.value ?? option?.id ?? option?.label ?? "")
        }
        value={
          options.find(
            (option) => String(option.value) === String(field.value),
          ) || null
        }
        onChange={(_, value) => field.onChange(value?.value || "")}
        disabled={loading || disabled}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            error={!!errors[name] || !!loadError}
            helperText={String(errors[name]?.message || "") || loadError || ""}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    )}
  />
);
