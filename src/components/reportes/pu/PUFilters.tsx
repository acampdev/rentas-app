import {
  Person as PersonIcon,
  Print as PrintIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";
import type { PUContributor } from "./pu.types";

interface Props {
  contributor: PUContributor | null;
  loading: boolean;
  canPrint: boolean;
  onSelectContributor: () => void;
  onSearch: () => void;
  onPrint: () => void;
}

export function PUFilters({
  contributor,
  loading,
  canPrint,
  onSelectContributor,
  onSearch,
  onPrint,
}: Props) {
  const theme = useTheme();
  const readonlySx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      height: 40,
      bgcolor: alpha(theme.palette.grey[100], 0.5),
    },
  };
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: alpha(theme.palette.grey[100], 0.5),
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          gap: 2,
          alignItems: { xs: "stretch", sm: "flex-end" },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<PersonIcon />}
          onClick={onSelectContributor}
          sx={{
            height: 40,
            flex: { xs: "1 1 100%", sm: "0 0 180px" },
            textTransform: "none",
          }}
        >
          Seleccionar Contribuyente
        </Button>
        <TextField
          size="small"
          label="Código"
          value={contributor?.codigo || ""}
          slotProps={{ input: { readOnly: true } }}
          sx={{ width: { xs: "100%", sm: 90 }, ...readonlySx }}
        />
        <TextField
          size="small"
          label="Nombre del contribuyente"
          value={
            contributor?.contribuyente || contributor?.nombreCompleto || ""
          }
          slotProps={{ input: { readOnly: true } }}
          sx={{ flex: "1 1 200px", ...readonlySx }}
        />
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}
      >
        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SearchIcon />
            )
          }
          onClick={onSearch}
          disabled={!contributor || loading}
          sx={{
            width: 150,
            bgcolor: "#3b82f6 !important",
            color: "white !important",
          }}
        >
          {loading ? "..." : "Buscar"}
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          disabled={!canPrint}
          onClick={onPrint}
          sx={{
            width: 150,
            bgcolor: "#10b981 !important",
            color: "white !important",
          }}
        >
          Imprimir
        </Button>
      </Box>
    </Paper>
  );
}
