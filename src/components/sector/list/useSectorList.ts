import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { Sector } from "../../../models/Sector";
import { filterAndSortSectors, paginateSectors } from "./sectorList.adapters";
import type {
  SectorListProps,
  SectorOrder,
  SectorSortKey,
} from "./sectorList.types";

export const useSectorList = ({
  sectores,
  onSearch,
  searchTerm = "",
  onSelectSector,
}: Pick<
  SectorListProps,
  "sectores" | "onSearch" | "searchTerm" | "onSelectSector"
>) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<SectorOrder>("asc");
  const [orderBy, setOrderBy] = useState<SectorSortKey>("nombre");

  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);

  useEffect(() => {
    const clearSelection = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onSelectSector(null as unknown as Sector);
      }
    };
    window.addEventListener("keydown", clearSelection);
    return () => window.removeEventListener("keydown", clearSelection);
  }, [onSelectSector]);

  const filteredSectors = useMemo(
    () =>
      filterAndSortSectors(
        sectores,
        localSearchTerm,
        orderBy,
        order,
        !onSearch,
      ),
    [sectores, localSearchTerm, orderBy, order, onSearch],
  );

  const rows = useMemo(
    () => paginateSectors(filteredSectors, page, rowsPerPage),
    [filteredSectors, page, rowsPerPage],
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

  const clearSearch = useCallback(() => {
    setLocalSearchTerm("");
    setPage(0);
    onSearch?.("");
  }, [onSearch]);

  const requestSort = useCallback(
    (property: SectorSortKey) => {
      setOrder((current) =>
        orderBy === property && current === "asc" ? "desc" : "asc",
      );
      setOrderBy(property);
    },
    [orderBy],
  );

  const changeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(Number.parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  return {
    localSearchTerm,
    page,
    rowsPerPage,
    order,
    orderBy,
    rows,
    total: filteredSectors.length,
    setPage,
    changeSearch,
    clearSearch,
    requestSort,
    changeRowsPerPage,
  };
};
