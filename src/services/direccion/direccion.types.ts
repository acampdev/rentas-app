import type { QueryParams } from "../BaseApiService";

export interface DireccionData {
  id: number;
  codigo?: number;
  codigoSector?: number | null;
  codigoBarrio?: number | null;
  codigoCalle?: number | null;
  codigoTipoVia?: number;
  codigoBarrioVia?: number;
  nombreSector?: string;
  nombreBarrio?: string;
  nombreCalle?: string;
  nombreVia?: string;
  nombreTipoVia?: string;
  cuadra?: string;
  manzana?: string;
  lado?: string;
  loteInicial?: number;
  loteFinal?: number;
  descripcion?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
  ruta?: number;
  zona?: number;
  rutaNombre?: string;
  zonaNombre?: string;
  ubicacionAreaVerde?: number | null;
  ubicacionAreaVerdeNombre?: string;
  codLado?: number | null;
}

export interface CreateDireccionDTO {
  codigoSector?: number | null;
  codigoBarrio?: number | null;
  codigoCalle?: number | null;
  cuadra?: number | null;
  manzana?: string | null;
  lado?: string;
  loteInicial?: number | null;
  loteFinal?: number | null;
  descripcion?: string | null;
  codUsuario?: number;
  ruta?: number | null;
  zona?: number | null;
  ubicacionAreaVerde?: number | null;
}

export interface UpdateDireccionDTO extends Partial<CreateDireccionDTO> {
  estado?: string;
}

export interface BusquedaDireccionParams extends QueryParams {
  codigoSector?: number;
  codigoBarrio?: number;
  codigoCalle?: number;
  nombreVia?: string;
  parametrosBusqueda?: string;
  estado?: string;
  codUsuario?: number;
}

export interface DireccionRaw {
  codDireccion?: number;
  id?: number;
  codSector?: number;
  codigoSector?: number;
  codBarrio?: number;
  codigoBarrio?: number;
  codVia?: number;
  codigoCalle?: number;
  codTipoVia?: number;
  codBarrioVia?: number;
  nombreSector?: string;
  nombreBarrio?: string;
  nombreVia?: string;
  nombreCalle?: string;
  nombreTipoVia?: string;
  cuadra?: string | number;
  manzana?: string | number;
  codLado?: number;
  loteInicial?: string | number;
  loteFinal?: string | number;
  direccionCompleta?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
  codRuta?: number;
  codZona?: number;
  ruta?: string;
  zona?: string;
  codUbicacionAreaVerde?: number;
  ubicacionAreaVerde?: string;
}

export interface DireccionApiResponse {
  success: boolean;
  data?: DireccionRaw | DireccionRaw[] | string | number | null;
  message?: string;
  mensaje?: string;
}

export type DireccionMutationResponse =
  DireccionApiResponse | DireccionRaw | DireccionRaw[] | string | number | null;

export interface DireccionRequestPayload {
  codDireccion?: number;
  codSector: number | null;
  codBarrio: number | null;
  codVia: number | null;
  cuadra: number | null;
  manzana: string | null;
  codLado: number;
  loteInicial: number | null;
  loteFinal: number | null;
  codZona: number | null;
  codRuta: number | null;
  codUbicacionAreaVerde: number | null;
  parametroBusqueda: null;
  codUsuario: number;
}
