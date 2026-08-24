import { Alert, Paper, Typography } from "@mui/material";
import type React from "react";
import AperturaCaja from "../../components/caja/AperturaCaja";
import ListarAperturaCaja from "../../components/caja/ListarAperturaCaja";
import Movimientos from "../../components/caja/modal/Movimientos";
import Pagos from "../../components/caja/Pagos";
import MainLayout from "../../layout/MainLayout";
import { CajaControls, CajaHeader, PageContainer } from "./CajaPageSections";
import { useCajaPage } from "./useCajaPage";

const CajaPage: React.FC = () => {
  const controller = useCajaPage();
  const { estadoCaja } = controller;

  return (
    <MainLayout title="Gestión de Caja">
      <PageContainer maxWidth="xl">
        <CajaHeader abierta={estadoCaja.abierta} />
        <CajaControls
          estado={estadoCaja}
          onOpen={() => controller.setAperturaModalOpen(true)}
          onClose={controller.cerrarCaja}
          onMovements={() => controller.setMovimientosModalOpen(true)}
          onHistory={() => controller.setListarAperturaModalOpen(true)}
        />

        {controller.puedeOperarCaja ? (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Pagos
              codAperturaCaja={Number(estadoCaja.codAperturaCaja)}
              codUsuarioOperando={Number(estadoCaja.codUsuarioOperando)}
              onPagoExitoso={() =>
                void controller.syncActiveApertura(
                  Number(estadoCaja.codUsuarioOperando),
                )
              }
            />
          </Paper>
        ) : (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography variant="body1">
              <strong>Caja cerrada:</strong> Para realizar operaciones, primero
              debe abrir la caja.
            </Typography>
          </Alert>
        )}

        <AperturaCaja
          open={controller.aperturaModalOpen}
          onClose={() => controller.setAperturaModalOpen(false)}
          onSave={controller.abrirCaja}
          loading={controller.loading}
        />
        <Movimientos
          open={controller.movimientosModalOpen}
          onClose={() => controller.setMovimientosModalOpen(false)}
        />
        <ListarAperturaCaja
          open={controller.listarAperturaModalOpen}
          onClose={() => controller.setListarAperturaModalOpen(false)}
          onOperarCaja={controller.operarCaja}
        />
      </PageContainer>
    </MainLayout>
  );
};

export default CajaPage;
