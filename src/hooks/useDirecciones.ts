import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  direccionService,
  DireccionData,
  CreateDireccionDTO,
  UpdateDireccionDTO,
  BusquedaDireccionParams,
} from "../services/direccionService";
import { NotificationService } from "../components/utils/Notification";

const EMPTY_DIRECCIONES: DireccionData[] = [];

/**
 * Hook para gestión de direcciones con React Query
 */
export const useDirecciones = (
  paramsIniciales: BusquedaDireccionParams = { parametrosBusqueda: "a" },
) => {
  const queryClient = useQueryClient();
  const [params, setParams] =
    useState<BusquedaDireccionParams>(paramsIniciales);

  // Query: Listar Direcciones
  const {
    data: direcciones = EMPTY_DIRECCIONES,
    isLoading: loading,
    error,
    refetch: cargarDirecciones,
  } = useQuery({
    queryKey: ["direcciones", params],
    queryFn: () => direccionService.getAll(params),
    placeholderData: (prev) => prev,
  });

  // Mutación: Crear
  const mutationCrear = useMutation({
    mutationFn: (datos: CreateDireccionDTO) =>
      direccionService.crearDireccion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
      NotificationService.success("Dirección creada correctamente");
    },
    onError: (err: any) => {
      NotificationService.error(err.message || "Error al crear dirección");
    },
  });

  // Mutación: Actualizar
  const mutationActualizar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: UpdateDireccionDTO }) =>
      direccionService.actualizarDireccion(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
      NotificationService.success("Dirección actualizada correctamente");
    },
    onError: (err: any) => {
      NotificationService.error(err.message || "Error al actualizar dirección");
    },
  });

  return {
    direcciones,
    loading,
    error: error ? (error as Error).message : null,

    // Acciones
    buscarDirecciones: (p: BusquedaDireccionParams) => setParams(p),
    cargarDirecciones,
    crearDireccion: mutationCrear.mutateAsync,
    actualizarDireccion: mutationActualizar.mutateAsync,

    // Estados de mutación
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,
  };
};
