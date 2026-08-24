export interface UseCrudEntityOptions<T, F = Record<string, unknown>> {
  entityName: string;
  loadOnMount?: boolean;
  localFilter?: (items: T[], filter: { search: string } & F) => T[];
  sortFunction?: (a: T, b: T) => number;
  searchDebounce?: number;
  onSuccess?: (operation: "create" | "update" | "delete", data?: T) => void;
  onError?: (operation: string, error: Error) => void;
}
export interface CrudEntityState<T, F = Record<string, unknown>> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  searchTerm: string;
  filters: F;
  isOffline: boolean;
}
export interface CrudEntityActions<
  T,
  CreateDTO,
  UpdateDTO,
  F = Record<string, unknown>,
> {
  loadItems: (params?: Record<string, unknown>) => Promise<void>;
  createItem: (data: CreateDTO) => Promise<T | null>;
  updateItem: (id: string | number, data: UpdateDTO) => Promise<T | null>;
  deleteItem: (id: string | number) => Promise<boolean>;
  selectItem: (item: T | null) => void;
  getItemById: (id: string | number) => Promise<T | null>;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: F) => void;
  clearFilters: () => void;
  search: (term?: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refresh: () => Promise<void>;
  clearError: () => void;
  clearSelection: () => void;
  reset: () => void;
}
export const createCrudState = <
  T,
  F extends Record<string, unknown>,
>(): CrudEntityState<T, F> => ({
  items: [],
  selectedItem: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  page: 1,
  pageSize: 20,
  totalItems: 0,
  totalPages: 0,
  searchTerm: "",
  filters: {} as F,
  isOffline: !navigator.onLine,
});
