import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredios } from './usePredioAPI';
import { Predio } from '../models/Predio';
import { Direccion } from '../models/Direcciones';

export const useConsultaPredios = () => {
  const navigate = useNavigate();
  const {
    predios,
    loading,
    cargarPredios,
    cargarTodosPredios,
    buscarPredios,
    buscarPrediosConFiltros,
    cargarEstadisticas
  } = usePredios();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<'anio' | 'codigo'>('codigo');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [filtros, setFiltros] = useState({
    codigoPredio: '',
    anio: new Date().getFullYear(),
    codPredioBase: '',
    parametroBusqueda: '',
    estadoPredio: '',
    condicionPropiedad: ''
  });

  useEffect(() => {
    cargarEstadisticas();
    cargarTodosPredios();
  }, [cargarEstadisticas, cargarTodosPredios]);

  const filteredPredios = useMemo(() => {
    let filtered = [...predios];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.codigoPredio?.toLowerCase().includes(term) ||
        p.conductor?.toLowerCase().includes(term)
      );
    }
    return filtered.sort((a, b) => {
      const aVal = orderBy === 'anio' ? (a.anio || 0) : (a.codPredioBase || a.codigoPredio || '');
      const bVal = orderBy === 'anio' ? (b.anio || 0) : (b.codPredioBase || b.codigoPredio || '');
      return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }, [predios, searchTerm, orderBy, order]);

  const paginatedPredios = useMemo(() => {
    return filteredPredios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredPredios, page, rowsPerPage]);

  const handleSort = (column: 'anio' | 'codigo') => {
    if (orderBy === column) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setOrderBy(column); setOrder('desc'); }
    setPage(0);
  };

  const handleBuscar = useCallback(() => {
    if (filtros.codPredioBase || filtros.parametroBusqueda) {
      buscarPrediosConFiltros(filtros.anio, filtros.codPredioBase, filtros.parametroBusqueda);
    } else {
      buscarPredios(filtros);
    }
    // Limpiar automáticamente los filtros tras iniciar la búsqueda
    setFiltros({
      codigoPredio: '',
      anio: new Date().getFullYear(),
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
      anio: new Date().getFullYear(),
      codPredioBase: '',
      parametroBusqueda: '',
      estadoPredio: '',
      condicionPropiedad: ''
    });
    setSearchTerm('');
    cargarTodosPredios();
  }, [cargarTodosPredios]);

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
    orderBy,
    order,
    filtros,
    setFiltros,
    setPage,
    setRowsPerPage,
    handleSort,
    handleBuscar,
    handleLimpiarFiltros,
    handleEdit,
    handleView,
    cargarPredios
  };
};

export const formatDireccion = (direccion: any): string => {
  if (!direccion) return 'Sin dirección';
  if (typeof direccion === 'string') return direccion;
  const parts = [];
  if (direccion.nombreTipoVia && direccion.nombreVia) parts.push(`${direccion.nombreTipoVia} ${direccion.nombreVia}`);
  if (direccion.cuadra) parts.push(`Cuadra ${direccion.cuadra}`);
  if (direccion.loteInicial) parts.push(`Lote ${direccion.loteInicial}`);
  if (direccion.nombreBarrio) parts.push(direccion.nombreBarrio);
  return parts.length > 0 ? parts.join(', ') : (direccion.descripcion || 'Sin dirección');
};
