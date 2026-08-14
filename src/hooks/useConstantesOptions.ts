// hooks/useConstantesOptions.ts
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { constanteService, type ConstanteData } from '../services/constanteService';

/**
 * Interface para las opciones formateadas en UI (Selects/Autocompletes)
 */
export interface OptionFormat {
  value: string | number;
  label: string;
  id?: string | number;
  [key: string]: any;
}

const EMPTY_ARRAY: any[] = [];

/**
 * Hook base genérico para cargar constantes usando React Query
 */
export const useConstantesOptions = (
  queryKey: string,
  fetchFn: () => Promise<ConstanteData[]>,
  defaultOptions: OptionFormat[] = EMPTY_ARRAY
) => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['constantes', queryKey],
    queryFn: fetchFn,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });

  const options: OptionFormat[] = useMemo(() => {
    return data.length > 0 
      ? data.map(item => ({
          value: String(item.codConstante).trim(),
          label: item.nombreCategoria,
          id: item.codConstante
        }))
      : defaultOptions;
  }, [data, defaultOptions]);

  return { 
    options, 
    loading: isLoading, 
    error: error ? (error as Error).message : null 
  };
};

// --- Hooks Específicos ---

// TIPOS DE CONTRIBUYENTE
export const useTipoContribuyenteOptions = () => {
  return useConstantesOptions('tipo-contribuyente', () => constanteService.obtenerTiposContribuyente());
};
// TIPOS DE DOCUMENTO
export const useTipoDocumentoOptions = (isJuridica: boolean = false) => {
  return useConstantesOptions(
    'tipo-documento',
    () => constanteService.obtenerTiposDocumento(),
    isJuridica ? [{ value: '4102', label: 'RUC', id: '4102' }] : EMPTY_ARRAY
  );
};
// TIPOS DE ESTADO CIVIL
export const useEstadoCivilOptions = () => {
  return useConstantesOptions('estado-civil', () => constanteService.obtenerTiposEstadoCivil());
};
// TIPOS DE SEXO
export const useSexoOptions = () => {
  return useConstantesOptions('sexos', () => constanteService.obtenerTiposSexo());
};
// TIPOS DE VIA
export const useTipoViaOptions = () => {
  return useConstantesOptions('tipos-vias', () => constanteService.obtenerTiposTipoVia());
};
// TIPOS DE CONDICION DE PROPIEDAD
export const useCondicionPropiedadOptions = () => {
  return useConstantesOptions('condicion-propiedad', () => constanteService.obtenerTiposCondicionPropiedad());
};

export const useTipoPredioOptions = () => {
  return useConstantesOptions('tipo-predio', () => constanteService.obtenerTiposTipoPredio());
};

export const useEstadoPredioOptions = () => {
  return useConstantesOptions('estado-predio', () => constanteService.obtenerTiposEstadoPredio());
};

export const useEstadoConservacionOptions = () => {
  return useConstantesOptions('estado-conservacion', () => constanteService.obtenerTiposEstadosConservacion());
};

export const useClasificacionPredio = () => {
  return useConstantesOptions('clasificacion-predio', () => constanteService.obtenerTiposCasa());
};

export const useListaConductorOptions = () => {
  return useConstantesOptions('lista-conductor', () => constanteService.obtenerTiposListaConductor());
};

export const useTiposMaterialPredominante = () => {
  return useConstantesOptions('material-estructural', () => constanteService.obtenerTiposMaterialEstructural());
};

export const useMaterialPredominante = useTiposMaterialPredominante;

export const useTipoNivelAntiguedad = () => {
  return useConstantesOptions('nivel-antiguedad', () => constanteService.obtenerTiposNivelAntiguedad());
};

export const useTiposLadosDireccion = () => {
  return useConstantesOptions('lados-direcciones', () => constanteService.obtenerTiposLadosDirecciones());
};

export const useModoDeclaracionOptions = () => {
  return useConstantesOptions('modo-declaracion', () => constanteService.obtenerTiposModoDeclaracion());
};

export const useEstadoOptions = () => {
  return useConstantesOptions('estados', () => constanteService.obtenerTiposEstado());
};
// TIPOS DE INTERES
export const useTiposInteresOptions = () => {
  return useConstantesOptions('tipos-interes', () => constanteService.obtenerTiposInteres());
};

export const useTiposEstadoReciboOptions = () => {
  return useConstantesOptions('tipos-estado-recibo', () => constanteService.obtenerTiposEstadoRecibo());
};

export const useTiposMotivoOptions = () => {
  return useConstantesOptions('tipos-motivo', () => constanteService.obtenerTiposMotivo());
};
// TIPOS DE MESES
export const useTiposMesesOptions = () => {
  return useConstantesOptions('tipos-meses', () => constanteService.obtenerTiposMeses());
};

export const useTiposEstadosPredioOptions = () => {
  return useConstantesOptions('tipos-estados-predio', () => constanteService.obtenerTiposEstadosPredio());
};

export const useTiposTipoPredioOptions = () => {
  return useConstantesOptions('tipos-tipo-predio', () => constanteService.obtenerTiposTipoPredio());
};

export const useTiposCondicionPropiedadOptions = () => {
  return useConstantesOptions('tipos-condicion-propiedad', () => constanteService.obtenerTiposCondicionPropiedad());
};

export const useTiposTipoViaOptions = () => {
  return useConstantesOptions('tipos-tipo-via', () => constanteService.obtenerTiposTipoVia());
};

export const useTiposEstadosConservacionOptions = () => {
  return useConstantesOptions('tipos-estados-conservacion', () => constanteService.obtenerTiposEstadosConservacion());
};

export const useTiposLadosDireccionOptions = () => {
  return useConstantesOptions('tipos-lados-direccion', () => constanteService.obtenerTiposLadosDirecciones());
};

export const useTiposListaConductorOptions = () => {
  return useConstantesOptions('tipos-lista-conductor', () => constanteService.obtenerTiposListaConductor());
};

export const useTiposListaUsoOptions = () => {
  return useConstantesOptions('tipos-lista-uso', () => constanteService.obtenerTiposListaUso());
};

// TIPOS DE TRIBUTOS
export const useTiposTributosOptions = () => {
  return useConstantesOptions('tipos-tributos', () => constanteService.obtenerTributos());
};
// TIPOS DE FRACCIONAMIENTO
export const useTiposFraccionamientoOptions = () => {
  return useConstantesOptions('tipos-fraccionamiento', () => constanteService.obtenerTiposFraccionamiento());
};

// TIPOS DE CLASE DE INTERES
export const useTiposClaseDeInteresOptions = () => {
  return useConstantesOptions('tipos-clase-interes', () => constanteService.obtenerClaseDeInteres());
};

export const useLetraValoresUnitariosOptions = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'letras-valores'],
    queryFn: () => constanteService.obtenerTiposLetrasValoresUnitarios(),
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(item => ({
    value: item.nombreCategoria, // Usar la letra como valor
    label: item.nombreCategoria,
    id: item.codConstante
  })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};

export const useCategoriasValoresUnitariosOptions = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'categorias-valores'],
    queryFn: () => constanteService.obtenerTiposCategoriasValoresUnitarios(),
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(item => ({
    value: item.codConstante,
    label: item.nombreCategoria,
    id: item.codConstante
  })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};

export const useCategoriasValoresUnitariosHijosOptions = (codigoPadreSeleccionado?: string) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'hijos-valores', codigoPadreSeleccionado],
    queryFn: () => codigoPadreSeleccionado ? constanteService.listarConstantesPorHijo(codigoPadreSeleccionado) : Promise.resolve([]),
    enabled: !!codigoPadreSeleccionado,
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(item => ({
    value: item.codConstante,
    label: item.nombreCategoria,
    id: item.codConstante
  })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};

export const useListaUsosOptions = () => {
  return useConstantesOptions('lista-usos', () => constanteService.obtenerTiposListaUso());
};

export const useAnioOptions = (startYear: number = 2000) => {
  const currentYear = new Date().getFullYear();
  const options = useMemo(() => Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
    id: (currentYear - i).toString()
  })), [currentYear, startYear]);
  return { options, loading: false, error: null };
};

export const useRutasOptions = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'rutas'],
    queryFn: () => constanteService.obtenerRutas(),
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(i => ({ value: i.codigo, label: i.descripcion, id: i.codigo })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};

export const useZonasOptions = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'zonas'],
    queryFn: () => constanteService.obtenerZonas(),
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(i => ({ value: i.codigo, label: i.descripcion, id: i.codigo })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};

export const useGrupoUsoOptions = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'grupos-uso'],
    queryFn: () => constanteService.listarGrupoUso(),
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(i => ({ value: i.codigo, label: i.descripcion, id: i.codigo })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};

export const useUbicacionAreaVerdeOptions = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'area-verde'],
    queryFn: () => constanteService.listarUbicacionAreaVerde(),
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(i => ({ value: i.codigo, label: i.descripcion, id: i.codigo })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};

export const useUsoPredioOptions = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['constantes', 'usos-predio'],
    queryFn: () => constanteService.listarUsoPredio(),
    staleTime: 24 * 60 * 60 * 1000
  });

  const options = useMemo(() => data.map(i => ({ value: i.codUso, label: i.descripcion, id: i.codUso })), [data]);

  return {
    options,
    loading: isLoading,
    error: null
  };
};
