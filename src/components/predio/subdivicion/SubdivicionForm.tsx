import { RestartAlt, Save } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Stack } from "@mui/material";
import SelectorPredio from "../../modal/SelectorPredio";
import {
  NuevoPredioSection,
  PredioMatrizSection,
  SubdivicionOperationSection,
} from "./SubdivicionFields";
import { useSubdivicionForm } from "./useSubdivicionForm";
import { useSubdivicionCatalogs } from "./useSubdivicionCatalogs";
import type { Predio } from "../../../models/Predio";

interface Props {
  initialPredio?: Predio | null;
}

const SubdivicionForm = ({ initialPredio = null }: Props) => {
  const controller = useSubdivicionForm(initialPredio);
  const catalogs = useSubdivicionCatalogs();

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      {controller.feedback && (
        <Alert severity={controller.feedback.severity}>
          {controller.feedback.message}
        </Alert>
      )}
      <PredioMatrizSection
        form={controller.form}
        onChange={controller.update}
        onOpenSelector={() => controller.setSelectorOpen(true)}
      />
      <NuevoPredioSection
        form={controller.form}
        catalogs={catalogs}
        onChange={controller.update}
      />
      <SubdivicionOperationSection form={controller.form} onChange={controller.update} />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<RestartAlt />}
          disabled={controller.isSubmitting}
          onClick={controller.clear}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          startIcon={controller.isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Save />}
          disabled={controller.isSubmitting}
          onClick={() => void controller.submit()}
        >
          Registrar subdivisión
        </Button>
      </Stack>
      <SelectorPredio
        isOpen={controller.selectorOpen}
        onClose={() => controller.setSelectorOpen(false)}
        onSelectPredio={controller.selectPredio}
        title="Seleccionar predio matriz"
      />
    </Box>
  );
};

export default SubdivicionForm;
