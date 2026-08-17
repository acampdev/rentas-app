import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
  Autocomplete
} from '@mui/material';
import {
  Home as HomeIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Controller } from 'react-hook-form';

import SelectorDireccionArancel from '../modal/SelectorDireccionArancel';
import { usePredioForm, PredioFormData, DireccionData } from '../../hooks/usePredioForm';

interface PredioFormProps {
  predioExistente?: Partial<PredioFormData>;
  onSubmit?: (data: PredioFormData & { imagenes: File[] }) => void;
  codPersona?: number;
  loading?: boolean;
}

const PredioForm: React.FC<PredioFormProps> = ({
  predioExistente,
  onSubmit: onSubmitCallback,
  codPersona,
  loading: externalLoading = false
}) => {
  const theme = useTheme();
  const {
    form,
    showSelectorDireccionArancel,
    setShowSelectorDireccionArancel,
    selectedImages,
    setSelectedImages,
    options,
    isUsoPredioDisabled,
    handleSelectArancel,
    handleImageUpload,
    onFormSubmit
  } = usePredioForm(predioExistente, codPersona, onSubmitCallback);

  const { control, formState: { errors, isSubmitting }, watch, setValue } = form;

  const direccionValue = watch('direccion');
  const numeroFincaValue = watch('numeroFinca');
  const otroNumeroValue = watch('otroNumero');

  const buildDireccionCompleta = (direccion: DireccionData | null | undefined, nFinca?: string, otro?: string) => {
    if (!direccion) return '';
    let desc = direccion.direccionCompleta || direccion.descripcion || `Año: ${direccion.anio} - Código: ${direccion.codigo}`;
    
    // Limpiar lote/lotes anterior si existe
    desc = desc.replace(/,?\s*Lotes?:\s*\d+\s*-?\s*\d*/gi, '');
    
    // Quitar cualquier N° Finca o Otro N° previamente concatenado para evitar duplicados al escribir
    desc = desc.split(' - N° Finca:')[0].split(' - Otro N°:')[0];
    
    desc = desc.trim().replace(/,\s*$/, '');
    if (nFinca?.trim()) desc += ` - N° Finca: ${nFinca.trim()}`;
    if (otro?.trim()) desc += ` - Otro N°: ${otro.trim()}`;
    return desc;
  };

  useEffect(() => {
    if (direccionValue) {
      const nuevaDesc = buildDireccionCompleta(direccionValue as DireccionData, numeroFincaValue, otroNumeroValue);
      if (direccionValue.descripcion !== nuevaDesc) {
        setValue('direccion', { ...direccionValue, descripcion: nuevaDesc });
      }
    }
  }, [numeroFincaValue, otroNumeroValue, direccionValue, setValue]);

  const loading = externalLoading || isSubmitting;

  const renderAutocomplete = (name: keyof PredioFormData, label: string, opts: any[], l: boolean, e: string | null, req = true, customDisabled = false) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={opts}
          getOptionLabel={(o) => o?.label || ''}
          getOptionKey={(o) => String(o?.value ?? o?.id ?? o?.label ?? '')}
          value={opts.find(opt => String(opt.value) === String(field.value)) || null}
          onChange={(_, val) => field.onChange(val?.value || '')}
          disabled={l || customDisabled}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              required={req}
              error={!!errors[name] || !!e}
              helperText={String(errors[name]?.message || '') || (e || '')}
              InputProps={{ ...params.InputProps, endAdornment: <>{l && <CircularProgress size={20} />}{params.InputProps.endAdornment}</> }}
            />
          )}
        />
      )}
    />
  );

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={onFormSubmit}>
        <Stack spacing={3}>
          <Paper elevation={0} sx={{ p: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`, borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                {predioExistente ? <HomeIcon fontSize="medium" /> : <AddIcon fontSize="medium" />}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">{predioExistente ? 'Editar Predio' : 'Registrar Nuevo Predio'}</Typography>
                <Typography variant="body2" color="text.secondary">Complete la información del predio en el sistema</Typography>
              </Box>
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Año */}
              <Box sx={{ flex: '0 0 120px' }}>
                <Controller name="anio" control={control} render={({ field }) => <TextField {...field} fullWidth size="small" label="Año" type="number" error={!!errors.anio} helperText={errors.anio?.message} />} />
              </Box>
              {/* Fecha adquisición */}
              <Box sx={{ flex: '0 0 160px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <Controller name="fechaAdquisicion" control={control} render={({ field }) => <DatePicker {...field} label="Fecha adquisición" slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.fechaAdquisicion, helperText: errors.fechaAdquisicion?.message } }} />} />
                </LocalizationProvider>
              </Box>
              {/* Estado Predio */}
              <Box sx={{ flex: '0 0 220px' }}>
                {renderAutocomplete('estadoPredio', 'Estado Predio', options.estadoPredioData, options.loading.estado, options.errors.estado, false)}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Tipo Predio */}
              <Box sx={{ flex: '0 0 250px' }}>{renderAutocomplete('tipoPredio', 'Tipo Predio', options.tipoPredioData, options.loading.tipo, options.errors.tipo, false)}</Box>
              {/* Clasificacion Predio */}
              <Box sx={{ flex: '0 0 600px' }}>{renderAutocomplete('clasificacionPredio', 'Clasificacion Predio', options.clasificacionPredioFiltrada, options.loading.clasificacion, options.errors.clasificacion, false)}</Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Uso Predio */}
              <Box sx={{ flex: '0 0 250px' }}>{renderAutocomplete('usoPredio', 'Uso Predio', options.usoPredioData, options.loading.uso, options.errors.uso, false, isUsoPredioDisabled)}</Box>
              {/* Condicion Propiedad */}
              <Box sx={{ flex: '0 0 280px' }}>{renderAutocomplete('condicionPropiedad', 'Condicion Propiedad', options.condicionData, options.loading.condicion, options.errors.condicion, true)}</Box>
               {/* Conductor */}
               <Box sx={{ flex: '0 0 150px' }}>{renderAutocomplete('conductor', 'Conductor', options.conductorData, options.loading.conductor, options.errors.conductor, true)}</Box>
              {/* Área m2 */}
              <Box sx={{ flex: '0 0 80px' }}>
                <Controller
                  name="areaTerreno"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Área m2"
                      type="number"
                      fullWidth
                      size="small"
                      error={!!errors.areaTerreno}
                      helperText={errors.areaTerreno?.message}
                      onFocus={(_e) => {
                        if (Number(field.value) === 0) {
                          field.onChange('');
                        }
                      }}
                      onBlur={(_e) => {
                        if (String(field.value) === '' || field.value === undefined || field.value === null) {
                          field.onChange(0);
                        }
                        field.onBlur();
                      }}
                      sx={{
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>

           

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Botón para seleccionar dirección */}
              <Button
                variant="contained"
                onClick={() => setShowSelectorDireccionArancel(true)}
                disabled={loading}
                startIcon={<LocationIcon />}
                size="small"
                sx={{
                  height: 40,
                  backgroundColor: '#3b82f6 !important', // Azul premium coherente
                  color: 'white !important',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    backgroundColor: '#2563eb !important',
                    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: `${alpha('#3b82f6', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important',
                    boxShadow: 'none'
                  }
                }}
              >
                Seleccionar dirección
              </Button>
              {/* N° finca */}
              <Box sx={{ flex: '0 0 100px' }}><Controller name="numeroFinca" control={control} render={({ field }) => <TextField {...field} label="N° finca" fullWidth size="small" />} /></Box>
              {/* Otro N° */}
              <Box sx={{ flex: '0 0 100px' }}><Controller name="otroNumero" control={control} render={({ field }) => <TextField {...field} label="Otro N°" fullWidth size="small" />} /></Box>
              {/* Arancel */}
              <Box sx={{ flex: '0 0 70px' }}><Controller name="arancel" control={control} render={({ field }) => <TextField {...field} label="Arancel" fullWidth size="small" disabled InputProps={{ readOnly: true }} />} /></Box>
            </Box>

            {/* Dirección seleccionada */}
            {direccionValue && (
              <Alert severity="info" sx={{ py: 0.5, fontSize: '0.75rem' }}>
                📍 {buildDireccionCompleta(direccionValue, numeroFincaValue, otroNumeroValue)}
              </Alert>
            )}
          </Stack>

          <Divider />
          {/* Imágenes - Foto y Plano */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Imágenes</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Botón para foto */}
              <Button
                variant="outlined"
                component="label"
                disabled={loading}
                startIcon={<PhotoIcon />}
                sx={{
                  width: 120,
                  height: 40,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& input[type="file"]': {
                    display: 'none !important',
                  }
                }}
              >
                Foto
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>
              {/* Botón para plano */}
              <Button
                variant="outlined"
                component="label"
                disabled={loading}
                startIcon={<DescriptionIcon />}
                sx={{
                  width: 120,
                  height: 40,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& input[type="file"]': {
                    display: 'none !important',
                  }
                }}
              >
                Plano
                <input type="file" hidden multiple onChange={handleImageUpload} />
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}><Stack direction="row" spacing={1} flexWrap="wrap">{selectedImages.map((f, i) => <Chip key={i} label={f.name} onDelete={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} size="small" />)}</Stack></Box>
          </Box>

          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {/* Botón para nuevo predio */}
            <Button
              variant="outlined"
              onClick={() => form.reset()}
              disabled={loading}
              sx={{
                height: 45,
                minWidth: 120,
                textTransform: 'none',
                borderRadius: 1.5,
                fontWeight: 600,
                borderColor: theme.palette.divider,
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              Nuevo
            </Button>
            {/* Botón para guardar predio */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{
                height: 45,
                minWidth: 150,
                backgroundColor: '#10b981 !important', // Verde esmeralda premium
                color: 'white !important',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1.5,
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                '&:hover': {
                  backgroundColor: '#059669 !important',
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                },
                '&.Mui-disabled': {
                  backgroundColor: `${alpha('#10b981', 0.5)} !important`,
                  color: 'rgba(255, 255, 255, 0.7) !important',
                  boxShadow: 'none'
                }
              }}
            >
              {predioExistente ? 'Guardar' : 'Registrar'}
            </Button>
          </Box>
        </Stack>
      </form>

      <SelectorDireccionArancel open={showSelectorDireccionArancel} onClose={() => setShowSelectorDireccionArancel(false)} onSelectArancel={handleSelectArancel} title="Seleccionar Dirección" />
    </Paper>
  );
};

export default PredioForm;
