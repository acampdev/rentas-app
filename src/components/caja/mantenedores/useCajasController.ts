import { useState } from "react";
import { useMantenedorCaja } from "../../../hooks/useMantenedorCaja";
import type {
  ListarMantenedorCajaParams,
  MantenedorCajaData,
} from "../../../services/mantenedorCajaService";
import { NotificationService } from "../../utils/Notification";
import type { CajasController } from "./cajas.types";

export const useCajasController = (): CajasController => {
  const [tab, setTab] = useState(0);
  const [descripcionRegistro, setDescripcionRegistro] = useState("");
  const [editando, setEditando] = useState<MantenedorCajaData | null>(null);
  const [descripcionBusqueda, setDescripcionBusqueda] = useState("");
  const [codUsuarioBusqueda, setCodUsuarioBusqueda] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    cajas,
    loading,
    crearCaja,
    actualizarCaja,
    eliminarCaja,
    buscarCajas,
  } = useMantenedorCaja();
  const nuevoRegistro = () => {
    setDescripcionRegistro("");
    setEditando(null);
  };
  const guardar = async () => {
    if (!descripcionRegistro.trim()) {
      NotificationService.warning("Por favor ingrese una descripción");
      return;
    }
    const result = editando
      ? await actualizarCaja({
          codCaja: editando.codCaja,
          descripcion: descripcionRegistro,
        })
      : await crearCaja({ descripcion: descripcionRegistro });
    if (result) {
      nuevoRegistro();
      setTab(1);
    }
  };
  const buscar = async () => {
    const params: ListarMantenedorCajaParams = {};
    if (descripcionBusqueda) params.descripcion = descripcionBusqueda;
    if (codUsuarioBusqueda) params.codUsuario = Number(codUsuarioBusqueda);
    setPage(0);
    await buscarCajas(params);
  };
  const limpiarBusqueda = () => {
    setDescripcionBusqueda("");
    setCodUsuarioBusqueda("");
    setPage(0);
  };
  const editar = (caja: MantenedorCajaData) => {
    setDescripcionRegistro(caja.descripcion);
    setEditando(caja);
    setTab(0);
  };
  const eliminar = async (caja: MantenedorCajaData) => {
    if (
      window.confirm(`¿Está seguro de eliminar la caja "${caja.descripcion}"?`)
    )
      await eliminarCaja(caja.codCaja);
  };
  const lastPage = Math.max(0, Math.ceil(cajas.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, lastPage);
  return {
    tab,
    setTab,
    descripcionRegistro,
    setDescripcionRegistro,
    editando,
    descripcionBusqueda,
    setDescripcionBusqueda,
    codUsuarioBusqueda,
    setCodUsuarioBusqueda,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    cajas,
    cajasPaginadas: cajas.slice(
      currentPage * rowsPerPage,
      currentPage * rowsPerPage + rowsPerPage,
    ),
    loading,
    guardar,
    nuevoRegistro,
    buscar,
    limpiarBusqueda,
    editar,
    eliminar,
  };
};
