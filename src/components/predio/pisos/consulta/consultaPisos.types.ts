import type { Piso } from "../../../../models/Piso";

export interface PisoConsulta extends Piso {
  anio?: number;
  codPredio?: string;
  codigoPredio?: string;
  codPredioBase?: string;
  numeroPiso?: number;
}

export interface FiltrosPisosUI {
  anio: number;
  codPredio: string;
}
