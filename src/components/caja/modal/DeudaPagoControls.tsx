import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, Button, FormControl, FormControlLabel, Paper, Radio, RadioGroup, TextField, Tooltip } from "@mui/material";
import type { TipoSeleccionMonto } from "./deudaContribuyente.types";

interface Props {
  tab: number;
  amount: string;
  selectionType: TipoSeleccionMonto;
  exceedsDebt: boolean;
  canPay: boolean;
  canReset: boolean;
  onAmountChange: (value: string) => void;
  onSelectionTypeChange: (value: TipoSeleccionMonto) => void;
  onPay: () => void;
  onReset: () => void;
}

export const DeudaPagoControls = ({ tab, amount, selectionType, exceedsDebt, canPay, canReset, onAmountChange, onSelectionTypeChange, onPay, onReset }: Props) => (
  <Paper variant="outlined" sx={{ p: 1.25, opacity: tab === 0 ? 0.55 : 1 }}>
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
      <TextField label="Monto a Pagar" value={amount} onChange={(event) => onAmountChange(event.target.value)} size="small" type="number" placeholder="0.00" disabled={tab === 0 || tab === 2 || (tab === 1 && selectionType === "seleccionar")} sx={{ width: 150 }} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
      <FormControl disabled={tab === 0 || tab === 2}><RadioGroup row value={selectionType} onChange={(_, value) => onSelectionTypeChange(value as TipoSeleccionMonto)}><FormControlLabel value="repartir" control={<Radio size="small" />} label="Repartir Monto" /><FormControlLabel value="seleccionar" control={<Radio size="small" />} label="Seleccionar Monto" /></RadioGroup></FormControl>
      <Tooltip title="Pagar deuda (F4)"><span><Button variant="contained" onClick={onPay} disabled={!canPay} sx={{ height: 40, px: 3 }}>Pagar</Button></span></Tooltip>
      <Tooltip title="Limpiar campos (F2)"><span><Button variant="outlined" onClick={onReset} disabled={!canReset} sx={{ height: 40, px: 3 }}>Nuevo</Button></span></Tooltip>
    </Box>
    {exceedsDebt && <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 1 }}>El monto ingresado excede la deuda total seleccionada.</Alert>}
  </Paper>
);
