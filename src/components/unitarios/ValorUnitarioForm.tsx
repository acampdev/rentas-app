// src/components/unitarios/ValorUnitarioForm.tsx
import React, { useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  useTheme,
  Autocomplete,
  Button,
  CircularProgress,
  Typography,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ValorUnitarioData } from '../../services/valorUnitarioService';
import { 
  useCategoriasValoresUnitariosOptions, 
  useCategoriasValoresUnitariosHijosOptions, 
  useLetraValoresUnitariosOptions 
} from '../../hooks/useConstantesOptions';

// Esquema de validación con Zod
const valorUnitarioSchema = z.object({
  anio: z.coerce.number().min(1900, 'Año inválido').max(2100, 'Año inválido'),
  codCategoria: z.string().min(1, 'La categoría es requerida'),
  codSubcategoria: z.string().min(1, 'La subcategoría es requerida'),
  codLetra: z.string().min(1, 'La letra es requerida'),
  costo: z.coerce.number().min(0, 'El costo no puede ser negativo')
});

type ValorUnitarioFormData = z.infer<typeof valorUnitarioSchema>;

interface ValorUnitarioFormProps {
  valorSeleccionado?: ValorUnitarioData | null;
  onSubmit: (data: ValorUnitarioFormData) => Promise<void>;
  onNuevo: () => void;
  isSubmitting?: boolean;
}

const ValorUnitarioForm: React.FC<ValorUnitarioFormProps> = ({
  valorSeleccionado,
  onSubmit,
  onNuevo,
  isSubmitting = false
}) => {
  const _theme = useTheme();
  
  // Hooks de constantes
  const { options: categoriasOptions, loading: loadingCategorias } = useCategoriasValoresUnitariosOptions();
  const { options: letrasOptions, loading: loadingLetras } = useLetraValoresUnitariosOptions();
  
  // Estado local para disparar el hook de subcategorías
  const { 
    control, 
    handleSubmit, 
    watch, 
    reset, 
    setValue,
    formState: { errors: formErrors } 
  } = useForm<ValorUnitarioFormData>({
    resolver: zodResolver(valorUnitarioSchema),
    defaultValues: {
      anio: new Date().getFullYear(),
      codCategoria: '',
      codSubcategoria: '',
      codLetra: '',
      costo: 0
    }
  });

  const selectedCategoryId = watch('codCategoria');
  
  // Hook de subcategorías dependiente de la categoría seleccionada
  const { 
    options: subcategoriasOptions, 
    loading: loadingSubcategorias 
  } = useCategoriasValoresUnitariosHijosOptions(selectedCategoryId);

  // Cargar datos en modo edición
  useEffect(() => {
    if (valorSeleccionado) {
      reset({
        anio: valorSeleccionado.año,
        codCategoria: valorSeleccionado.categoria, // El modelo usa 'categoria' para el ID en algunos casos, verificar normalización
        codSubcategoria: valorSeleccionado.subcategoria,
        codLetra: valorSeleccionado.letra,
        costo: valorSeleccionado.costo
      });
    }
  }, [valorSeleccionado, reset]);

  // Manejar cambio de categoría
  const handleCategoryChange = (val: string | null) => {
    setValue('codCategoria', val || '');
    setValue('codSubcategoria', ''); // Limpiar subcategoría al cambiar categoría
  };

  const onFormSubmit = async (data: ValorUnitarioFormData) => {
    await onSubmit(data);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff' }}>
      {Object.keys(formErrors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>Faltan datos obligatorios</AlertTitle>
          Por favor, verifique los campos marcados en rojo.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
        {/* FILA 1: Año (mínimo), Categoría y Subcategoría (Máximo ancho con Flexbox) */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
          <Box sx={{ width: '100px', flexShrink: 0 }}>
            <Controller
              name="anio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Año"
                  type="number"
                  size="small"
                  error={!!formErrors.anio}
                />
              )}
            />
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Controller
              name="codCategoria"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  fullWidth
                  options={categoriasOptions}
                  getOptionLabel={(o) => o.label || ''}
                  loading={loadingCategorias}
                  value={categoriasOptions.find(opt => opt.value === field.value) || null}
                  onChange={(_, val) => handleCategoryChange(val?.value ? String(val.value) : null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categoría"
                      size="small"
                      error={!!formErrors.codCategoria}
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flexGrow: 1.2, minWidth: 0 }}>
            <Controller
              name="codSubcategoria"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  fullWidth
                  options={subcategoriasOptions}
                  getOptionLabel={(o) => o.label || ''}
                  loading={loadingSubcategorias}
                  disabled={!selectedCategoryId}
                  value={subcategoriasOptions.find(opt => opt.value === field.value) || null}
                  onChange={(_, val) => field.onChange(val?.value ? String(val.value) : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subcategoría"
                      size="small"
                      error={!!formErrors.codSubcategoria}
                      placeholder="Seleccione descripción..."
                    />
                  )}
                />
              )}
            />
          </Box>
        </Box>

        {/* FILA 2: Letra, Costo y Botones alineados a la derecha */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Campo de letra */}
          <Box sx={{ width: '90px', flexShrink: 0 }}>
            <Controller
              name="codLetra"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  fullWidth
                  options={letrasOptions}
                  getOptionLabel={(o) => o.label || ''}
                  loading={loadingLetras}
                  value={letrasOptions.find(opt => opt.value === field.value) || null}
                  onChange={(_, val) => field.onChange(val?.value ? String(val.value) : '')}
                  renderOption={(props, option) => (
                    <li {...props} className={`${props.className || ''} notranslate`} translate="no">
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Letra"
                      size="small"
                      error={!!formErrors.codLetra}
                      inputProps={{
                        ...params.inputProps,
                        className: `${params.inputProps.className || ''} notranslate`,
                        translate: 'no'
                      }}
                    />
                  )}
                />
              )}
            />
          </Box>
          {/* Campo de costo */}
          <Box sx={{ width: '120px', flexShrink: 0 }}>
            <Controller
              name="costo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Costo"
                  type="number"
                  size="small"
                  error={!!formErrors.costo}
                  onFocus={(e) => {
                    if (Number(e.target.value) === 0) field.onChange('');
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') field.onChange(0);
                  }}
                  value={field.value === 0 ? '' : field.value}
                  sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      display: 'none',
                    },
                    '& input[type=number]': {
                      MozAppearance: 'textfield',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'primary.main' }}>S/</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          {/* Espaciador y Botones a la derecha */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={() => {
                reset({
                  anio: new Date().getFullYear(),
                  codCategoria: '',
                  codSubcategoria: '',
                  codLetra: '',
                  costo: 0
                });
                onNuevo();
              }}
              disabled={isSubmitting}
              sx={{ height: '38px', textTransform: 'none' }}
            >
              Nuevo
            </Button>
            
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={isSubmitting}
              style={{ 
                backgroundColor: isSubmitting ? undefined : '#10b981',
                color: 'white',
                fontWeight: 700,
                minWidth: '130px',
                height: '38px',
                textTransform: 'none'
              }}
            >
              {valorSeleccionado ? 'Actualizar' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ValorUnitarioForm;
