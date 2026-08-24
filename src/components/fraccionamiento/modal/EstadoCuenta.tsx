import { Close, Print, ReceiptLong } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { EstadoCuentaDocument } from "./estadoCuenta/EstadoCuentaDocument";
import type { EstadoCuentaProps } from "./estadoCuenta/estadoCuenta.types";
import { ESTADO_CUENTA_PRINT_CSS } from "./estadoCuenta/estadoCuenta.utils";
import { useEstadoCuenta } from "./estadoCuenta/useEstadoCuenta";

export default function EstadoCuenta({
  open,
  onClose,
  fraccionamiento,
  contribuyente,
}: EstadoCuentaProps) {
  const view = useEstadoCuenta({ open, fraccionamiento, contribuyente });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "96vh" } }}
    >
      <style>{ESTADO_CUENTA_PRINT_CSS}</style>
      <DialogTitle
        className="no-print"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReceiptLong color="primary" />
          <Typography variant="h6" component="span">
            Estado de Cuenta Fraccionada
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "grey.200", py: 3 }}>
        {view.loading ? (
          <Box className="no-print" sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando estado de cuenta...</Typography>
          </Box>
        ) : view.error ? (
          <Alert className="no-print" severity="error">
            {view.error}
          </Alert>
        ) : (
          <EstadoCuentaDocument
            data={view.data}
            fraccionamiento={fraccionamiento}
          />
        )}
      </DialogContent>
      <DialogActions className="no-print" sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={() => window.print()}
          disabled={view.loading || Boolean(view.error)}
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
