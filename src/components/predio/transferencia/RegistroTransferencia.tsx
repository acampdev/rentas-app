// src/components/predio/transferencia/RegistroTransferencia.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Typography,
  Stack,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  PersonSearch as PersonSearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import SelectorContribuyente from '../../modal/SelectorContribuyente';
import {
  useClasificacionPredio,
  useCondicionPropiedadOptions,
  useModoDeclaracionOptions,
  useEstadoOptions,
  type OptionFormat
} from '../../../hooks/useConstantesOptions';
import { usePredios } from '../../../hooks/usePredioAPI';

// Interfaz para Contribuyente seleccionado
interface ContribuyenteSeleccionado {
  codigo: number;
  contribuyente: string;
  documento: string;
  direccion: string;
  telefono?: string;
  tipoPersona?: 'natural' | 'juridica';
}

// Interfaz para el formulario
interface TransferenciaFormData {
  fechaTransferencia: Date | null;
  anioConstruccion: boolean;
  vendedor: ContribuyenteSeleccionado | null;
  comprador: ContribuyenteSeleccionado | null;
  clasificacionPredio: OptionFormat | null;
  usoPredio: OptionFormat | null;
  condicionPropiedad: OptionFormat | null;
  modoDeclaracion: OptionFormat | null;
  porcentaje: string;
  codigoPredio: string;
  autovaluo: string;
  tasa: string;
  factorReajuste: string;
  autovaluoAjuste: string;
  valorVenta: string;
  montoAfectado: string;
}

// Interfaz para formulario lateral
interface FormularioLateralData {
  numeroRecibo: string;
  estado: OptionFormat | null;
  nombre: string;
  dni: string;
  numeroEspecie: string;
  impuestoAlcabala: string;
}

const RegistroTransferencia: React.FC = () => {
  const theme = useTheme();

  // Estados para los modales
  const [openModalVendedor, setOpenModalVendedor] = useState(false);
  const [openModalComprador, setOpenModalComprador] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<TransferenciaFormData>({
    fechaTransferencia: new Date(),
    anioConstruccion: false,
    vendedor: null,
    comprador: null,
    clasificacionPredio: null,
    usoPredio: null,
    condicionPropiedad: null,
    modoDeclaracion: null,
    porcentaje: '',
    codigoPredio: '',
    autovaluo: '',
    tasa: '',
    factorReajuste: '',
    autovaluoAjuste: '',
    valorVenta: '',
    montoAfectado: ''
  });

  // Estado del formulario lateral
  const [formLateral, setFormLateral] = useState<FormularioLateralData>({
    numeroRecibo: '',
    estado: null,
    nombre: '',
    dni: '',
    numeroEspecie: '',
    impuestoAlcabala: ''
  });

  // Hooks para cargar opciones de los autocompletes
  const { options: clasificacionOptions, loading: loadingClasificacion } = useClasificacionPredio();
  const { options: condicionOptions, loading: loadingCondicion } = useCondicionPropiedadOptions();
  const { options: modoDeclaracionOptions, loading: loadingModo } = useModoDeclaracionOptions();
  const { options: estadoOptions, loading: loadingEstado } = useEstadoOptions();

  // Hook para usos de predio desde API /api/predio/usos
  const { usosPredio, cargarUsosPredio, loading: loadingPredios } = usePredios();

  // Cargar usos de predio al montar el componente
  useEffect(() => {
    cargarUsosPredio();
  }, [cargarUsosPredio]);

  // Transformar usosPredio al formato del autocomplete
  const usoPredioOptions: OptionFormat[] = useMemo(() => {
    return usosPredio.map(uso => ({
      value: uso.codUsoPredio.toString(),
      label: uso.descripcionUso,
      id: uso.codUsoPredio
    }));
  }, [usosPredio]);

  const loadingUsoPredio = loadingPredios;

  // Determinar si Uso Predio debe estar deshabilitado
  const isUsoPredioDisabled = useMemo(() => {
    // Si no hay clasificacion seleccionada, deshabilitar
    if (!formData.clasificacionPredio) {
      return true;
    }

    // Obtener el label de la clasificacion seleccionada
    const clasificacionLabel = formData.clasificacionPredio.label?.toUpperCase() || '';

    // Si la clasificacion es "CASAS HABITACION Y DEPARTAMENTO PARA CASAS", deshabilitar Uso Predio
    if (clasificacionLabel.includes('CASAS HABITACION') || clasificacionLabel.includes('DEPARTAMENTO PARA CASAS')) {
      return true;
    }

    return false;
  }, [formData.clasificacionPredio]);

  // Determinar si Condicion Propiedad debe estar deshabilitado
  const isCondicionPropiedadDisabled = useMemo(() => {
    // Si no hay clasificacion seleccionada, deshabilitar
    if (!formData.clasificacionPredio) {
      return true;
    }

    return false;
  }, [formData.clasificacionPredio]);

  // Handler para seleccionar vendedor (contribuyente)
  const handleSelectVendedor = (contribuyente: any) => {
    setFormData(prev => ({
      ...prev,
      vendedor: contribuyente
    }));
    setOpenModalVendedor(false);
  };

  // Handler para seleccionar comprador
  const handleSelectComprador = (contribuyente: any) => {
    setFormData(prev => ({
      ...prev,
      comprador: contribuyente
    }));
    setOpenModalComprador(false);
  };

  // Handler para cambios en el formulario
  const handleInputChange = (field: keyof TransferenciaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler para cambios en el formulario lateral
  const handleLateralChange = (field: keyof FormularioLateralData, value: any) => {
    setFormLateral(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler para limpiar formulario
  const handleLimpiar = () => {
    setFormData({
      fechaTransferencia: new Date(),
      anioConstruccion: false,
      vendedor: null,
      comprador: null,
      clasificacionPredio: null,
      usoPredio: null,
      condicionPropiedad: null,
      modoDeclaracion: null,
      porcentaje: '',
      codigoPredio: '',
      autovaluo: '',
      tasa: '',
      factorReajuste: '',
      autovaluoAjuste: '',
      valorVenta: '',
      montoAfectado: ''
    });
  };

  // Handler para guardar
  const handleGuardar = () => {
    console.log('Datos del formulario:', formData);
    // Aqui se implementara la logica de guardado
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Columna izquierda - Formulario de Transferencia */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            }}
          >
        {/* Fila 1: Fecha de Transferencia y Checkbox Ano de Construccion */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
            Datos de la Transferencia
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* Fecha de Transferencia */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="Fecha de Transferencia"
                value={formData.fechaTransferencia}
                onChange={(newValue) => handleInputChange('fechaTransferencia', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </Grid>
            {/* Ano de Construccion */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.anioConstruccion}
                    onChange={(e) => handleInputChange('anioConstruccion', e.target.checked)}
                    color="primary"
                  />
                }
                label="Año de Construccion"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Fila 2: Seleccionar Contribuyente (Vendedor) */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
            Datos del Vendedor
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* Boton para seleccionar Vendedor */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Button
                variant="contained"
                startIcon={<PersonSearchIcon />}
                onClick={() => setOpenModalVendedor(true)}
                fullWidth
                sx={{ height: 40 }}
              >
                Seleccionar Vendedor
              </Button>
            </Grid>
            {/* Codigo Contribuyente */}
            <Grid size={{ xs: 12, sm: 4, md: 1 }}>
              <TextField
                label="Codigo "
                value={formData.vendedor?.codigo || ''}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Nombre Contribuyente */}
            <Grid size={{ xs: 12, sm: 12, md: 9 }}>
              <TextField
                label="Nombre Contribuyente"
                value={formData.vendedor?.contribuyente || ''}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Fila 3: Direccion del Contribuyente (Vendedor) */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              {/* Direccion del Contribuyente */}
              <TextField
                label="Direccion del Contribuyente"
                value={formData.vendedor?.direccion || ''}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Fila 4: Seleccionar Comprador */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
            Datos del Comprador
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* Boton para seleccionar Comprador */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => setOpenModalComprador(true)}
                fullWidth
                sx={{ height: 40 }}
              >
                Seleccionar Comprador
              </Button>
            </Grid>
            {/* Codigo Contribuyente */}
            <Grid size={{ xs: 12, sm: 4, md: 1 }}>
              <TextField
                label="Codigo "
                value={formData.comprador?.codigo || ''}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Nombre Contribuyente */}
            <Grid size={{ xs: 12, sm: 12, md: 9 }}>
              <TextField
                label="Nombre Contribuyente"
                value={formData.comprador?.contribuyente || ''}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Fila 5: Clasificacion Predio */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
            Clasificacion del Predio
          </Typography>
          <Grid container spacing={2}>
            {/* Clasificacion Predio */}
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Autocomplete
                options={clasificacionOptions}
                getOptionLabel={(option) => option.label}
                value={formData.clasificacionPredio}
                onChange={(_, newValue) => handleInputChange('clasificacionPredio', newValue)}
                loading={loadingClasificacion}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Clasificacion Predio"
                    size="small"
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Fila 6: Uso Predio y Condicion Propiedad */}
        <Box sx={{ mb: 3 }}>
         
          <Grid container spacing={2}>
            {/* Uso Predio */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                options={usoPredioOptions}
                getOptionLabel={(option) => option.label}
                value={formData.usoPredio}
                onChange={(_, newValue) => handleInputChange('usoPredio', newValue)}
                loading={loadingUsoPredio}
                disabled={isUsoPredioDisabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Uso Predio"
                    size="small"
                    fullWidth
                    sx={isUsoPredioDisabled ? { backgroundColor: alpha(theme.palette.grey[500], 0.1) } : {}}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </Grid>
            {/* Condicion Propiedad */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                options={condicionOptions}
                getOptionLabel={(option) => option.label}
                value={formData.condicionPropiedad}
                onChange={(_, newValue) => handleInputChange('condicionPropiedad', newValue)}
                loading={loadingCondicion}
                disabled={isCondicionPropiedadDisabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Condicion Propiedad"
                    size="small"
                    fullWidth
                    sx={isCondicionPropiedadDisabled ? { backgroundColor: alpha(theme.palette.grey[500], 0.1) } : {}}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Fila 7: Modo Declaracion y campos bloqueados */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
            Datos de Valoracion
          </Typography>
          <Grid container spacing={2}>
            {/* Modo Declaracion */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                options={modoDeclaracionOptions}
                getOptionLabel={(option) => option.label}
                value={formData.modoDeclaracion}
                onChange={(_, newValue) => handleInputChange('modoDeclaracion', newValue)}
                loading={loadingModo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Modos Declaracion"
                    size="small"
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </Grid>
            {/* Porcentaje */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                label="Porcentaje"
                value={formData.porcentaje}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Codigo Predio */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                label="Codigo Predio"
                value={formData.codigoPredio}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Autovaluo */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                label="Autovaluo"
                value={formData.autovaluo}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Tasa */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Tasa"
                value={formData.tasa}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
          </Grid>

          {/* Segunda linea de campos bloqueados */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Factor Reajuste */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Factor Reajuste"
                value={formData.factorReajuste}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Autovaluo Ajuste */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Autovaluo Ajuste"
                value={formData.autovaluoAjuste}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Valor Venta */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Valor Venta"
                value={formData.valorVenta}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
            {/* Monto Afectado */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Monto Afectado"
                value={formData.montoAfectado}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Botones de accion */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {/* Boton para limpiar formulario */}
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleLimpiar}
          >
            Limpiar
          </Button>
          {/* Boton para guardar formulario */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleGuardar}
          >
            Guardar
          </Button>
          {/* Boton para generar recibo */}
          <Button
            variant="contained"
            color="success"
            startIcon={<ReceiptIcon />}
          >
            Generar Recibo
          </Button>
        </Stack>
          </Paper>
        </Grid>

        {/* Columna derecha - Formularios laterales */}
        <Grid size={{ xs: 12, md: 3 }}>
          {/* Primer formulario lateral */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              mb: 2
            }}
          >
            <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
              Datos del Recibo
            </Typography>

            {/* Primera fila: N° Recibo */}
            <Box sx={{ mb: 2 }}>
              <TextField
                label="N° Recibo"
                value={formLateral.numeroRecibo}
                onChange={(e) => handleLateralChange('numeroRecibo', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>

            {/* Segunda fila: Estado */}
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                options={estadoOptions}
                getOptionLabel={(option) => option.label}
                value={formLateral.estado}
                onChange={(_, newValue) => handleLateralChange('estado', newValue)}
                loading={loadingEstado}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estado"
                    size="small"
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </Box>

            {/* Tercera fila: Nombre y DNI bloqueados */}
            <Grid container spacing={1}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nombre"
                  value={formLateral.nombre}
                  fullWidth
                  size="small"
                  disabled
                  InputProps={{
                    readOnly: true,
                    sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="DNI"
                  value={formLateral.dni}
                  fullWidth
                  size="small"
                  disabled
                  InputProps={{
                    readOnly: true,
                    sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Segundo formulario lateral */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
              Datos de Especie
            </Typography>

            <Grid container spacing={1} alignItems="stretch">
              {/* Columna izquierda: N° Especie e Impuesto Alcabala */}
              <Grid size={{ xs: 8 }}>
                {/* Primera fila: N° Especie */}
                <Box sx={{ mb: 1 }}>
                  <TextField
                    label="N° Especie"
                    value={formLateral.numeroEspecie}
                    onChange={(e) => handleLateralChange('numeroEspecie', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>

                {/* Segunda fila: Impuesto Alcabala bloqueado */}
                <Box>
                  <TextField
                    label="Impuesto Alcabala"
                    value={formLateral.impuestoAlcabala}
                    fullWidth
                    size="small"
                    disabled
                    InputProps={{
                      readOnly: true,
                      sx: { backgroundColor: alpha(theme.palette.grey[500], 0.1) }
                    }}
                  />
                </Box>
              </Grid>

              {/* Columna derecha: Button Alcabala Formulario */}
              <Grid size={{ xs: 4 }}>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  sx={{
                    height: '100%',
                    minHeight: 88,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 28 }} />
                  <Typography variant="caption" sx={{ fontSize: 10, textAlign: 'center' }}>
                    Alcabala Formulario
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para seleccionar Vendedor (Contribuyente) */}
      <SelectorContribuyente
        isOpen={openModalVendedor}
        onClose={() => setOpenModalVendedor(false)}
        onSelectContribuyente={handleSelectVendedor}
        title="Seleccionar Vendedor (Contribuyente)"
        selectedId={formData.vendedor?.codigo}
      />

      {/* Modal para seleccionar Comprador (Contribuyente) */}
      <SelectorContribuyente
        isOpen={openModalComprador}
        onClose={() => setOpenModalComprador(false)}
        onSelectContribuyente={handleSelectComprador}
        title="Seleccionar Comprador"
        selectedId={formData.comprador?.codigo}
      />
    </Box>
  );
};

export default RegistroTransferencia;
