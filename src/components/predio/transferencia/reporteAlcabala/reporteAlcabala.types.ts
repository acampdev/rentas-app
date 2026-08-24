import type { Predio } from "../../../../models/Predio";

export interface FiltroReporteAlcabala {
  predio: Predio | null;
  codigoPredio: string;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
}

export interface ReporteAlcabalaItem {
  id: number;
  fechaOperacion: string;
  codigoPredio: string;
  direccion: string;
  vendedor: string;
  comprador: string;
  valorVenta: number;
  impuesto: number;
  estado: string;
}
