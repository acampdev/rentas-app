export interface ConsultaAsignacionFiltros {
  anio: string;
  codigoContribuyente: string;
  nombreContribuyente: string;
}

export interface ConsultaAsignacionLocationState {
  searchParams?: {
    anio: number;
    codContribuyente: string;
  };
  nombreContribuyente?: string;
}

