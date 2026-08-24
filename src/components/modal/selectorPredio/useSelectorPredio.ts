import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { usePredios } from '../../../hooks/usePredioAPI';
import type { Predio } from '../../../models/Predio';
import { logger } from '../../../utils/logger';
import { prepareSelectedPredio, sortPrediosByCode } from '../selectorPredio.utils';

interface UseSelectorPredioOptions {
  isOpen: boolean;
  onClose: () => void;
  onSelectPredio: (predio: Predio) => void;
}

const currentYear = () => new Date().getFullYear();

export const useSelectorPredio = ({ isOpen, onClose, onSelectPredio }: UseSelectorPredioOptions) => {
  const [anio, setAnio] = useState(currentYear());
  const [codPredioBase, setCodPredioBase] = useState('');
  const [parametroBusqueda, setParametroBusqueda] = useState('');
  const [selectedPredio, setSelectedPredio] = useState<Predio | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasSearched, setHasSearched] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { predios, loading, error, buscarPrediosConFiltros } = usePredios({ enabled: false });

  useEffect(() => {
    if (!isOpen) return;
    buscarPrediosConFiltros(currentYear(), '').catch((requestError) => {
      logger.error('[SelectorPredio] No se pudieron cargar los predios:', requestError);
    });
  }, [buscarPrediosConFiltros, isOpen]);

  useEffect(() => {
    if (isOpen) return;
    setAnio(currentYear());
    setCodPredioBase('');
    setParametroBusqueda('');
    setSelectedPredio(null);
    setPage(0);
    setHasSearched(false);
  }, [isOpen]);

  const filteredPredios = useMemo(
    () => sortPrediosByCode(predios, order),
    [order, predios],
  );

  const paginatedPredios = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredPredios.slice(start, start + rowsPerPage);
  }, [filteredPredios, page, rowsPerPage]);

  const handleBuscar = async () => {
    setHasSearched(true);
    setPage(0);
    try {
      await buscarPrediosConFiltros(
        anio || undefined,
        codPredioBase || undefined,
        parametroBusqueda || undefined,
      );
    } catch (requestError) {
      logger.error('[SelectorPredio] Error en búsqueda:', requestError);
    }
  };

  const handleLimpiar = async () => {
    const anioActual = currentYear();
    setAnio(anioActual);
    setCodPredioBase('');
    setParametroBusqueda('');
    setHasSearched(false);
    setPage(0);
    await buscarPrediosConFiltros(anioActual, '');
  };

  const handleConfirm = () => {
    if (!selectedPredio) return;
    onSelectPredio(prepareSelectedPredio(selectedPredio));
    onClose();
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    anio,
    codPredioBase,
    parametroBusqueda,
    selectedPredio,
    page,
    rowsPerPage,
    hasSearched,
    order,
    predios,
    filteredPredios,
    paginatedPredios,
    loading,
    error,
    setAnio,
    setCodPredioBase,
    setParametroBusqueda,
    setSelectedPredio,
    setPage,
    setOrder,
    handleBuscar,
    handleLimpiar,
    handleConfirm,
    handleChangeRowsPerPage,
  };
};
