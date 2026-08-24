import type { CronogramaContribuyente } from "../../../../types/fraccionamiento.types";
import type { EstadoCuentaDetalle } from "../../../../services/cuentaCorrienteService";
import type {
  CuotaFraccionamiento,
  ResolucionFraccionamiento,
  TributoFraccionado,
} from "./deudaFraccionada.types";

export const EMPTY_TRIBUTES: TributoFraccionado[] = [
  "Parques y Jardines",
  "Impuesto Predial",
  "Serenazgo",
  "Limpieza Publica",
  "Formularios D.J",
  "TIM Impuesto Predial",
  "TIM Parques y Jardines",
].map((tributo) => ({ tributo, valores: Array<number>(12).fill(0) }));

export const installmentTotal = (
  installments: CuotaFraccionamiento[],
): number =>
  installments
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.cuota, 0);

export const groupSchedule = (
  schedule: CronogramaContribuyente[],
): ResolucionFraccionamiento[] => {
  const groups = new Map<string, ResolucionFraccionamiento>();
  schedule.forEach((item) => {
    const key = `${item.anio}-${item.codResolucion}`;
    const group = groups.get(key) ?? {
      año: item.anio,
      resolucion: `R${String(item.codResolucion).padStart(3, "0")}`,
      codResolucion: item.codResolucion,
      cuotas: [],
    };
    group.cuotas.push({
      nCuota: item.numeroCuota,
      deuda: Number(item.saldoInicio) || 0,
      im: Number(item.interes) || 0,
      cuota: Number(item.montoCuota) || 0,
      fVenc: item.fechaVencimiento,
      checked: false,
      pagado: item.pagado,
    });
    groups.set(key, group);
  });

  return [...groups.values()]
    .map((group) => {
      group.cuotas.sort((a, b) => a.nCuota - b.nCuota);
      const index = group.cuotas.findIndex((item) => !item.pagado);
      if (group.cuotas.length)
        group.cuotas[index < 0 ? 0 : index].checked = true;
      return group;
    })
    .sort((a, b) => b.año - a.año || b.codResolucion - a.codResolucion);
};

export const accountDetailToTributes = (
  details: EstadoCuentaDetalle[],
): TributoFraccionado[] =>
  details.map((detail) => ({
    tributo: detail.tributo,
    valores: Array.from({ length: 12 }, (_, index) => {
      const period = index + 1;
      const cargo =
        Number(detail[`cargo${period}` as keyof EstadoCuentaDetalle]) || 0;
      const abono =
        Number(detail[`abono${period}` as keyof EstadoCuentaDetalle]) || 0;
      return Math.max(0, cargo - abono);
    }),
  }));
