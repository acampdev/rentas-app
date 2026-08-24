import { Clear, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const BarrioListSearch = ({ value, onChange }: Props) => (
  <TextField
    fullWidth
    size="small"
    placeholder="Buscar por nombre de barrio o sector..."
    value={value}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <Search color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => onChange("")}
              aria-label="Limpiar búsqueda"
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      },
    }}
    sx={{
      maxWidth: 400,
      "& .MuiOutlinedInput-root": { borderRadius: 2, height: 40 },
    }}
  />
);
