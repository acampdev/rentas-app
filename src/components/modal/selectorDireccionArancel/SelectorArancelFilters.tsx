import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { parseOptionalPositiveInteger } from "./selectorDireccionArancel.adapters";

interface SelectorArancelFiltersProps {
  useGeneralApi: boolean;
  parametroBusqueda: string;
  anioSeleccionado: number | null;
  codDireccionBusqueda: number | null;
  loading: boolean;
  hasResults: boolean;
  onParametroChange: (value: string) => void;
  onAnioChange: (value: number | null) => void;
  onCodDireccionChange: (value: number | null) => void;
  onResetPage: () => void;
  onSearch: () => void;
}

const NumberField = ({
  label,
  value,
  onChange,
  min,
  max,
  width,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min: number;
  max?: number;
  width: number;
}) => (
  <Box
    sx={{
      flex: { xs: "1 1 100%", sm: `0 0 ${width}px` },
      minWidth: { xs: "100%", sm: width },
    }}
  >
    <TextField
      fullWidth
      required
      size="small"
      label={label}
      type="number"
      value={value ?? ""}
      onChange={(event) =>
        onChange(parseOptionalPositiveInteger(event.target.value))
      }
      slotProps={{ htmlInput: { min, max } }}
    />
  </Box>
);

export const SelectorArancelFilters = ({
  useGeneralApi,
  parametroBusqueda,
  anioSeleccionado,
  codDireccionBusqueda,
  loading,
  hasResults,
  onParametroChange,
  onAnioChange,
  onCodDireccionChange,
  onResetPage,
  onSearch,
}: SelectorArancelFiltersProps) => {
  const searchDisabled =
    loading || (!useGeneralApi && (!anioSeleccionado || !codDireccionBusqueda));

  return (
    <Stack spacing={3} mb={2}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {useGeneralApi && (
          <Box
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 calc(60% - 8px)" },
              minWidth: { xs: "100%", sm: 250 },
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Buscar Aranceles"
              value={parametroBusqueda}
              onChange={(event) => {
                onParametroChange(event.target.value);
                onResetPage();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
              placeholder="Buscar por sector, barrio, calle..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        )}
        <NumberField
          label="Año"
          value={anioSeleccionado}
          onChange={(value) => {
            onAnioChange(value);
            onResetPage();
          }}
          min={1900}
          max={new Date().getFullYear()}
          width={120}
        />
        {!useGeneralApi && (
          <NumberField
            label="Código Dirección"
            value={codDireccionBusqueda}
            onChange={(value) => {
              onCodDireccionChange(value);
              onResetPage();
            }}
            min={1}
            width={150}
          />
        )}
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <SearchIcon />}
          onClick={onSearch}
          disabled={searchDisabled}
          sx={{
            height: 40,
            minWidth: 100,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Buscar
        </Button>
      </Box>

      {useGeneralApi && !hasResults && !loading && (
        <Alert severity="info" icon={<SearchIcon />} sx={{ borderRadius: 2 }}>
          Use la búsqueda general para encontrar aranceles por sector, barrio,
          calle o deje vacío para ver todos.
        </Alert>
      )}
      {!useGeneralApi && (!anioSeleccionado || !codDireccionBusqueda) && (
        <Alert severity="info" icon={<SearchIcon />} sx={{ borderRadius: 2 }}>
          Ingrese el año y código de dirección para buscar aranceles
          específicos.
        </Alert>
      )}
    </Stack>
  );
};
