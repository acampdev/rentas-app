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
  const { crearPredio, loading } = usePredios({ enabled: false });

  const handleSubmit = async (data: PredioFormSubmitData): Promise<void> => {
    const payload = buildCreateInput(data);
    const created = await crearPredio(
      payload as Parameters<typeof crearPredio>[0],
    );
    if (created) {
      logger.log("✅ [NuevoPredio] Predio creado exitosamente:", created);
    }
  };

  if (loadingPredio) return <NuevoPredioLoading />;

  return (
    <MainLayout title={editMode ? "Edición de Predio" : "Registro de Predio"}>
      <Container maxWidth="xl">
        <Box sx={{ py: 2 }}>
          <NuevoPredioHeader editMode={editMode} />
          <PredioForm
            onSubmit={handleSubmit}
            loading={loading}
            predioExistente={existingPredio}
          />
        </Box>
      </Container>
    </MainLayout>
  );
});

NuevoPredio.displayName = "NuevoPredio";

export default NuevoPredio;
