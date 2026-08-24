import { CircularProgress, MenuItem, TextField } from "@mui/material";
import type { TimOption } from "./registroTim.types";

interface Props {
  value: number | string;
  options: TimOption[];
  loading: boolean;
  onChange: (value: number) => void;
}

export function TimTributoField({ value, options, loading, onChange }: Props) {
  return (
    <TextField
      select
      label="Tributo"
      value={value}
      onChange={(event) => onChange(Number.parseInt(event.target.value) || 0)}
      sx={{ width: 250 }}
      size="small"
      disabled={loading}
      slotProps={{
        input: {
          endAdornment: loading ? <CircularProgress size={20} /> : undefined,
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label} ({option.value})
        </MenuItem>
      ))}
    </TextField>
  );
}
