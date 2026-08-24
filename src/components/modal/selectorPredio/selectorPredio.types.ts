import type { ChangeEvent } from 'react';
import type { Predio } from '../../../models/Predio';

export interface SelectorPredioProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPredio: (predio: Predio) => void;
  title?: string;
  selectedId?: string | null;
  contribuyenteId?: number | null;
}

export interface SelectorPredioPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  mobile?: boolean;
  onPageChange: (_event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface SelectorPredioListProps extends SelectorPredioPaginationProps {
  predios: Predio[];
  selectedPredio: Predio | null;
  onSelect: (predio: Predio) => void;
}
