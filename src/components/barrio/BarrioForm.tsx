// src/components/barrio/BarrioForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { BarrioFormData } from '../../models/Barrio';
import { useSectores } from '../../hooks/useSectores';

// Esquema de validación con nombres de campos correctos
const schema = yup.object().shape({
  nombreBarrio: yup
    .string()
    .trim()
    .required('El nombre del barrio es requerido')
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .default(''),
  codSector: yup
    .number()
    .positive('Debe seleccionar un sector')
    .integer()
    .required('El sector es requerido')
    .typeError('Debe seleccionar un sector válido')
    .default(0),
  descripcion: yup.string().optional().default('')
});

interface BarrioFormProps {
  onSubmit: (data: BarrioFormData) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onNew?: () => void;
  initialData?: Partial<BarrioFormData>;
  isSubmitting?: boolean;
}

const BarrioForm: React.FC<BarrioFormProps> = ({
  onSubmit,
  onDelete,
  onNew,
  initialData,
  isSubmitting = false
}) => {
  const { sectores } = useSectores();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isNewMode, setIsNewMode] = useState(!initialData);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<BarrioFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      nombreBarrio: initialData?.nombreBarrio || (initialData as any)?.nombre || '',
      codSector: initialData?.codSector || 0,
      descripcion: initialData?.descripcion || ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombreBarrio: initialData.nombreBarrio || (initialData as any).nombre || '',
        codSector: initialData.codSector || 0,
        descripcion: initialData.descripcion || ''
      });
      setIsNewMode(false);
    } else {
      setIsNewMode(true);
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: BarrioFormData) => {
    await onSubmit(data);
  };

  const handleNew = () => {
    reset({ nombreBarrio: '', codSector: 0, descripcion: '' });
    setIsNewMode(true);
    onNew?.();
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 1.5, sm: 2 },
        pb: 1,
        borderRadius: 2,
        background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        mx: 'auto'
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          gap: 1.5,
          width: '100%'
        }}>
          {/* Nombre del Barrio */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 250px' }, minWidth: { xs: '100%', md: '250px' } }}>
            <TextField
              {...register('nombreBarrio')}
              label="Nombre del Barrio *"
              placeholder="Ingrese el nombre del barrio"
              fullWidth
              size="small"
              error={!!errors.nombreBarrio}
              helperText={errors.nombreBarrio?.message}
              disabled={isSubmitting}
              InputProps={{
                sx: { height: 40 }
              }}
            />
          </Box>

          {/* Sector */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 250px' }, minWidth: { xs: '100%', md: '250px' } }}>
            <Controller
              name="codSector"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={sectores || []}
                  getOptionLabel={(o) => o.nombre || 'Sin nombre'}
                  value={sectores?.find(s => s.id === field.value) || null}
                  onChange={(_, v) => field.onChange(v?.id || 0)}
                  disabled={isSubmitting}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sector *"
                      placeholder="Seleccione un sector"
                      error={!!errors.codSector}
                      helperText={errors.codSector?.message}
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        sx: { height: 40 }
                      }}
                    />
                  )}
                />
              )}
            />
          </Box>

          {/* Botones */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: '0 0 auto',
            alignSelf: 'flex-start',
            pt: 0.2
          }}>
            {/* Botón Nuevo */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleNew}
              disabled={isSubmitting}
              sx={{
                minWidth: 80,
                height: 40,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: 'white !important',
                color: '#1976d2 !important',
                border: '1px solid #1976d2 !important',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04) !important'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f3f4f6 !important',
                  color: '#9ca3af !important',
                  border: '1px solid #e5e7eb !important',
                  boxShadow: 'none !important'
                }
              }}
            >
              Nuevo
            </Button>

            {/* Botón Guardar / Actualizar */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : (isNewMode ? <SaveIcon /> : <EditIcon />)}
              disabled={isSubmitting}
              sx={{
                minWidth: 100,
                height: 40,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#1976d2 !important',
                color: 'white !important',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#1565c0 !important',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f3f4f6 !important',
                  color: '#9ca3af !important',
                  border: '1px solid #e5e7eb !important',
                  boxShadow: 'none !important'
                }
              }}
            >
              {isNewMode ? 'Guardar' : 'Actualizar'}
            </Button>

            {/* Botón Eliminar */}
            {onDelete && !isNewMode && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDeleteDialog(true)}
                disabled={isSubmitting}
                sx={{
                  minWidth: 80,
                  height: 40,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: 'white !important',
                  color: '#d32f2f !important',
                  border: '1px solid #d32f2f !important',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.04) !important'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#f3f4f6 !important',
                    color: '#9ca3af !important',
                    border: '1px solid #e5e7eb !important',
                    boxShadow: 'none !important'
                  }
                }}
              >
                Eliminar
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>Confirmar Eliminación</DialogTitle>
        <DialogContent><DialogContentText>¿Está seguro que desea eliminar este barrio?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={async () => { await onDelete?.(); setOpenDeleteDialog(false); }} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BarrioForm;
