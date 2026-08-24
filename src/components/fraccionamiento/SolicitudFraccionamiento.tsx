import { Alert, Box, Container, Paper, Stack, Typography } from '@mui/material';
import SelectorContribuyente from '../modal/SelectorContribuyente';
import { CondicionesSection } from './solicitud/CondicionesSection';
import { ContribuyenteSection } from './solicitud/ContribuyenteSection';
import { DetalleDeudaSection } from './solicitud/DetalleDeudaSection';
import { PeriodoDeudaSection } from './solicitud/PeriodoDeudaSection';
import { ResolucionAnteriorSection } from './solicitud/ResolucionAnteriorSection';
import { SolicitanteSection } from './solicitud/SolicitanteSection';
import { SolicitudActions } from './solicitud/SolicitudActions';
import { SolicitudConfirmationDialog } from './solicitud/SolicitudConfirmationDialog';
import { useSolicitudFraccionamiento } from './solicitud/useSolicitudFraccionamiento';

const SolicitudFraccionamiento = () => {
  const controller = useSolicitudFraccionamiento();

  const handleNewRequest = () => {
    controller.setConfirmacionDialogo(false);
    controller.handleLimpiar();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }} className="notranslate" translate="no">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Nueva Solicitud de Fraccionamiento
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingrese los datos necesarios para registrar el fraccionamiento de la deuda.
        </Typography>
      </Box>

      {controller.error && <Alert severity="error" sx={{ mb: 3 }}>{controller.error}</Alert>}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={4}>
          <ContribuyenteSection
            contribuyente={controller.contribuyente}
            onOpenSelector={() => controller.setModalContribuyente(true)}
          />
          <DetalleDeudaSection
            contribuyenteCodigo={controller.contribuyente.codigo}
            detalles={controller.detallesCuentaCorriente}
            loading={controller.cargandoCuentaCorriente}
            currentYear={controller.currentYear}
            deudaInsoluta={controller.values.deudaInsoluta}
          />
          <CondicionesSection
            values={controller.values}
            options={controller.options.tipoFraccionamiento}
            loadingOptions={controller.options.loadingTiposFraccionamiento}
            onChange={controller.setField}
          />
          <PeriodoDeudaSection values={controller.values} onChange={controller.setField} />
          <SolicitanteSection
            values={controller.values}
            documentOptions={controller.options.tipoDocumento}
            onChange={controller.setField}
          />
          <ResolucionAnteriorSection values={controller.values} />
          <SolicitudActions
            loading={controller.cargando}
            valid={controller.formularioValido}
            onClear={controller.handleLimpiar}
            onSubmit={controller.handleEnviar}
          />
        </Stack>
      </Paper>

      {controller.modalContribuyente && (
        <SelectorContribuyente
          isOpen
          onClose={() => controller.setModalContribuyente(false)}
          onSelectContribuyente={controller.handleSeleccionarContribuyente}
        />
      )}

      <SolicitudConfirmationDialog
        open={controller.confirmacionDialogo}
        onNew={handleNewRequest}
        onClose={() => controller.setConfirmacionDialogo(false)}
      />
    </Container>
  );
};

export default SolicitudFraccionamiento;
