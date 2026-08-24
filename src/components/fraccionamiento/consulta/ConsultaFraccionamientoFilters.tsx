import ClearIcon from "@mui/icons-material/Clear";
import FilterIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";

interface Props {
  contribuyente: ContribuyenteListItem | null;
  loading: boolean;
  onOpenSelector: () => void;
  onBuscar: () => void;
  onLimpiar: () => void;
}

export const ConsultaFraccionamientoFilters = ({
  contribuyente,
  loading,
  onOpenSelector,
  onBuscar,
  onLimpiar,
}: Props) => (
  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
      <FilterIcon color="primary" />
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Filtros de Búsqueda
      </Typography>
    </Box>
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onOpenSelector}
          startIcon={<PersonIcon />}
          sx={{ height: 40, textTransform: "none", fontWeight: 600 }}
        >
          Seleccionar Contribuyente
        </Button>
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="Código"
          value={contribuyente?.codigo ?? ""}
          slotProps={{ input: { readOnly: true } }}
          placeholder="---"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Contribuyente"
          value={contribuyente?.contribuyente ?? ""}
          slotProps={{ input: { readOnly: true } }}
          placeholder="Sin seleccionar"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={loading}
          onClick={onBuscar}
          startIcon={<SearchIcon />}
          sx={{ height: 40, fontWeight: 600, bgcolor: "#3b82f6" }}
        >
          Buscar
        </Button>
        <Tooltip title="Limpiar filtros">
          <IconButton
            onClick={onLimpiar}
            sx={{
              height: 40,
              width: 40,
              flexShrink: 0,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  </Paper>
);
