import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { Barrio } from "../../models/Barrio";
import type { Sector } from "../../models/Sector";
import type { BarrioOrder, BarrioOrderBy } from "./barrioList.types";

interface Options {
  barrios: Barrio[];
  sectores: Sector[];
  searchTerm: string;
  onSearch?: (term: string) => void;
}

export const useBarrioList = ({
  barrios,
  sectores,
  searchTerm,
  onSearch,
}: Options) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<BarrioOrder>("asc");
  const [orderBy, setOrderBy] = useState<BarrioOrderBy>("nombre");
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const sectors = useMemo(
    () => new Map(sectores.map((sector) => [sector.id, sector])),
    [sectores],
  );
  const getSectorName = useCallback(
    (code?: number) =>
      code ? sectors.get(code)?.nombre || `Sector ${code}` : "Sin sector",
    [sectors],
  );

  const rows = useMemo(() => {
    const query = localSearchTerm.trim().toLocaleLowerCase("es");
    const filtered =
      onSearch || !query
        ? [...barrios]
        : barrios.filter(
            (item) =>
              (item.nombre || "").toLocaleLowerCase("es").includes(query) ||
              getSectorName(item.codSector)
                .toLocaleLowerCase("es")
                .includes(query),
          );
    return filtered.sort((a, b) => {
      const left =
        orderBy === "sector" ? getSectorName(a.codSector) : a[orderBy];
      const right =
        orderBy === "sector" ? getSectorName(b.codSector) : b[orderBy];
      if (left == null) return 1;
      if (right == null) return -1;
      const result =
        typeof left === "string"
          ? left.localeCompare(String(right), "es", { sensitivity: "base" })
          : Number(left) - Number(right);
      return order === "asc" ? result : -result;
    });
  }, [barrios, getSectorName, localSearchTerm, onSearch, order, orderBy]);

  const changeSearch = (value: string) => {
    setLocalSearchTerm(value);
    setPage(0);
    onSearch?.(value);
  };
  const requestSort = (field: BarrioOrderBy) => {
    setOrder((current) =>
      orderBy === field && current === "asc" ? "desc" : "asc",
    );
    setOrderBy(field);
  };
  const changeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    order,
    orderBy,
    localSearchTerm,
    rows,
    visibleRows: rows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    ),
    getSectorName,
    setPage,
    changeRowsPerPage,
    changeSearch,
    requestSort,
  };
};
