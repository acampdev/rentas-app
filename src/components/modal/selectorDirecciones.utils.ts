import type { DireccionData } from "../../services/direccionService";
import type { LocalDireccion } from "./selectorDirecciones.types";

export const filtrarDirecciones = (
  direcciones: DireccionData[],
  busqueda: string,
) => {
  const termino = busqueda.trim().toLowerCase();
  if (!termino) return direcciones;
  return direcciones.filter((direccion) =>
    [
      direccion.nombreVia,
      direccion.nombreBarrio,
      direccion.nombreSector,
      direccion.descripcion,
      direccion.cuadra,
      direccion.nombreTipoVia,
    ].some((valor) => valor?.toLowerCase().includes(termino)),
  );
};

export const formatearDireccionSeleccionada = (
  direccion: DireccionData,
): LocalDireccion => ({
  id: direccion.id,
  codigo: direccion.codigo?.toString() || direccion.id.toString(),
  sector: direccion.nombreSector || "",
  barrio: direccion.nombreBarrio || "",
  tipoVia: direccion.nombreTipoVia || "CALLE",
  nombreVia: direccion.nombreVia || direccion.nombreCalle || "",
  cuadra: direccion.cuadra || "",
  lado: direccion.lado || "D",
  loteInicial: direccion.loteInicial || 1,
  loteFinal: direccion.loteFinal || 1,
  descripcion:
    direccion.descripcion ||
    `CALLE ${direccion.nombreVia || ""} ${direccion.cuadra ? `CUADRA ${direccion.cuadra}` : ""}`.trim(),
  codigoSector: direccion.codigoSector,
  codigoBarrio: direccion.codigoBarrio,
  codigoCalle: direccion.codigoCalle,
  codigoTipoVia: direccion.codigoTipoVia,
});
