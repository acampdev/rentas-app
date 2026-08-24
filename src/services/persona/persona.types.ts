export interface PersonaData {
  codPersona: number;
  codTipopersona?: string;
  codTipoDocumento?: string;
  numerodocumento: string;
  nombres?: string;
  apellidomaterno?: string;
  apellidopaterno?: string;
  razonSocial?: string;
  direccion?: string | null;
  fechanacimiento?: number | string | null;
  codestadocivil?: string;
  codsexo?: string;
  telefono?: string;
  email?: string;
  codDireccion?: number | null;
  lote?: string | number | null;
  otros?: string | null;
  parametroBusqueda?: string | null;
  codUsuario?: number | null;
  nombrePersona?: string;
  estado?: string;
  fechaRegistro?: string;
}

export interface CreatePersonaDTO {
  codTipopersona: string;
  codTipoDocumento: string | number;
  numerodocumento: string;
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  fechanacimiento: string;
  codestadocivil: string | number;
  codsexo: string | number;
  telefono: string;
  codDireccion: number | null;
  lote: number | string | null;
  otros: string | null;
  parametroBusqueda?: string | null;
  usuario?: number;
  codUsuario?: number;
}

export interface UpdatePersonaDTO extends CreatePersonaDTO {
  codPersona: number;
}

export type CreatePersonaAPIDTO = CreatePersonaDTO;

export interface BusquedaPersonaParams {
  codTipoPersona?: string;
  codTipoDocumento?: string;
  numeroDocumento?: string;
  parametroBusqueda?: string;
  codUsuario?: number;
}

export interface PersonaRaw {
  codPersona: number;
  codTipopersona?: string | null;
  codTipoDocumento?: string | null;
  numerodocumento: string;
  nombres?: string | null;
  apellidomaterno?: string | null;
  apellidopaterno?: string | null;
  razonSocial?: string | null;
  direccion?: string | null;
  fechanacimiento?: number | string | null;
  codestadocivil?: string | null;
  codsexo?: string | null;
  telefono?: string | null;
  email?: string | null;
  codDireccion?: number | null;
  lote?: string | number | null;
  otros?: string | null;
  parametroBusqueda?: string | null;
  codUsuario?: number | null;
  usuario?: number | null;
  nombrePersona?: string | null;
  estado?: string | null;
  fechaRegistro?: string | null;
}

export interface PersonaApiPayload {
  codPersona?: number;
  codTipopersona: string;
  codTipoDocumento: string;
  numerodocumento: string;
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  fechanacimiento: string;
  codestadocivil: string;
  codsexo: string;
  telefono: string;
  codDireccion: number | null;
  lote: number | string | null;
  otros: string | null;
  parametroBusqueda: string | null;
  usuario: number;
}

export interface DocumentoValidation {
  valido: boolean;
  mensaje?: string;
}
