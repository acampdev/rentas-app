import type { ContribuyenteData } from "../../services/contribuyenteService";
import type { PersonaData } from "../../services/personaService";
import type { ContribuyenteDireccion } from "../../types/formTypes";

export interface ContribuyenteFormValues {
  codPersona: number | null;
  esPersonaJuridica: boolean;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  razonSocial: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: ContribuyenteDireccion | null;
  nFinca: string;
  otroNumero: string;
  telefono: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: Date | string | null;
  esExonerado: boolean;
  esPensionista: boolean;
}

export interface UseContribuyenteFormProps {
  onSubmit?: (data: {
    persona: PersonaData;
    contribuyente: ContribuyenteData;
    conyugeRepresentante: number | null;
  }) => void | Promise<void>;
  onEdit?: () => void;
  onNew?: () => void;
  initialData?: Partial<ContribuyenteFormValues> & Record<string, unknown>;
}
