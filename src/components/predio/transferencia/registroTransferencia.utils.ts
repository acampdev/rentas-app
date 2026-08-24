import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import type {
  CreateTransferenciaPredioDTO,
  TransferenciaPredioData,
  UpdateTransferenciaPredioDTO,
} from "../../../services/transferenciaService";
import type { TransferenciaFormData } from "./registroTransferencia.types";

export const crearFormularioTransferencia = (): TransferenciaFormData => ({
  codTransferencia: null,
  anio: String(new Date().getFullYear()),
  codigoPredio: "",
  vendedor: null,
  comprador: null,
  porcentajeTransferencia: "",
  fechaMinuta: null,
  documento: "",
  modoTransferencia: "",
  valorTransferencia: "",
  esConstructor: false,
});

const parseFechaApi = (fecha: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha);
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : null;
};
const crearContribuyente = (
  codigo: number,
  nombre: string,
): ContribuyenteListItem | null =>
  codigo > 0
    ? {
        codigo,
        contribuyente: nombre || `Contribuyente ${codigo}`,
        documento: "",
        direccion: "",
      }
    : null;

export const mapTransferenciaToForm = (
  item: TransferenciaPredioData,
): TransferenciaFormData => ({
  codTransferencia: item.codTransferencia,
  anio: String(item.anio),
  codigoPredio: item.codPredio,
  vendedor: crearContribuyente(
    item.codContribuyenteVenta,
    item.nombreContribuyenteVenta,
  ),
  comprador: crearContribuyente(
    item.codContribuyenteCompra,
    item.nombreContribuyenteCompra,
  ),
  porcentajeTransferencia: item.porcentajeTransferencia,
  fechaMinuta: parseFechaApi(item.fechaMinuta),
  documento: item.documento,
  modoTransferencia: item.codModoTransferencia,
  valorTransferencia: item.valorTransferencia,
  esConstructor: item.esConstructor,
});

export const validarTransferencia = (
  form: TransferenciaFormData,
): string | null => {
  if (
    !form.anio ||
    !form.codigoPredio.trim() ||
    !form.vendedor ||
    !form.comprador ||
    form.porcentajeTransferencia === "" ||
    !form.fechaMinuta ||
    !form.documento.trim() ||
    !form.modoTransferencia ||
    form.valorTransferencia === ""
  )
    return "Complete todos los datos de la transferencia";
  if (form.porcentajeTransferencia < 0 || form.porcentajeTransferencia > 100)
    return "El porcentaje debe estar entre 0 y 100";
  return null;
};

const formatFechaApi = (fecha: Date): string =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

export const buildTransferenciaPayload = (
  form: TransferenciaFormData,
): CreateTransferenciaPredioDTO | UpdateTransferenciaPredioDTO => {
  if (!form.vendedor || !form.comprador || !form.fechaMinuta)
    throw new Error("El formulario de transferencia está incompleto");
  const payload = {
    anio: Number(form.anio),
    codPredio: form.codigoPredio.trim(),
    codContribuyenteVenta: form.vendedor.codigo,
    codContribuyenteCompra: form.comprador.codigo,
    porcentajeTransferencia: Number(form.porcentajeTransferencia),
    fechaMinuta: formatFechaApi(form.fechaMinuta),
    documento: form.documento.trim(),
    CodModoTransferencia: form.modoTransferencia,
    valorTransferencia: Number(form.valorTransferencia),
    esConstructor: String(form.esConstructor) as "true" | "false",
  };
  return form.codTransferencia === null
    ? { codTransferencia: null, ...payload }
    : { codTransferencia: form.codTransferencia, ...payload };
};
