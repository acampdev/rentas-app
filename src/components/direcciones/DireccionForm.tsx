// src/components/direcciones/DireccionForm.tsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  DialogContentText,
  DialogActions,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DireccionData, CreateDireccionDTO } from '../../services/direccionService';
import { useTiposLadosDireccion, useRutasOptions, useZonasOptions, useUbicacionAreaVerdeOptions } from '../../hooks/useConstantesOptions';
import { useCalles } from '../../hooks/useCalles';
import { useSectores } from '../../hooks/useSectores';
import { useBarrios } from '../../hooks/useBarrios';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

// Schema de validación corregido y relajado
const direccionSchema = z.object({
  codigoSector: z.number().nullable().optional(),
  codigoBarrio: z.number().nullable().optional(),
  codigoCalle: z.number().nullable().optional(),
  cuadra: z.coerce.number().nullable().optional(),
  manzana: z.string().nullable().optional(),
  lado: z.string().optional().default('8103'),
  loteInicial: z.coerce.number().optional().default(0),
  loteFinal: z.coerce.number().optional().default(0),
  ruta: z.number().nullable().optional(),
  zona: z.number().nullable().optional(),
  ubicacionAreaVerde: z.number().nullable().optional(),
});

type DireccionFormData = z.infer<typeof direccionSchema>;

interface DireccionFormProps {
  direccionSeleccionada?: DireccionData | null;
  onSubmit: (data: CreateDireccionDTO) => Promise<void>;
  onNuevo: () => void;
  onEditar: () => void;
  onDelete?: (id: number) => Promise<void>;
  loading?: boolean;
  isEditMode?: boolean;
}

const DireccionFormMUI: React.FC<DireccionFormProps> = ({
  direccionSeleccionada,
  onSubmit,
  onNuevo,
  onEditar: _onEditar,
  onDelete,
  loading = false,
  isEditMode = false
}) => {
  // Hooks de datos maestros
  const { sectores } = useSectores();
  const { barrios } = useBarrios();
  const { calles } = useCalles();
  const { options: ladoOptions } = useTiposLadosDireccion();
  const { options: rutaOptions, loading: loadingRutas } = useRutasOptions();
  const { options: zonaOptions, loading: loadingZonas } = useZonasOptions();
  const { options: areasVerdesOptions, loading: loadingAreasVerdes } = useUbicacionAreaVerdeOptions();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loteInicialFocused, setLoteInicialFocused] = useState(false);
  const [loteFinalFocused, setLoteFinalFocused] = useState(false);
  const isLoadingEditDataRef = useRef(false);

  // Helper para normalizar datos
  const safeParseInt = (val: any) => {
    if (val === null || val === undefined || val === '') return null;
    const num = parseInt(val.toString());
    return isNaN(num) || num === 0 ? null : num;
  };

  // LÓGICA CENTRAL DE EXTRACCIÓN DE DATOS
  // LÓGICA CENTRAL DE EXTRACCIÓN DE DATOS (Estable y rápida)
  const initialFormValues = useMemo(() => {
    if (direccionSeleccionada && isEditMode) {
      console.log('📝 [DireccionForm] ========== INICIANDO PARSEO BASE ==========');
      
      const codSector = safeParseInt(direccionSeleccionada.codigoSector);
      const codBarrio = safeParseInt(direccionSeleccionada.codigoBarrio);
      const codCalle = safeParseInt(direccionSeleccionada.codigoCalle);
      let cuadra = safeParseInt(direccionSeleccionada.cuadra);
      let manzana = (direccionSeleccionada as any).manzana || '';
      let loteInicial = safeParseInt(direccionSeleccionada.loteInicial) || 0;
      let loteFinal = safeParseInt(direccionSeleccionada.loteFinal) || 0;
      let ladoValue = direccionSeleccionada.codLado ? String(direccionSeleccionada.codLado) : '';
      if (!ladoValue && direccionSeleccionada.lado) {
        if (direccionSeleccionada.lado === 'PAR') ladoValue = '8101';
        else if (direccionSeleccionada.lado === 'IMPAR') ladoValue = '8102';
        else ladoValue = '8103';
      }
      if (!ladoValue) ladoValue = '8103';
      const rutaId = safeParseInt(direccionSeleccionada.ruta);
      const zonaId = safeParseInt(direccionSeleccionada.zona);
      const areaVerdeId = safeParseInt((direccionSeleccionada as any).ubicacionAreaVerde || (direccionSeleccionada as any).codUbicacionAreaVerde);

      // Extraer campos de texto directos de la descripción si faltan en los datos estructurados
      if (direccionSeleccionada.descripcion) {
        const desc = direccionSeleccionada.descripcion.toUpperCase();

        if (!cuadra) {
          const cuadraMatch = desc.match(/CUADRA\s*(\d+)/i);
          if (cuadraMatch) cuadra = parseInt(cuadraMatch[1]);
        }

        if (!manzana || manzana === '') {
          const mzMatch = desc.match(/MZ\.?\s*([A-Z0-9]+)/i);
          if (mzMatch) manzana = mzMatch[1];
        }

        if (loteInicial === 0 || loteFinal === 0) {
          const lotesMatch = desc.match(/LOTES?:?\s*(\d+)\s*[-–]\s*(\d+)/i);
          if (lotesMatch) {
            if (loteInicial === 0) loteInicial = parseInt(lotesMatch[1]);
            if (loteFinal === 0) loteFinal = parseInt(lotesMatch[2]);
          }
        }
      }

      return {
        codigoSector: codSector,
        codigoBarrio: codBarrio,
        codigoCalle: codCalle,
        cuadra: cuadra,
        manzana: manzana,
        lado: ladoValue,
        loteInicial: loteInicial,
        loteFinal: loteFinal,
        ruta: rutaId,
        zona: zonaId,
        ubicacionAreaVerde: areaVerdeId
      };
    }
    
    return {
      codigoSector: null, codigoBarrio: null, codigoCalle: null, cuadra: null,
      manzana: '', lado: '8103', loteInicial: 0, loteFinal: 0,
      ruta: null, zona: null, ubicacionAreaVerde: null
    };
  }, [direccionSeleccionada, isEditMode]);

  // Formulario con inicialización directa
  const { register, control, handleSubmit, watch, reset, setValue, getValues, formState: { isSubmitting, errors: formErrors } } = useForm<DireccionFormData>({
    resolver: zodResolver(direccionSchema) as any,
    defaultValues: initialFormValues
  });

  const sectorValue = watch('codigoSector');
  const barrioValue = watch('codigoBarrio');

  // 1. Resetear el formulario cuando cambian los valores iniciales (solo en cambios de ID o Modo)
  useEffect(() => {
    if (isEditMode && direccionSeleccionada) {
      isLoadingEditDataRef.current = true;
      reset(initialFormValues);
      setTimeout(() => { isLoadingEditDataRef.current = false; }, 100);
    } else if (!isEditMode && !direccionSeleccionada) {
      reset({
        codigoSector: null, codigoBarrio: null, codigoCalle: null, cuadra: null,
        manzana: '', lado: '8103', loteInicial: 0, loteFinal: 0,
        ruta: null, zona: null, ubicacionAreaVerde: null
      });
    }
  }, [direccionSeleccionada, initialFormValues, isEditMode, reset]);

  // 2. Autocompletar / normalizar valores desde la descripción cuando cargan las opciones
  useEffect(() => {
    if (!isEditMode || !direccionSeleccionada) return;

    const desc = (direccionSeleccionada.descripcion || '').toUpperCase();

    // Sector
    const currentSector = getValues('codigoSector');
    if (!currentSector && sectores.length > 0 && desc) {
      const sectorMatch = desc.match(/(?:SECT\.|SECTOR|URB\.|URBANIZACIÓN|AA\.HH\.|A\.H\.|P\.J\.|ASOC\.|ASOCIACIÓN|RES\.|RESIDENCIAL)\s*(?:“|")?([^,”"]+)(?:”|")?/i);
      if (sectorMatch) {
        const nombre = sectorMatch[1].trim();
        const found = sectores.find((s: any) => s.nombre.toUpperCase().includes(nombre) || nombre.includes(s.nombre.toUpperCase()));
        if (found) setValue('codigoSector', found.id);
      }
    }

    // Barrio
    const currentBarrio = getValues('codigoBarrio');
    if (!currentBarrio && barrios.length > 0 && desc) {
      const barrioMatch = desc.match(/(?:B\.?º|B\.?Â?º|B\.|BARRIO)\s*([^,]+)/i);
      if (barrioMatch) {
        const nombre = barrioMatch[1].trim();
        const found = barrios.find((b: any) => b.nombre.toUpperCase().includes(nombre) || nombre.includes(b.nombre.toUpperCase()));
        if (found) setValue('codigoBarrio', found.id);
      }
    }

    // Calle
    const currentCalle = getValues('codigoCalle');
    if (!currentCalle && calles.length > 0 && desc) {
      const calleMatch = desc.match(/(?:JR\.|AV\.|CA\.|CL\.|CALLE|PSJE\.|PASAJE|JIRÓN|AVENIDA|VIA)\s*([^,]+?)(?:,|CUADRA|MZ\.|$)/i);
      if (calleMatch) {
        const nombre = calleMatch[1].trim();
        const found = calles.find((c: any) => (c.nombreVia || '').toUpperCase().includes(nombre) || nombre.includes((c.nombreVia || '').toUpperCase()));
        if (found) setValue('codigoCalle', found.codVia || (found as any).id || (found as any).codigo);
      }
    }

    // Ruta
    const currentRuta = getValues('ruta');
    const rutaNombre = (direccionSeleccionada as any).rutaNombre;
    if (!currentRuta && rutaNombre && rutaOptions.length > 0) {
      const found = rutaOptions.find(r => String(r.label).toUpperCase().includes(String(rutaNombre).toUpperCase()) || String(rutaNombre).toUpperCase().includes(String(r.label).toUpperCase()));
      if (found) setValue('ruta', Number(found.value));
    }

    // Zona
    const currentZona = getValues('zona');
    const zonaNombre = (direccionSeleccionada as any).zonaNombre;
    if (!currentZona && zonaNombre && zonaOptions.length > 0) {
      const found = zonaOptions.find(z => String(z.label).toUpperCase().includes(String(zonaNombre).toUpperCase()) || String(zonaNombre).toUpperCase().includes(String(z.label).toUpperCase()));
      if (found) setValue('zona', Number(found.value));
    }

    // Ubicación Área Verde
    const currentAreaVerde = getValues('ubicacionAreaVerde');
    const avNombre = (direccionSeleccionada as any).ubicacionAreaVerdeNombre;
    if (!currentAreaVerde && avNombre && areasVerdesOptions.length > 0) {
      const found = areasVerdesOptions.find(a => String(a.label).toUpperCase().includes(String(avNombre).toUpperCase()));
      if (found) setValue('ubicacionAreaVerde', Number(found.value));
    }

    // Lado (Normalizar el string 'PAR'/'IMPAR' o '8101'/'8102' a código de lado)
    const currentLado = getValues('lado');
    const ladoValue = direccionSeleccionada.lado;
    if (ladoValue && ladoOptions.length > 0) {
      const isValidCode = ladoOptions.some(o => String(o.value) === String(currentLado));
      if (!isValidCode) {
        const found = ladoOptions.find(o => String(o.label).toUpperCase() === ladoValue.toUpperCase() || String(o.value) === ladoValue);
        if (found) setValue('lado', String(found.value));
      }
    }
  }, [
    direccionSeleccionada,
    isEditMode,
    sectores,
    barrios,
    calles,
    ladoOptions,
    rutaOptions,
    zonaOptions,
    areasVerdesOptions,
    setValue,
    getValues
  ]);

  const handleFormSubmit = async (data: DireccionFormData) => {
    try {
      await onSubmit({
        ...data,
        codigoSector: data.codigoSector || null,
        codigoBarrio: data.codigoBarrio || null,
        codigoCalle: data.codigoCalle || null,
        codUsuario: getAuthenticatedUserCode()
      } as CreateDireccionDTO);
    } catch (error) {
      console.error('❌ Error submit:', error);
    }
  };

  const barriosFiltrados = useMemo(() => {
    if (!sectorValue) return barrios;
    return barrios.filter((b: any) => Number(b.codSector) === Number(sectorValue));
  }, [barrios, sectorValue]);
    
  const callesFiltradas = useMemo(() => {
    if (!barrioValue) return calles;
    return calles.filter((c: any) => Number(c.codBarrio || c.codigoBarrio) === Number(barrioValue));
  }, [calles, barrioValue]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff' }}>
      {Object.keys(formErrors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>Faltan datos obligatorios</AlertTitle>
          Por favor, verifique los campos marcados en rojo.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit) as any}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            {/* Box Sector */}
            <Controller name="codigoSector" control={control} render={({ field }) => (
              <Autocomplete 
                options={sectores} 
                getOptionLabel={(o: any) => o.nombre || ''} 
                value={sectores.find((s: any) => Number(s.id) === Number(field.value)) || null}
                isOptionEqualToValue={(option: any, value: any) => Number(option.id) === Number(value?.id)}
                onChange={(_, v: any) => field.onChange(v?.id || null)}
                renderInput={(p) => <TextField {...p} label="Sector" size="small" />} 
              />
            )} />
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            {/* Box Barrio */}
            <Controller name="codigoBarrio" control={control} render={({ field }) => (
              <Autocomplete 
                options={barriosFiltrados} 
                getOptionLabel={(o: any) => o.nombre || ''} 
                value={barriosFiltrados.find((b: any) => Number(b.id) === Number(field.value)) || null}
                isOptionEqualToValue={(option: any, value: any) => Number(option.id) === Number(value?.id)}
                onChange={(_, v: any) => field.onChange(v?.id || null)}
                renderInput={(p) => <TextField {...p} label="Barrio" size="small" />} 
              />
            )} />
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            {/* Box Calle */}
            <Controller name="codigoCalle" control={control} render={({ field }) => (
              <Autocomplete 
                options={callesFiltradas} 
                getOptionLabel={(o: any) => o.nombreVia || o.nombre || ''} 
                value={callesFiltradas.find((c: any) => Number(c.codVia || c.codigo) === Number(field.value)) || null}
                isOptionEqualToValue={(option: any, value: any) => Number(option.codVia || option.codigo) === Number(value?.codVia || value?.codigo)}
                onChange={(_, v: any) => field.onChange(v?.codVia || v?.codigo || null)}
                renderInput={(p) => <TextField {...p} label="Calle" size="small" />} 
              />
            )} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ flex: '1 1 150px' }}>
            {/* Box Lado */}
            <Controller name="lado" control={control} render={({ field }) => (
              <Autocomplete 
                options={ladoOptions} 
                getOptionLabel={(o: any) => o.label || ''} 
                value={ladoOptions.find((opt: any) => String(opt.value) === String(field.value)) || null}
                onChange={(_, v: any) => field.onChange(v?.value || '8103')}
                renderInput={(p) => <TextField {...p} label="Lado" size="small" />} 
              />
            )} />
          </Box>
          {/* Box Cuadra */}
          <TextField 
            {...register('cuadra')} 
            label="Cuadra" 
            type="number" 
            size="small" 
            sx={{ 
              width: 100,
              '& input[type=number]': {
                MozAppearance: 'textfield'
              },
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
              }
            }} 
          />
          {/* Box Manzana */}
          <TextField {...register('manzana')} label="Manzana" size="small" sx={{ width: 100 }} />
          {/* Box Lote Inicial */}
          <Controller
            name="loteInicial"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Lote Inicial"
                type="number"
                size="small"
                value={loteInicialFocused && field.value === 0 ? '' : field.value}
                onFocus={() => setLoteInicialFocused(true)}
                onBlur={(_e) => {
                  setLoteInicialFocused(false);
                  field.onBlur();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? 0 : Number(val));
                }}
                sx={{
                  width: 120,
                  '& input[type=number]': {
                    MozAppearance: 'textfield'
                  },
                  '& input[type=number]::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                  },
                  '& input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                  }
                }}
              />
            )}
          />
          {/* Box Lote Final */}
          <Controller
            name="loteFinal"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Lote Final"
                type="number"
                size="small"
                value={loteFinalFocused && field.value === 0 ? '' : field.value}
                onFocus={() => setLoteFinalFocused(true)}
                onBlur={(_e) => {
                  setLoteFinalFocused(false);
                  field.onBlur();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? 0 : Number(val));
                }}
                sx={{
                  width: 120,
                  '& input[type=number]': {
                    MozAppearance: 'textfield'
                  },
                  '& input[type=number]::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                  },
                  '& input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                  }
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 200px' }}>
            {/* Box Ruta */}
            <Controller name="ruta" control={control} render={({ field }) => (
              <Autocomplete 
                options={rutaOptions} 
                loading={loadingRutas}
                getOptionLabel={(o: any) => o.label || ''} 
                value={rutaOptions.find((opt: any) => Number(opt.value) === Number(field.value)) || null}
                onChange={(_, v: any) => field.onChange(v?.value ? Number(v.value) : null)}
                renderInput={(p) => <TextField {...p} label="Ruta" size="small" />} 
              />
            )} />
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            {/* Box Zona */}
            <Controller name="zona" control={control} render={({ field }) => (
              <Autocomplete 
                options={zonaOptions} 
                loading={loadingZonas}
                getOptionLabel={(o: any) => o.label || ''} 
                value={zonaOptions.find((opt: any) => Number(opt.value) === Number(field.value)) || null}
                onChange={(_, v: any) => field.onChange(v?.value ? Number(v.value) : null)}
                renderInput={(p) => <TextField {...p} label="Zona" size="small" />} 
              />
            )} />
          </Box>
          <Box sx={{ flex: '1 1 250px' }}>
            {/* Box Ubicación Área Verde */}
            <Controller name="ubicacionAreaVerde" control={control} render={({ field }) => (
              <Autocomplete 
                options={areasVerdesOptions} 
                loading={loadingAreasVerdes}
                getOptionLabel={(o: any) => o.label || ''} 
                value={areasVerdesOptions.find((opt: any) => Number(opt.value) === Number(field.value)) || null}
                onChange={(_, v: any) => field.onChange(v?.value ? Number(v.value) : null)}
                renderInput={(p) => <TextField {...p} label="Ubicación Área Verde" size="small" />} 
              />
            )} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #eee' }}>
          {/* Boton Guardar */}
          <Button 
            variant="contained" 
            type="submit" 
            disabled={loading || isSubmitting} 
            startIcon={loading || isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 700, minWidth: '130px' }}
          >
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </Button>
          {/* Boton Nuevo */}
          <Button variant="outlined" onClick={() => { reset(); onNuevo(); }} startIcon={<AddIcon />}>Nuevo</Button>
          {/* Boton Eliminar */}
          {isEditMode && onDelete && (
            <Button variant="outlined" color="error" onClick={() => setDeleteModalOpen(true)} startIcon={<DeleteIcon />}>Eliminar</Button>
          )}
        </Box>
      </Box>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Confirmar Eliminación</DialogTitle>
        <DialogContent><DialogContentText>¿Está seguro que desea eliminar esta dirección?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
          <Button onClick={async () => { if (direccionSeleccionada && onDelete) await onDelete(direccionSeleccionada.id); setDeleteModalOpen(false); }} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DireccionFormMUI;
