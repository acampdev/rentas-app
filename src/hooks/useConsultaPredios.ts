import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredios } from './usePredioAPI';
import { Predio } from '../models/Predio';

const ANIO_ACTUAL = new Date().getFullYear();

export const useConsultaPredios = () => {
  const navigate = useNavigate();
  const {
    predios,
    loading,
    cargarPredios,
    buscarPrediosConFiltros
  } = usePredios({
    anio: ANIO_ACTUAL,
    codPredioBase: '',
    isAll: false
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtros, setFiltros] = useState({
    anio: ANIO_ACTUAL,
    codPredioBase: ''
  });

  const filteredPredios = predios;

  const paginatedPredios = useMemo(() => {
    return filteredPredios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredPredios, page, rowsPerPage]);

  const handleBuscar = useCallback(async () => {
    const { anio, codPredioBase } = filtros;
    setPage(0);

    try {
      await buscarPrediosConFiltros(anio, codPredioBase);
      setFiltros({
        anio: ANIO_ACTUAL,
        codPredioBase: ''
      });
    } catch {
      // React Query conserva el error para mostrarlo sin perder los filtros ingresados.
    }
  }, [filtros, buscarPrediosConFiltros]);

  const handleLimpiarFiltros = useCallback(() => {
    setFiltros({
      anio: ANIO_ACTUAL,
      codPredioBase: ''
    });
    buscarPrediosConFiltros(ANIO_ACTUAL, '');
  }, [buscarPrediosConFiltros]);

  const handleEdit = (predio: Predio) => {
    navigate(`/predio/editar/${predio.anio || new Date().getFullYear()}/${predio.codPredioBase || predio.codigoPredio}`);
  };

  const handleView = (predio: Predio) => {
    navigate('/predio/pisos/consulta', { state: { codigoPredio: predio.codPredioBase || predio.codigoPredio, predio } });
  };

  return {
    predios,
    loading,
    filteredPredios,
    paginatedPredios,
    page,
    rowsPerPage,
    filtros,
    setFiltros,
    setPage,
    setRowsPerPage,
    handleBuscar,
    handleLimpiarFiltros,
    handleEdit,
    handleView,
    cargarPredios
  };
};

interface DireccionConsulta {
  nombreTipoVia?: string;
  nombreVia?: string;
  cuadra?: string | number;
  loteInicial?: string | number;
  nombreBarrio?: string;
  descripcion?: string;
}

export const formatDireccion = (direccion?: string | DireccionConsulta | null): string => {
  if (!direccion) return 'Sin dirección';
  if (typeof direccion === 'string') return direccion;
  const parts = [];
  if (direccion.nombreTipoVia && direccion.nombreVia) parts.push(`${direccion.nombreTipoVia} ${direccion.nombreVia}`);
  if (direccion.cuadra) parts.push(`Cuadra ${direccion.cuadra}`);
  if (direccion.loteInicial) parts.push(`Lote ${direccion.loteInicial}`);
  if (direccion.nombreBarrio) parts.push(direccion.nombreBarrio);
  return parts.length > 0 ? parts.join(', ') : (direccion.descripcion || 'Sin dirección');
};
