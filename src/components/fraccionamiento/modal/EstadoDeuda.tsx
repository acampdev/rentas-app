import {
  Close as CloseIcon,
  FactCheck as FactCheckIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
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
import { EstadoDeudaDocument } from "./estadoDeuda/EstadoDeudaDocument";
import { EstadoDeudaPrintStyles } from "./estadoDeuda/EstadoDeudaPrintStyles";
import type { EstadoDeudaProps } from "./estadoDeuda/estadoDeuda.types";
import { useEstadoDeuda } from "./estadoDeuda/useEstadoDeuda";

const EstadoDeuda = ({
  open,
  onClose,
  fraccionamiento,
  contribuyente,
}: EstadoDeudaProps) => {
  const report = useEstadoDeuda({ open, fraccionamiento, contribuyente });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "96vh" } }}
    >
      <EstadoDeudaPrintStyles />
      <DialogTitle
        className="no-print"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FactCheckIcon color="primary" />
          <Typography variant="h6" component="span">
            Verificación de Estado de Deuda
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "grey.200", py: 3 }}>
        {report.loading ? (
          <Box className="no-print" sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando estado de deuda...</Typography>
          </Box>
        ) : report.error ? (
          <Alert className="no-print" severity="error">
            {report.error}
          </Alert>
        ) : (
          <EstadoDeudaDocument
            rows={report.rows}
            totals={report.totals}
            identity={report.identity}
          />
        )}
      </DialogContent>
      <DialogActions className="no-print" sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          disabled={report.loading || Boolean(report.error)}
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EstadoDeuda;
