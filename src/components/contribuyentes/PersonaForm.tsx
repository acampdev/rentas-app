// src/components/contribuyentes/PersonaForm.tsx - ACTUALIZADO CON CONSTANTES DINÁMICAS
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  useTheme,
  Paper,
  Stack,
  Skeleton,
  CircularProgress,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Badge as BadgeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
// import SearchableSelect from '../ui/SearchableSelect'; // Reemplazado por Autocomplete
import { 
  useTipoDocumentoOptions, 
  useEstadoCivilOptions, 
  useSexoOptions 
} from '../../hooks/useConstantesOptions';
import { usePersonas } from '../../hooks/usePersonas';
import { useContribuyentes } from '../../hooks/useContribuyentes';
import { BUSINESS_CODES } from '../../config/constants';
import { ContribuyenteFormValues } from '../../hooks/useContribuyenteForm';
import { ContribuyenteDireccion } from '../../types/formTypes';
import { PersonaData } from '../../services/personaService';
import { ContribuyenteData } from '../../services/contribuyenteService';

interface PersonaFormProps {
  form: UseFormReturn<ContribuyenteFormValues>;
  isJuridica?: boolean;
  isRepresentante?: boolean;
  onOpenDireccionModal: () => void;
  direccion: ContribuyenteDireccion | null;
  getDireccionTextoCompleto: (direccion: ContribuyenteDireccion | null, nFinca?: string, otroNumero?: string) => string;
  disablePersonaFields?: boolean;
  onGuardar?: (data: { persona: PersonaData; contribuyente?: ContribuyenteData }) => void | Promise<void>;
  showGuardarButton?: boolean;
}

const PersonaFormMUI: React.FC<PersonaFormProps> = ({
  form,
  isJuridica = false,
  onOpenDireccionModal,
  direccion,
  getDireccionTextoCompleto,
  disablePersonaFields = false,
}) => {
  const theme = useTheme();
  const { control, watch, formState: { errors } } = form;

  const nFinca = watch('nFinca');
  const otroNumero = watch('otroNumero');
  const tipoDocumento = watch('tipoDocumento');

  // Hook para gestión de personas
  const { error: errorPersona } = usePersonas();
  
  // Hook para gestión de contribuyentes
  const { 
    error: errorContribuyente 
  } = useContribuyentes();

  // Cargar opciones dinámicas usando hooks personalizados
  const { 
    options: tipoDocumentoOptions, 
    loading: loadingTipoDoc, 
    error: errorTipoDoc 
  } = useTipoDocumentoOptions(isJuridica);

  const { 
    options: estadoCivilOptions, 
    loading: loadingEstadoCivil, 
    error: errorEstadoCivil 
  } = useEstadoCivilOptions();

  const { 
    options: sexoOptions, 
    loading: loadingSexo, 
    error: errorSexo 
  } = useSexoOptions();

  // Verificar si hay algún error de carga
  const hasLoadingErrors = errorTipoDoc || errorEstadoCivil || errorSexo;

  // Estilos comunes para los campos
  const fieldStyles = {
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.02)',
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  };

  // Función helper para determinar el placeholder del número de documento
  const getNumeroDocumentoPlaceholder = () => {
    const selectedOption = tipoDocumentoOptions.find(opt => opt.value === tipoDocumento);
    if (!selectedOption) return 'Número';
    
    // Usar el código de la constante para determinar el formato
    switch (tipoDocumento) {
      case BUSINESS_CODES.TIPO_DOCUMENTO.DNI: // DNI
        return '12345678';
      case BUSINESS_CODES.TIPO_DOCUMENTO.RUC: // RUC
        return '20123456789';
      default:
        return 'Número';
    }
  };

  // Función helper para validar número de documento
  const getDocumentoPattern = () => {
    // Convertir a string y limpiar para comparación robusta
    const tipoDoc = String(tipoDocumento || '').trim();

    // DNI: 8 dígitos
    if (tipoDoc === BUSINESS_CODES.TIPO_DOCUMENTO.DNI || tipoDoc.toUpperCase().includes('DNI')) {
      return /^\d{8}$/;
    }
    // RUC: 11 dígitos
    if (tipoDoc === BUSINESS_CODES.TIPO_DOCUMENTO.RUC || tipoDoc.toUpperCase().includes('RUC')) {
      return /^\d{11}$/;
    }
    // Carnet de Extranjería: hasta 12 caracteres alfanuméricos
    if (tipoDoc === BUSINESS_CODES.TIPO_DOCUMENTO.CE) {
      return /^[A-Za-z0-9]{1,12}$/;
    }
    // Pasaporte: hasta 12 caracteres alfanuméricos
    if (tipoDoc === BUSINESS_CODES.TIPO_DOCUMENTO.PASAPORTE) {
      return /^[A-Za-z0-9]{1,12}$/;
    }
    // Default
    return /^.+$/;
  };

  const getDocumentoMaxLength = () => {
    // Convertir a string y limpiar para comparación robusta
    const tipoDoc = String(tipoDocumento || '').trim();

    // DNI: 8 dígitos
    if (tipoDoc === '4101' || tipoDoc.toUpperCase().includes('DNI')) {
      return 8;
    }
    // RUC: 11 dígitos
    if (tipoDoc === '4102' || tipoDoc.toUpperCase().includes('RUC')) {
      return 11;
    }
    // Carnet de Extranjería: 12 dígitos
    if (tipoDoc === '4103') {
      return 12;
    }
    // Pasaporte: 12 dígitos
    if (tipoDoc === '4104') {
      return 12;
    }
    // Default
    return 15;
  };

  const getDocumentoErrorMessage = () => {
    // Convertir a string y limpiar para comparación robusta
    const tipoDoc = String(tipoDocumento || '').trim();

    // DNI: 8 dígitos
    if (tipoDoc === '4101' || tipoDoc.toUpperCase().includes('DNI')) {
      return 'DNI debe tener 8 dígitos';
    }
    // RUC: 11 dígitos
    if (tipoDoc === '4102' || tipoDoc.toUpperCase().includes('RUC')) {
      return 'RUC debe tener 11 dígitos';
    }
    // Carnet de Extranjería
    if (tipoDoc === '4103') {
      return 'Carnet de Extranjería debe tener máximo 12 caracteres';
    }
    // Pasaporte
    if (tipoDoc === '4104') {
      return 'Pasaporte debe tener máximo 12 caracteres';
    }
    // Default
    return 'Formato inválido';
  };


  return (
    <Box sx={{ Width: '100%' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 1, sm: 1.5 }, 
          borderRadius: { xs: 1, sm: 2 },
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >

        {/* Mostrar alerta si hay errores de carga */}
        {hasLoadingErrors && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
            Algunas opciones no pudieron cargarse. Se están usando valores por defecto.
          </Alert>
        )}

        <Stack spacing={{ xs: 1, sm: 1.5 }}>
          {/* Primera fila - Tipo Doc, Número Doc, Nombres/Razón Social */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 1.5 }, 
            flexWrap: 'wrap', 
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            {/* Tipo de Documento */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', sm: '0 0 205px' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              {loadingTipoDoc ? (
                <Skeleton variant="rounded" height={40} />
              ) : (
                <Controller
                  name="tipoDocumento"
                  control={control}
                  rules={{ required: 'Tipo de documento es requerido' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={tipoDocumentoOptions}
                      getOptionLabel={(option) => option?.label || ''}
                      value={tipoDocumentoOptions.find(opt => opt.value === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.value || '')}
                      disabled={disablePersonaFields || loadingTipoDoc}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tipo Documento"
                          placeholder="Seleccione tipo"
                          error={!!errors.tipoDocumento || !!errorTipoDoc}
                          helperText={
                            (errors.tipoDocumento?.message as string) ||
                            (errorTipoDoc ? 'Error al cargar opciones' : '')
                          }
                          sx={fieldStyles}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <BadgeIcon sx={{ fontSize: 16 }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              )}
            </Box>

            {/* Número de Documento */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', sm: '0 0 130px' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Controller
                name="numeroDocumento"
                control={control}
                rules={{
                  required: 'Requerido',
                  pattern: {
                    value: getDocumentoPattern(),
                    message: getDocumentoErrorMessage()
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Número de Documento"
                    placeholder={getNumeroDocumentoPlaceholder()}
                    disabled={disablePersonaFields}
                    error={!!errors.numeroDocumento}
                    helperText={String(errors.numeroDocumento?.message || '')}
                    sx={fieldStyles}
                    onChange={(e) => {
                      // Solo permitir números
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      // Usar la función getDocumentoMaxLength para obtener el límite correcto
                      // RUC (4102): 11 dígitos, DNI (4101): 8 dígitos, otros: 15
                      const maxLen = getDocumentoMaxLength();
                      const truncatedValue = value.slice(0, maxLen);
                      field.onChange(truncatedValue);
                    }}
                    inputProps={{
                      maxLength: getDocumentoMaxLength(),
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Box>

            {/* Nombres o Razón Social */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 160px' },
              maxWidth: { xs: '100%', sm: '200px' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Controller
                name={isJuridica ? 'razonSocial' : 'nombres'}
                control={control}
                rules={{ 
                  required: 'Este campo es requerido',
                  pattern: isJuridica ? undefined : {
                    value: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/,
                    message: 'Solo se permiten letras'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label={isJuridica ? 'Razón Social' : 'Nombres'}
                    placeholder={isJuridica ? 'Ingrese razón social' : 'Ingrese nombres'}
                    disabled={disablePersonaFields}
                    error={!!errors[isJuridica ? 'razonSocial' : 'nombres']}
                    helperText={String((errors as any)[isJuridica ? 'razonSocial' : 'nombres']?.message || '')}
                    sx={fieldStyles}
                    onChange={(e) => {
                      if (!isJuridica) {
                        // Solo permitir letras para nombres de persona natural
                        const value = e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
                        field.onChange(value);
                      } else {
                        // Para razón social permitir letras, números y algunos caracteres especiales
                        field.onChange(e.target.value);
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {isJuridica ? 
                            <BusinessIcon sx={{ fontSize: 16 }} /> : 
                            <PersonIcon sx={{ fontSize: 16 }} />
                          }
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Box>

            {/* Para Persona Jurídica: mostrar teléfono en primera fila */}
            {isJuridica && (
              <>
                {/* Teléfono */}
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '0 0 120px' },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Controller
                    name="telefono"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[0-9]{0,9}$/,
                        message: 'Teléfono inválido (máximo 9 dígitos)'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        label="Teléfono"
                        placeholder="999 999 999"
                        disabled={disablePersonaFields}
                        error={!!errors.telefono}
                        helperText={String(errors.telefono?.message || '')}
                        sx={fieldStyles}
                        onChange={(e) => {
                          // Solo permitir números
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          // Limitar a 9 dígitos (formato celular peruano)
                          const truncatedValue = value.slice(0, 9);
                          field.onChange(truncatedValue);
                        }}
                        inputProps={{
                          maxLength: 9,
                          inputMode: 'tel',
                          pattern: '[0-9]*'
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={{ fontSize: 16 }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Box>
              </>
            )}

            {/* Para Persona Natural: mostrar campos adicionales */}
            {!isJuridica && (
              <>
                {/* Apellido Paterno */}
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '0 0 120px' },
                  maxWidth: { xs: '100%', sm: '120px' },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Controller
                    name="apellidoPaterno"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/,
                        message: 'Solo se permiten letras'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        label="Ap. Paterno"
                        placeholder="Ap. paterno"
                        disabled={disablePersonaFields}
                        error={!!errors.apellidoPaterno}
                        helperText={String(errors.apellidoPaterno?.message || '')}
                        sx={fieldStyles}
                        onChange={(e) => {
                          // Solo permitir letras, espacios y caracteres especiales españoles
                          const value = e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Apellido Materno */}
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '0 0 120px' },
                  maxWidth: { xs: '100%', sm: '120px' },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Controller
                    name="apellidoMaterno"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/,
                        message: 'Solo se permiten letras'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        label="Ap. Materno"
                        placeholder="Ap. materno"
                        disabled={disablePersonaFields}
                        error={!!errors.apellidoMaterno}
                        helperText={String(errors.apellidoMaterno?.message || '')}
                        sx={fieldStyles}
                        onChange={(e) => {
                          // Solo permitir letras, espacios y caracteres especiales españoles
                          const value = e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </Box>
              </>
            )}
          </Box>

          {/* Segunda fila para Persona Jurídica: Button Seleccionar, N° Finca, Otro N° */}
          {isJuridica && (
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 1.5 }, 
              flexWrap: 'wrap', 
              alignItems: { xs: 'stretch', sm: 'stretch' },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              {/* Botón Seleccionar/Cambiar */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'stretch', sm: 'flex-end' }, 
                height: '100%',
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.currentTarget.blur(); // Quitar foco del botón
                    onOpenDireccionModal();
                  }}
                  disabled={disablePersonaFields}
                  startIcon={<LocationIcon sx={{ fontSize: 16 }} />}
                  sx={{ 
                    fontSize: '0.75rem',
                    height: '32px',
                    minHeight: '32px',
                    minWidth: { xs: '100%', sm: '120px' },
                    width: { xs: '100%', sm: 'auto' },
                    px: 2,
                    marginTop: { xs: 0, sm: '5px' }
                  }}
                >
                  {direccion ? 'Cambiar' : 'Seleccionar Direccion'}
                </Button>
              </Box>

              {/* N° Finca */}
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '0 0 100px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Controller
                  name="nFinca"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      label="N° Finca"
                      placeholder="123"
                      disabled={disablePersonaFields || !direccion}
                      fullWidth
                      sx={fieldStyles}
                    />
                  )}
                />
              </Box>

              {/* Otro N° */}
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '0 0 120px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Controller
                  name="otroNumero"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      label="Otro N°"
                      placeholder="Dpto, Int"
                      disabled={disablePersonaFields || !direccion}
                      fullWidth
                      sx={fieldStyles}
                    />
                  )}
                />
              </Box>

              {/* Dirección seleccionada compacta */}
              {direccion && (
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 auto' },
                  minWidth: { xs: '100%', sm: '300px' },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      py: 0.5,
                      px: 1,
                      minHeight: 'auto',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      '& .MuiAlert-message': { 
                        py: 0,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      },
                      '& .MuiAlert-icon': {
                        fontSize: '1rem',
                        paddingTop: 0,
                        marginRight: 0.5
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                      📍 {getDireccionTextoCompleto(direccion, nFinca || '', otroNumero)}
                    </Typography>
                  </Alert>
                </Box>
              )}
            </Box>
          )}

          {/* Segunda fila - Solo para personas naturales: Fecha Nacimiento , Sexo , Estado Civil y Teléfono */}
          {!isJuridica && (
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 1.5 }, 
              flexWrap: 'wrap', 
              alignItems: 'stretch',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              {/* Fecha de Nacimiento */}
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '0 0 140px' },
                maxWidth: { xs: '100%', sm: '140px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Controller
                  name="fechaNacimiento"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      label="Fecha Nac."
                      disabled={disablePersonaFields}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!errors.fechaNacimiento,
                          helperText: String(errors.fechaNacimiento?.message || ''),
                          sx: {
                            ...fieldStyles,
                            '& .MuiInputBase-input': {
                              fontSize: '0.75rem',
                              padding: '6px 10px'
                            }
                          },
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon sx={{ fontSize: 14 }} />
                              </InputAdornment>
                            ),
                          }
                        },
                        popper: {
                          placement: 'bottom-start'
                        }
                      }}
                    />
                  )}
                />
              </Box>

              {/* Sexo */}
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '0 0 160px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                {loadingSexo ? (
                  <Skeleton variant="rounded" height={40} />
                ) : (
                  <Controller
                    name="sexo"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={sexoOptions}
                        getOptionLabel={(option) => option?.label || ''}
                        value={sexoOptions.find(opt => opt.value === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue?.value || '')}
                        disabled={disablePersonaFields || loadingSexo}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Sexo"
                            placeholder="Seleccione"
                            error={!!errors.sexo || !!errorSexo}
                            helperText={
                              (errors.sexo?.message as string) ||
                              (errorSexo ? 'Error al cargar opciones' : '')
                            }
                            sx={fieldStyles}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FamilyRestroomIcon sx={{ fontSize: 16 }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  />
                )}
              </Box>

              {/* Estado Civil */}
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '0 0 180px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                {loadingEstadoCivil ? (
                  <Skeleton variant="rounded" height={40} />
                ) : (
                  <Controller
                    name="estadoCivil"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={estadoCivilOptions}
                        getOptionLabel={(option) => option?.label || ''}
                        value={estadoCivilOptions.find(opt => opt.value === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue?.value || '')}
                        disabled={disablePersonaFields || loadingEstadoCivil}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Est. Civil"
                            placeholder="Seleccione"
                            error={!!errors.estadoCivil || !!errorEstadoCivil}
                            helperText={
                              (errors.estadoCivil?.message as string) ||
                              (errorEstadoCivil ? 'Error al cargar opciones' : '')
                            }
                            sx={{
                              ...fieldStyles,
                              '& .MuiInputBase-root': {
                                ...fieldStyles['& .MuiInputBase-root'],
                                height: '32px',
                                minHeight: '32px'
                              }
                            }}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FamilyRestroomIcon sx={{ fontSize: 16 }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  />
                )}
              </Box>

              {/* Teléfono */}
              <Box sx={{
                flex: { xs: '1 1 100%', sm: '0 0 150px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Controller
                  name="telefono"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[0-9]{0,9}$/,
                      message: 'Teléfono inválido (máximo 9 dígitos)'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Teléfono"
                      placeholder="999 999 999"
                      disabled={disablePersonaFields}
                      error={!!errors.telefono}
                      helperText={String(errors.telefono?.message || '')}
                      sx={fieldStyles}
                      onChange={(e) => {
                        // Solo permitir números
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        // Limitar a 9 dígitos (formato celular peruano)
                        const truncatedValue = value.slice(0, 9);
                        field.onChange(truncatedValue);
                      }}
                      inputProps={{
                        maxLength: 9,
                        inputMode: 'tel',
                        pattern: '[0-9]*'
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ fontSize: 16 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>

              {/* Exonerado */}
              <Box sx={{
                flex: { xs: '1 1 100%', sm: '0 0 200px' },
                width: { xs: '100%', sm: 'auto' },
                display: 'flex',
                alignItems: 'center',
                minHeight: '40px'
              }}>
                <Controller
                  name="exonerado"
                  control={control}
                  defaultValue="No"
                  render={({ field }) => (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%'
                    }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: disablePersonaFields ? 'text.disabled' : 'text.primary',
                          fontWeight: 500,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Exonerado:
                      </Typography>
                      <RadioGroup
                        {...field}
                        row
                        sx={{
                          '& .MuiFormControlLabel-root': {
                            marginRight: 1,
                            marginLeft: 0
                          },
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem'
                          },
                          '& .MuiRadio-root': {
                            padding: '4px'
                          }
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio size="small" disabled={disablePersonaFields} />}
                          label="Si"
                          disabled={disablePersonaFields}
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio size="small" disabled={disablePersonaFields} />}
                          label="No"
                          disabled={disablePersonaFields}
                        />
                      </RadioGroup>
                    </Box>
                  )}
                />
              </Box>
            </Box>
          )}

          {/* Tercera fila - Solo para personas naturales: Button Seleccionar, N° Finca, Otro Número y Dirección */}
          {!isJuridica && (
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 1.5 }, 
              flexWrap: 'wrap', 
              alignItems: { xs: 'stretch', sm: 'stretch' },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              {/* Botón Seleccionar/Cambiar */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'stretch', sm: 'flex-end' }, 
                height: '100%',
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.currentTarget.blur(); // Quitar foco del botón
                    onOpenDireccionModal();
                  }}
                  disabled={disablePersonaFields}
                  startIcon={<LocationIcon sx={{ fontSize: 16 }} />}
                  sx={{ 
                    fontSize: '0.75rem',
                    height: '32px',
                    minHeight: '32px',
                    minWidth: { xs: '100%', sm: '120px' },
                    width: { xs: '100%', sm: 'auto' },
                    px: 2,
                    marginTop: { xs: 0, sm: '5px' }
                  }}
                >
                  {direccion ? 'Cambiar' : 'Seleccionar'}
                </Button>
              </Box>

              {/* N° Finca */}
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '0 0 100px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Controller
                  name="nFinca"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      label="N° Finca"
                      placeholder="123"
                      disabled={disablePersonaFields || !direccion}
                      fullWidth
                      sx={fieldStyles}
                    />
                  )}
                />
              </Box>

              {/* Otro N° */}
              <Box sx={{ 
                flex: { xs: '1 1 100%', sm: '0 0 120px' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Controller
                  name="otroNumero"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      label="Otro N°"
                      placeholder="Dpto, Int"
                      disabled={disablePersonaFields || !direccion}
                      fullWidth
                      sx={fieldStyles}
                    />
                  )}
                />
              </Box>

              {/* Dirección seleccionada */}
              {direccion && (
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 auto' },
                  minWidth: { xs: '100%', sm: '300px' },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      py: 0.5,
                      px: 1,
                      minHeight: 'auto',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      '& .MuiAlert-message': { 
                        py: 0,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      },
                      '& .MuiAlert-icon': {
                        fontSize: '1rem',
                        paddingTop: 0,
                        marginRight: 0.5
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                      📍 {getDireccionTextoCompleto(direccion, nFinca || '', otroNumero)}
                    </Typography>
                  </Alert>
                </Box>
              )}
            </Box>
          )}


          {/* Errores si existen */}
          {errorPersona && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errorPersona}
            </Alert>
          )}
          
          {errorContribuyente && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errorContribuyente}
            </Alert>
          )}


          {/* Indicador de carga general */}
          {(loadingTipoDoc || loadingEstadoCivil || loadingSexo) && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Cargando opciones...
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default PersonaFormMUI;