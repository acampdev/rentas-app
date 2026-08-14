// src/models/Interes.ts

interface InteresBase {
  codInteres: number;
  anio: number;
  tasa: number;
  codTipo: string;
  codClase: string;
  codEstado?: string;
}

export type InteresData = InteresBase;


export interface CreateInteresDTO {
  codInteres?: number | null;
  anio: number;
  tasa: number;
  codTipo: string;
  codClase: string;
}

export interface UpdateInteresDTO {
  codInteres: number;
  anio: number;
  tasa: number;
  codTipo: string;
  codClase: string;
}
