import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  filterDirecciones,
  paginateDirecciones,
  sortDirecciones,
} from "./direccionList.adapters";
import type {
  DireccionListProps,
  DireccionOrder,
  DireccionSortKey,
} from "./direccionList.types";

export const useDireccionList = ({
  direcciones,
  onSearch,
  searchTerm = "",
}: Pick<DireccionListProps, "direcciones" | "onSearch" | "searchTerm">) => {
  const [order, setOrder] = useState<DireccionOrder>("asc");
  const [orderBy, setOrderBy] = useState<DireccionSortKey>("codigo");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);

  const filtered = useMemo(
    () => filterDirecciones(direcciones, localSearchTerm),
    [direcciones, localSearchTerm],
  );
  const sorted = useMemo(
    () => sortDirecciones(filtered, orderBy, order),
    [filtered, orderBy, order],
  );
  const rows = useMemo(
    () => paginateDirecciones(sorted, page, rowsPerPage),
    [sorted, page, rowsPerPage],
  );

  const requestSort = useCallback(
    (property: DireccionSortKey) => {
      setOrder((current) =>
        orderBy === property && current === "asc" ? "desc" : "asc",
      );
      setOrderBy(property);
    },
    [orderBy],
  );

  const changeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setLocalSearchTerm(value);
      setPage(0);
      onSearch?.(value);
    },
    [onSearch],
  );

  const search = useCallback(() => {
    const term = localSearchTerm.trim();
    if (term) onSearch?.(term);
  }, [localSearchTerm, onSearch]);

  const clearSearch = useCallback(() => {
    setLocalSearchTerm("");
    setPage(0);
    onSearch?.("");
  }, [onSearch]);

  const changeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(Number.parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  return {
    order,
    orderBy,
    page,
    rowsPerPage,
    localSearchTerm,
    rows,
    total: filtered.length,
    setPage,
    requestSort,
    changeSearch,
    search,
    clearSearch,
    changeRowsPerPage,
  };
};
