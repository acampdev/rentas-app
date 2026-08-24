import { Clear, Search } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import type { ConsultaFiltersState } from "./contribuyenteConsulta.types";

interface Option {
  value: string | number;
  label: string;
}
interface Props {
  filters: ConsultaFiltersState;
  types: Option[];
  onChange: (field: keyof ConsultaFiltersState, value: string) => void;
  onToggle: (field: "exonerado" | "pensionista", value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const BooleanFilter = ({
  label,
  field,
  value,
  onToggle,
}: {
  label: string;
  field: "exonerado" | "pensionista";
  value: string;
  onToggle: Props["onToggle"];
}) => (
  <Box
    sx={{
      bgcolor: "background.paper",
      px: 2,
      py: 0.5,
      borderRadius: 1.5,
      border: 1,
      borderColor: "divider",
      display: "flex",
      alignItems: "center",
    }}
  >
    <Typography
      variant="body2"
      fontWeight={700}
      color="text.secondary"
      sx={{ mr: 1 }}
    >
      {label}:
    </Typography>
    <RadioGroup
      row
      value={value}
      onChange={(event) => onToggle(field, event.target.value)}
    >
      <FormControlLabel value="1" control={<Radio size="small" />} label="Sí" />
      <FormControlLabel value="0" control={<Radio size="small" />} label="No" />
    </RadioGroup>
  </Box>
);

export const ContribuyenteConsultaFilters = ({
  filters,
  types,
  onChange,
  onToggle,
  onSearch,
  onClear,
}: Props) => {
  const theme = useTheme();
  const enterSearch = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") onSearch();
  };
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: alpha(theme.palette.grey[100], 0.3),
        p: 2.5,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}
      >
        <TextField
          label="Nombre o Documento"
          placeholder="Ej: Marcelo ó 72252468"
          value={filters.texto}
          onChange={(event) => onChange("texto", event.target.value)}
          onKeyDown={enterSearch}
          size="small"
          sx={{ bgcolor: "background.paper", minWidth: 240, flexGrow: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Cód. Contribuyente"
          placeholder="Ej: 21"
          value={filters.codigo}
          onChange={(event) =>
            /^\d*$/.test(event.target.value) &&
            onChange("codigo", event.target.value)
          }
          onKeyDown={enterSearch}
          size="small"
          sx={{ bgcolor: "background.paper", width: 160 }}
        />
        <FormControl
          size="small"
          sx={{ minWidth: 180, bgcolor: "background.paper" }}
        >
          <InputLabel>Tipo Contribuyente</InputLabel>
          <Select
            value={filters.tipo}
            label="Tipo Contribuyente"
            onChange={(event) => onChange("tipo", event.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {types.map((option) => (
              <MenuItem key={option.value} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}
      >
        <BooleanFilter
          label="Exonerado"
          field="exonerado"
          value={filters.exonerado}
          onToggle={onToggle}
        />
        <BooleanFilter
          label="Pensionista"
          field="pensionista"
          value={filters.pensionista}
          onToggle={onToggle}
        />
        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
          <Button
            variant="contained"
            onClick={onSearch}
            startIcon={<Search />}
            sx={{ height: 38, minWidth: 110, textTransform: "none" }}
          >
            Buscar
          </Button>
          <Button
            variant="outlined"
            onClick={onClear}
            startIcon={<Clear />}
            sx={{ height: 38, minWidth: 100, textTransform: "none" }}
          >
            Limpiar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
