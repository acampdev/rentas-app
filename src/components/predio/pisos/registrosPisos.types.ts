import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type { Predio } from "../../../models/Predio";
import type { PisoData } from "../../../services/pisoService";

export enum FormaRegistro {
  INDIVIDUAL = "INDIVIDUAL",
  MASIVO = "MASIVO",
}

export interface PisoFormData {
  descripcion: string;
  fechaConstruccion: Date | null;
  antiguedad: string;
  estadoConservacion: string;
  areaConstruida: string;
  materialPredominante: string;
  formaRegistro: string;
  otrasInstalaciones: string;
  anio?: number;
  areasComunes?: string;
}

export interface CategoriaSeleccionada {
  id: string;
  padre: OptionFormat;
  hijo: OptionFormat;
  letra: OptionFormat;
  fechaCreacion: Date;
  valor: number;
}

export interface PisoNavigationState {
  modoEdicion?: "editar";
  datosEdicion?: {
    piso?: PisoData;
    predio?: Partial<Predio>;
  };
}

export interface PisoCategoryDictionaries {
  categoriaCodigoToTexto: Record<string, string>;
  categoriaTextoToCodigo: Record<string, string>;
  subcategoriaCodigoToTexto: Record<string, string>;
  subcategoriaTextoToCodigo: Record<string, string>;
  letraCodigoToLetra: Record<string, string>;
}
