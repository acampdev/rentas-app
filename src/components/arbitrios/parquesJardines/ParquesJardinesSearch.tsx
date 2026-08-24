import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import type { ParquesMatrix } from "./parquesJardines.types";
import { ParquesJardinesMatrix } from "./ParquesJardinesMatrix";

interface Props {
  year: number;
  setYear: (year: number) => void;
  visible: boolean;
  loading: boolean;
  matrix: ParquesMatrix;
  onSearch: () => void;
  onRateClick: (
    routeCode: string | number,
    locationCode: string | number,
    rate: number,
  ) => void;
}

export function ParquesJardinesSearch({
  year,
  setYear,
  visible,
  loading,
  matrix,
  onSearch,
  onRateClick,
}: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        gutterBottom
        display="flex"
        alignItems="center"
        gap={1}
      >
        <DashboardIcon color="primary" fontSize="small" /> Consultar Tasas
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 4 }}>
        <TextField
          label="Filtrar por Año"
          type="number"
          size="small"
          value={year}
          onChange={(event) => setYear(Number.parseInt(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSearch();
          }}
          sx={{ width: 150 }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          disabled={loading}
          sx={{
            bgcolor: "#3b82f6",
            color: "white",
            fontWeight: 700,
            height: 40,
            textTransform: "none",
          }}
        >
          Buscar
        </Button>
        {loading && <CircularProgress size={24} />}
      </Box>
      <ParquesJardinesMatrix
        visible={visible}
        year={year}
        loading={loading}
        matrix={matrix}
        onRateClick={onRateClick}
      />
    </Box>
  );
}
