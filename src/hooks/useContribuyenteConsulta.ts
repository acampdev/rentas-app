import { useState, useCallback, useMemo } from 'react';
import { useConstantesOptions } from './useConstantesOptions';
import { constanteService } from '../services';

interface Contribuyente {
  codigo: string | number;
  contribuyente: string;
  documento: string;
  direccion: string;
  telefono?: string;
  tipoPersona?: 'natural' | 'juridica' | string;
  tipoContribuyente?: string;
  estado?: 'activo' | 'inactivo';
}

interface UseContribuyenteConsultaProps {
  contribuyentes: Contribuyente[];
  onBuscar: (filtro: any) => void;
}

export const useContribuyenteConsulta = ({
  contribuyentes,
  onBuscar
}: UseContribuyenteConsultaProps) => {
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [tipoContribuyente, setTipoContribuyente] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const {
    options: tiposContribuyenteOptions,
    loading: loadingTipos
  } = useConstantesOptions(
    'tipos-contribuyente',
    () => constanteService.obtenerTiposContribuyente()
  );

  const handleBuscar = useCallback(() => {
    onBuscar({ busqueda: textoBusqueda.trim() });
    setPage(0);
  }, [textoBusqueda, onBuscar]);

  const handleLimpiar = useCallback(() => {
    setTextoBusqueda('');
    setTipoContribuyente(null);
    onBuscar({ busqueda: '' });
    setPage(0);
  }, [onBuscar]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const tieneFiltrosActivos = useMemo(() => !!textoBusqueda.trim(), [textoBusqueda]);

  const filteredContribuyentes = useMemo(() => {
    if (!textoBusqueda.trim()) return contribuyentes;
    const term = textoBusqueda.toLowerCase().trim();
    return contribuyentes.filter(c => 
      c.codigo.toString().toLowerCase().includes(term) ||
      c.contribuyente.toLowerCase().includes(term) ||
      c.documento.toLowerCase().includes(term) ||
      (c.direccion && c.direccion.toLowerCase().includes(term))
    );
  }, [contribuyentes, textoBusqueda]);

  const contribuyentesPaginados = useMemo(() => {
    return filteredContribuyentes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredContribuyentes, page, rowsPerPage]);

  return {
    textoBusqueda,
    setTextoBusqueda,
    tipoContribuyente,
    setTipoContribuyente,
    tiposContribuyenteOptions,
    loadingTipos,
    page,
    rowsPerPage,
    handleBuscar,
    handleLimpiar,
    handleChangePage,
    handleChangeRowsPerPage,
    tieneFiltrosActivos,
    contribuyentesPaginados,
    filteredContribuyentes
  };
};
