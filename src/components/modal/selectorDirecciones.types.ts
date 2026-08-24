import type { ContribuyenteDireccion } from "../../types/formTypes";

export interface LocalDireccion extends ContribuyenteDireccion {
  codigo: string;
  sector: string;
  barrio: string;
  tipoVia: string;
  nombreVia: string;
  cuadra: string;
}

export interface SelectorDireccionesProps {
  open: boolean;
  onClose: () => void;
  onSelectDireccion: (direccion: ContribuyenteDireccion) => void;
  direccionSeleccionada?: ContribuyenteDireccion | null;
  titulo?: string;
}
