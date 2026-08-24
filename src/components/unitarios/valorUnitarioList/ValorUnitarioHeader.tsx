import { Search } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

interface Props {
  year?: number | null;
  loading: boolean;
  onYearChange?: (year: number) => void;
}

export function ValorUnitarioHeader({ year, loading, onYearChange }: Props) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        bgcolor: alpha(theme.palette.grey[50], 0.5),
        borderRadius: 1.5,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 800, flexGrow: 1, color: "primary.dark" }}
      >
        LISTADO DE VALORES UNITARIOS
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          size="small"
          label="Año"
          type="number"
          value={year || ""}
          onChange={(event) => onYearChange?.(Number(event.target.value))}
          sx={{ width: 120 }}
        />
        <Button
          variant="contained"
          startIcon={<Search />}
          disabled={loading}
          sx={{ bgcolor: "#3b82f6", color: "white", fontWeight: 700 }}
        >
          Buscar
        </Button>
      </Box>
    </Box>
  );
}
