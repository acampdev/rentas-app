import {
  useCallback,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { NotificationService } from "../../components/utils/Notification";
import type BaseApiService from "../../services/BaseApiService";
import { logger } from "../../utils/logger";
import type { CrudEntityState, UseCrudEntityOptions } from "./crudEntity.types";

interface Params<
  T extends { id?: number; codigo?: number },
  CreateDTO,
  UpdateDTO,
  F extends Record<string, unknown>,
> {
  service: BaseApiService<T, CreateDTO, UpdateDTO>;
  options: UseCrudEntityOptions<T, F>;
  state: CrudEntityState<T, F>;
  setState: Dispatch<SetStateAction<CrudEntityState<T, F>>>;
  abortRef: MutableRefObject<AbortController | null>;
}
export const useCrudEntityOperations = <
  T extends { id?: number; codigo?: number },
  CreateDTO,
  UpdateDTO,
  F extends Record<string, unknown>,
>({
  service,
  options,
  state,
  setState,
  abortRef,
}: Params<T, CreateDTO, UpdateDTO, F>) => {
  const { entityName, localFilter, sortFunction, onSuccess, onError } = options;
  const getId = useCallback(
    (item: T): string | number => item.id || item.codigo || 0,
    [],
  );
  const fail = useCallback(
    (
      operation: string,
      error: unknown,
      fallback: string,
      patch: Partial<CrudEntityState<T, F>>,
      notify = false,
    ) => {
      const parsed = error instanceof Error ? error : new Error(fallback);
      const message = parsed.message || fallback;
      setState((previous) => ({ ...previous, ...patch, error: message }));
      if (notify) NotificationService.error(message);
      onError?.(operation, parsed);
      logger.error(`${operation} ${entityName}:`, error);
    },
    [entityName, onError, setState],
  );
  const loadItems = useCallback(
    async (params?: Record<string, unknown>) => {
      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        setState((previous) => ({ ...previous, loading: true, error: null }));
        const query = {
          page: state.page,
          pageSize: state.pageSize,
          search: state.searchTerm,
          ...state.filters,
          ...params,
        };
        let items = await service.getAll(query);
        if (
          localFilter &&
          (state.searchTerm || Object.keys(state.filters).length)
        )
          items = localFilter(items, {
            search: state.searchTerm,
            ...state.filters,
          });
        if (sortFunction) items = [...items].sort(sortFunction);
        setState((previous) => ({
          ...previous,
          items,
          totalItems: items.length,
          totalPages: Math.ceil(items.length / previous.pageSize),
          loading: false,
          error: null,
        }));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        fail("load", error, `Error al cargar ${entityName}s`, {
          loading: false,
        });
      }
    },
    [
      abortRef,
      entityName,
      fail,
      localFilter,
      service,
      setState,
      sortFunction,
      state.filters,
      state.page,
      state.pageSize,
      state.searchTerm,
    ],
  );
  const createItem = useCallback(
    async (data: CreateDTO) => {
      try {
        setState((p) => ({ ...p, creating: true, error: null }));
        const item = await service.create(data);
        NotificationService.success(`${entityName} creado exitosamente`);
        await loadItems();
        setState((p) => ({ ...p, creating: false, selectedItem: item }));
        onSuccess?.("create", item);
        return item;
      } catch (error) {
        fail(
          "create",
          error,
          `Error al crear ${entityName}`,
          { creating: false },
          true,
        );
        return null;
      }
    },
    [entityName, fail, loadItems, onSuccess, service, setState],
  );
  const updateItem = useCallback(
    async (id: string | number, data: UpdateDTO) => {
      try {
        setState((p) => ({ ...p, updating: true, error: null }));
        const item = await service.update(id, data);
        NotificationService.success(`${entityName} actualizado exitosamente`);
        setState((p) => ({
          ...p,
          items: p.items.map((current) =>
            getId(current) === id ? item : current,
          ),
          selectedItem:
            p.selectedItem && getId(p.selectedItem) === id
              ? item
              : p.selectedItem,
          updating: false,
        }));
        onSuccess?.("update", item);
        return item;
      } catch (error) {
        fail(
          "update",
          error,
          `Error al actualizar ${entityName}`,
          { updating: false },
          true,
        );
        return null;
      }
    },
    [entityName, fail, getId, onSuccess, service, setState],
  );
  const deleteItem = useCallback(
    async (id: string | number) => {
      if (!window.confirm(`¿Está seguro de eliminar este ${entityName}?`))
        return false;
      try {
        setState((p) => ({ ...p, deleting: true, error: null }));
        await service.delete(id);
        NotificationService.success(`${entityName} eliminado exitosamente`);
        setState((p) => ({
          ...p,
          items: p.items.filter((item) => getId(item) !== id),
          selectedItem:
            p.selectedItem && getId(p.selectedItem) === id
              ? null
              : p.selectedItem,
          deleting: false,
          totalItems: p.totalItems - 1,
        }));
        onSuccess?.("delete");
        return true;
      } catch (error) {
        fail(
          "delete",
          error,
          `Error al eliminar ${entityName}`,
          { deleting: false },
          true,
        );
        return false;
      }
    },
    [entityName, fail, getId, onSuccess, service, setState],
  );
  const getItemById = useCallback(
    async (id: string | number) => {
      try {
        setState((p) => ({ ...p, loading: true, error: null }));
        const item = await service.getById(id);
        setState((p) => ({ ...p, loading: false }));
        return item;
      } catch (error) {
        fail("getById", error, `Error al obtener ${entityName}`, {
          loading: false,
        });
        return null;
      }
    },
    [entityName, fail, service, setState],
  );
  return { loadItems, createItem, updateItem, deleteItem, getItemById };
};
