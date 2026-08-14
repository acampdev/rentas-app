/**
 * Modelo que representa un Valor Unitario por categoría y calidad
 */
export interface ValorUnitario {
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

/**
 * Datos para el formulario de Valor Unitario
 */
export interface ValorUnitarioFormData {
  año: number;
  categoria: string;
  subcategoria: string;
  letra: string;
  costo: number;
}
