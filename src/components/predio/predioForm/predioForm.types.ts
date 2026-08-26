import type { PredioFormData } from "../../../hooks/usePredioForm";

export interface PredioFormProps {
  predioExistente?: Partial<PredioFormData>;
  onSubmit?: (
    data: PredioFormData & { imagenes: File[] },
  ) => unknown | Promise<unknown>;
  codPersona?: number;
  loading?: boolean;
}
