import React from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { CuentaBusquedaCard } from "./CuentaBusquedaCard";
import { CuentaDetalleTable } from "./CuentaDetalleTable";
import { CuentaResumenTable } from "./CuentaResumenTable";
import type { CuentaListProps } from "./cuentaList.types";
import { useCuentaDetalle } from "./useCuentaDetalle";
import { useCuentaList } from "./useCuentaList";

const SelectorContribuyente = React.lazy(
  () => import("../modal/SelectorContribuyente"),
);

const CuentaList = ({
  contribuyenteId,
  predioId,
  loading = false,
  error,
}: CuentaListProps) => {
  const cuenta = useCuentaList({ contribuyenteId, predioId });
  const { tributosUnicos } = useCuentaDetalle(
    cuenta.estadoCuentaDetalle,
    cuenta.anioSeleccionado,
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: "100%" }}>
      <SelectorContribuyente
        isOpen={cuenta.isModalOpen}
        onClose={() => cuenta.setIsModalOpen(false)}
        onSelectContribuyente={cuenta.seleccionarContribuyente}
        selectedId={
          cuenta.contribuyenteSeleccionado
            ? Number(cuenta.contribuyenteSeleccionado.codigo)
            : undefined
        }
      />

      <CuentaBusquedaCard
        contribuyente={cuenta.contribuyenteSeleccionado}
        codigoContribuyente={cuenta.codigoContribuyente}
        anio={cuenta.anioFiltro}
        codigoPredio={cuenta.codigoPredio}
        loading={cuenta.loadingEstadoCuenta}
        error={cuenta.errorValidacion ?? cuenta.errorEstadoCuenta}
        onAbrirSelector={() => cuenta.setIsModalOpen(true)}
        onAnioChange={cuenta.setAnioFiltro}
        onCodigoPredioChange={cuenta.setCodigoPredio}
        onBuscar={cuenta.buscar}
      />

      <CuentaResumenTable
        rows={cuenta.estadoCuentaAnual}
        loading={cuenta.loadingEstadoCuenta}
        busquedaRealizada={cuenta.busquedaRealizada}
        codigoContribuyente={cuenta.codigoContribuyente}
        anioSeleccionado={cuenta.anioSeleccionado}
        onSeleccionarAnio={cuenta.seleccionarAnio}
      />

      <CuentaDetalleTable
        anio={cuenta.anioSeleccionado}
        loading={cuenta.loadingDetalle}
        error={cuenta.errorDetalle}
        tributos={tributosUnicos}
        expandidos={cuenta.tributosExpandidos}
        onToggle={cuenta.alternarTributo}
      />
    </Box>
  );
};

export default CuentaList;
