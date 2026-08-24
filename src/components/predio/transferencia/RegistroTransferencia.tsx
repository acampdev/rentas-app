import React from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import { useTiposModoTransferenciaOptions } from "../../../hooks/useConstantesOptions";
import SelectorContribuyente from "../../modal/SelectorContribuyente";
import {
  ContribuyenteTransferenciaSection,
  DatosComplementariosSection,
  DatosTransferenciaSection,
  SectionDivider,
  TransferenciaActions,
} from "./RegistroTransferenciaSections";
import type { RegistroTransferenciaProps } from "./registroTransferencia.types";
import { useRegistroTransferencia } from "./useRegistroTransferencia";

const RegistroTransferencia: React.FC<RegistroTransferenciaProps> = (props) => {
  const theme = useTheme();
  const { options, loading } = useTiposModoTransferenciaOptions();
  const controller = useRegistroTransferencia(props);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <DatosTransferenciaSection
              form={controller.formData}
              onChange={controller.changeField}
            />
            <SectionDivider />
            <ContribuyenteTransferenciaSection
              tipo="vendedor"
              form={controller.formData}
              onOpen={() => controller.setOpenModalVendedor(true)}
            />
            <SectionDivider />
            <ContribuyenteTransferenciaSection
              tipo="comprador"
              form={controller.formData}
              onOpen={() => controller.setOpenModalComprador(true)}
            />
            <SectionDivider />
            <DatosComplementariosSection
              form={controller.formData}
              onChange={controller.changeField}
              options={options}
              loading={loading}
            />
            <TransferenciaActions
              editing={controller.formData.codTransferencia !== null}
              saving={controller.guardando}
              onClear={controller.limpiar}
              onSave={controller.guardar}
            />
          </Paper>
        </Grid>
      </Grid>

      <SelectorContribuyente
        isOpen={controller.openModalVendedor}
        onClose={() => controller.setOpenModalVendedor(false)}
        onSelectContribuyente={controller.selectVendedor}
        title="Seleccionar Vendedor (Contribuyente)"
        selectedId={controller.formData.vendedor?.codigo}
      />
      <SelectorContribuyente
        isOpen={controller.openModalComprador}
        onClose={() => controller.setOpenModalComprador(false)}
        onSelectContribuyente={controller.selectComprador}
        title="Seleccionar Comprador"
        selectedId={controller.formData.comprador?.codigo}
      />
    </Box>
  );
};

export default RegistroTransferencia;
