// src/hooks/useContribuyentes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { 
  contribuyenteService, 
  ContribuyenteData, 
  CreateContribuyenteAPIDTO,
  BusquedaContribuyenteParams
} from '../services/contribuyenteService';
import { NotificationService } from '../components/utils/Notification';

export interface ContribuyenteListItem {
  codigo: number;
  contribuyente: string;
  documento: string;
  direccion: string;
  telefono?: string;
  tipoPersona?: 'natural' | 'juridica';
  tipoContribuyente?: string;
  esExonerado?: boolean | null;
  esPensionista?: boolean | null;
}

const mapToListItem = (data: ContribuyenteData): ContribuyenteListItem => ({
  codigo: data.codigo,
  contribuyente: data.nombreCompleto || data.nombres || '',
  documento: data.numeroDocumento || '',
  direccion: data.direccion || 'Sin dirección',
  telefono: data.telefono || '',
  tipoPersona: data.tipoPersona === '0301' ? 'natural' : 'juridica',
  tipoContribuyente: data.tipoContribuyente || 'Natural',
  esExonerado: data.esExonerado,
  esPensionista: data.esPensionista
});

export const useContribuyentes = () => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<BusquedaContribuyenteParams>({});

  const fetchContribuyentes = useCallback(async (searchParams: BusquedaContribuyenteParams) => {
    console.log('📡 [useContribuyentes] Ejecutando búsqueda API con params:', searchParams);
    const data = await contribuyenteService.buscarContribuyentes(searchParams);
    console.log(`✅ [useContribuyentes] ${data.length} items mapeados para la tabla`);
    return data.map(mapToListItem);
  }, []);

  const {
    data: contribuyentes = [],
    isLoading,
    isFetching,
    error,
    refetch: cargarContribuyentes
  } = useQuery({
    queryKey: ['contribuyentes', params],
    queryFn: () => fetchContribuyentes(params),
    placeholderData: (prev) => prev,
    staleTime: 0
  });

  const obtenerContribuyenteDetalle = useCallback(async (codigoContribuyente: number | string, codigoPersona: number | string = "") => {
    return queryClient.fetchQuery({
      queryKey: ['contribuyente-detalle', codigoContribuyente, codigoPersona],
      queryFn: () => contribuyenteService.obtenerContribuyenteDetalle(codigoContribuyente, codigoPersona),
      staleTime: 60 * 1000
    });
  }, [queryClient]);

  const crearContribuyente = useMutation({
    mutationFn: (datos: CreateContribuyenteAPIDTO) => contribuyenteService.crearContribuyenteAPI(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contribuyentes'] });
      NotificationService.success('Contribuyente registrado correctamente');
    },
    onError: (err: any) => {
      NotificationService.error(err.message || 'Error al registrar contribuyente');
    }
  });

  const buscarContribuyentesConQueryParams = useCallback(async (p: BusquedaContribuyenteParams | any) => {
    console.log('📡 [useContribuyentes] buscarContribuyentesConQueryParams recibido:', p);

    let cleanParams: BusquedaContribuyenteParams = {};
    if (typeof p === 'string') {
      cleanParams = { parametroBusqueda: p === 'a' ? '' : p };
    } else if (p && typeof p === 'object') {
      const rawCod = p.codigoContribuyente ?? p.codigo ?? p.codContribuyente ?? '';
      const rawTipo = p.codTipoContribuyente ?? p.tipoPersona ?? '';
      const rawExon = p.esExonerado ?? '';
      const rawPens = p.esPensionista ?? '';
      const rawBusq = p.parametroBusqueda ?? p.busqueda ?? '';

      cleanParams = {
        parametroBusqueda: String(rawBusq === 'a' ? '' : rawBusq).trim(),
        codigoContribuyente: String(rawCod).trim(),
        codTipoContribuyente: String(rawTipo).trim(),
        esExonerado: String(rawExon).trim(),
        esPensionista: String(rawPens).trim()
      };
    }

    console.log('📡 [useContribuyentes] Limpiados y seteados params finales:', cleanParams);

    // 1. Ejecutar query directa con cleanParams
    const result = await queryClient.fetchQuery({
      queryKey: ['contribuyentes', cleanParams],
      queryFn: () => fetchContribuyentes(cleanParams)
    });
    
    // 2. Actualizar el estado para sincronizar la query key del hook
    setParams(cleanParams);
    return result;
  }, [queryClient, fetchContribuyentes]);

  return {
    contribuyentes,
    loading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    cargarContribuyentes,
    buscarContribuyentes: buscarContribuyentesConQueryParams,
    buscarContribuyentesConQueryParams,
    obtenerContribuyenteDetalle,
    crearContribuyente: crearContribuyente.mutateAsync,
    isCreating: crearContribuyente.isPending
  };
};

export default useContribuyentes;
