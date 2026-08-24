import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { CreateAsignacionAPIDTO } from "../../../services/asignacionService";

interface Props {
  data: CreateAsignacionAPIDTO | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const ConfirmarDesasignacionDialog = ({
  data,
  loading,
  onClose,
  onConfirm,
}: Props) => (
  <Dialog open={Boolean(data)} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Confirmar desasignación</DialogTitle>
    <DialogContent>
      <Typography>
        ¿Desea desasignar el predio <strong>{data?.codPredio.trim()}</strong>{" "}
        del contribuyente <strong>{data?.codContribuyente}</strong>?
      </Typography>
      <Alert severity="warning" sx={{ mt: 2 }}>
        Esta operación cambiará la relación activa entre el contribuyente y el
        predio.
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="error"
        disabled={loading}
      >
        Confirmar desasignación
      </Button>
    </DialogActions>
  </Dialog>
);
