import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { NotificationService } from '../components/utils/Notification';
import { pisoService, CreatePisoApiDTO } from '../services/pisoService';
import { Piso } from '../models/Piso';
import { getAuthenticatedUserCode } from '../config/api.unified.config';

export interface CrearPisoFormData {
  anio: number;
  codPredio: string;
  codPiso?: number;
  numeroPiso: number;
  areaConstruida: number;
  fechaConstruccion?: string;
  murosColumnas?: string;
  techos?: string;
  pisos?: string;
  puertasVentanas?: string;
  revestimiento?: string;
  banios?: string;
  instalacionesElectricas?: string;
  codLetraMurosColumnas?: string;
  codLetraTechos?: string;
  codLetraPisos?: string;
  codLetraPuertasVentanas?: string;
  codLetraRevestimiento?: string;
  codLetraBanios?: string;
  codLetraInstalacionesElectricas?: string;
  codEstadoConservacion?: string;
  codMaterialEstructural?: string;
  valorAreasComunes?: string;
  codUsuario?: number;
}

/**
 * Hook para gestión de pisos con React Query
 */
export const usePisos = (filtrosIniciales?: { codPredio?: string; codPredioBase?: string; anio?: number }) => {
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState<{
    anio?: number;
    codPiso?: number;
    codPredio?: string;
    codPredioBase?: string;
    numeroPiso?: number;
  }>(filtrosIniciales || {});

  // Query para listar pisos
  const {
    data: pisos = [] as Piso[],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pisos', filtros],
    queryFn: async () => {
      if (!filtros.codPredio && !filtros.codPredioBase) return [];
      const data = await pisoService.consultarPisos(filtros);
      return data.map((piso, index): Piso => ({
        // Mantener acceso a datos originales primero
        ...piso,
        id: (piso.id || piso.codPiso || index + 1) as number,
        codPiso: piso.codPiso,
        item: index + 1,
        descripcion: piso.numeroPisoDesc || `Piso ${piso.numeroPiso || index + 1}`,
        numeroPisoDesc: piso.numeroPisoDesc,
        valorUnitario: piso.valorUnitario || 0,
        incremento: piso.incremento || 0,
        porcentajeDepreciacion: piso.depreciacion || 0,
        valorUnicoDepreciado: piso.valorUnitarioDepreciado || 0,
        valorAreaConstruida: piso.valorAreaConstruida || 0,
        areaConstruida: piso.areaConstruida || piso.areaTotalConstruccion || piso.totalAreaConstruccion || 0,
        areaTotalConstruccion: piso.areaTotalConstruccion || piso.totalAreaConstruccion || 0,
        valorConstruccion: piso.valorConstruccion || 0,
        fechaConstruccion: piso.fechaConstruccion || undefined,
        fechaConstruccionStr: piso.fechaConstruccionStr || undefined
      }));
    },
    enabled: true,
    placeholderData: (prev) => prev
  });

  // Mutación: Crear/Actualizar
  const mutationGuardar = useMutation({
    mutationFn: async (datos: CrearPisoFormData) => {
      const isUpdate = !!(datos.codPiso && datos.codPiso > 0);
      const datosApi: CreatePisoApiDTO = {
        anio: datos.anio || new Date().getFullYear(),
        codPredio: String(datos.codPredio),
        codPiso: Number(datos.codPiso || 1),
        numeroPiso: Number(datos.numeroPiso),
        fechaConstruccion: datos.fechaConstruccion || "1990-01-01",
        murosColumnas: String(datos.murosColumnas || "100101"),
        techos: String(datos.techos || "100102"),
        pisos: String(datos.pisos || "100201"),
        puertasVentanas: String(datos.puertasVentanas || "100202"),
        revestimiento: String(datos.revestimiento || "100203"),
        banios: String(datos.banios || "100204"),
        instalacionesElectricas: String(datos.instalacionesElectricas || "100301"),
        codLetraMurosColumnas: String(datos.codLetraMurosColumnas || "1101"),
        codLetraTechos: String(datos.codLetraTechos || "1101"),
        codLetraPisos: String(datos.codLetraPisos || "1101"),
        codLetraPuertasVentanas: String(datos.codLetraPuertasVentanas || "1101"),
        codLetraRevestimiento: String(datos.codLetraRevestimiento || "1101"),
        codLetraBanios: String(datos.codLetraBanios || "1101"),
        codLetraInstalacionesElectricas: String(datos.codLetraInstalacionesElectricas || "1101"),
        codEstadoConservacion: String(datos.codEstadoConservacion || "9402"),
        codMaterialEstructural: String(datos.codMaterialEstructural || "0703"),
        areaConstruida: String(datos.areaConstruida),
        valorAreasComunes: String(datos.valorAreasComunes || "0"),
        codUsuario: getAuthenticatedUserCode()
      };

      return isUpdate 
        ? pisoService.actualizarPiso(datosApi)
        : pisoService.crearPisoSinAuth(datosApi);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pisos'] });
      NotificationService.success('Piso guardado exitosamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al guardar piso');
    }
  });

  // Mutación: Eliminar
  const mutationEliminar = useMutation({
    mutationFn: (params: { anio: number; codPredio: string; numeroPiso: number; codPiso?: number }) => 
      pisoService.eliminarPiso(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pisos'] });
      NotificationService.success('Piso eliminado correctamente');
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al eliminar piso');
    }
  });

  const buscarPisos = useCallback((newFiltros: { anio?: number; codPiso?: number; codPredio?: string; codPredioBase?: string; numeroPiso?: number }) => {
    setFiltros(newFiltros);
  }, []);

  return {
    pisos,
    loading,
    error: error ? (error as Error).message : null,
    filtros,
    setFiltros,
    buscarPisos,
    consultarPisos: buscarPisos, // Alias
    guardarPiso: mutationGuardar.mutateAsync,
    crearPiso: mutationGuardar.mutateAsync, // Alias para compatibilidad
    eliminarPiso: mutationEliminar.mutateAsync,
    isSaving: mutationGuardar.isPending,
    isDeleting: mutationEliminar.isPending
  };
};
