// src/components/caja/AperturaCaja.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
  Alert,
  Paper,
  InputAdornment,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useUsuarios } from '../../hooks/useUsuarios';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    minWidth: '500px',
    maxWidth: '600px',
    overflowX: 'hidden',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(2),
  margin: theme.spacing(-3, -3, 2, -3),
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));

// Interfaces
export interface AperturaCajaData {
  numeroCaja?: string;
  fechaApertura: string;
  montoInicial: number;
  observacion: string;
  codUsuario: number;
  codAsignacionCaja: number | null;
}

interface AperturaCajaProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AperturaCajaData) => void;
  loading?: boolean;
}

const AperturaCaja: React.FC<AperturaCajaProps> = ({
  open,
  onClose,
  onSave,
  loading = false
}) => {
  // Cargar usuarios
  const { usuarios, loading: loadingUsuarios } = useUsuarios();

  // Filtrar los usuarios que tienen rol Cajero
  const cajeros = usuarios.filter(u => u.rol?.trim().toLowerCase() === 'cajero');

  // Estado del formulario
  const [formData, setFormData] = useState<AperturaCajaData>(() => {
    const currentCodUsuario = getAuthenticatedUserCode();
    return {
      numeroCaja: '',
      fechaApertura: new Date().toLocaleDateString('es-PE'),
      montoInicial: 1000.0000,
      observacion: 'Aperturar caja',
      codUsuario: currentCodUsuario,
      codAsignacionCaja: null
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Buscar el usuario seleccionado para vincularlo al Autocomplete
  const selectedUsuario = cajeros.find(u => u.codUsuario === formData.codUsuario) || null;

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.montoInicial === undefined || formData.montoInicial === null || isNaN(formData.montoInicial) || formData.montoInicial < 0) {
      newErrors.montoInicial = 'El monto inicial debe ser mayor o igual a 0';
    }

    if (!selectedUsuario || !Number.isInteger(formData.codUsuario) || formData.codUsuario <= 0) {
      newErrors.codUsuario = 'Debe seleccionar un cajero válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof AperturaCajaData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Manejar envío
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Limpiar formulario al cerrar
  const handleClose = () => {
    const currentCodUsuario = getAuthenticatedUserCode();
    setFormData({
      numeroCaja: '',
      fechaApertura: new Date().toLocaleDateString('es-PE'),
      montoInicial: 0,
      observacion: 'Aperturar caja',
      codUsuario: currentCodUsuario,
      codAsignacionCaja: null
    });
    setErrors({});
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
    >
      {/* Header */}
      <HeaderBox>
        <Box display="flex" alignItems="center" gap={1}>
          <CreditCardIcon />
          <Typography variant="h6" fontWeight="bold">
            Monto Apertura Caja
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: 'white' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </HeaderBox>

      <DialogContent sx={{ padding: 3 }}>
        <ContentBox>
          {/* Información de la caja */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef'
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Usuario:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {selectedUsuario ? `${selectedUsuario.nombrePersona} (${selectedUsuario.username?.trim()})` : '---'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {`${formData.fechaApertura || ''}`}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {`APERTURA S/. ${(formData.montoInicial || 0).toFixed(4)}`}
              </Typography>
            </Box>
          </Paper>

          {/* Formulario */}
          <Box display="flex" flexDirection="column" gap={3}>

            {/* Segunda fila: Monto Inicial y Usuario */}
            <Box display="flex" gap={2}>
              {/* Monto Inicial */}
              <TextField
                label="Monto Inicio de Caja"
                type="number"
                value={formData.montoInicial}
                onChange={(e) => handleInputChange('montoInicial', parseFloat(e.target.value) || 0)}
                onFocus={(e) => e.target.select()}
                error={!!errors.montoInicial}
                helperText={errors.montoInicial}
                disabled={loading}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                  inputProps: {
                    step: 0.0001,
                    min: 0
                  }
                }}
              />

              {/* Autocomplete Usuario */}
              <Autocomplete
                size="small"
                options={cajeros}
                loading={loadingUsuarios}
                value={selectedUsuario}
                onChange={(_event, newValue) => {
                  handleInputChange('codUsuario', newValue ? newValue.codUsuario : 0);
                }}
                getOptionLabel={(option) => `${option.nombrePersona} (${option.username?.trim()})`}
                isOptionEqualToValue={(option, value) => option.codUsuario === value.codUsuario}
                disabled={loading}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Usuario"
                    placeholder="Seleccionar usuario..."
                    error={!!errors.codUsuario}
                    helperText={errors.codUsuario}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingUsuarios ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Tercera fila: Observación */}
            <TextField
              fullWidth
              label="Observación"
              value={formData.observacion}
              onChange={(e) => handleInputChange('observacion', e.target.value)}
              disabled={loading}
              size="small"
              placeholder="Ej. Aperturar caja"
            />
          </Box>

          {/* Alert informativo */}
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            icon={<CreditCardIcon />}
          >
            <Typography variant="body2">
              Se registrará la apertura de caja con el monto inicial especificado.
              Verifique que todos los datos sean correctos antes de proceder.
            </Typography>
          </Alert>
        </ContentBox>
      </DialogContent>

      {/* Actions */}
      <Divider />
      <DialogActions sx={{ p: 2, gap: 1 }}>
        {/* Boton Cerrar */}
        <Button
          onClick={handleClose}
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          disabled={loading}
          sx={{
            borderColor: '#f44336 !important',
            color: '#f44336 !important',
            '&:hover': {
              borderColor: '#d32f2f !important',
              backgroundColor: 'rgba(244, 67, 54, 0.08) !important',
            },
            '&.Mui-disabled': {
              borderColor: '#f44336 !important',
              color: '#f44336 !important',
              opacity: '0.65 !important',
            }
          }}
        >
          Cerrar
        </Button>
        {/* Boton Grabar */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important',
            backgroundColor: '#4caf50 !important',
            color: '#ffffff !important',
            '&:hover': {
              background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%) !important',
              backgroundColor: '#43a047 !important',
            },
            '&.Mui-disabled': {
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important',
              backgroundColor: '#4caf50 !important',
              color: '#ffffff !important',
              opacity: '0.65 !important',
            }
          }}
        >
          Grabar
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AperturaCaja;
