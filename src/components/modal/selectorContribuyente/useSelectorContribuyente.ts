import { useEffect, useMemo, useRef, useState } from "react";
import {
  useContribuyentes,
  type ContribuyenteListItem,
} from "../../../hooks/useContribuyentes";
import { logger } from "../../../utils/logger";

interface Params {
  isOpen: boolean;
  selectedId?: number;
}

export const useSelectorContribuyente = ({ isOpen, selectedId }: Params) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [seleccionado, setSeleccionado] =
    useState<ContribuyenteListItem | null>(null);
  const { contribuyentes, loading, error, cargarContribuyentes } =
    useContribuyentes();
  const hasLoadedRef = useRef(false);
  const previousIsOpenRef = useRef(false);

  useEffect(() => {
    if (
      isOpen &&
      !previousIsOpenRef.current &&
      contribuyentes.length === 0 &&
      !loading &&
      !hasLoadedRef.current
    ) {
      logger.log("[SelectorContribuyente] Cargando contribuyentes");
      void cargarContribuyentes();
      hasLoadedRef.current = true;
    }
    previousIsOpenRef.current = isOpen;
  }, [isOpen, contribuyentes.length, loading, cargarContribuyentes]);

  useEffect(() => {
    if (!isOpen) return;
    setSeleccionado(
      selectedId
        ? (contribuyentes.find((item) => item.codigo === selectedId) ?? null)
        : null,
    );
  }, [isOpen, selectedId, contribuyentes]);

  const filtrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return contribuyentes;
    return contribuyentes.filter(
      (item) =>
        item.contribuyente?.toLowerCase().includes(term) ||
        item.documento?.toLowerCase().includes(term) ||
        item.codigo?.toString().includes(term),
    );
  }, [contribuyentes, searchTerm]);

  const visibles = useMemo(
    () => filtrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtrados, page, rowsPerPage],
  );

  const updateSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };
  const updateRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(0);
  };

  return {
    searchTerm,
    updateSearch,
    page,
    setPage,
    rowsPerPage,
    updateRowsPerPage,
    seleccionado,
    setSeleccionado,
    filtrados,
    visibles,
    loading: loading && contribuyentes.length === 0,
    error,
  };
};
