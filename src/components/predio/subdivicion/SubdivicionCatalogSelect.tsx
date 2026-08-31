import { CircularProgress, MenuItem, TextField } from "@mui/material";
import type { SubdivicionField } from "./subdivicion.types";
import type { SubdivicionCatalog } from "./useSubdivicionCatalogs";

interface Props {
  field: SubdivicionField;
  label: string;
  value: string;
  catalog: SubdivicionCatalog;
  onChange: (field: SubdivicionField, value: string) => void;
  disabled?: boolean;
}

export const SubdivicionCatalogSelect = ({
  field,
  label,
  value,
  catalog,
  onChange,
  disabled = false,
}: Props) => (
  <TextField
    select
    fullWidth
    size="small"
    label={label}
    value={value}
    disabled={catalog.loading || disabled}
    error={Boolean(catalog.error)}
    helperText={catalog.error || ""}
    onChange={(event) => onChange(field, event.target.value)}
    slotProps={{
      select: {
        IconComponent: catalog.loading
          ? () => <CircularProgress size={18} sx={{ mr: 1 }} />
          : undefined,
      },
    }}
  >
    {catalog.options.map((option) => (
      <MenuItem key={String(option.value)} value={String(option.value)}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);
