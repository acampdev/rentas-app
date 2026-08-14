import { useState, useEffect, useMemo, useCallback } from 'react';
import { Calle } from '../models/Calle';

interface UseCalleListProps {
  calles: Calle[];
  searchTerm?: string;
  obtenerNombreBarrio?: (id: number) => string;
}

export const useCalleList = ({ calles, searchTerm: initialSearch = '', obtenerNombreBarrio }: UseCalleListProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('nombreVia');
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearch);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setLocalSearchTerm(initialSearch);
  }, [initialSearch]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getUbicacion = useCallback((calle: Calle) => {
    const cod = calle.codBarrio || calle.codigoBarrio;
    return calle.nombreBarrio || (obtenerNombreBarrio ? obtenerNombreBarrio(cod || 0) : `Barrio ${cod || ''}`);
  }, [obtenerNombreBarrio]);

  const sortedAndFilteredCalles = useMemo(() => {
    let data = [...calles];
    if (localSearchTerm) {
      const term = localSearchTerm.toLowerCase();
      data = data.filter(c => {
        const nombre = `${c.descTipoVia || ''} ${c.nombreVia || ''}`.toLowerCase();
        return nombre.includes(term) || getUbicacion(c).toLowerCase().includes(term);
      });
    }
    data.sort((a, b) => {
      let aV: any = orderBy === 'ubicacion' ? getUbicacion(a) : a[orderBy as keyof Calle];
      let bV: any = orderBy === 'ubicacion' ? getUbicacion(b) : b[orderBy as keyof Calle];
      if (typeof aV === 'string') { aV = aV.toLowerCase(); bV = bV?.toLowerCase() || ''; }
      return order === 'asc' ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1);
    });
    return data;
  }, [calles, order, orderBy, localSearchTerm, getUbicacion]);

  const paginatedCalles = useMemo(() => {
    return sortedAndFilteredCalles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedAndFilteredCalles, page, rowsPerPage]);

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    orderBy,
    handleRequestSort,
    localSearchTerm,
    setLocalSearchTerm,
    selectedId,
    setSelectedId,
    paginatedCalles,
    sortedAndFilteredCalles,
    getUbicacion
  };
};
