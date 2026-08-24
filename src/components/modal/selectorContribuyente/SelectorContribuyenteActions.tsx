import { Button, DialogActions, Typography, alpha } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";

interface Props {
  total: number;
  seleccionado: ContribuyenteListItem | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const SelectorContribuyenteActions = ({
  total,
  seleccionado,
  onConfirm,
  onClose,
}: Props) => (
  <DialogActions
    sx={{
      p: 2,
      px: 3,
      borderTop: 1,
      borderColor: "divider",
      gap: 1.5,
      flexShrink: 0,
    }}
  >
    <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>
      Total registros: {total}
    </Typography>
    {seleccionado && (
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "primary.main", mr: 2 }}
      >
        Seleccionado: {seleccionado.contribuyente}
      </Typography>
    )}
    <Button
      onClick={onConfirm}
      variant="contained"
      disabled={!seleccionado}
      startIcon={<CheckCircle />}
      sx={{
        borderRadius: 2,
        bgcolor: "#3b82f6 !important",
        color: "white !important",
        fontWeight: "bold",
        "&.Mui-disabled": {
          bgcolor: `${alpha("#3b82f6", 0.5)} !important`,
          color: "rgba(255, 255, 255, 0.7) !important",
        },
      }}
    >
      Seleccionar
    </Button>
    <Button
      onClick={onClose}
      variant="outlined"
      color="inherit"
      sx={{ borderRadius: 2 }}
    >
      Cancelar
    </Button>
  </DialogActions>
);
