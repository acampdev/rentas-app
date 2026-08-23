export interface CuentaListProps {
  contribuyenteId?: number;
  predioId?: number;
  loading?: boolean;
  error?: string;
}

export interface ContribuyenteSeleccionado {
  codigo: number | string;
  contribuyente?: string;
  nombreCompleto?: string;
}

