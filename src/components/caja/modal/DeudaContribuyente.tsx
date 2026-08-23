import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Box, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DeudaContribuyenteSummary } from "./DeudaContribuyenteSummary";
import { DeudaDialogFooter } from "./DeudaDialogFooter";
import { DeudaPagoControls } from "./DeudaPagoControls";
import { DeudaTabsContent } from "./DeudaTabsContent";
import type { DeudaContribuyenteProps } from "./deudaContribuyente.types";
import { useDeudaContribuyente } from "./useDeudaContribuyente";

const ResponsiveDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    width: "min(1400px, calc(100vw - 24px))",
    maxWidth: "none",
    height: "min(750px, calc(100vh - 24px))",
    margin: 12,
    overflow: "hidden",
  },
}));

const DeudaContribuyente = ({ open, onClose, contribuyenteData = null, onPagoGenerado }: DeudaContribuyenteProps) => {
  const controller = useDeudaContribuyente({ open, contributor: contribuyenteData, onClose, onPayment: onPagoGenerado });
  return (
    <ResponsiveDialog open={open} onClose={controller.close} fullWidth>
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box display="flex" alignItems="center" gap={1}><ReceiptIcon /><Typography variant="h6" fontWeight={700}>Deuda Contribuyente</Typography></Box>
        <IconButton onClick={controller.close} color="inherit" size="small" aria-label="Cerrar"><CloseIcon /></IconButton>
      </Box>
      <DialogContent sx={{ p: { xs: 1, sm: 2 }, flex: 1, minHeight: 0, overflow: "hidden" }}>
        {contribuyenteData ? <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 1, overflow: "hidden" }}>
          <DeudaContribuyenteSummary contributor={contribuyenteData} />
          <DeudaPagoControls tab={controller.tab} amount={controller.amount} selectionType={controller.selectionType} exceedsDebt={controller.exceedsDebt} canPay={controller.canPay} canReset={controller.tab !== 0 && Boolean(controller.amount || controller.selectedRows.length)} onAmountChange={controller.changeAmount} onSelectionTypeChange={controller.changeSelectionType} onPay={controller.pay} onReset={controller.resetPayment} />
          <DeudaTabsContent contributor={contribuyenteData} controller={controller} />
        </Box> : <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}><Typography variant="h6" color="text.secondary">No hay datos de contribuyente disponibles</Typography></Box>}
      </DialogContent>
      <DeudaDialogFooter onClose={controller.close} />
    </ResponsiveDialog>
  );
};

export default DeudaContribuyente;
export type { ConceptoPago, DatosPagoDeudaOrdinaria } from "./deudaContribuyente.types";
export type { DeudaGlobalItem } from "./deuda/DeudaGlobal";
