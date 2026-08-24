import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useDirecciones } from "../../hooks/useDirecciones";
import { NotificationService } from "../utils/Notification";
import type { SelectorDireccionesProps } from "./selectorDirecciones.types";
import {
  filtrarDirecciones,
  formatearDireccionSeleccionada,
} from "./selectorDirecciones.utils";

export const useSelectorDirecciones = ({
  open,
  onClose,
  onSelectDireccion,
  direccionSeleccionada,
}: SelectorDireccionesProps) => {
  const [busqueda, setBusqueda] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(
    direccionSeleccionada?.id || null,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const busquedaDiferida = useDeferredValue(busqueda);
  const { direcciones, loading, error, cargarDirecciones } = useDirecciones();
  const cargarRef = useRef(cargarDirecciones);

  useEffect(() => {
    cargarRef.current = cargarDirecciones;
  }, [cargarDirecciones]);
  useEffect(() => {
    if (open) void cargarRef.current();
  }, [open]);
  useEffect(() => {
    if (open) setSelectedId(direccionSeleccionada?.id || null);
  }, [open, direccionSeleccionada?.id]);

  const filtradas = useMemo(
    () => filtrarDirecciones(direcciones, busquedaDiferida),
    [direcciones, busquedaDiferida],
  );
  const paginadas = useMemo(
    () => filtradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtradas, page, rowsPerPage],
  );

  const cambiarBusqueda = (value: string) => {
    setBusqueda(value);
    setPage(0);
  };
  const cambiarFilas = (value: number) => {
    setRowsPerPage(value);
    setPage(0);
  };
  const recargar = () => {
    void cargarDirecciones();
    NotificationService.info("Recargando direcciones...");
  };
  const seleccionar = () => {
    const direccion = filtradas.find((item) => item.id === selectedId);
    if (!direccion) return;
    onSelectDireccion(formatearDireccionSeleccionada(direccion));
    onClose();
  };

  return {
    busqueda,
    selectedId,
    page,
    rowsPerPage,
    direcciones,
    filtradas,
    paginadas,
    loading,
    error,
    setSelectedId,
    setPage,
    cambiarBusqueda,
    cambiarFilas,
    recargar,
    seleccionar,
  };
};
