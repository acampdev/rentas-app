export interface ConstanteData {
  codConstante: string;
  nombreCategoria: string;
}
export interface RutaData {
  codigo: number;
  descripcion: string;
  abreviatura: string;
}
export interface ZonaData {
  codigo: number;
  descripcion: string;
  abreviatura: string;
}
export interface GrupoUsoData {
  codigo: number;
  descripcion: string;
}
export interface UbicacionAreaVerdeData {
  codigo: number;
  descripcion: string;
  abreviatura: string;
}
export interface UsoPredioData {
  codUso: number;
  descripcion: string;
  codCriterio: number;
  anio: number;
  codGrupoUso: number;
}

export interface ConstanteRaw {
  codConstante?: string | number;
  codigo?: string | number;
  nombreCategoria?: string;
  descripcion?: string;
}
export interface CatalogoRaw {
  codigo?: number;
  descripcion?: string;
  abreviatura?: string;
}
export interface UsoPredioRaw {
  codUso?: number | null;
  descripcion?: string | null;
  codCriterio?: number | null;
  anio?: number | null;
  codGrupoUso?: number | null;
}
