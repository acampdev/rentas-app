import { useMemo, useState } from "react";
import type { GridPaginationModel } from "@mui/x-data-grid";
import type { UITData } from "../../../services/uitService";
import { uitService } from "../../../services/uitService";
import { NotificationService } from "../../utils/Notification";
import { filterUits, parseUitSearchYear } from "./uitList.adapters";
import type { UitListController } from "./uitList.types";

export const useUitList = (uits: UITData[]): UitListController => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UITData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const rows = useMemo(
    () => (hasSearched ? searchResults : filterUits(uits, searchTerm)),
    [hasSearched, searchResults, searchTerm, uits],
  );

  const search = async (): Promise<void> => {
    if (!searchTerm.trim()) {
      NotificationService.warning("Ingrese un año para buscar");
      return;
    }

    const year = parseUitSearchYear(searchTerm);
    if (year === null) {
      NotificationService.error("Ingrese un año válido (entre 1990 y 2100)");
      return;
    }

    setIsSearching(true);
    try {
      const results = await uitService.listarUITs(year);
      setSearchResults(results);
      setHasSearched(true);
      setPaginationModel((current) => ({ ...current, page: 0 }));
      if (results.length === 0) {
        NotificationService.info(`No se encontraron UITs para el año ${year}`);
      } else {
        NotificationService.success(
          `Se encontraron ${results.length} registro(s) para el año ${year}`,
        );
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      NotificationService.error(`Error al buscar UITs: ${message}`);
      setSearchResults([]);
      setHasSearched(false);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = (): void => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Enter") void search();
  };

  return {
    searchTerm,
    setSearchTerm,
    rows,
    isSearching,
    hasSearched,
    paginationModel,
    setPaginationModel,
    search,
    clearSearch,
    handleSearchKeyDown,
  };
};
