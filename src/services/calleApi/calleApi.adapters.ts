import type {
  CalleData,
  CreateCalleDTO,
  CreateViaPayload,
  RawCalle,
  UpdateCalleDTO,
  UpdateViaPayload,
} from "./calleApi.types";

export const normalizeCalle = (item: RawCalle): CalleData => ({
  codVia: item.codVia || 0,
  codTipoVia: item.codTipoVia || "",
  codBarrio: item.codBarrio || 0,
  codSector: item.codSector || 0,
  nombreVia: item.nombreVia || "",
  descTipoVia: item.descTipoVia || "",
  nombreBarrio: item.nombreBarrio || "",
  nombreSector: item.nombreSector || "",
  codigo: item.codVia || item.codigo || 0,
  nombre: item.nombreVia || item.nombre || "",
  codigoVia: item.codTipoVia || item.codigoVia,
  codigoBarrio: item.codBarrio || item.codigoBarrio,
  tipo: item.descTipoVia || item.tipoVia || item.tipo || "CALLE",
  descripcion: item.descripcion || "",
  estado: item.estado || "ACTIVO",
  fechaRegistro: item.fechaRegistro,
  fechaModificacion: item.fechaModificacion,
  codUsuario: item.codUsuario,
});

export const isValidCalle = (item: CalleData) =>
  !!item.codigo && !!item.nombre && item.nombre.trim().length > 0;

export const toCreateViaPayload = (data: CreateCalleDTO): CreateViaPayload => ({
  nombreVia: data.nombreVia,
  codTipoVia: data.codTipoVia,
  codBarrio: data.codBarrio > 0 ? data.codBarrio : "",
  codSector: data.codSector,
});

export const toUpdateViaPayload = (
  id: number,
  data: UpdateCalleDTO,
): UpdateViaPayload => ({
  codVia: id,
  nombreVia: data.nombreVia || "",
  codTipoVia: data.codTipoVia ? String(data.codTipoVia) : "",
  codBarrio: data.codBarrio || 0,
  codSector: data.codSector || 0,
});

export const toCreatedCalle = (
  data: CreateCalleDTO,
  response: RawCalle,
): CalleData => {
  const id = response.codVia || response.id || 0;
  return {
    codVia: id,
    codTipoVia: data.codTipoVia,
    codBarrio: data.codBarrio,
    codSector: data.codSector,
    nombreVia: data.nombreVia,
    descTipoVia: "",
    nombreBarrio: "",
    nombreSector: "",
    codigo: id,
    nombre: data.nombreVia,
    codigoVia: data.codTipoVia,
    codigoBarrio: data.codBarrio,
    estado: "ACTIVO",
    fechaRegistro: new Date().toISOString(),
  };
};

export const toUpdatedCalle = (payload: UpdateViaPayload): CalleData => ({
  codVia: payload.codVia,
  codTipoVia: payload.codTipoVia,
  codBarrio: payload.codBarrio,
  codSector: payload.codSector,
  nombreVia: payload.nombreVia,
  descTipoVia: "",
  nombreBarrio: "",
  nombreSector: "",
  codigo: payload.codVia,
  nombre: payload.nombreVia,
  codigoVia: payload.codTipoVia,
  codigoBarrio: payload.codBarrio,
  estado: "ACTIVO",
  fechaModificacion: new Date().toISOString(),
});
