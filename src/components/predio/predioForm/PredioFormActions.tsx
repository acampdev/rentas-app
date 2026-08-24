import { Save } from "@mui/icons-material";
import { Box, Button, CircularProgress, alpha, useTheme } from "@mui/material";

interface Props {
  editing: boolean;
  loading: boolean;
  onReset: () => void;
}

export const PredioFormActions = ({ editing, loading, onReset }: Props) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      <Button
        variant="outlined"
        onClick={onReset}
        disabled={loading}
        sx={{
          height: 45,
          minWidth: 120,
          textTransform: "none",
          borderRadius: 1.5,
          fontWeight: 600,
          borderColor: theme.palette.divider,
          color: "text.primary",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        Nuevo
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={16} color="inherit" /> : <Save />
        }
        sx={{
          height: 45,
          minWidth: 150,
          bgcolor: "#10b981 !important",
          color: "white !important",
          fontWeight: 700,
          textTransform: "none",
          borderRadius: 1.5,
          boxShadow: "0 2px 4px rgba(16,185,129,.2)",
          "&:hover": {
            bgcolor: "#059669 !important",
            boxShadow: "0 4px 6px rgba(16,185,129,.3)",
          },
          "&.Mui-disabled": {
            bgcolor: `${alpha("#10b981", 0.5)} !important`,
            color: "rgba(255,255,255,.7)",
          },
        }}
      >
        {editing ? "Guardar" : "Registrar"}
      </Button>
    </Box>
  );
};
