import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type { PersonaData } from "../../../services/personaService";
import type { ContribuyenteDireccion } from "../../../types/formTypes";

export interface PersonaFormProps {
  persona?: PersonaData | null;
  onSaved: () => void;
}

export interface PersonaFormValues {
  codTipopersona: string;
  codTipoDocumento: string;
  numerodocumento: string;
  nombres: string;
  apellidopaterno: string;
  apellidomaterno: string;
  fechanacimiento: string;
  codestadocivil: string;
  codsexo: string;
  telefono: string;
  nFinca: string;
  otroNumero: string;
}

export interface DocumentoConfig {
  maxLength: number;
  helperText: string;
}

export type ConsultaStatus = "success" | "info" | "error" | null;

export interface PersonaFormCatalogs {
  tiposPersona: OptionFormat[];
  documentos: OptionFormat[];
  estadosCiviles: OptionFormat[];
  sexos: OptionFormat[];
}

export interface PersonaFormSelectionValues {
  documento: string;
  tipoPersona: string;
  estadoCivil: string;
  sexo: string;
}

export interface PersonaFormController {
  values: PersonaFormValues;
  catalogs: PersonaFormCatalogs;
  selections: PersonaFormSelectionValues;
  documentoConfig: DocumentoConfig;
  personaEnEdicion: PersonaData | null;
  direccionSeleccionada: ContribuyenteDireccion | null;
  direccionCompleta: string;
  error: string;
  mensajeConsulta: string;
  estadoConsulta: ConsultaStatus;
  selectorDireccionesOpen: boolean;
  isJuridica: boolean;
  consultandoDocumento: boolean;
  submitting: boolean;
  setField: (field: keyof PersonaFormValues, value: string) => void;
  setTipoPersona: (value: string) => void;
  cambiarTipoDocumento: (value: string) => void;
  cambiarNumeroDocumento: (value: string) => void;
  consultarDocumento: () => Promise<void>;
  setDireccionSeleccionada: (value: ContribuyenteDireccion | null) => void;
  setSelectorDireccionesOpen: (value: boolean) => void;
  limpiar: () => void;
  guardar: (event: React.FormEvent) => Promise<void>;
}
