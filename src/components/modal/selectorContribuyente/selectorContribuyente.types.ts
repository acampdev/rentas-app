import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";

export interface SelectorContribuyenteProps {
  isOpen: boolean;
  onClose: () => void;
  // Se conserva un parámetro flexible porque los consumidores históricos adaptan
  // el elemento seleccionado a modelos distintos (caja, predio y reportes).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectContribuyente: (contribuyente: any) => void;
  selectedId?: number;
  title?: string;
}

export interface SelectorContribuyenteTableProps {
  contribuyentes: ContribuyenteListItem[];
  loading: boolean;
  seleccionado: ContribuyenteListItem | null;
  onSelect: (contribuyente: ContribuyenteListItem) => void;
  onConfirmImmediately: (contribuyente: ContribuyenteListItem) => void;
}
