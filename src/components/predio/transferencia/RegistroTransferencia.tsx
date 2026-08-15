// src/components/predio/transferencia/RegistroTransferencia.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  CircularProgress,
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
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import SelectorContribuyente from '../../modal/SelectorContribuyente';
import { useTiposModoTransferenciaOptions } from '../../../hooks/useConstantesOptions';
import type { ContribuyenteListItem } from '../../../hooks/useContribuyentes';
import { useTransferencia } from '../../../hooks/useTransferencia';
import type { TransferenciaPredioData } from '../../../services/transferenciaService';
import { NotificationService } from '../../utils/Notification';

// Interfaz para el formulario
interface TransferenciaFormData {
  codTransferencia: number | null;
  anio: string;
  codigoPredio: string;
  vendedor: ContribuyenteListItem | null;
  comprador: ContribuyenteListItem | null;
  porcentajeTransferencia: number | '';
  fechaMinuta: Date | null;
  documento: string;
  modoTransferencia: string;
  valorTransferencia: number | '';
  esConstructor: boolean;
}

interface RegistroTransferenciaProps {
  transferenciaEditar?: TransferenciaPredioData | null;
  onGuardado?: () => void;
  onCancelarEdicion?: () => void;
}

const crearFormularioInicial = (): TransferenciaFormData => ({
  codTransferencia: null,
  anio: String(new Date().getFullYear()),
  codigoPredio: '',
  vendedor: null,
  comprador: null,
  porcentajeTransferencia: '',
  fechaMinuta: null,
  documento: '',
  modoTransferencia: '',
  valorTransferencia: '',
  esConstructor: false
});

const parseFechaApi = (fecha: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const formatFechaApi = (fecha: Date): string => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const crearContribuyenteEdicion = (codigo: number, nombre: string): ContribuyenteListItem | null =>
  codigo > 0
    ? {
        codigo,
        contribuyente: nombre || `Contribuyente ${codigo}`,
        documento: '',
        direccion: ''
      }
    : null;

const RegistroTransferencia: React.FC<RegistroTransferenciaProps> = ({
  transferenciaEditar = null,
  onGuardado,
  onCancelarEdicion
}) => {
  const theme = useTheme();

  // Estados para los modales
  const [openModalVendedor, setOpenModalVendedor] = useState(false);
  const [openModalComprador, setOpenModalComprador] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<TransferenciaFormData>(crearFormularioInicial);

  const { options: modoTransferenciaOptions, loading: loadingModoTransferencia } = useTiposModoTransferenciaOptions();
  const { crearTransferencia, actualizarTransferencia, isCreating, isUpdating } = useTransferencia();

  useEffect(() => {
    if (!transferenciaEditar) {
      setFormData(crearFormularioInicial());
      return;
    }

    setFormData({
      codTransferencia: transferenciaEditar.codTransferencia,
      anio: String(transferenciaEditar.anio),
      codigoPredio: transferenciaEditar.codPredio,
      vendedor: crearContribuyenteEdicion(
        transferenciaEditar.codContribuyenteVenta,
        transferenciaEditar.nombreContribuyenteVenta
      ),
      comprador: crearContribuyenteEdicion(
        transferenciaEditar.codContribuyenteCompra,
        transferenciaEditar.nombreContribuyenteCompra
      ),
      porcentajeTransferencia: transferenciaEditar.porcentajeTransferencia,
      fechaMinuta: parseFechaApi(transferenciaEditar.fechaMinuta),
      documento: transferenciaEditar.documento,
      modoTransferencia: transferenciaEditar.codModoTransferencia,
      valorTransferencia: transferenciaEditar.valorTransferencia,
      esConstructor: transferenciaEditar.esConstructor
    });
  }, [transferenciaEditar]);

  // Handler para seleccionar vendedor (contribuyente)
  const handleSelectVendedor = (contribuyente: ContribuyenteListItem) => {
    setFormData((prev) => ({
      ...prev,
      vendedor: contribuyente
    }));
    setOpenModalVendedor(false);
  };

  // Handler para seleccionar comprador
  const handleSelectComprador = (contribuyente: ContribuyenteListItem) => {
    setFormData((prev) => ({
      ...prev,
      comprador: contribuyente
    }));
    setOpenModalComprador(false);
  };

  // Handler para cambios en el formulario
  const handleInputChange = <K extends keyof TransferenciaFormData>(field: K, value: TransferenciaFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler para limpiar formulario
  const handleLimpiar = () => {
    setFormData(crearFormularioInicial());
    if (formData.codTransferencia !== null) {
      onCancelarEdicion?.();
    }
  };

  // Handler para guardar
  const handleGuardar = async () => {
    if (
      !formData.anio ||
      !formData.codigoPredio.trim() ||
      !formData.vendedor ||
      !formData.comprador ||
      formData.porcentajeTransferencia === '' ||
      !formData.fechaMinuta ||
      !formData.documento.trim() ||
      !formData.modoTransferencia ||
      formData.valorTransferencia === ''
    ) {
      NotificationService.warning('Complete todos los datos de la transferencia');
      return;
    }

    if (formData.porcentajeTransferencia < 0 || formData.porcentajeTransferencia > 100) {
      NotificationService.warning('El porcentaje debe estar entre 0 y 100');
      return;
    }

    const datos = {
      anio: Number(formData.anio),
      codPredio: formData.codigoPredio.trim(),
      codContribuyenteVenta: formData.vendedor.codigo,
      codContribuyenteCompra: formData.comprador.codigo,
      porcentajeTransferencia: Number(formData.porcentajeTransferencia),
      fechaMinuta: formatFechaApi(formData.fechaMinuta),
      documento: formData.documento.trim(),
      CodModoTransferencia: formData.modoTransferencia,
      valorTransferencia: Number(formData.valorTransferencia),
      esConstructor: String(formData.esConstructor) as 'true' | 'false'
    };

    try {
      if (formData.codTransferencia !== null) {
        await actualizarTransferencia({
          codTransferencia: formData.codTransferencia,
          ...datos
        });
      } else {
        await crearTransferencia({
          codTransferencia: null,
          ...datos
        });
      }

      setFormData(crearFormularioInicial());
      onGuardado?.();
    } catch {
      // El hook muestra el detalle del error de la API.
    }
  };

  const guardando = isCreating || isUpdating;

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Columna izquierda - Formulario de Transferencia */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            }}
          >
            {/* Fila 1: Año y Código de Predio */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
                Datos de la Transferencia
              </Typography>
              <Grid container spacing={2} alignItems="center">
                {/* Año */}
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                  <TextField
                    label="Año"
                    type="number"
                    value={formData.anio}
                    onChange={(e) => handleInputChange('anio', e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1900, max: 9999 }}
                  />
                </Grid>
                {/* Código de Predio */}
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                  <TextField
                    label="Código de Predio"
                    value={formData.codigoPredio}
                    onChange={(e) => handleInputChange('codigoPredio', e.target.value)}
                    fullWidth
                    size="small"
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
                      sx: {
                        backgroundColor: alpha(theme.palette.grey[500], 0.1)
                      }
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
                      sx: {
                        backgroundColor: alpha(theme.palette.grey[500], 0.1)
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Seleccionar Comprador */}
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
                      sx: {
                        backgroundColor: alpha(theme.palette.grey[500], 0.1)
                      }
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
                      sx: {
                        backgroundColor: alpha(theme.palette.grey[500], 0.1)
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Datos complementarios de la transferencia */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 2 }}>
                Datos Complementarios de Transferencia
              </Typography>
              <Grid container spacing={2} alignItems="center">
                {/* Porcentaje Transferencia */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Porcentaje"
                    type="number"
                    value={formData.porcentajeTransferencia}
                    onChange={(e) =>
                      handleInputChange('porcentajeTransferencia', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                  />
                </Grid>
                {/* Fecha Minuta */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    label="Fecha Minuta"
                    value={formData.fechaMinuta}
                    onChange={(newValue) => handleInputChange('fechaMinuta', newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small'
                      }
                    }}
                  />
                </Grid>
                {/* Documento */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Documento"
                    placeholder="1234-2026"
                    value={formData.documento}
                    onChange={(e) => handleInputChange('documento', e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ pattern: '[0-9]+-[0-9]{4}' }}
                  />
                </Grid>
                {/* Modo Transferencia */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="modo-transferencia-label">Modo Transferencia</InputLabel>
                    <Select
                      labelId="modo-transferencia-label"
                      label="Modo Transferencia"
                      value={formData.modoTransferencia}
                      onChange={(e) => handleInputChange('modoTransferencia', String(e.target.value))}
                      disabled={loadingModoTransferencia}
                    >
                      {modoTransferenciaOptions.map((option) => (
                        <MenuItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Valor de Transferencia */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Valor de Transferencia"
                    type="number"
                    value={formData.valorTransferencia}
                    onChange={(e) =>
                      handleInputChange('valorTransferencia', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                {/* Es constructor */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl
                    sx={{
                      minHeight: 40,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <FormLabel id="es-constructor-label" sx={{ whiteSpace: 'nowrap' }}>
                      Es constructor
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="es-constructor-label"
                      value={String(formData.esConstructor)}
                      onChange={(e) => handleInputChange('esConstructor', e.target.value === 'true')}
                      sx={{ flexWrap: 'nowrap' }}
                    >
                      <FormControlLabel value="true" control={<Radio size="small" />} label="True" />
                      <FormControlLabel value="false" control={<Radio size="small" />} label="False" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Botones de accion */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {/* Boton para limpiar formulario */}
              <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleLimpiar}>
                Limpiar
              </Button>
              {/* Boton para guardar formulario */}
              <Button
                variant="contained"
                color="primary"
                startIcon={guardando ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                onClick={handleGuardar}
                disabled={guardando}
              >
                {formData.codTransferencia !== null ? 'Actualizar' : 'Guardar'}
              </Button>
              {/* Boton para generar recibo */}
              <Button variant="contained" color="success" startIcon={<ReceiptIcon />}>
                Generar Recibo
              </Button>
            </Stack>
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
