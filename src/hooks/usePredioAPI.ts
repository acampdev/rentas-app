import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { predioService, PredioData, CreatePredioDTO } from '../services/predioService';
import {
  Predio,
  FiltroPredio,
  PredioFormData
} from '../models/Predio';
import { NotificationService } from '../components/utils/Notification';
import { getAuthenticatedUserCode } from '../config/api.unified.config';

// Function to map PredioData to Predio
const mapPredioDataToModel = (data: PredioData): Predio => {
  return {
    codigoPredio: data.codPredio?.trim() || '',
    codPredioBase: data.codPredioBase,
    anio: data.anio,
    fechaAdquisicion: data.fechaAdquisicion,
    condicionPropiedad: data.condicionPropiedad || 'PROPIETARIO_UNICO',
    direccion: data.direccion,
    direccionId: data.codDireccion ? Number(data.codDireccion) : undefined,
    numeroFinca: data.numeroFinca,
    otroNumero: data.otroNumero,
    conductor: data.conductor || 'PRIVADO',
    estadoPredio: data.estadoPredio || 'TERMINADO',
    areaTerreno: data.areaTerreno || 0,
    numeroPisos: data.numeroPisos,
    totalAreaConstruccion: data.totalAreaConstruccion,
    valorTotalConstruccion: data.valorTotalConstruccion,
    valorTerreno: data.valorTerreno,
    autoavaluo: data.autoavaluo,
    costoArancel: data.costoArancel,

    // Códigos originales de la API
    codPredio: data.codPredio,
    codClasificacion: data.codClasificacion ? Number(data.codClasificacion) : undefined,
    estPredio: data.estPredio,
    codTipoPredio: data.codTipoPredio ? Number(data.codTipoPredio) : undefined,
    codCondicionPropiedad: data.codCondicionPropiedad ? Number(data.codCondicionPropiedad) : undefined,
    codDireccion: data.codDireccion ? Number(data.codDireccion) : undefined,
    codUso: data.codUsoPredio ? Number(data.codUsoPredio) : undefined,
    nombreUso: data.descripcionUso || '',
    direccionCompleta: data.direccion || '',
    codListaConductor: data.codListaConductor ? Number(data.codListaConductor) : undefined,
    codUbicacionAreaVerde: data.codUbicacionAreaVerde ? Number(data.codUbicacionAreaVerde) : undefined,
    codEstado: data.codEstado ? Number(data.codEstado) : undefined,
    codUsuario: data.codUsuario,

    numeroCondominos: data.numeroCondominos ? Number(data.numeroCondominos) : undefined,
  };
};

interface PredioQueryFilters {
  anio?: number;
  codPredioBase?: string;
  parametroBusqueda?: string;
  isAll?: boolean;
  enabled?: boolean;
}

/**
 * Hook personalizado para gestión de predios con React Query
 */
export const usePredios = (filtrosIniciales: PredioQueryFilters = { isAll: true }) => {
  const queryClient = useQueryClient();
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<PredioQueryFilters>(() => filtrosIniciales);

  // Query para listar predios (Todos o con filtros)
  const {
    data: predios = [],
    isLoading: loadingPredios,
    error: errorPredios,
    refetch: cargarPredios
  } = useQuery({
    queryKey: ['predios', filtrosBusqueda],
    queryFn: async () => {
      let data: PredioData[] = [];
      if (filtrosBusqueda.isAll) {
        data = await predioService.obtenerTodosPredios();
      } else {
        data = await predioService.buscarPrediosConFiltros({
          anio: filtrosBusqueda.anio,
          codPredioBase: filtrosBusqueda.codPredioBase,
          parametroBusqueda: filtrosBusqueda.parametroBusqueda
        });
      }
      return data.map(mapPredioDataToModel);
    },
    enabled: filtrosBusqueda.enabled !== false,
    placeholderData: (prev) => prev
  });

  // Mutación para crear predio
  const mutationCrear = useMutation({
    mutationFn: async (datos: PredioFormData & { 
      codClasificacion?: string; 
      estPredio?: string; 
      codTipoPredio?: string; 
      codCondicionPropiedad?: string; 
      codUsoPredio?: number;
      codListaConductor?: string;
    }) => {
      // Validaciones básicas
      if (!datos.numeroFinca) throw new Error('El número de finca es requerido');
      if (!datos.areaTerreno || datos.areaTerreno <= 0) throw new Error('El área del terreno debe ser mayor a 0');
      if (!datos.direccionId) throw new Error('Debe seleccionar una dirección');

      const codClasificacionValue = String(datos.codClasificacion || datos.clasificacionPredio || "0502").trim();
      const esCasaHabitacion = codClasificacionValue === "0501";
      const codUsoPredioValue = esCasaHabitacion ? null : Number(datos.codUsoPredio || datos.usoPredio || 1);

      const datosApi: CreatePredioDTO = {
        anio: datos.anio || new Date().getFullYear(),
        codPredio: null,
        numeroFinca: Number(datos.numeroFinca),
        otroNumero: String(datos.otroNumero || ""),
        codClasificacion: codClasificacionValue,
        estPredio: String(datos.estPredio || datos.estadoPredio || "2503").trim(),
        codTipoPredio: String(datos.codTipoPredio || datos.tipoPredio || "2601").trim(),
        codCondicionPropiedad: String(datos.codCondicionPropiedad || datos.condicionPropiedad || "2701").trim(),
        codDireccion: Number(datos.direccionId),
        codUsoPredio: codUsoPredioValue,
        fechaAdquisicion: datos.fechaAdquisicion
          ? (datos.fechaAdquisicion instanceof Date
              ? datos.fechaAdquisicion.toISOString().split('T')[0]
              : String(datos.fechaAdquisicion).split('T')[0])
          : new Date().toISOString().split('T')[0],
        numeroCondominos: Number(datos.numeroCondominos || 2),
        codListaConductor: String(datos.codListaConductor || datos.conductor || "1401").trim(),
        codUbicacionAreaVerde: 1,
        areaTerreno: Number(datos.areaTerreno),
        totalAreaConstruccion: datos.totalAreaConstruccion ? Number(datos.totalAreaConstruccion) : null,
        valorTotalConstruccion: datos.valorTotalConstruccion ? Number(datos.valorTotalConstruccion) : null,
        valorTerreno: datos.valorTerreno ? Number(datos.valorTerreno) : null,
        autoavaluo: datos.autoavaluo ? Number(datos.autoavaluo) : null,
        codEstado: "0201",
        codUsuario: getAuthenticatedUserCode()
      };

      return predioService.crearPredio(datosApi);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['predios'] });
      NotificationService.success(`Predio ${data.codPredio || 'nuevo'} creado exitosamente`);
    },
    onError: (err: Error) => {
      NotificationService.error(err.message || 'Error al crear predio');
    }
  });

  const buscarPrediosConFiltros = useCallback((anio?: number, codPredioBase?: string, parametroBusqueda?: string) => {
    const nuevosFiltros: PredioQueryFilters = {
      anio,
      codPredioBase,
      parametroBusqueda,
      isAll: false,
      enabled: true
    };
    setFiltrosBusqueda(nuevosFiltros);

    return queryClient.fetchQuery({
      queryKey: ['predios', nuevosFiltros],
      queryFn: async () => {
        const data = await predioService.buscarPrediosConFiltros({ anio, codPredioBase });
        return data.map(mapPredioDataToModel);
      }
    });
  }, [queryClient]);

  const cargarTodosPredios = useCallback(() => {
    setFiltrosBusqueda({ isAll: true, enabled: true });
    return cargarPredios();
  }, [cargarPredios]);

  return {
    predios,
    loading: loadingPredios,
    error: errorPredios ? (errorPredios as Error).message : null,
    // Acciones (Manteniendo compatibilidad)
    cargarPredios,
    cargarTodosPredios,
    buscarPredios: (filtros: FiltroPredio) => {
      setFiltrosBusqueda({
        anio: filtros.anio,
        codPredioBase: filtros.codigoPredio,
        isAll: false,
        enabled: true
      });
      return Promise.resolve();
    },
    buscarPrediosConFiltros,
    crearPredio: mutationCrear.mutateAsync,
    isCreating: mutationCrear.isPending
  };
};
