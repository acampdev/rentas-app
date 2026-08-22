import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CalleFormData } from '../models/Calle';
import { useSectores } from './useSectores';
import { useBarrios } from './useBarrios';
import { buildApiUrl } from '../config/api.unified.config';
import apiClient from '../services/apiClient';

// Esquema de validación
const calleValidationSchema = yup.object().shape({
  tipoVia: yup
    .number()
    .transform((value) => (isNaN(value) || value === '' ? undefined : value))
    .required('El tipo de vía es requerido')
    .positive('Debe seleccionar un tipo de vía válido')
    .integer(),
  codSector: yup
    .number()
    .transform((value) => (isNaN(value) || value === '' ? undefined : value))
    .required('El sector es requerido')
    .positive('Debe seleccionar un sector válido')
    .integer(),
  codBarrio: yup
    .number()
    .transform((value) => (isNaN(value) || value === '' ? 0 : value))
    .optional()
    .nullable(),
  nombreCalle: yup
    .string()
    .trim()
    .required('El nombre de la calle es requerido')
});

interface TipoViaOption {
  codConstante: number;
  nombre: string;
  descripcion?: string;
}

export const useCalleForm = (initialData?: Partial<CalleFormData>, onSubmit?: (data: any) => void | Promise<void>) => {
  const [tiposVia, setTiposVia] = useState<TipoViaOption[]>([]);
  const [loadingTiposVia, setLoadingTiposVia] = useState(false);
  const [errorTiposVia, setErrorTiposVia] = useState<string | null>(null);
  const [openEditSectorDialog, setOpenEditSectorDialog] = useState(false);
  const [editingSector, setEditingSector] = useState<{id: number, nombre: string} | null>(null);
  const [newSectorName, setNewSectorName] = useState('');

  const { sectores, loading: loadingSectores, error: errorSectores } = useSectores();
  const { 
    barrios: todosLosBarrios,
    loading: loadingBarrios, 
    error: errorBarrios 
  } = useBarrios();

  const form = useForm<CalleFormData>({
    resolver: yupResolver(calleValidationSchema) as Resolver<CalleFormData>,
    defaultValues: {
      tipoVia: initialData?.tipoVia || Number((initialData as any)?.codTipoVia) || 0,
      codSector: initialData?.codSector || 0,
      codBarrio: initialData?.codBarrio ?? (initialData as any)?.codigoBarrio ?? 0,
      nombreCalle: initialData?.nombreCalle || (initialData as any)?.nombreVia || '',
    }
  });

  const { watch, reset, setValue, handleSubmit } = form;
  const selectedSector = watch('codSector');

  // Filtrar barrios por sector seleccionado
  const barriosFiltrados = useMemo(() => {
    if (!selectedSector || selectedSector === 0) return [];
    return todosLosBarrios?.filter(barrio => barrio.codSector === selectedSector) || [];
  }, [selectedSector, todosLosBarrios]);

  // Resetear barrio cuando cambia el sector
  useEffect(() => {
    if (selectedSector && initialData && selectedSector !== initialData.codSector) {
      setValue('codBarrio', 0);
    }
  }, [selectedSector, setValue, initialData]);

  // Cargar tipos de vía
  useEffect(() => {
    const cargarTiposVia = async () => {
      setLoadingTiposVia(true);
      setErrorTiposVia(null);
      try {
        const formData = new URLSearchParams();
        formData.append('codConstante', '38');
        const baseUrl = buildApiUrl('/api/constante/listarConstantePadre');
        const url = `${baseUrl}?${formData.toString()}`;
        const data = await apiClient.request<{ data?: unknown[] }>(url, {
          headers: { 'Accept': 'application/json' }
        });
        if (Array.isArray(data.data)) {
          setTiposVia(data.data.map((item: any) => ({
            codConstante: parseInt(item.codConstante),
            nombre: item.nombreCategoria || item.nombre,
            descripcion: item.descripcion || ''
          })));
        }
      } catch (error) {
        console.error('Error al cargar tipos de vía:', error);
        setErrorTiposVia('Error al cargar tipos de vía');
      } finally {
        setLoadingTiposVia(false);
      }
    };
    cargarTiposVia();
  }, []);

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      reset({
        tipoVia: initialData.tipoVia || Number((initialData as any).codTipoVia) || 0,
        codSector: initialData.codSector || 0,
        codBarrio: initialData.codBarrio || (initialData as any).codigoBarrio || 0,
        nombreCalle: initialData.nombreCalle || (initialData as any).nombreVia || '',
      });
    } else {
      reset({ tipoVia: 0, codSector: 0, codBarrio: 0, nombreCalle: '' });
    }
  }, [initialData, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    const datosParaHook = {
      nombreVia: data.nombreCalle.trim(),
      codTipoVia: String(data.tipoVia),
      codBarrio: Number(data.codBarrio) || 0,
      codSector: Number(data.codSector)
    };
    if (onSubmit) await onSubmit(datosParaHook);
    if (!initialData) reset({ tipoVia: 0, codSector: 0, codBarrio: 0, nombreCalle: '' });
  });

  const handleEditSector = useCallback((sector: any) => {
    setEditingSector({ id: sector.id, nombre: sector.nombre });
    setNewSectorName(sector.nombre);
    setOpenEditSectorDialog(true);
  }, []);

  return {
    form,
    tiposVia,
    loadingTiposVia,
    errorTiposVia,
    sectores,
    loadingSectores,
    errorSectores,
    barriosFiltrados,
    loadingBarrios,
    errorBarrios,
    openEditSectorDialog,
    setOpenEditSectorDialog,
    editingSector,
    newSectorName,
    setNewSectorName,
    handleFormSubmit,
    handleEditSector,
    selectedSector
  };
};
