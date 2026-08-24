import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

interface UitListFiltersProps {
  searchTerm: string;
  isSearching: boolean;
  hasSearched: boolean;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const controlStyles = {
  minWidth: 100,
  height: 33,
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 2,
  px: 2,
};

export const UitListFilters = ({
  searchTerm,
  isSearching,
  hasSearched,
  onSearchTermChange,
  onSearch,
  onClear,
  onKeyDown,
}: UitListFiltersProps) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ minHeight: 33 }}>
    <TextField
      size="small"
      placeholder="Ingrese año"
      value={searchTerm}
      onChange={(event) => onSearchTermChange(event.target.value)}
      onKeyDown={onKeyDown}
      type="number"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={onClear}
                edge="end"
                aria-label="Limpiar búsqueda"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        width: 180,
        "& .MuiOutlinedInput-root": { height: 33, borderRadius: 2 },
        "& input[type=number]": { MozAppearance: "textfield" },
        "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
          { WebkitAppearance: "none", m: 0 },
      }}
    />
    <Button
      variant="contained"
      startIcon={
        isSearching ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <SearchIcon />
        )
      }
      onClick={onSearch}
      disabled={isSearching || !searchTerm.trim()}
      sx={{
        ...controlStyles,
        bgcolor: "#10b981",
        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
        "&:hover": { bgcolor: "#059669" },
      }}
    >
      {isSearching ? "Buscando..." : "Buscar"}
    </Button>
    {hasSearched && (
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={onClear}
        sx={controlStyles}
      >
        Ver Todos
      </Button>
    )}
  </Stack>
);
