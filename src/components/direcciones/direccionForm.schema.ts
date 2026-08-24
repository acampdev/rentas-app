import { z } from "zod";
import type {
  CreateDireccionDTO,
  DireccionData,
} from "../../services/direccionService";
import { getAuthenticatedUserCode } from "../../config/api.unified.config";

export const direccionSchema = z.object({
  codigoSector: z.number().nullable().optional(),
  codigoBarrio: z.number().nullable().optional(),
  codigoCalle: z.number().nullable().optional(),
  cuadra: z.coerce.number().nullable().optional(),
  manzana: z.string().nullable().optional(),
  lado: z.string().optional().default("8103"),
  loteInicial: z.coerce.number().optional().default(0),
  loteFinal: z.coerce.number().optional().default(0),
  ruta: z.number().nullable().optional(),
  zona: z.number().nullable().optional(),
  ubicacionAreaVerde: z.number().nullable().optional(),
});
export type DireccionFormData = z.infer<typeof direccionSchema>;

export interface DireccionFormProps {
  direccionSeleccionada?: DireccionData | null;
  onSubmit: (data: CreateDireccionDTO) => Promise<void>;
  onNuevo: () => void;
  onEditar: () => void;
  loading?: boolean;
  isEditMode?: boolean;
}
export const EMPTY_DIRECCION_FORM: DireccionFormData = {
  codigoSector: null,
  codigoBarrio: null,
  codigoCalle: null,
  cuadra: null,
  manzana: "",
  lado: "8103",
  loteInicial: 0,
  loteFinal: 0,
  ruta: null,
  zona: null,
  ubicacionAreaVerde: null,
};

const parseId = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseInt(String(value));
  return Number.isNaN(parsed) || parsed === 0 ? null : parsed;
};
export const mapDireccionToForm = (
  item?: DireccionData | null,
  editing = false,
): DireccionFormData => {
  if (!item || !editing) return { ...EMPTY_DIRECCION_FORM };
  let cuadra = parseId(item.cuadra);
  let manzana = item.manzana || "";
  let loteInicial = parseId(item.loteInicial) || 0;
  let loteFinal = parseId(item.loteFinal) || 0;
  const description = (item.descripcion || "").toUpperCase();
  if (!cuadra) cuadra = parseId(description.match(/CUADRA\s*(\d+)/i)?.[1]);
  if (!manzana) manzana = description.match(/MZ\.?\s*([A-Z0-9]+)/i)?.[1] || "";
  const lots = description.match(/LOTES?:?\s*(\d+)\s*[-–]\s*(\d+)/i);
  if (lots) {
    if (!loteInicial) loteInicial = Number(lots[1]);
    if (!loteFinal) loteFinal = Number(lots[2]);
  }
  const lado = item.codLado
    ? String(item.codLado)
    : item.lado === "PAR"
      ? "8101"
      : item.lado === "IMPAR"
        ? "8102"
        : "8103";
  return {
    codigoSector: parseId(item.codigoSector),
    codigoBarrio: parseId(item.codigoBarrio),
    codigoCalle: parseId(item.codigoCalle),
    cuadra,
    manzana,
    lado,
    loteInicial,
    loteFinal,
    ruta: parseId(item.ruta),
    zona: parseId(item.zona),
    ubicacionAreaVerde: parseId(item.ubicacionAreaVerde),
  };
};

export const buildDireccionPayload = (
  data: DireccionFormData,
): CreateDireccionDTO => ({
  ...data,
  codigoSector: data.codigoSector || null,
  codigoBarrio: data.codigoBarrio || null,
  codigoCalle: data.codigoCalle || null,
  codUsuario: getAuthenticatedUserCode(),
});
