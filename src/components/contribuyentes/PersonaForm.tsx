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

const normalizarEtiqueta = (label: string) => label
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .trim();

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
  const numeroDocumento = watch('numeroDocumento');

  // Hook para gestión de personas
  const { error: errorPersona, listarPersona } = usePersonas();
  
  // Hook para gestión de contribuyentes
  const { 
    error: errorContribuyente 
  } = useContribuyentes();

  // Cargar opciones dinámicas usando hooks personalizados
  const { 
    options: tipoDocumentoOptionsCatalogo,
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

  const tipoDocumentoOptions = React.useMemo(() => {
    if (isJuridica) {
      const opcionRuc = tipoDocumentoOptionsCatalogo.find((option) =>
        normalizarEtiqueta(option.label).includes('RUC')
      );

      return opcionRuc
        ? [opcionRuc]
        : [{ value: BUSINESS_CODES.TIPO_DOCUMENTO.RUC, label: 'RUC', id: BUSINESS_CODES.TIPO_DOCUMENTO.RUC }];
    }

    return tipoDocumentoOptionsCatalogo.filter((option) => {
      const codigo = String(option.value).trim();
      const etiqueta = normalizarEtiqueta(option.label);

      const esDni =
        (codigo === BUSINESS_CODES.TIPO_DOCUMENTO.DNI || etiqueta.includes('DNI')) &&
        !etiqueta.includes('SIN DNI');
      const esPartidaNacimiento = etiqueta.includes('PARTIDA') && etiqueta.includes('NACIMIENTO');
      const esSinDni = etiqueta.includes('SIN DNI');
      const esCarnetExtranjeria =
        codigo === BUSINESS_CODES.TIPO_DOCUMENTO.CE ||
        etiqueta.includes('CARNET') ||
        etiqueta.includes('EXTRANJER');

      return esDni || esPartidaNacimiento || esSinDni || esCarnetExtranjeria;
    });
  }, [isJuridica, tipoDocumentoOptionsCatalogo]);

  const tipoContribuyenteAnterior = React.useRef(isJuridica);

  React.useEffect(() => {
    if (loadingTipoDoc || tipoDocumentoOptions.length === 0) return;

    const tipoActual = String(form.getValues('tipoDocumento') || '').trim();
    const tipoPermitido = tipoDocumentoOptions.some(
      (option) => String(option.value).trim() === tipoActual
    );
    const cambioTipoContribuyente = tipoContribuyenteAnterior.current !== isJuridica;
    tipoContribuyenteAnterior.current = isJuridica;

    if (!tipoPermitido || cambioTipoContribuyente) {
      const codigoPreferido = isJuridica
        ? BUSINESS_CODES.TIPO_DOCUMENTO.RUC
        : BUSINESS_CODES.TIPO_DOCUMENTO.DNI;
      const opcionPreferida = tipoDocumentoOptions.find(
        (option) => String(option.value).trim() === codigoPreferido
      ) ?? tipoDocumentoOptions[0];

      form.setValue('tipoDocumento', String(opcionPreferida.value), {
        shouldDirty: cambioTipoContribuyente,
        shouldValidate: true
      });
      form.setValue('numeroDocumento', '', {
        shouldDirty: cambioTipoContribuyente,
        shouldValidate: false
      });
      form.clearErrors('numeroDocumento');
    }
  }, [form, isJuridica, loadingTipoDoc, tipoDocumentoOptions]);

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

  const documentoConfig = React.useMemo(() => {
    const tipoDoc = String(tipoDocumento || '').trim();
    const etiqueta = normalizarEtiqueta(
      tipoDocumentoOptions.find((option) => String(option.value).trim() === tipoDoc)?.label || ''
    );

    if (
      tipoDoc === BUSINESS_CODES.TIPO_DOCUMENTO.DNI ||
      (etiqueta.includes('DNI') && !etiqueta.includes('SIN DNI'))
    ) {
      return {
        pattern: /^\d{8}$/,
        maxLength: 8,
        placeholder: '12345678',
        errorMessage: 'DNI debe tener 8 dígitos'
      };
    }

    if (tipoDoc === BUSINESS_CODES.TIPO_DOCUMENTO.RUC || etiqueta.includes('RUC')) {
      return {
        pattern: /^\d{11}$/,
        maxLength: 11,
        placeholder: '20123456789',
        errorMessage: 'RUC debe tener 11 dígitos'
      };
    }

    if (
      tipoDoc === BUSINESS_CODES.TIPO_DOCUMENTO.CE ||
      etiqueta.includes('CARNET') ||
      etiqueta.includes('EXTRANJER')
    ) {
      return {
        pattern: /^\d{9}$/,
        maxLength: 9,
        placeholder: '123456789',
        errorMessage: 'Carnet de Extranjería debe tener 9 dígitos'
      };
    }

    if (etiqueta.includes('PARTIDA') && etiqueta.includes('NACIMIENTO')) {
      return {
        pattern: /^\d{1,15}$/,
        maxLength: 15,
        placeholder: 'Número de partida',
        errorMessage: 'Partida de Nacimiento debe tener entre 1 y 15 dígitos'
      };
    }

    if (etiqueta.includes('SIN DNI')) {
      return {
        pattern: /^\d{1,15}$/,
        maxLength: 15,
        placeholder: 'Número identificador',
        errorMessage: 'Sin DNI debe tener entre 1 y 15 dígitos'
      };
    }

    return {
      pattern: /^\d{1,15}$/,
      maxLength: 15,
      placeholder: 'Número',
      errorMessage: 'El documento debe contener únicamente números'
    };
  }, [tipoDocumento, tipoDocumentoOptions]);

  const [consultandoDocumento, setConsultandoDocumento] = React.useState(false);
  const [mensajeConsulta, setMensajeConsulta] = React.useState<string | null>(null);
  const [estadoConsulta, setEstadoConsulta] = React.useState<'success' | 'info' | 'error'>('info');
  const ultimaConsultaRef = React.useRef('');
  const consultaActivaRef = React.useRef(0);

  React.useEffect(() => {
    const tipo = String(tipoDocumento || '').trim();
    const numero = String(numeroDocumento || '').trim();
    const documentoValido = tipo !== '' && documentoConfig.pattern.test(numero);

    if (!documentoValido) {
      consultaActivaRef.current += 1;
      ultimaConsultaRef.current = '';
      setConsultandoDocumento(false);
      setMensajeConsulta(null);

      if (form.getValues('codPersona')) {
        form.setValue('codPersona', null);
        form.setValue('nombres', '');
        form.setValue('razonSocial', '');
        form.setValue('apellidoPaterno', '');
        form.setValue('apellidoMaterno', '');
        form.setValue('fechaNacimiento', null);
        form.setValue('estadoCivil', '');
        form.setValue('sexo', BUSINESS_CODES.SEXO.MASCULINO);
        form.setValue('telefono', '');
        form.setValue('direccion', null);
        form.setValue('nFinca', '');
        form.setValue('otroNumero', '');
      }
      return;
    }

    const claveConsulta = `${tipo}:${numero}`;
    if (ultimaConsultaRef.current === claveConsulta) return;

    const timer = window.setTimeout(async () => {
      ultimaConsultaRef.current = claveConsulta;
      const consultaActual = ++consultaActivaRef.current;
      setConsultandoDocumento(true);
      setMensajeConsulta(null);

      try {
        const personas = await listarPersona(tipo, numero);
        if (consultaActual !== consultaActivaRef.current) return;

        const personaEncontrada = personas.find(
          (persona) => String(persona.numerodocumento).trim() === numero
        ) ?? personas[0];

        if (!personaEncontrada) {
          form.setValue('codPersona', null);
          setEstadoConsulta('info');
          setMensajeConsulta('No existe una persona con este documento. Puede continuar con el registro.');
          return;
        }

        form.setValue('codPersona', personaEncontrada.codPersona);
        form.setValue('tipoDocumento', String(personaEncontrada.codTipoDocumento || tipo));
        form.setValue('numeroDocumento', personaEncontrada.numerodocumento || numero);
        form.setValue('nombres', isJuridica ? '' : (personaEncontrada.nombres || ''));
        form.setValue(
          'razonSocial',
          isJuridica ? (personaEncontrada.razonSocial || personaEncontrada.nombres || '') : ''
        );
        form.setValue('apellidoPaterno', personaEncontrada.apellidopaterno || '');
        form.setValue('apellidoMaterno', personaEncontrada.apellidomaterno || '');
        form.setValue(
          'fechaNacimiento',
          personaEncontrada.fechanacimiento
            ? String(personaEncontrada.fechanacimiento).slice(0, 10)
            : null
        );
        form.setValue('estadoCivil', personaEncontrada.codestadocivil || '');
        form.setValue('sexo', personaEncontrada.codsexo || BUSINESS_CODES.SEXO.MASCULINO);
        form.setValue('telefono', personaEncontrada.telefono || '');
        form.setValue(
          'direccion',
          personaEncontrada.codDireccion
            ? {
                id: personaEncontrada.codDireccion,
                descripcion: personaEncontrada.direccion || 'Dirección registrada'
              }
            : null
        );
        form.setValue(
          'nFinca',
          personaEncontrada.lote != null ? String(personaEncontrada.lote) : ''
        );
        form.setValue('otroNumero', personaEncontrada.otros || '');
        form.clearErrors();
        setEstadoConsulta('success');
        setMensajeConsulta(
          `Persona encontrada. El formulario está en modo edición (código ${personaEncontrada.codPersona}).`
        );
      } catch {
        if (consultaActual !== consultaActivaRef.current) return;
        ultimaConsultaRef.current = '';
        setEstadoConsulta('error');
        setMensajeConsulta('No se pudo consultar el documento. Verifique la conexión e intente nuevamente.');
      } finally {
        if (consultaActual === consultaActivaRef.current) {
          setConsultandoDocumento(false);
        }
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [documentoConfig.pattern, form, isJuridica, listarPersona, numeroDocumento, tipoDocumento]);


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

        {mensajeConsulta && (
          <Alert severity={estadoConsulta} sx={{ mb: 2 }}>
            {mensajeConsulta}
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
                      value={tipoDocumentoOptions.find(
                        (option) => String(option.value) === String(field.value)
                      ) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.value || '');
                        form.setValue('numeroDocumento', '', {
                          shouldDirty: true,
                          shouldValidate: false
                        });
                        form.clearErrors('numeroDocumento');
                      }}
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
                    value: documentoConfig.pattern,
                    message: documentoConfig.errorMessage
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Número de Documento"
                    placeholder={documentoConfig.placeholder}
                    disabled={disablePersonaFields}
                    error={!!errors.numeroDocumento}
                    helperText={String(errors.numeroDocumento?.message || '')}
                    sx={fieldStyles}
                    onChange={(e) => {
                      // Solo permitir números
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const maxLen = documentoConfig.maxLength;
                      const truncatedValue = value.slice(0, maxLen);
                      field.onChange(truncatedValue);
                    }}
                    inputProps={{
                      maxLength: documentoConfig.maxLength,
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </InputAdornment>
                      ),
                      endAdornment: consultandoDocumento
                        ? <CircularProgress size={18} />
                        : undefined
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
                    helperText={String(
                      (isJuridica ? errors.razonSocial : errors.nombres)?.message || ''
                    )}
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
