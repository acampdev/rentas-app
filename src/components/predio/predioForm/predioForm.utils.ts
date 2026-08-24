import type { DireccionData } from "../../../hooks/usePredioForm";

export const buildDireccionCompleta = (
  direccion: DireccionData | null | undefined,
  numeroFinca?: string,
  otroNumero?: string,
) => {
  if (!direccion) return "";
  let descripcion =
    direccion.direccionCompleta ||
    direccion.descripcion ||
    `Año: ${direccion.anio} - Código: ${direccion.codigo}`;

  descripcion = descripcion.replace(/,?\s*Lotes?:\s*\d+\s*-?\s*\d*/gi, "");
  descripcion = descripcion.split(" - N° Finca:")[0].split(" - Otro N°:")[0];
  descripcion = descripcion.trim().replace(/,\s*$/, "");
  if (numeroFinca?.trim()) descripcion += ` - N° Finca: ${numeroFinca.trim()}`;
  if (otroNumero?.trim()) descripcion += ` - Otro N°: ${otroNumero.trim()}`;
  return descripcion;
};
