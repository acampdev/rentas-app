import {
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { AperturaHeader } from "./aperturaCaja.styles";

export function AperturaCajaHeader({ onClose }: { onClose: () => void }) {
  return (
    <AperturaHeader>
      <Box display="flex" alignItems="center" gap={1}>
        <CreditCardIcon />
        <Typography variant="h6" fontWeight="bold">
          Monto Apertura Caja
        </Typography>
      </Box>
      <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
        <CloseIcon />
      </IconButton>
    </AperturaHeader>
  );
}
