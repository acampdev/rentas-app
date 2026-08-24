import type { TransferenciaPredioData } from "../../../../services/transferenciaService";

export interface TransferenciaFilters {
  codigoTransferencia: string;
  codigoPredio: string;
  anio: string;
  codContribuyenteVenta: string;
  codContribuyenteCompra: string;
}

export interface ConsultaTransferenciaProps {
  onEditar?: (transferencia: TransferenciaPredioData) => void;
}

export const INITIAL_TRANSFER_FILTERS: TransferenciaFilters = {
  codigoTransferencia: "",
  codigoPredio: "",
  anio: "",
  codContribuyenteVenta: "",
  codContribuyenteCompra: "",
};
