import { Cancel as CancelIcon, Save as SaveIcon } from "@mui/icons-material";
import { Button, DialogActions } from "@mui/material";

interface Props {
  loading: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function AperturaCajaActions({
  loading,
  canSubmit,
  onClose,
  onSubmit,
}: Props) {
  return (
    <DialogActions sx={{ p: 2, gap: 1 }}>
      <Button
        onClick={onClose}
        variant="outlined"
        color="error"
        startIcon={<CancelIcon />}
        disabled={loading}
        sx={{
          borderColor: "#f44336 !important",
          color: "#f44336 !important",
          "&.Mui-disabled": { opacity: "0.65 !important" },
        }}
      >
        Cerrar
      </Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        startIcon={<SaveIcon />}
        disabled={loading || !canSubmit}
        sx={{
          background:
            "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important",
          color: "#fff !important",
          "&.Mui-disabled": {
            background:
              "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important",
            color: "#fff !important",
            opacity: "0.65 !important",
          },
        }}
      >
        Grabar
      </Button>
    </DialogActions>
  );
}
