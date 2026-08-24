import { Close, Description, Print } from "@mui/icons-material";
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
import type React from "react";
import {
  ConvenioDeudaDocument,
  convenioPrintCss,
} from "./ConvenioDeudaDocument";
import type { ConvenioDeudaProps } from "./convenioDeuda.types";
import { useConvenioDeuda } from "./useConvenioDeuda";

const ConvenioDeuda: React.FC<ConvenioDeudaProps> = (props) => {
  const { loading, error, data } = useConvenioDeuda(props);
  const printable = data.cuotaInicial > 0 || data.cronograma.length > 0;
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="xl"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "96vh" } }}
    >
      <style>{convenioPrintCss}</style>
      <DialogTitle
        className="no-print"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Description color="primary" />
          <Typography variant="h6" component="span">
            Convenio de Deuda por Fraccionamiento
          </Typography>
        </Box>
        <IconButton onClick={props.onClose} aria-label="Cerrar">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        className="no-scrollbar"
        sx={{ bgcolor: "grey.200", py: 3 }}
      >
        {loading ? (
          <Box className="no-print" sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando cronograma...</Typography>
          </Box>
        ) : error ? (
          <Alert className="no-print" severity="error">
            {error}
          </Alert>
        ) : (
          <ConvenioDeudaDocument
            data={data}
            fraccionamiento={props.fraccionamiento}
          />
        )}
      </DialogContent>
      <DialogActions className="no-print" sx={{ px: 3, py: 2 }}>
        <Button onClick={props.onClose} color="inherit">
          Cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={() => window.print()}
          disabled={loading || Boolean(error) || !printable}
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvenioDeuda;
