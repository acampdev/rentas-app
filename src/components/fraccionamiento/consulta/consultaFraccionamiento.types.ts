export type DocumentoFraccionamiento =
  "convenio" | "estadoCuenta" | "resolucionJefatural" | "estadoDeuda";

export const DOCUMENTOS_FRACCIONAMIENTO: Array<{
  tipo: DocumentoFraccionamiento;
  etiqueta: string;
}> = [
  { tipo: "convenio", etiqueta: "Convenio Deuda" },
  { tipo: "estadoCuenta", etiqueta: "Estado de Cuenta" },
  { tipo: "resolucionJefatural", etiqueta: "Resolución Jefatural" },
  { tipo: "estadoDeuda", etiqueta: "Estado de Deuda" },
];
