// src/components/aranceles/ArancelForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
  FormHelperText,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Add as AddIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAranceles } from '../../hooks/useAranceles';
import SelectorDirecciones from '../modal/SelectorDirecciones';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

interface ArancelFormData {
  anio: number | null;
  codDireccion: number | null;
  costoArancel: number;
}

interface AsignacionArancelFormProps {
  onRedirectToList?: (searchParams: { anio: number; codDireccion: number }) => void;
  initialData?: any;
  onSubmit?: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  onNuevo?: () => void;
  isSubmitting?: boolean;
}

export const AsignacionArancelForm: React.FC<AsignacionArancelFormProps> = ({ 
  onRedirectToList,
  initialData,
  onSubmit,
  onDelete: _onDelete,
  onNuevo: _onNuevo,
  isSubmitting
}) => {
  const theme = useTheme();
  
  // Estados
  const [formData, setFormData] = useState<ArancelFormData>({
    anio: new Date().getFullYear(),
    codDireccion: null,
    costoArancel: 0
  });
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<any>(null);
  const [modalDireccionOpen, setModalDireccionOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [codArancelActual, setCodArancelActual] = useState<number | null>(null);

  // Hook
  const { 
    crearArancel, 
    actualizarArancel, 
    eliminarArancel, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useAranceles();

  const submitting = !!(isSubmitting || isCreating || isUpdating || isDeleting);

  // Efecto para cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setFormData({
        anio: initialData.anio || new Date().getFullYear(),
        codDireccion: initialData.codDireccion || initialData.idDireccion || null,
        costoArancel: initialData.costoArancel || initialData.arancel || initialData.costo || 0
      });
      
      setCodArancelActual(initialData.codArancel || initialData.id);
      setIsEditMode(true);
      
      // Objeto de dirección temporal para mostrar
      setDireccionSeleccionada({
        id: initialData.codDireccion || initialData.idDireccion,
        descripcion: initialData.direccionCompleta || `Dirección ${initialData.codDireccion || initialData.idDireccion}`
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.anio) newErrors.anio = 'El año es requerido';
    if (!formData.codDireccion) newErrors.direccion = 'La dirección es requerida';
    if (formData.costoArancel < 0) newErrors.costoArancel = 'El costo no puede ser negativo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnioChange = (value: string | number) => {
    setFormData(prev => ({ ...prev, anio: value === '' ? null : Number(value) }));
    setErrors(prev => ({ ...prev, anio: '' }));
  };

  const handleCostoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const value = inputValue === '' ? 0 : parseFloat(inputValue);
    setFormData(prev => ({ ...prev, costoArancel: value }));
    setErrors(prev => ({ ...prev, costoArancel: '' }));
  };

  const handleSelectDireccion = (direccion: any) => {
    setDireccionSeleccionada(direccion);
    setFormData(prev => ({ ...prev, codDireccion: direccion.id || direccion.codDireccion }));
    setErrors(prev => ({ ...prev, direccion: '' }));
    setModalDireccionOpen(false);
  };

  const handleNuevo = () => {
    setFormData({
      anio: new Date().getFullYear(),
      codDireccion: null,
      costoArancel: 0
    });
    setDireccionSeleccionada(null);
    setIsEditMode(false);
    setCodArancelActual(null);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const savedAnio = formData.anio!;
      const savedCodDireccion = formData.codDireccion!;
      
      const payload = {
        codArancel: codArancelActual || undefined,
        anio: savedAnio,
        codDireccion: savedCodDireccion,
        costoArancel: formData.costoArancel,
        costo: formData.costoArancel, // Compatibilidad con DTOs que usan 'costo'
        codUsuario: getAuthenticatedUserCode()
      };

      if (onSubmit) {
        // Usar el callback del padre si existe
        await onSubmit(payload);
      } else {
        // Fallback al hook interno
        if (isEditMode && codArancelActual) {
          await actualizarArancel({
            codArancel: codArancelActual,
            anio: savedAnio,
            codDireccion: savedCodDireccion,
            costo: formData.costoArancel,
            codUsuario: getAuthenticatedUserCode()
          });
        } else {
          await crearArancel({
            anio: savedAnio,
            codDireccion: savedCodDireccion,
            costo: formData.costoArancel,
            codUsuario: getAuthenticatedUserCode()
          });
        }
      }

      if (onRedirectToList) {
        onRedirectToList({ anio: savedAnio, codDireccion: savedCodDireccion });
      }
      
      // No limpiar automáticamente aquí si el padre maneja el estado
      if (!onSubmit) handleNuevo();
      
    } catch (error) {
      console.error('Error al guardar arancel:', error);
    }
  };

  const handleEliminar = async () => {
    if (!codArancelActual) return;
    if (!window.confirm('¿Está seguro de que desea eliminar este arancel?')) return;

    try {
      await eliminarArancel(codArancelActual);
      handleNuevo();
    } catch (error) {
      console.error('Error eliminando arancel:', error);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(to bottom, #ffffff, #fafafa)', border: '1px solid', borderColor: 'divider' }}>
        {isEditMode && <Alert severity="info" sx={{ mb: 3 }}>Modo edición: Actualizando arancel existente.</Alert>}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: '0 0 120px' }}>
            {/* Box Año */}
            <TextField fullWidth size="small" label="Año" type="number" value={formData.anio || ''} onChange={(e) => handleAnioChange(e.target.value)} error={!!errors.anio} helperText={errors.anio} />
          </Box>

          <Box sx={{ flex: '0 0 150px' }}>
            {/* Box Costo */}
            <TextField fullWidth size="small" label="Costo S/." type="number" value={formData.costoArancel || ''} onChange={handleCostoChange} error={!!errors.costoArancel} helperText={errors.costoArancel} disabled={submitting} InputProps={{ startAdornment: <InputAdornment position="start">S/</InputAdornment> }} />
          </Box>

          <Box sx={{ flex: '0 0 200px' }}>
            {/* Box Dirección */}
            <Button variant="outlined" startIcon={<LocationIcon />} onClick={() => setModalDireccionOpen(true)} disabled={submitting} fullWidth sx={{ height: 40, textTransform: 'none' }}>
              {direccionSeleccionada ? 'Cambiar Dirección' : 'Seleccionar Dirección'}
            </Button>
            {errors.direccion && <FormHelperText error>{errors.direccion}</FormHelperText>}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>

            {/* Boton Guardar */}
            <Button 
              variant="contained" 
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
              onClick={handleSubmit} 
              disabled={submitting}
              sx={{ 
                minWidth: '120px', 
                height: '40px',
                fontWeight: 700, 
                backgroundColor: '#10b981 !important', 
                color: 'white !important', 
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#059669 !important',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#e5e7eb !important',
                  color: '#9ca3af !important',
                  border: '1px solid #d1d5db !important',
                  boxShadow: 'none !important',
                  opacity: '0.8 !important'
                }
              }}
            >
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </Button>
            {/* Boton Nuevo */}
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleNuevo} disabled={submitting} sx={{ height: '40px' }}>Nuevo</Button>
            {/* Boton Eliminar */}
            {isEditMode && <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleEliminar} disabled={submitting} sx={{ height: '40px' }}>Eliminar</Button>}
          </Box>
        </Box>

        {direccionSeleccionada && (
          <Box sx={{ p: 2, mt: 2, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <Typography variant="caption" color="text.secondary" display="block"><LocationIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} /> Dirección seleccionada:</Typography>
            <Typography variant="body2" fontWeight={600}>{direccionSeleccionada.descripcion}</Typography>
          </Box>
        )}
      </Paper>

      <SelectorDirecciones open={modalDireccionOpen} onClose={() => setModalDireccionOpen(false)} onSelectDireccion={handleSelectDireccion} />
    </>
  );
};

export default AsignacionArancelForm;
