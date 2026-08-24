import { Person, Print, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  alpha,
  useTheme,
} from "@mui/material";
import type { HRSelectedContribuyente } from "./useHRView";

interface Props {
  contribuyente: HRSelectedContribuyente | null;
  loading: boolean;
  canPrint: boolean;
  onOpenSelector: () => void;
  onSearch: () => void;
  onPrint: () => void;
}

export const HRFilters = ({
  contribuyente,
  loading,
  canPrint,
  onOpenSelector,
  onSearch,
  onPrint,
}: Props) => {
  const theme = useTheme();
  const readonlySx = {
    m: 0,
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
        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
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
          startIcon={<Person />}
          onClick={onOpenSelector}
          sx={{
            height: 40,
            borderRadius: 2,
            fontWeight: 500,
            textTransform: "none",
            flex: { xs: "1 1 100%", sm: "0 0 180px" },
            minWidth: { xs: "100%", sm: 180 },
          }}
        >
          Seleccionar Contribuyente
        </Button>
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "0 0 90px" },
            minWidth: { xs: "100%", sm: 90 },
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Código"
            value={contribuyente?.codigo || ""}
            InputProps={{ readOnly: true }}
            placeholder="---"
            sx={readonlySx}
          />
        </Box>
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 200px" },
            minWidth: { xs: "100%", sm: 200 },
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Nombre del contribuyente"
            value={
              contribuyente?.contribuyente ||
              contribuyente?.nombreCompleto ||
              ""
            }
            InputProps={{ readOnly: true }}
            placeholder="Seleccione un contribuyente..."
            sx={readonlySx}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flex: { xs: "1 1 100%", sm: "0 0 220px" },
            minWidth: { xs: "100%", sm: 220 },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Search />
              )
            }
            onClick={onSearch}
            disabled={!contribuyente || loading}
            sx={actionSx("#3b82f6", "#2563eb")}
          >
            {loading ? "..." : "Buscar"}
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Print />}
            disabled={!canPrint}
            onClick={onPrint}
            sx={actionSx("#10b981", "#059669")}
          >
            Imprimir
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const actionSx = (color: string, hover: string) => ({
  height: 40,
  bgcolor: `${color} !important`,
  color: "white !important",
  fontWeight: 600,
  borderRadius: 2,
  "&:hover": { bgcolor: `${hover} !important` },
  "&.Mui-disabled": {
    bgcolor: `${alpha(color, 0.5)} !important`,
    color: "rgba(255,255,255,.7) !important",
  },
});
