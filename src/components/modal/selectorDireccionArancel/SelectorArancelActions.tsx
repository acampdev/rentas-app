import {
  alpha,
  Button,
  DialogActions,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { ArancelData } from "../../../services/arancelService";
import { formatCurrency } from "../../../utils/formatters";

interface SelectorArancelActionsProps {
  selectedArancel: ArancelData | null;
  useGeneralApi: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SelectorArancelActions = ({
  selectedArancel,
  useGeneralApi,
  onClose,
  onConfirm,
}: SelectorArancelActionsProps) => {
  const theme = useTheme();
  const selectionText = selectedArancel
    ? `Seleccionado: ${selectedArancel.direccionCompleta || `Año ${selectedArancel.anio}`} - ${formatCurrency(selectedArancel.costoArancel)}`
    : useGeneralApi
      ? "Tip: Use la búsqueda general para encontrar aranceles por cualquier criterio"
      : "Tip: Seleccione un año para ver los aranceles disponibles";

  return (
    <DialogActions
      sx={{
        p: 3,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: alpha(theme.palette.grey[50], 0.8),
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {selectionText}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            minWidth: 100,
            height: 36,
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={!selectedArancel}
          sx={{
            bgcolor: "#3b82f6",
            fontWeight: 700,
            height: 36,
            textTransform: "none",
            minWidth: 120,
            "&:hover": { bgcolor: "#2563eb" },
          }}
        >
          Seleccionar
        </Button>
      </Stack>
    </DialogActions>
  );
};
