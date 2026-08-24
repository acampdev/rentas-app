import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button } from "@mui/material";

interface PersonaFormActionsProps {
  submitting: boolean;
  onClear: () => void;
}

export const PersonaFormActions = ({
  submitting,
  onClear,
}: PersonaFormActionsProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 1.5,
      mt: 4,
      pt: 2,
      borderTop: 1,
      borderColor: "divider",
    }}
  >
    <Button
      type="button"
      onClick={onClear}
      startIcon={<ClearIcon />}
      variant="outlined"
      sx={{
        borderColor: "#64748b",
        color: "#334155",
        fontWeight: 700,
        "&:hover": { borderColor: "#334155", bgcolor: "#f1f5f9" },
      }}
    >
      Limpiar
    </Button>
    <Button
      type="submit"
      variant="contained"
      disabled={submitting}
      startIcon={<SaveIcon />}
      sx={{
        bgcolor: "#2563eb",
        color: "#fff",
        fontWeight: 700,
        "&:hover": { bgcolor: "#1d4ed8" },
        "&.Mui-disabled": { bgcolor: "#94a3b8", color: "#fff" },
      }}
    >
      {submitting ? "Guardando..." : "Guardar persona"}
    </Button>
  </Box>
);
