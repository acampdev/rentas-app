import type { Predio } from "../../../models/Predio";

export interface SubdivicionFormData {
  anio: number;
  predioMatriz: Predio | null;
  codPredioMatriz: string;
  areaTerrenoNuevaMatriz: string;
  valorTerrenoNuevoMatriz: string;
  codDireccionNuevo: string;
  numeroFincaNuevo: string;
  otroNumeroNuevo: string;
  codClasificacionNuevo: string;
  estPredioNuevo: string;
  codTipoPredioNuevo: string;
  codCondicionPropiedadNuevo: string;
  codUsoNuevo: string;
  fechaAdquisicionNuevo: string;
  codListaConductorNuevo: string;
  areaTerrenoNuevo: string;
  valorOtrasInstalacionesNuevo: string;
  fechaSubdivision: string;
  periodoEfectivoArbitrios: string;
}

export interface FormFeedback {
  severity: "success" | "error";
  message: string;
}

export type SubdivicionField = Exclude<keyof SubdivicionFormData, "predioMatriz">;
