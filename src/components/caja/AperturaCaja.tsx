import { DialogContent, Divider } from "@mui/material";
import { AperturaCajaActions } from "./aperturaCaja/AperturaCajaActions";
import { AperturaCajaForm } from "./aperturaCaja/AperturaCajaForm";
import { AperturaCajaHeader } from "./aperturaCaja/AperturaCajaHeader";
import { StyledAperturaDialog } from "./aperturaCaja/aperturaCaja.styles";
import type { AperturaCajaProps } from "./aperturaCaja/aperturaCaja.types";
import { useAperturaCajaForm } from "./aperturaCaja/useAperturaCajaForm";

export type { AperturaCajaData } from "./aperturaCaja/aperturaCaja.types";

const AperturaCaja = ({
  open,
  onClose,
  onSave,
  loading = false,
}: AperturaCajaProps) => {
  const controller = useAperturaCajaForm(open, onSave, onClose);
  return (
    <StyledAperturaDialog
      open={open}
      onClose={controller.close}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
    >
      <AperturaCajaHeader onClose={controller.close} />
      <DialogContent sx={{ p: 3 }}>
        <AperturaCajaForm
          form={controller.form}
          cajeros={controller.cajeros}
          selectedUser={controller.selectedUser}
          loadingUsers={controller.loadingUsuarios}
          loading={loading}
          confirmed={controller.confirmed}
          errors={controller.errors}
          onChange={controller.change}
          onAmountChange={controller.changeAmount}
          onConfirm={controller.confirmAmount}
        />
      </DialogContent>
      <Divider />
      <AperturaCajaActions
        loading={loading}
        canSubmit={controller.form.montoInicial !== "" && controller.confirmed}
        onClose={controller.close}
        onSubmit={controller.submit}
      />
    </StyledAperturaDialog>
  );
};

export default AperturaCaja;
