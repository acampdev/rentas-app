import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { predioService } from '../services/predioService';
import { NotificationService } from '../components/utils/Notification';
import { usePredios } from './usePredioAPI';
import constanteService from '../services/constanteService';
import {
  useCondicionPropiedadOptions,
  useTipoPredioOptions,
  useListaConductorOptions,
  useConstantesOptions,
  useClasificacionPredio,
  useGrupoUsoOptions,
  useEstadoPredioOptions,
  useAnioOptions
} from './useConstantesOptions';

import { Arancel } from '../models/Arancel';

// Schema de validación con Zod
const predioSchema = z.object({
  codPersona: z.number().optional(),
  anio: z.coerce.number().min(1900).max(new Date().getFullYear() + 10).optional(),
  fechaAdquisicion: z.date().nullable().optional(),
  condicionPropiedad: z.string().min(1, 'La condición es requerida'),
  tipoPredio: z.string().optional(),
  conductor: z.string().min(1, 'El conductor es requerido'),
  usoPredio: z.string().optional(),
  estadoPredio: z.string().optional(),
  modoDeclaracion: z.string().optional(),
  clasificacionPredio: z.string().optional(),
  criterioUso: z.string().optional(),
  direccionId: z.number().optional(),
  direccion: z.object({
    id: z.number().nullable().optional(),
    codigo: z.number().nullable().optional(),
    anio: z.number().optional(),
    direccionCompleta: z.string().optional(),
    descripcion: z.string().optional(),
    arancel: z.number().optional(),
  }).nullable().optional(),
  numeroFinca: z.string().optional(),
  otroNumero: z.string().optional(),
  arancel: z.string().optional(),
  areaTerreno: z.coerce.number().min(0, 'El área no puede ser negativa'),
  numeroPisos: z.coerce.number().min(0).optional(),
  numeroCondominos: z.coerce.number().min(0).optional()
});

export interface DireccionData {
  id: number | null;
  codigo?: number | null;
  anio?: number;
  direccionCompleta?: string;
  descripcion?: string;
  arancel?: number;
}

export interface PredioFormData {
  codPersona?: number;
  anio?: number;
  fechaAdquisicion?: Date | null;
  condicionPropiedad: string;
  tipoPredio?: string;
  conductor: string;
  usoPredio?: string;
  estadoPredio?: string;
  modoDeclaracion?: string;
  clasificacionPredio?: string;
  criterioUso?: string;
  direccionId?: number;
  direccion?: DireccionData | null;
  numeroFinca?: string;
  otroNumero?: string;
  arancel?: string;
  areaTerreno: number;
  numeroPisos?: number;
  numeroCondominos?: number;
}

export interface PredioFormSubmitData extends PredioFormData {
  imagenes: File[];
}

export const usePredioForm = (
  initialData?: Partial<PredioFormData>,
  codPersona?: number,
  onSubmitCallback?: (data: PredioFormSubmitData) => void | Promise<void>
) => {
  const navigate = useNavigate();
  const [showSelectorDireccionArancel, setShowSelectorDireccionArancel] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const form = useForm<PredioFormData>({
    resolver: zodResolver(predioSchema) as any,
    defaultValues: {
      codPersona: codPersona,
      anio: new Date().getFullYear(),
      fechaAdquisicion: null,
      condicionPropiedad: '',
      tipoPredio: '',
      conductor: '',
      usoPredio: '',
      estadoPredio: '',
      modoDeclaracion: '',
      clasificacionPredio: '',
      criterioUso: '',
      direccion: null,
      numeroFinca: '',
      otroNumero: '',
      arancel: '',
      areaTerreno: 0,
      numeroPisos: 0,
      numeroCondominos: 0,
      ...initialData
    }
  });

  const { reset, setValue, watch, handleSubmit } = form;

  // Sincronizar con datos iniciales
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        codPersona: codPersona || initialData.codPersona
      });
    }
  }, [initialData, reset, codPersona]);

  // Options Hooks
  const { options: condicionData, loading: loadingCondicion, error: errorCondicion } = useCondicionPropiedadOptions();
  const { options: tipoPredioData, loading: loadingTipoPredio, error: errorTipoPredio } = useTipoPredioOptions();
  const { options: conductorData, loading: loadingConductor, error: errorConductor } = useListaConductorOptions();
  const { options: estadoPredioData, loading: loadingEstadoPredio, error: errorEstadoPredio } = useEstadoPredioOptions();
  const { options: modoDeclaracionData, loading: loadingModoDeclaracion, error: errorModoDeclaracion } = useConstantesOptions('modo-declaracion', () => constanteService.obtenerTiposModoDeclaracion());
  const { options: clasificacionPredioData, loading: loadingClasificacionPredio, error: errorClasificacionPredio } = useClasificacionPredio();
  const { options: criterioUsoData, loading: loadingCriterioUso, error: errorCriterioUso } = useGrupoUsoOptions();
  const { options: aniosData, loading: loadingAnios, error: errorAnios } = useAnioOptions();

  const { usosPredio, cargarUsosPredio } = usePredios();
  useEffect(() => { cargarUsosPredio(); }, [cargarUsosPredio]);

  const usoPredioData = useMemo(() => usosPredio.map(uso => ({
    value: uso.codUsoPredio.toString(),
    label: uso.descripcionUso
  })), [usosPredio]);

  // Lógica de filtrado de clasificación por uso
  const usoPredioValue = watch('usoPredio');
  const clasificacionPredioValue = watch('clasificacionPredio');

  const clasificacionPredioFiltrada = useMemo(() => {
    if (!clasificacionPredioData || !usoPredioValue) return clasificacionPredioData || [];
    const usoPredioLabel = usoPredioData.find(up => up.value === usoPredioValue)?.label?.toUpperCase() || '';
    if (usoPredioLabel.includes('CASA') || usoPredioLabel.includes('HABITACION')) {
      return clasificacionPredioData.filter(cp => cp.label?.toUpperCase().includes('CASA'));
    }
    return clasificacionPredioData.filter(cp => !cp.label?.toUpperCase().includes('CASA'));
  }, [clasificacionPredioData, usoPredioValue, usoPredioData]);

  const isUsoPredioDisabled = useMemo(() => {
    if (!clasificacionPredioValue) return false;
    const label = clasificacionPredioData?.find(cp => cp.value === clasificacionPredioValue)?.label?.toUpperCase() || '';
    return label.includes('CASA') && label.includes('HABITACION');
  }, [clasificacionPredioValue, clasificacionPredioData]);

  // Handlers
  const handleSelectArancel = useCallback((arancel: Arancel) => {
    const direccionData: DireccionData = {
      id: arancel.codDireccion,
      codigo: arancel.codDireccion,
      anio: arancel.anio,
      direccionCompleta: arancel.direccionCompleta,
      arancel: arancel.costoArancel
    };
    setValue('direccion', direccionData);
    setValue('direccionId', arancel.codDireccion);
    setValue('arancel', arancel.costoArancel.toString());
    setShowSelectorDireccionArancel(false);
  }, [setValue]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedImages(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      if (onSubmitCallback) {
        await onSubmitCallback({ ...data, imagenes: selectedImages } as unknown as PredioFormSubmitData);
        NotificationService.success('Predio guardado exitosamente');
        setTimeout(() => navigate('/predio/consulta'), 1500);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al guardar predio';
      NotificationService.error(message);
    }
  });

  return {
    form,
    showSelectorDireccionArancel,
    setShowSelectorDireccionArancel,
    selectedImages,
    setSelectedImages,
    options: {
      condicionData,
      tipoPredioData,
      conductorData,
      usoPredioData,
      estadoPredioData,
      modoDeclaracionData,
      clasificacionPredioFiltrada,
      criterioUsoData,
      aniosData,
      loading: {
        condicion: loadingCondicion,
        tipo: loadingTipoPredio,
        conductor: loadingConductor,
        uso: false,
        estado: loadingEstadoPredio,
        modo: loadingModoDeclaracion,
        clasificacion: loadingClasificacionPredio,
        criterio: loadingCriterioUso,
        anios: loadingAnios
      },
      errors: {
        condicion: errorCondicion,
        tipo: errorTipoPredio,
        conductor: errorConductor,
        uso: null,
        estado: errorEstadoPredio,
        modo: errorModoDeclaracion,
        clasificacion: errorClasificacionPredio,
        criterio: errorCriterioUso,
        anios: errorAnios
      }
    },
    isUsoPredioDisabled,
    handleSelectArancel,
    handleImageUpload,
    onFormSubmit
  };
};
