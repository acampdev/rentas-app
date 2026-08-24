export type SimpleEndpoint = string;
export type ComplexEndpoint = { base: string; [key: string]: string };

export interface EndpointsConfig {
  barrio: SimpleEndpoint;
  sector: ComplexEndpoint;
  via: SimpleEndpoint;
  contribuyente: ComplexEndpoint;
  arancel: SimpleEndpoint;
  valorUnitario: SimpleEndpoint;
  uit: SimpleEndpoint;
  alcabala: SimpleEndpoint;
  depreciacion: SimpleEndpoint;
  predio: ComplexEndpoint;
  piso: SimpleEndpoint;
  asignacion: SimpleEndpoint;
  direccion: SimpleEndpoint;
  persona: ComplexEndpoint;
  constante: ComplexEndpoint;
  serenazgo: SimpleEndpoint;
  limpiezaPublica: ComplexEndpoint;
  parquesJardines: SimpleEndpoint;
  cuentaCorriente: ComplexEndpoint;
  resolucionInteres: SimpleEndpoint;
  vencimiento: SimpleEndpoint;
  interes: ComplexEndpoint;
  asignacionCaja: ComplexEndpoint;
  caja: ComplexEndpoint;
  turno: SimpleEndpoint;
  aperturaCaja: ComplexEndpoint;
  usuario: ComplexEndpoint;
  asignacionPredio: ComplexEndpoint;
  pu: SimpleEndpoint;
  hr: SimpleEndpoint;
  tim: SimpleEndpoint;
  auditoria: SimpleEndpoint;
}

export const API_ENDPOINTS: EndpointsConfig = {
  auditoria: "/api/auditoria",
  tim: "/api/tim",
  barrio: "/api/barrio",
  sector: {
    base: "/api/sector",
    listarCuadrante: "/api/sector/listarCuadrante",
    listarUnidadUrbana: "/api/sector/listarTipoUnidadUrbana",
  },
  via: "/api/via/listarVia",
  contribuyente: {
    base: "/api/contribuyente",
    general: "/api/contribuyente/general",
  },
  arancel: "/api/arancel",
  valorUnitario: "/api/valoresunitarios",
  uit: "/api/uitEpa",
  alcabala: "/api/alcabala",
  depreciacion: "/api/depreciacion",
  predio: {
    base: "/api/predio",
    all: "/api/predio/all",
    usos: "/api/predio/usos",
  },
  piso: "/api/piso",
  asignacion: "/api/asignacionpredio",
  direccion: "/api/direccion",
  persona: {
    base: "/api/persona",
    listarPersona: "/api/persona/listarPersona",
    listarPorTipoYNombre: "/api/persona/listarPersonaPorTipoPersonaNombreRazon",
    listarPorContribuyente:
      "/api/persona/listarPersonaPorTipoPersonaNombreRazonContribuyente",
    listarPorTipoVia: "/api/persona/listarPersonaPorTipoPersonaNombreVia",
  },
  constante: {
    base: "/api/constante",
    listarPadre: "/api/constante/listarConstantePadre",
    listarHijo: "/api/constante/listarConstanteHijo",
  },
  serenazgo: "/api/arbitrioSerenazgo",
  limpiezaPublica: {
    base: "/api/arbitrioLimpiezaPublica",
    listarLimpiezaPublicaOtros:
      "/api/arbitrioLimpiezaPublica/listarArbitrioLimpiezaPublicaOtros",
    insertarLimpiezaPublicaOtros:
      "/api/arbitrioLimpiezaPublica/insertarArbitrioLimpiezaPublicaOtros",
    actualizarLimpiezaPublicaOtros:
      "/api/arbitrioLimpiezaPublica/actualizarArbitrioLimpiezaPublicaOtros",
  },
  parquesJardines: "/api/arbitrioParquesJardines",
  cuentaCorriente: {
    base: "/api/estadoCuenta",
    listar: "/api/estadoCuenta/listar",
    listarDetalle: "/api/estadoCuenta/listarDetalle",
  },
  resolucionInteres: "/api/resolucionInteres",
  vencimiento: "/api/vencimiento",
  interes: { base: "/api/interes", eliminar: "/api/interes/eliminarInteres" },
  asignacionCaja: {
    base: "/api/asignacionCaja",
    listar: "/api/asignacionCaja/listar",
    insertar: "/api/asignacionCaja/insertar",
    actualizar: "/api/asignacionCaja/actualizar",
    eliminar: "/api/asignacionCaja/eliminar",
  },
  caja: {
    base: "/api/caja",
    listar: "/api/caja/listar",
    insertar: "/api/caja/insertar",
    actualizar: "/api/caja/actualizar",
    eliminar: "/api/caja/eliminar",
  },
  aperturaCaja: {
    base: "/api/aperturaCaja",
    aperturar: "/api/aperturaCaja/aperturar",
    cierre: "/api/aperturaCaja/cierre",
  },
  turno: "/api/turno",
  usuario: {
    base: "/api/usuario",
    listar: "/api/usuario/listar",
    insertar: "/api/usuario/insertar",
    actualizar: "/api/usuario/actualizar",
    cambiarClave: "/api/usuario/cambiarClave",
    darBaja: "/api/usuario/darBaja",
    activar: "/api/usuario/activar",
  },
  asignacionPredio: {
    base: "/api/asignacionpredio",
    prevalidarBeneficioPensionista:
      "/api/asignacionpredio/prevalidarBeneficioPensionista",
    prevalidarBeneficioAdultoMayor:
      "/api/asignacionpredio/prevalidarBeneficioAdultoMayor",
  },
  pu: "/api/pu",
  hr: "/api/hr",
};

export function resolveEndpoint<K extends keyof EndpointsConfig>(
  module: K,
  subEndpoint?: string,
) {
  const endpoint = API_ENDPOINTS[module];
  if (typeof endpoint === "string") return endpoint;
  if (subEndpoint && endpoint[subEndpoint]) return endpoint[subEndpoint];
  return endpoint.base;
}
