import type { UseFormReturn } from "react-hook-form";
import type { ContribuyenteFormValues } from "../../hooks/useContribuyenteForm";
import type { ContribuyenteDireccion } from "../../types/formTypes";
import type { PersonaData } from "../../services/personaService";
import type { ContribuyenteData } from "../../services/contribuyenteService";

export interface PersonaFormProps {
  form: UseFormReturn<ContribuyenteFormValues>;
  isJuridica?: boolean;
  isRepresentante?: boolean;
  onOpenDireccionModal: () => void;
  direccion: ContribuyenteDireccion | null;
  getDireccionTextoCompleto: (direccion: ContribuyenteDireccion | null, nFinca?: string, otroNumero?: string) => string;
  disablePersonaFields?: boolean;
  onGuardar?: (data: { persona: PersonaData; contribuyente?: ContribuyenteData }) => void | Promise<void>;
  showGuardarButton?: boolean;
}

export interface DocumentoConfig {
  pattern: RegExp;
  maxLength: number;
  placeholder: string;
  errorMessage: string;
}

export type EstadoConsultaDocumento = "success" | "info" | "error";
