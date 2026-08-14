// src/hooks/usePersonas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  personaService,
  CreatePersonaAPIDTO,
  UpdatePersonaDTO,
  BusquedaPersonaParams,
} from "../services/personaService";
import { NotificationService } from "../components/utils/Notification";
import { BUSINESS_CODES } from "../config/constants";

/**
 * Hook para la gestión de Personas con React Query
 */
export const usePersonas = () => {
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState<BusquedaPersonaParams>({});

  // Query: Listar/Buscar personas
  const {
    data: personas = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["personas", filtros],
    queryFn: () => personaService.listarPorTipoYNombre(filtros),
    enabled: !!(
      filtros.numeroDocumento ||
      (filtros.parametroBusqueda && filtros.parametroBusqueda !== "a")
    ),
    placeholderData: (prev) => prev,
  });

  // Query: Obtener por documento (Lazy)
  const buscarPorDocumento = useCallback(
    async (dni: string, codTipoDocumento: string = "4101") => {
      return queryClient.fetchQuery({
        queryKey: ["persona-dni", dni, codTipoDocumento],
        queryFn: () =>
          personaService.obtenerPorDocumento(dni, codTipoDocumento),
        staleTime: 0,
      });
    },
    [queryClient],
  );

  // Query: Listar persona especifica (GET /api/persona/listarPersona)
  const listarPersona = useCallback(
    async (codTipoDocumento: string = "4101", numeroDocumento: string) => {
      return queryClient.fetchQuery({
        queryKey: ["persona-listar", codTipoDocumento, numeroDocumento],
        queryFn: () =>
          personaService.listarPersona(codTipoDocumento, numeroDocumento),
        staleTime: 0,
      });
    },
    [queryClient],
  );

  // Mutación: Crear (POST /api/persona)
  const mutationCrear = useMutation({
    mutationFn: (datos: CreatePersonaAPIDTO) =>
      personaService.crearPersonaAPI(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      queryClient.invalidateQueries({ queryKey: ["persona-listar"] });
      NotificationService.success("Persona registrada correctamente");
    },
    onError: (err: unknown) => {
      NotificationService.error(
        err instanceof Error ? err.message : "Error al registrar persona",
      );
    },
  });

  // Mutación: Actualizar (PUT /api/persona)
  const mutationActualizar = useMutation({
    mutationFn: (datos: UpdatePersonaDTO) =>
      personaService.actualizarPersonaAPI(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      queryClient.invalidateQueries({ queryKey: ["persona-listar"] });
      NotificationService.success("Persona actualizada correctamente");
    },
    onError: (err: unknown) => {
      NotificationService.error(
        err instanceof Error ? err.message : "Error al actualizar persona",
      );
    },
  });

  const buscarPersonas = useCallback((params: BusquedaPersonaParams) => {
    setFiltros(params);
  }, []);

  const validarDocumento = useCallback(
    (tipoDocumento: string, numeroDocumento: string) =>
      personaService.validarDocumento(tipoDocumento, numeroDocumento),
    [],
  );

  return {
    personas,
    loading,
    error: error ? (error as Error).message : null,
    buscarPersonas,
    buscarPorDocumento,
    listarPersona,
    crearPersona: mutationCrear.mutateAsync,
    actualizarPersona: mutationActualizar.mutateAsync,
    isCreating: mutationCrear.isPending,
    isUpdating: mutationActualizar.isPending,

    // Utilidades del servicio
    validarDocumento,
    convertirAContribuyente:
      personaService.convertirAContribuyente.bind(personaService),
    convertirFormularioAApiDTO:
      personaService.convertirFormularioAApiDTO.bind(personaService),

    // Constantes
    TIPO_PERSONA_CODES: BUSINESS_CODES.TIPO_PERSONA,
  };
};

export default usePersonas;
