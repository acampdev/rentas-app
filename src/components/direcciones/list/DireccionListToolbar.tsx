import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import type { ChangeEvent } from "react";

interface Props {
  searchTerm: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onNew: () => void;
}

export const DireccionListToolbar = ({
  searchTerm,
  onChange,
  onSearch,
  onNew,
}: Props) => (
  <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%" }}>
    <TextField
      sx={{ flex: "1 1 auto", maxWidth: 400 }}
      variant="outlined"
      placeholder="Buscar por dirección completa, ruta, zona, código..."
      value={searchTerm}
      onChange={onChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: { borderRadius: 2, height: 40 },
        },
      }}
    />
    <Button
      variant="contained"
      startIcon={<SearchIcon />}
      onClick={onSearch}
      disabled={!searchTerm.trim()}
      sx={{ minWidth: 100, height: 40, textTransform: "none", fontWeight: 600 }}
    >
      Buscar
    </Button>
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<AddIcon />}
      onClick={onNew}
      sx={{ minWidth: 100, height: 40, textTransform: "none", fontWeight: 600 }}
    >
      Nuevo
    </Button>
  </Box>
);
