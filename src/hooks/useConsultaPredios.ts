import { useState, useEffect, useMemo, useCallback } from 'react';
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
    buscarPredios,
    buscarPrediosConFiltros,
    cargarEstadisticas
  } = usePredios({
    anio: ANIO_ACTUAL,
    codPredioBase: '',
    parametroBusqueda: '',
    isAll: false
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({
    codigoPredio: '',
    anio: ANIO_ACTUAL,
    codPredioBase: '',
    parametroBusqueda: '',
    estadoPredio: '',
    condicionPropiedad: ''
  });

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  const filteredPredios = useMemo(() => {
    let filtered = [...predios];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.codigoPredio?.toLowerCase().includes(term) ||
        p.conductor?.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [predios, searchTerm]);

  const paginatedPredios = useMemo(() => {
    return filteredPredios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredPredios, page, rowsPerPage]);

  const handleBuscar = useCallback(() => {
    if (filtros.codPredioBase || filtros.parametroBusqueda) {
      buscarPrediosConFiltros(filtros.anio, filtros.codPredioBase, filtros.parametroBusqueda);
    } else {
      buscarPredios(filtros);
    }
    // Limpiar automáticamente los filtros tras iniciar la búsqueda
    setFiltros({
      codigoPredio: '',
      anio: ANIO_ACTUAL,
      codPredioBase: '',
      parametroBusqueda: '',
      estadoPredio: '',
      condicionPropiedad: ''
    });
    setSearchTerm('');
  }, [filtros, buscarPredios, buscarPrediosConFiltros]);

  const handleLimpiarFiltros = useCallback(() => {
    setFiltros({
      codigoPredio: '',
      anio: ANIO_ACTUAL,
      codPredioBase: '',
      parametroBusqueda: '',
      estadoPredio: '',
      condicionPropiedad: ''
    });
    setSearchTerm('');
    buscarPrediosConFiltros(ANIO_ACTUAL, '', '');
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
    searchTerm,
    setSearchTerm,
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
