import ClearIcon from "@mui/icons-material/Clear";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import type { ChangeEvent } from "react";

interface Props {
  searchTerm: string;
  isOfflineMode: boolean;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export const SectorListToolbar = ({
  searchTerm,
  isOfflineMode,
  onSearchChange,
  onClearSearch,
}: Props) => (
  <>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 2 },
        alignItems: { xs: "stretch", sm: "center" },
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Buscar por nombre del sector..."
        value={searchTerm}
        onChange={onSearchChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onClearSearch}>
                  <ClearIcon />
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
    </Box>
    {isOfflineMode && (
      <Alert severity="warning" icon={<CloudOffIcon />}>
        Mostrando datos almacenados localmente. Algunos datos pueden no estar
        actualizados.
      </Alert>
    )}
  </>
);
