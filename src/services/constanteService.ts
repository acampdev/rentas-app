import BaseApiService from "./BaseApiService";
import {
  fetchConstants,
  fetchGreenAreaLocations,
  fetchPropertyUses,
  fetchRoutes,
  fetchUseGroups,
  fetchZones,
} from "./constante/constante.api";
import { CODIGO_CONSTANTE_PADRE as CODE } from "./constante/constante.codes";
import type { ConstanteData, ConstanteRaw } from "./constante/constante.types";

class ConstanteService extends BaseApiService<
  ConstanteData,
  void,
  void,
  ConstanteRaw
> {
  private static instance: ConstanteService;

  private constructor() {
    super(
      "/api/constante",
      {
        normalizeItem: (item) => ({
          codConstante: String(item.codConstante || item.codigo || ""),
          nombreCategoria: item.nombreCategoria || item.descripcion || "",
        }),
        validateItem: (item) => Boolean(item.codConstante),
      },
      "constantes",
    );
  }

  static getInstance() {
    if (!ConstanteService.instance)
      ConstanteService.instance = new ConstanteService();
    return ConstanteService.instance;
  }

  async listarConstantesPorPadre(code: string) {
    return this.normalizeData(await fetchConstants("Padre", code));
  }
  async listarConstantesPorHijo(code: string) {
    return this.normalizeData(await fetchConstants("Hijo", code));
  }
  private parent = (code: string) => this.listarConstantesPorPadre(code);

  obtenerTiposContribuyente = () => this.parent(CODE.TIPO_CONTRIBUYENTE);
  obtenerTiposDocumento = () => this.parent(CODE.TIPO_DOCUMENTO);
  obtenerTiposEstadoCivil = () => this.parent(CODE.ESTADO_CIVIL);
  obtenerTiposSexo = () => this.parent(CODE.SEXOS);
  obtenerTiposNivelAntiguedad = () => this.parent(CODE.NIVEL_ANTIGUEDAD);
  obtenerTiposEstado = () => this.parent(CODE.ESTADO);
  obtenerTiposModoDeclaracion = () => this.parent(CODE.MODO_DECLARACION);
  obtenerTiposCasa = () => this.parent(CODE.TIPOS_DE_CASA);
  obtenerTiposMaterialEstructural = () =>
    this.parent(CODE.MATERIAL_ESTRUCTURAL_PREDOMINANTE);
  obtenerTiposEscala = () => this.parent(CODE.ESCALAS);
  obtenerTiposCategoriasValoresUnitarios = () =>
    this.parent(CODE.CATEGORIAS_VALORES_UNITARIOS);
  obtenerTiposLetrasValoresUnitarios = () =>
    this.parent(CODE.LETRAS_DE_VALORES_UNITARIOS);
  obtenerTiposEstadoPredio = () => this.parent(CODE.ESTADOS_DE_PREDIOS);
  obtenerTiposTipoPredio = () => this.parent(CODE.TIPO_DE_PREDIO);
  obtenerTiposCondicionPropiedad = () =>
    this.parent(CODE.CONDICION_DE_PROPIEDAD);
  obtenerTiposTipoVia = () => this.parent(CODE.TIPO_VIAS);
  obtenerTiposEstadosConservacion = () =>
    this.parent(CODE.ESTADOS_DE_CONSERVACION);
  obtenerTiposLadosDirecciones = () => this.parent(CODE.LADOS_DIRECCIONES);
  obtenerTiposListaConductor = () => this.parent(CODE.LISTA_CONDUCTOR);
  obtenerTiposListaUso = () => this.parent(CODE.LISTA_DE_USOS);
  obtenerTiposInteres = () => this.parent(CODE.TIPO_INTERES);
  obtenerTiposEstadoRecibo = () => this.parent(CODE.ESTADO_RECIBO);
  obtenerTiposMotivo = () => this.parent(CODE.MOTIVO);
  obtenerTiposMeses = () => this.parent(CODE.MESES);
  obtenerTiposEstadosPredio = () => this.parent(CODE.ESTADOS_DE_PREDIOS);
  obtenerTributos = () => this.parent(CODE.TRIBUTOS);
  obtenerTiposFraccionamiento = () => this.parent(CODE.TIPO_FRACCIONAMIENTO);
  obtenerClaseDeInteres = () => this.parent(CODE.CLASES_DE_INTERES);
  obtenerTiposModoTransferencia = () => this.parent(CODE.MODO_TRANSFERENCIA);
  obtenerTipoInscripcion = () =>
    this.parent(CODE.TIPOS_DE_INSCRIPCION_DE_PREDIO);

  obtenerRutas = fetchRoutes;
  obtenerZonas = fetchZones;
  listarGrupoUso = fetchUseGroups;
  listarUbicacionAreaVerde = fetchGreenAreaLocations;
  listarUsoPredio = fetchPropertyUses;
}

export const constanteService = ConstanteService.getInstance();
export default constanteService;
export { CODIGO_CONSTANTE_PADRE } from "./constante/constante.codes";
export type {
  CatalogoRaw as GrupoUsoRaw,
  CatalogoRaw as RutaRaw,
  CatalogoRaw as UbicacionAreaVerdeRaw,
  CatalogoRaw as ZonaRaw,
  ConstanteData,
  ConstanteRaw,
  GrupoUsoData,
  RutaData,
  UbicacionAreaVerdeData,
  UsoPredioData,
  UsoPredioRaw,
  ZonaData,
} from "./constante/constante.types";
