export interface ValorUnitarioData {
  id: string;
  año: number;
  categoria: string;
  subcategoria: string;
  letra: string;
  costo: number;
  descripcionCategoria?: string;
  descripcionSubcategoria?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface CreateValorUnitarioDTO {
  año: number;
  categoria: string;
  subcategoria: string;
  letra: string;
  costo: number;
  codUsuario?: number;
}

export interface CrearValorUnitarioApiDTO {
  codigoValorUnitario: null;
  codigoValorUnitarioAnterior: null;
  anio: number;
  codLetra: string;
  codCategoria: string;
  codSubcategoria: string;
  costo: number;
}

export interface UpdateValorUnitarioDTO extends Partial<CreateValorUnitarioDTO> {
  estado?: string;
  fechaModificacion?: string;
}

export interface BusquedaValorUnitarioParams {
  anio?: number;
  /** @deprecated Usar `anio`. Se mantiene para compatibilidad interna. */
  año?: number;
  categoria?: string;
  subcategoria?: string;
  letra?: string;
  estado?: string;
  codUsuario?: number;
}

export interface ValorUnitarioRaw {
  codValorUnitario?: number | string;
  codigoValorUnitario?: number | string;
  id?: number | string;
  anio?: number;
  año?: number;
  codLetra?: string;
  letra?: string;
  codCategoria?: string;
  categoria?: string;
  codSubcategoria?: string;
  subcategoria?: string;
  costo?: string | number;
  descripcionCategoria?: string;
  descripcionSubcategoria?: string;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number;
}

export interface ValorUnitarioEstadisticas {
  total: number;
  activos: number;
  inactivos: number;
  porCategoria: Record<string, number>;
  porSubcategoria: Record<string, number>;
  costoPromedio: number;
  añosDisponibles: number[];
}

export type ValoresPorCategoria = Record<
  string,
  Record<string, Record<string, number>>
>;

export type ValorUnitarioApiResponse =
  | ValorUnitarioRaw[]
  | ValorUnitarioRaw
  | { data?: ValorUnitarioRaw[] | ValorUnitarioRaw | null; success?: boolean };
