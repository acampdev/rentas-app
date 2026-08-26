export interface PersonaRelacionada {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroDocumento: string;
  tipoDocumento: string;
}

export interface ContribuyenteData {
  operationMessage?: string;
  codigo: number;
  codigoPersona: number;
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string;
  nombreCompleto: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: number;
  estadoCivil?: string;
  sexo?: string;
  lote?: string;
  estado?: string;
  fechaRegistro?: string;
  codUsuario?: number;
  tipoContribuyente?: string;
  esExonerado?: boolean | null;
  esPensionista?: boolean | null;
  conyuge?: PersonaRelacionada;
  representanteLegal?: PersonaRelacionada;
}

export interface CreateContribuyenteDTO {
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  sexo?: string;
  lote?: string;
  codUsuario?: number;
  conyugeNombres?: string;
  conyugeApellidoPaterno?: string;
  conyugeApellidoMaterno?: string;
  conyugeNumeroDocumento?: string;
  conyugeTipoDocumento?: string;
  repreNombres?: string;
  repreApellidoPaterno?: string;
  repreApellidoMaterno?: string;
  repreNumeroDocumento?: string;
  repreTipoDocumento?: string;
}

export interface UpdateContribuyenteDTO extends Partial<CreateContribuyenteDTO> {
  codigo?: number;
}

export interface CreateContribuyenteAPIDTO {
  codPersona: number;
  codContribuyente?: null;
  codConyuge?: number | null;
  codRepresentanteLegal?: number | null;
  codestado: string;
  codUsuario: number;
  esExonerado?: boolean;
  esPensionista?: boolean;
}

export interface BusquedaContribuyenteParams {
  tipoPersona?: string;
  numeroDocumento?: string;
  nombre?: string;
  parametroBusqueda?: string;
  estado?: string;
  codUsuario?: number;
  codigoContribuyente?: string | number;
  codigoPersona?: string | number;
  codTipoContribuyente?: string;
  esExonerado?: boolean | number | string;
  esPensionista?: boolean | number | string;
  codigo?: string | number;
}

export interface ContribuyenteDetalle {
  codPersona: number | null;
  codTipoContribuyente: string | null;
  codTipopersona: string | null;
  codTipoDocumento: string | null;
  numerodocumento: string | null;
  nombres: string | null;
  apellidomaterno: string | null;
  apellidopaterno: string | null;
  direccion: string | null;
  fechanacimiento: string | null;
  codestadocivil: string | null;
  codsexo: string | null;
  telefono: string | null;
  lote: string | null;
  otros: string | null;
  codestado: string | null;
  codDireccion: string | null;
  codContribuyente: number;
  codConyuge: number | null;
  conyugeTipoDocumento: string | null;
  conyugeNumeroDocumento: string | null;
  conyugeNombres: string | null;
  conyugeApellidopaterno: string | null;
  conyugeApellidomaterno: string | null;
  conyugeEstadocivil: string | null;
  conyugeSexo: string | null;
  conyugeTelefono: string | null;
  conyugeFechanacimiento: string | null;
  conyugeFechanacimientoStr: string | null;
  conyugeDireccion: string | null;
  conyugeCoddireccion: string | null;
  conyugeLote: string | null;
  conyugeOtros: string | null;
  codRepresentanteLegal: number | null;
  repreTipoDocumento: string | null;
  repreNumeroDocumento: string | null;
  repreNombres: string | null;
  repreApellidopaterno: string | null;
  repreApellidomaterno: string | null;
  repreEstadocivil: string | null;
  repreSexo: string | null;
  repreTelefono: string | null;
  repreFechanacimiento: string | null;
  repreFechanacimientoStr: string | null;
  repreDireccion: string | null;
  repreCoddireccion: string | null;
  repreLote: string | null;
  repreOtros: string | null;
  tipoContribuyente: string | null;
  esExonerado: boolean | null;
  esPensionista: boolean | null;
  fechaNacimientoStr: string | null;
}

export interface ContribuyenteRaw {
  codContribuyente?: number;
  codigo?: number;
  codPersona?: number;
  codigoPersona?: number;
  tipoContribuyente?: string;
  tipoPersona?: string;
  codTipopersona?: string;
  tipoDocumento?: string;
  codTipoDocumento?: string;
  numeroDocumento?: string;
  numerodocumento?: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidopaterno?: string;
  apellidoMaterno?: string;
  apellidomaterno?: string;
  razonSocial?: string;
  nombreCompleto?: string;
  nombrePersona?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: number;
  fechanacimiento?: number;
  estadoCivil?: string;
  codestadocivil?: string;
  sexo?: string;
  codsexo?: string;
  lote?: string;
  estado?: string;
  codestado?: string;
  fechaRegistro?: string;
  fechaNacimientoStr?: string;
  codUsuario?: number;
  esExonerado?: boolean | null;
  esPensionista?: boolean | null;
  conyugeNombres?: string;
  conyugeApellidopaterno?: string;
  conyugeApellidomaterno?: string;
  conyugeNumeroDocumento?: string;
  conyugeTipoDocumento?: string;
  repreNombres?: string;
  repreApellidopaterno?: string;
  repreApellidomaterno?: string;
  repreNumeroDocumento?: string;
  repreTipoDocumento?: string;
}
