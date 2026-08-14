/**
 * Modelo que representa a un contribuyente en el sistema
 */
export interface Contribuyente {
  codigo: number;
  codigoPersona: number;
  tipoPersona: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  razonSocial: string;
  nombreCompleto: string;
  direccion: string;
  telefono: string;
  email: string;
  fechaNacimiento?: number;
  edad?: number;
  estadoCivil?: string;
  sexo?: string;
  lote: string;
  estado: string;
  fechaRegistro?: string;
  codUsuario?: number;
  
  // Datos opcionales extendidos
  conyuge?: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numeroDocumento: string;
    tipoDocumento: string;
  };
  representanteLegal?: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numeroDocumento: string;
    tipoDocumento: string;
  };
}

/**
 * Filtro para búsqueda de contribuyentes
 */
export interface FiltroContribuyente {
  busqueda?: string;
  codUsuario?: number;
}
