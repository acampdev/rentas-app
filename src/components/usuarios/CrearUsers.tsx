// src/components/usuarios/CrearUsers.tsx
import React from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useUsuarios } from '../../hooks/useUsuarios';
import { USER_ESTADOS } from '../../config/constants';
import { buildApiUrl } from '../../config/api.unified.config';
import apiClient, { unwrapApiList } from '../../services/apiClient';

// Esquema de validacion con Zod
const crearUserSchema = z.object({
  username: z.string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(50, 'El usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, numeros y guion bajo'),
  nombrePersona: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  documento: z.string()
    .length(8, 'El DNI debe tener exactamente 8 digitos')
    .regex(/^\d{8}$/, 'El DNI solo debe contener numeros'),
  codEstado: z.string()
    .min(1, 'Debe seleccionar un estado'),
  password: z.string()
    .min(6, 'La contrasena debe tener al menos 6 caracteres')
    .max(50, 'La contrasena no puede exceder 50 caracteres'),
  codRol: z.number()
    .min(1, 'Debe seleccionar un rol'),
});

type CrearUserFormData = z.infer<typeof crearUserSchema>;

// Opciones para el Autocomplete de Estado
const estadoOptions = [
  { label: 'Activo', value: USER_ESTADOS.ACTIVO },
  { label: 'Inactivo', value: USER_ESTADOS.INACTIVO },
  { label: 'Suspendido', value: USER_ESTADOS.SUSPENDIDO },
];

interface RolResponse {
  codRol: number;
  descripcion: string;
}

const CrearUsers: React.FC = () => {
  const { crearUsuario, isCreating } = useUsuarios();

  // Cargar roles desde el API usando React Query
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery<RolResponse[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const url = buildApiUrl('/api/rol');
      const res = await apiClient.request<unknown>(url);
      return unwrapApiList<RolResponse>(res);
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CrearUserFormData>({
    resolver: zodResolver(crearUserSchema),
    defaultValues: {
      username: '',
      nombrePersona: '',
      documento: '',
      codEstado: USER_ESTADOS.ACTIVO,
      password: '',
      codRol: 1,
    }
  });

  // Handler para guardar
  const onSubmit = async (data: CrearUserFormData) => {
    try {
      console.log('[CrearUsers] Enviando datos:', data);

      await crearUsuario({
        username: data.username,
        nombrePersona: data.nombrePersona,
        documento: data.documento,
        codEstado: data.codEstado,
        password: data.password,
        codRol: data.codRol
      });

      // Limpiar formulario despues de crear exitosamente
      reset({
        username: '',
        nombrePersona: '',
        documento: '',
        codEstado: USER_ESTADOS.ACTIVO,
        password: '',
        codRol: roles.length > 0 ? roles[0].codRol : 1,
      });

    } catch (error: any) {
      console.error('[CrearUsers] Error:', error);
    }
  };

  // Handler para nuevo (limpiar formulario)
  const handleNuevo = () => {
    reset({
      username: '',
      nombrePersona: '',
      documento: '',
      codEstado: USER_ESTADOS.ACTIVO,
      password: '',
      codRol: roles.length > 0 ? roles[0].codRol : 1,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Registro de Usuario
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Primera fila */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
            {/* Usuario */}
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Usuario"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={isCreating}
                  placeholder="Ingrese nombre de usuario"
                />
              )}
            />
          </Box>
          {/* Nombre Persona */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
            <Controller
              name="nombrePersona"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre Persona"
                  fullWidth
                  error={!!errors.nombrePersona}
                  helperText={errors.nombrePersona?.message}
                  disabled={isCreating}
                  placeholder="Ingrese nombre completo"
                />
              )}
            />
          </Box>

          {/* DNI */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
            <Controller
              name="documento"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="DNI"
                  fullWidth
                  error={!!errors.documento}
                  helperText={errors.documento?.message}
                  disabled={isCreating}
                  placeholder="8 digitos"
                  inputProps={{
                    maxLength: 8,
                    pattern: '[0-9]*',
                  }}
                  onChange={(e) => {
                    // Solo permitir numeros
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Box>

          {/* Segunda fila */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
            {/* Estado */}
            <Controller
              name="codEstado"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={estadoOptions}
                  getOptionLabel={(option) => option.label}
                  value={estadoOptions.find(opt => opt.value === value) || null}
                  onChange={(_, newValue) => {
                    onChange(newValue?.value || '');
                  }}
                  disabled={isCreating}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Estado"
                      error={!!errors.codEstado}
                      helperText={errors.codEstado?.message}
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
            {/* Contrasena */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contrasena"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isCreating}
                  placeholder="Minimo 6 caracteres"
                />
              )}
            />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
            {/* Rol */}
            <Controller
              name="codRol"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={roles}
                  getOptionLabel={(option) => option.descripcion || ''}
                  value={roles.find(opt => opt.codRol === value) || null}
                  onChange={(_, newValue) => {
                    onChange(newValue?.codRol || 1);
                  }}
                  disabled={isCreating || isLoadingRoles}
                  loading={isLoadingRoles}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Rol"
                      error={!!errors.codRol}
                      helperText={errors.codRol?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingRoles ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          </Box>

          {/* Tercera fila - Botones en el lado derecho */}
          <Box sx={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            {/* Boton Nuevo */}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleNuevo}
              disabled={isCreating}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': {
                  borderColor: '#2e7d32',
                  backgroundColor: 'rgba(76, 175, 80, 0.08)',
                },
                '&.Mui-disabled': {
                  borderColor: '#cccccc',
                  color: '#cccccc'
                }
              }}
            >
              Nuevo
            </Button>
            {/* Boton Guardar */}
            <Button
              type="submit"
              variant="contained"
              startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={isCreating}
              sx={{
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important',
                backgroundColor: '#4caf50 !important',
                color: '#ffffff !important',
                '&:hover': {
                  background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%) !important',
                  backgroundColor: '#43a047 !important',
                },
                '&.Mui-disabled': {
                  background: '#e0e0e0 !important',
                  backgroundColor: '#e0e0e0 !important',
                  color: 'rgba(0, 0, 0, 0.38) !important'
                }
              }}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CrearUsers;
