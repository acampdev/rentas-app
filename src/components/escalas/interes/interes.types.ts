export interface InteresFormState {
  codInteres: string;
  anio: string;
  tasa: string;
  codTipo: string;
  codClase: string;
}

export const emptyInteresForm = (): InteresFormState => ({
  codInteres: "",
  anio: String(new Date().getFullYear()),
  tasa: "",
  codTipo: "",
  codClase: "",
});
