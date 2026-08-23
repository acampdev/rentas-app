import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GavelIcon from "@mui/icons-material/Gavel";
import PaymentIcon from "@mui/icons-material/Payment";
import PublicIcon from "@mui/icons-material/Public";
import { Alert, Box, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import type { ContribuyenteOption } from "../../../models/Caja";
import DeudaGlobal from "./deuda/DeudaGlobal";
import DeudaOrdinariaComponent from "./deuda/DeudaOrdinaria";
import DeudaFraccionada from "./deuda/DeudaFraccionada";
import type { useDeudaContribuyente } from "./useDeudaContribuyente";

interface Props {
  contributor: ContribuyenteOption;
  controller: ReturnType<typeof useDeudaContribuyente>;
}

export const DeudaTabsContent = ({ contributor, controller }: Props) => {
  const activeYearTotal = controller.account.details.find((item) => item.year === controller.ordinaryYear)?.details.filter((item) => item.saldoNeto > 0).reduce((sum, item) => sum + item.saldoNeto, 0) || 0;
  return (
    <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Tabs value={controller.tab} onChange={(_, value) => controller.changeTab(value)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
        <Tab label="Deuda Global" icon={<PublicIcon />} /><Tab label="Deuda Ordinaria" icon={<AccountBalanceIcon />} /><Tab label="Deuda Fraccionamiento" icon={<PaymentIcon />} /><Tab label="Deuda Coactiva" icon={<GavelIcon />} />
      </Tabs>
      <Box sx={{ flex: 1, minHeight: 0, p: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {controller.account.loading ? <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}><Box textAlign="center"><CircularProgress /><Typography color="text.secondary" mt={1}>Cargando estado de cuenta...</Typography></Box></Box>
          : controller.account.error ? <Alert severity="error">{controller.account.error}</Alert>
          : <>
            {controller.tab === 0 && <DeudaGlobal allDetails={controller.account.details} />}
            {controller.tab === 1 && <DeudaOrdinariaComponent allDetails={controller.account.details} tipoMonto={controller.selectionType} selectedRows={controller.selectedRows} onRowSelection={controller.selectRow} getCellColor={controller.cellColor} calcularDeudaTotal={() => activeYearTotal} listAños={controller.account.years} selectedAño={controller.ordinaryYear} onAñoClick={controller.selectYear} onCellClick={controller.selectCell} />}
            {controller.tab === 2 && <DeudaFraccionada codContribuyente={contributor.codigo || contributor.codigoPredio || ""} allDetails={controller.account.details} cuotasFraccionamiento={controller.installments} setCuotasFraccionamiento={controller.setInstallments} selectedAño={controller.fractionYear} setSelectedAño={controller.setFractionYear} selectedResolucion={controller.resolution} setSelectedResolucion={controller.setResolution} selectedResolucionCode={controller.resolutionCode} setSelectedResolucionCode={controller.setResolutionCode} montoFraccionado={controller.fractionAmount} setMontoFraccionado={controller.setFractionAmount} setMontoAPagar={controller.changeAmount} setTributosFraccionados={controller.setFractionTributes} getCellColorFraccionamiento={controller.fractionCellColor} />}
            {controller.tab === 3 && <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}><Typography fontWeight={700}>Módulo no disponible</Typography>La deuda coactiva todavía no está conectada a una API municipal. No se muestran expedientes ni importes simulados.</Alert>}
          </>}
      </Box>
    </Paper>
  );
};
