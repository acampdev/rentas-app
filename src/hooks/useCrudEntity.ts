import { useCallback, useEffect, useRef, useState } from "react";
import type BaseApiService from "../services/BaseApiService";
import {
  createCrudState,
  type CrudEntityActions,
  type CrudEntityState,
  type UseCrudEntityOptions,
} from "./crud/crudEntity.types";
import { useCrudEntityOperations } from "./crud/useCrudEntityOperations";

export type {
  CrudEntityActions,
  CrudEntityState,
  UseCrudEntityOptions,
} from "./crud/crudEntity.types";

export function useCrudEntity<
  T extends { id?: number; codigo?: number },
  CreateDTO = unknown,
  UpdateDTO = unknown,
  F extends Record<string, unknown> = Record<string, unknown>,
>(
  service: BaseApiService<T, CreateDTO, UpdateDTO>,
  options: UseCrudEntityOptions<T, F> = { entityName: "Item" },
): [CrudEntityState<T, F>, CrudEntityActions<T, CreateDTO, UpdateDTO, F>] {
  const { loadOnMount = true, searchDebounce = 300 } = options;
  const [state, setState] = useState<CrudEntityState<T, F>>(createCrudState);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const operations = useCrudEntityOperations({
    service,
    options,
    state,
    setState,
    abortRef: abortControllerRef,
  });
  const { loadItems, createItem, updateItem, deleteItem, getItemById } =
    operations;

  useEffect(() => {
    const online = () =>
      setState((previous) => ({ ...previous, isOffline: false }));
    const offline = () =>
      setState((previous) => ({ ...previous, isOffline: true }));
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  const selectItem = useCallback(
    (item: T | null) =>
      setState((previous) => ({ ...previous, selectedItem: item })),
    [],
  );
  const setSearchTerm = useCallback(
    (term: string) =>
      setState((previous) => ({ ...previous, searchTerm: term, page: 1 })),
    [],
  );
  const setFilters = useCallback(
    (filters: F) => setState((previous) => ({ ...previous, filters, page: 1 })),
    [],
  );
  const clearFilters = useCallback(
    () =>
      setState((previous) => ({
        ...previous,
        filters: {} as F,
        searchTerm: "",
        page: 1,
      })),
    [],
  );
  const search = useCallback(
    async (term?: string) => {
      if (term !== undefined) setSearchTerm(term);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        void loadItems();
      }, searchDebounce);
    },
    [loadItems, searchDebounce, setSearchTerm],
  );
  const setPage = useCallback(
    (page: number) =>
      setState((previous) => ({
        ...previous,
        page: Math.max(1, Math.min(page, previous.totalPages)),
      })),
    [],
  );
  const setPageSize = useCallback(
    (pageSize: number) =>
      setState((previous) => ({
        ...previous,
        pageSize: Math.max(1, pageSize),
        page: 1,
      })),
    [],
  );
  const nextPage = useCallback(
    () =>
      setState((previous) => ({
        ...previous,
        page: Math.min(previous.page + 1, previous.totalPages),
      })),
    [],
  );
  const previousPage = useCallback(
    () =>
      setState((previous) => ({
        ...previous,
        page: Math.max(previous.page - 1, 1),
      })),
    [],
  );
  const refresh = useCallback(async () => {
    await loadItems();
  }, [loadItems]);
  const clearError = useCallback(
    () => setState((previous) => ({ ...previous, error: null })),
    [],
  );
  const clearSelection = useCallback(
    () => setState((previous) => ({ ...previous, selectedItem: null })),
    [],
  );
  const reset = useCallback(() => setState(createCrudState<T, F>()), []);

  useEffect(() => {
    if (!loadOnMount) return;
    const timeout = setTimeout(() => {
      void loadItems();
    }, 100);
    return () => clearTimeout(timeout);
  }, [loadOnMount, loadItems]);
  useEffect(
    () => () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      abortControllerRef.current?.abort();
    },
    [],
  );

  return [
    state,
    {
      loadItems,
      createItem,
      updateItem,
      deleteItem,
      getItemById,
      selectItem,
      setSearchTerm,
      setFilters,
      clearFilters,
      search,
      setPage,
      setPageSize,
      nextPage,
      previousPage,
      refresh,
      clearError,
      clearSelection,
      reset,
    },
  ];
}
