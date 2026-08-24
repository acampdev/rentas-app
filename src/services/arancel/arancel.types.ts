export interface ArancelData {
  codArancel: number | null;
  anio: number;
  codDireccion: number;
  costo: number | null;
  codUsuario: number | null;
  costoArancel: number;
  direccionCompleta: string;
  sector: string;
  barrio: string;
  calle: string;
}

export interface CreateArancelDTO {
  anio: number;
  codDireccion: number;
  costoArancel: number;
  codUsuario?: number;
}

export interface CrearArancelApiDTO {
  codArancel?: null;
  anio: number;
  codDireccion: number;
  costo: number;
  codUsuario: number;
}

export interface ActualizarArancelApiDTO {
  codArancel: number;
  anio: number;
  codDireccion: number;
  costo: number;
  codUsuario: number;
}

export interface ArancelRaw {
  codArancel: number | null;
  anio: number;
  codDireccion: number;
  costo: number | null;
  codUsuario: number | null;
  costoArancel: string | number | null;
  direccionCompleta: string;
  sector: string | null;
  barrio: string | null;
  calle: string | null;
}

export type UpdateArancelDTO = Partial<CreateArancelDTO>;

export interface ArancelResponse {
  success: boolean;
  message: string;
  data: ArancelRaw[];
  pagina: number | null;
  limite: number | null;
  totalPaginas: number | null;
  totalRegistros: number | null;
}

export interface ArancelMutationResponse {
  success?: boolean;
  message?: string;
  mensaje?: string;
  data?: ArancelRaw | ArancelRaw[] | string | null;
}

export interface ArancelListParams {
  codDireccion?: number;
  anio?: number;
  parametroBusqueda?: string;
  codUsuario?: number;
}
