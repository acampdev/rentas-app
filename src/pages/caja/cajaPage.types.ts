export interface EstadoCaja {
  numeroCaja: string;
  fechaApertura: string;
  montoInicial: number;
  montoActual: number;
  totalIngresos: number;
  totalEgresos: number;
  abierta: boolean;
  ultimaTransaccion?: string;
  codAperturaCaja?: number;
  codAsignacionCaja?: number | null;
  codUsuarioOperando?: number;
}

export const createClosedCajaState = (): EstadoCaja => ({
  numeroCaja: "",
  fechaApertura: "",
  montoInicial: 0,
  montoActual: 0,
  totalIngresos: 0,
  totalEgresos: 0,
  abierta: false,
});
