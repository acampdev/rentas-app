import { Box, Container, Typography } from "@mui/material";
import SelectorContribuyente from "../modal/SelectorContribuyente";
import { ConsultaFraccionamientoDocuments } from "./consulta/ConsultaFraccionamientoDocuments";
import { ConsultaFraccionamientoFilters } from "./consulta/ConsultaFraccionamientoFilters";
import { ConsultaFraccionamientoTable } from "./consulta/ConsultaFraccionamientoTable";
import { useConsultaFraccionamiento } from "./consulta/useConsultaFraccionamiento";

const ConsultaFraccionamiento = () => {
  const controller = useConsultaFraccionamiento();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Consulta de Fraccionamientos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Búsqueda y seguimiento de convenios de fraccionamiento
        </Typography>
      </Box>

      <ConsultaFraccionamientoFilters
        contribuyente={controller.contribuyente}
        loading={controller.loading}
        onOpenSelector={() => controller.setSelectorOpen(true)}
        onBuscar={controller.buscar}
        onLimpiar={controller.limpiar}
      />
      <ConsultaFraccionamientoTable
        rows={controller.rows}
        total={controller.fraccionamientos.length}
        selected={controller.seleccionado}
        loading={controller.loading}
        page={controller.page}
        rowsPerPage={controller.rowsPerPage}
        onSelect={controller.setSeleccionado}
        onView={controller.verDetalle}
        onPrint={controller.imprimirConvenio}
        onPageChange={controller.setPage}
        onRowsPerPageChange={controller.changeRowsPerPage}
      />
      <ConsultaFraccionamientoDocuments
        openDocument={controller.documentoOpen}
        selected={controller.seleccionado}
        contribuyente={controller.contribuyenteResultado}
        onOpen={controller.abrirDocumento}
        onClose={() => controller.setDocumentoOpen(null)}
      />
      <SelectorContribuyente
        isOpen={controller.selectorOpen}
        onClose={() => controller.setSelectorOpen(false)}
        onSelectContribuyente={controller.setContribuyente}
      />
    </Container>
  );
};

export default ConsultaFraccionamiento;
