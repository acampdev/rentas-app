import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { SelectorContribuyente } from "../../";
import SelectorPredio from "../../modal/SelectorPredio";
import { AsignacionDataCard } from "./AsignacionDataCard";
import { AsignacionSelectionCard } from "./AsignacionSelectionCard";
import { ConfirmarDesasignacionDialog } from "./ConfirmarDesasignacionDialog";
import type { AsignacionPredioProps } from "./asignacionPredio.types";
import { useAsignacionPredioForm } from "./useAsignacionPredioForm";

export type {
  AsignacionPredioProps,
  DatosEdicionAsignacion,
} from "./asignacionPredio.types";

const AsignacionPredio = (props: AsignacionPredioProps) => {
  const controller = useAsignacionPredioForm(props);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        <AsignacionSelectionCard
          form={controller.form}
          disabled={controller.isDesasignarMode}
          onContributor={() => controller.setContributorModal(true)}
          onProperty={() => controller.setPropertyModal(true)}
        />
        <AsignacionDataCard
          form={controller.form}
          modes={controller.modes}
          loading={controller.loading}
          edit={controller.isEditMode}
          unassign={controller.isDesasignarMode}
          feedback={controller.feedback}
          onUpdate={controller.update}
          onSubmit={() => void controller.submit()}
          onClear={controller.clear}
        />
      </Box>
      <SelectorContribuyente
        isOpen={controller.contributorModal}
        onClose={() => controller.setContributorModal(false)}
        onSelectContribuyente={controller.selectContributor}
        title="Seleccionar Contribuyente"
      />
      <SelectorPredio
        isOpen={controller.propertyModal}
        onClose={() => controller.setPropertyModal(false)}
        onSelectPredio={controller.selectProperty}
        title="Seleccionar Predio"
      />
      <ConfirmarDesasignacionDialog
        data={controller.pendingUnassignment}
        loading={controller.loading}
        onClose={() => controller.setPendingUnassignment(null)}
        onConfirm={() => void controller.confirmUnassignment()}
      />
    </LocalizationProvider>
  );
};

export default AsignacionPredio;
