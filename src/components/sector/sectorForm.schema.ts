import { z } from "zod";
import type { Sector } from "../../models/Sector";

export const sectorSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del sector es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  cuadrante: z
    .number({
      required_error: "El cuadrante es requerido",
      invalid_type_error: "Debe seleccionar un cuadrante",
    })
    .int()
    .min(1, "Debe seleccionar un cuadrante válido"),
  codUnidadUrbana: z
    .number({
      required_error: "La unidad urbana es requerida",
      invalid_type_error: "Debe seleccionar una unidad urbana",
    })
    .int()
    .min(1, "Debe seleccionar una unidad urbana válida"),
  descripcion: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length <= 200,
      "La descripción no puede exceder los 200 caracteres",
    ),
});
export type SectorFormValues = z.infer<typeof sectorSchema>;
export interface SectorFormProps {
  sectorSeleccionado?: Sector | null;
  onGuardar: (data: {
    nombre: string;
    cuadrante?: number;
    codUnidadUrbana?: number;
    descripcion?: string;
  }) => void | Promise<void>;
  onNuevo: () => void;
  onEditar?: () => void;
  modoOffline?: boolean;
  loading?: boolean;
  isEditMode?: boolean;
}
export const EMPTY_SECTOR_FORM: Partial<SectorFormValues> = {
  nombre: "",
  cuadrante: undefined,
  codUnidadUrbana: undefined,
  descripcion: "",
};
export const mapSectorToForm = (
  sector?: Sector | null,
): Partial<SectorFormValues> =>
  sector
    ? {
        nombre: sector.nombre || "",
        cuadrante: Number(sector.cuadrante) || undefined,
        codUnidadUrbana: Number(sector.codUnidadUrbana) || undefined,
        descripcion: sector.descripcion || "",
      }
    : { ...EMPTY_SECTOR_FORM };
