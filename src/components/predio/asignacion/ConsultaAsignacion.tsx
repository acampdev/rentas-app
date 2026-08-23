import { Error as ErrorIcon, Print as PrintIcon } from "@mui/icons-material";
import {
  Alert, Box, Button, Chip, Paper, Typography, alpha, useTheme,
} from "@mui/material";
import { SelectorContribuyente } from "../../";
import { ConsultaAsignacionFiltros } from "./ConsultaAsignacionFiltros";
import { ConsultaAsignacionHeader } from "./ConsultaAsignacionHeader";
import { ConsultaAsignacionTable } from "./ConsultaAsignacionTable";
import { useConsultaAsignacion } from "./useConsultaAsignacion";

const ConsultaAsignacion = () => {
  const theme = useTheme();
  const consulta = useConsultaAsignacion();
  const hasFilters = Boolean(
    consulta.filtros.anio || consulta.filtros.codigoContribuyente,
  );

  return (
    <Box>
      {consulta.error && (
        <Alert severity="error" onClose={consulta.limpiarError} icon={<ErrorIcon />} sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500}>Error al cargar asignaciones: {consulta.error}</Typography>
        </Alert>
      )}

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider", mb: 3 }}>
        <ConsultaAsignacionHeader />
        <ConsultaAsignacionFiltros
          filtros={consulta.filtros}
          loading={consulta.loading}
          onChange={consulta.actualizarFiltro}
          onSeleccionarContribuyente={() => consulta.setSelectorAbierto(true)}
          onBuscar={() => void consulta.buscar()}
          onNuevo={consulta.crearNuevo}
        />
        <ConsultaAsignacionTable
          asignaciones={consulta.asignaciones}
          loading={consulta.loading}
          hasFilters={hasFilters}
          onEditar={consulta.editar}
          onDesasignar={consulta.desasignar}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button variant="contained" color="success" startIcon={<PrintIcon />} onClick={consulta.imprimirPU} disabled={!consulta.filtros.codigoContribuyente || !consulta.asignaciones.length}>
            Imprimir PU
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.025), border: "1px solid", borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary">Total de asignaciones encontradas: {consulta.asignaciones.length}</Typography>
        {!!consulta.asignaciones.length && <Chip label="Datos actualizados" color="success" size="small" variant="outlined" />}
      </Box>

      <SelectorContribuyente
        isOpen={consulta.selectorAbierto}
        onClose={() => consulta.setSelectorAbierto(false)}
        onSelectContribuyente={consulta.seleccionarContribuyente}
        title="Seleccionar contribuyente"
      />
    </Box>
  );
};

export default ConsultaAsignacion;
