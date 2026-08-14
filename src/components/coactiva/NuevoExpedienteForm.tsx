// src/components/coactiva/NuevoExpedienteForm.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Divider,
  Alert,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { NotificationService } from '../utils/Notification';
import { useCoactiva } from '../../hooks/useCoactiva';
import { useContribuyentes } from '../../hooks/useContribuyentes';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

// Styled Components
const FormSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const InfoCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
}));

interface FormData {
  numeroExpediente: string;
  dniContribuyente: string;
  nombreContribuyente: string;
  direccion: string;
  telefono: string;
  email: string;
  montoDeuda: string;
  tipoDeuda: string;
  observaciones: string;
  codContribuyente: number | null;
}

const NuevoExpedienteForm: React.FC = () => {
  const { crearExpediente, isCreating } = useCoactiva();
  const { obtenerContribuyenteDetalle } = useContribuyentes();

  const [formData, setFormData] = useState<FormData>({
    numeroExpediente: '',
    dniContribuyente: '',
    nombreContribuyente: '',
    direccion: '',
    telefono: '',
    email: '',
    montoDeuda: '',
    tipoDeuda: '',
    observaciones: '',
    codContribuyente: null
  });

  const [contribuyenteEncontrado, setContribuyenteEncontrado] = useState(false);
  const [buscandoContribuyente, setBuscandoBusqueda] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBuscarContribuyente = async () => {
    if (!formData.dniContribuyente) {
      NotificationService.warning('Ingrese el DNI del contribuyente');
      return;
    }

    try {
      setBuscandoBusqueda(true);
      // Intentar buscar el detalle del contribuyente
      // Nota: En un sistema real usaríamos buscar por documento directamente
      const contribuyente = await obtenerContribuyenteDetalle("", formData.dniContribuyente);

      if (contribuyente) {
        const fullNombre = `${contribuyente.nombres} ${contribuyente.apellidopaterno} ${contribuyente.apellidomaterno}`.trim();
        setFormData(prev => ({
          ...prev,
          nombreContribuyente: fullNombre,
          direccion: contribuyente.direccion || '',
          telefono: contribuyente.telefono || '',
          email: '', // El servicio no devuelve email actualmente
          codContribuyente: contribuyente.codPersona || null
        }));
        setContribuyenteEncontrado(true);
        NotificationService.success('Contribuyente encontrado');
      } else {
        NotificationService.error('No se encontró el contribuyente');
        setContribuyenteEncontrado(false);
      }
    } catch (e) {
      NotificationService.error('Error al buscar contribuyente');
    } finally {
      setBuscandoBusqueda(false);
    }
  };

  const handleLimpiar = () => {
    setFormData({
      numeroExpediente: '',
      dniContribuyente: '',
      nombreContribuyente: '',
      direccion: '',
      telefono: '',
      email: '',
      montoDeuda: '',
      tipoDeuda: '',
      observaciones: '',
      codContribuyente: null
    });
    setContribuyenteEncontrado(false);
  };

  const handleGuardar = async () => {
    if (!formData.numeroExpediente || !formData.dniContribuyente || !formData.montoDeuda || !formData.tipoDeuda || !formData.codContribuyente) {
      NotificationService.error('Complete todos los campos obligatorios y seleccione un contribuyente válido');
      return;
    }

    try {
      await crearExpediente({
        numeroExpediente: formData.numeroExpediente,
        codContribuyente: formData.codContribuyente,
        montoDeuda: parseFloat(formData.montoDeuda),
        tipoDeuda: formData.tipoDeuda,
        observaciones: formData.observaciones,
        codUsuario: getAuthenticatedUserCode()
      });
      handleLimpiar();
    } catch (e) {
      // El error ya lo maneja el hook
    }
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Complete el formulario para registrar un nuevo expediente de cobranza coactiva.
        </Typography>
      </Alert>

      <FormSection>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Datos del Expediente</Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Número de Expediente *"
            value={formData.numeroExpediente}
            onChange={(e) => handleInputChange('numeroExpediente', e.target.value)}
            size="small"
          />
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Tipo de Deuda *"
              select
              value={formData.tipoDeuda}
              onChange={(e) => handleInputChange('tipoDeuda', e.target.value)}
              size="small"
            >
              <MenuItem value="predial">Predial</MenuItem>
              <MenuItem value="arbitrios">Arbitrios</MenuItem>
              <MenuItem value="alcabala">Alcabala</MenuItem>
              <MenuItem value="multas">Multas Administrativas</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Monto de Deuda (S/.) *"
              type="number"
              value={formData.montoDeuda}
              onChange={(e) => handleInputChange('montoDeuda', e.target.value)}
              size="small"
            />
          </Box>
        </Stack>
      </FormSection>

      <FormSection>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Datos del Contribuyente</Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={3}>
          <Box display="flex" gap={2}>
            <TextField
              label="Documento *"
              value={formData.dniContribuyente}
              onChange={(e) => handleInputChange('dniContribuyente', e.target.value)}
              size="small"
              sx={{ width: 200 }}
            />
            <Button
              variant="contained"
              startIcon={buscandoContribuyente ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              onClick={handleBuscarContribuyente}
              disabled={!formData.dniContribuyente || buscandoContribuyente}
            >
              Buscar
            </Button>
          </Box>

          {contribuyenteEncontrado && (
            <InfoCard>
              <CardContent>
                <Typography variant="subtitle2" color="primary">Contribuyente: <strong>{formData.nombreContribuyente}</strong></Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>Dirección: {formData.direccion}</Typography>
              </CardContent>
            </InfoCard>
          )}
        </Stack>
      </FormSection>

      <FormSection>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Observaciones</Typography>
        <Divider sx={{ mb: 3 }} />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Observaciones"
          value={formData.observaciones}
          onChange={(e) => handleInputChange('observaciones', e.target.value)}
          size="small"
        />
      </FormSection>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleLimpiar} disabled={isCreating}>Limpiar</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleGuardar}
          disabled={isCreating || !contribuyenteEncontrado}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default NuevoExpedienteForm;
