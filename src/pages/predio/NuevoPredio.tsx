import { Box, Container } from "@mui/material";
import { memo } from "react";
import { useParams } from "react-router-dom";
import PredioForm from "../../components/predio/PredioForm";
import { usePredios } from "../../hooks/usePredioAPI";
import type { PredioFormSubmitData } from "../../hooks/usePredioForm";
import MainLayout from "../../layout/MainLayout";
import { logger } from "../../utils/logger";
import { buildCreateInput } from "./nuevoPredio/nuevoPredio.adapters";
import { NuevoPredioHeader } from "./nuevoPredio/NuevoPredioHeader";
import { NuevoPredioLoading } from "./nuevoPredio/NuevoPredioLoading";
import { useNuevoPredio } from "./nuevoPredio/useNuevoPredio";

const NuevoPredio = memo(() => {
  const { anio, codPredio } = useParams<{
    anio?: string;
    codPredio?: string;
  }>();
  const { editMode, existingPredio, loadingPredio } = useNuevoPredio(
    anio,
    codPredio,
  );
  const { crearPredio, actualizarPredio, isCreating, isUpdating } = usePredios({
    enabled: false,
  });

  const handleSubmit = async (data: PredioFormSubmitData) => {
    const payload = buildCreateInput(data);
    const routeCode = String(codPredio || "").trim();
    const routeYear = String(anio || payload.anio || "").trim();
    const editPredioCode =
      existingPredio?.codPredio?.trim() ||
      (routeCode.startsWith(routeYear) ? routeCode : `${routeYear}${routeCode}`);
    const saved = editMode
      ? await actualizarPredio({
          ...payload,
          codPredio: editPredioCode,
          anio: existingPredio?.anio ?? payload.anio,
        } as Parameters<typeof actualizarPredio>[0])
      : await crearPredio(payload as Parameters<typeof crearPredio>[0]);
    if (saved) {
      logger.log(
        `✅ [NuevoPredio] Predio ${editMode ? "actualizado" : "creado"} exitosamente:`,
        saved,
      );
    }
    return saved;
  };

  if (loadingPredio) return <NuevoPredioLoading />;

  return (
    <MainLayout title={editMode ? "Edición de Predio" : "Registro de Predio"}>
      <Container maxWidth="xl">
        <Box sx={{ py: 2 }}>
          <NuevoPredioHeader editMode={editMode} />
          <PredioForm
            key={editMode ? `edit-${anio}-${codPredio}` : "new"}
            onSubmit={handleSubmit}
            loading={isCreating || isUpdating}
            predioExistente={editMode ? existingPredio : undefined}
          />
        </Box>
      </Container>
    </MainLayout>
  );
});

NuevoPredio.displayName = "NuevoPredio";

export default NuevoPredio;
