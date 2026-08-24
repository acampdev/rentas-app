import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import type { TransferenciaPredioData } from "../../../services/transferenciaService";

export interface TransferenciaFormData {
  codTransferencia: number | null;
  anio: string;
  codigoPredio: string;
  vendedor: ContribuyenteListItem | null;
  comprador: ContribuyenteListItem | null;
  porcentajeTransferencia: number | "";
  fechaMinuta: Date | null;
  documento: string;
  modoTransferencia: string;
  valorTransferencia: number | "";
  esConstructor: boolean;
}

export interface RegistroTransferenciaProps {
  transferenciaEditar?: TransferenciaPredioData | null;
  onGuardado?: () => void;
  onCancelarEdicion?: () => void;
}

export type TransferenciaFieldChange = <K extends keyof TransferenciaFormData>(
  field: K,
  value: TransferenciaFormData[K],
) => void;
