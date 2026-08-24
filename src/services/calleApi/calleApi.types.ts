import type { QueryParams } from "../BaseApiService";

export interface CalleData {
  codVia: number;
  codTipoVia: number | string;
  codBarrio: number;
  codSector?: number;
  nombreVia: string;
  descTipoVia: string;
  nombreBarrio: string;
  nombreSector?: string;
  codigo?: number;
  nombre?: string;
  codigoVia?: number | string;
  codigoBarrio?: number;
  tipo?: string;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateCalleDTO {
  nombreVia: string;
  codTipoVia: string;
  codBarrio: number;
  codSector: number;
}

export interface UpdateCalleDTO {
  nombreVia?: string;
  codTipoVia?: string;
  codBarrio?: number;
  codSector?: number;
  estado?: string;
  fechaModificacion?: string;
}

export interface BusquedaCalleParams extends QueryParams {
  nombre?: string;
  tipo?: string;
  estado?: string;
  codUsuario?: number;
  parametrosBusqueda?: string;
  nombreVia?: string;
}

export interface UpdateSectorDTO {
  nombreSector: string;
}

export interface RawCalle {
  codVia?: number;
  id?: number;
  codTipoVia?: number | string;
  codBarrio?: number;
  codSector?: number;
  nombreVia?: string;
  descTipoVia?: string;
  nombreBarrio?: string;
  nombreSector?: string;
  codigo?: number;
  nombre?: string;
  codigoVia?: number | string;
  codigoBarrio?: number;
  tipoVia?: string;
  tipo?: string;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateViaPayload {
  nombreVia: string;
  codTipoVia: string;
  codBarrio: number | string;
  codSector: number;
}

export interface UpdateViaPayload {
  codVia: number;
  nombreVia: string;
  codTipoVia: string;
  codBarrio: number;
  codSector: number;
}
