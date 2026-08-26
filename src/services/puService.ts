import { logger } from "../utils/logger";
import BaseApiService from "./BaseApiService";
import apiClient, { isApiNotFoundError, unwrapApiList } from "./apiClient";
import { buildApiUrl } from "../config/api.unified.config";

/**
 * Interface para los datos de Predio Urbano (PU)
 */
export interface PUData {
  codPredio: string;
  codContribuyente: string;
  nombreContribuyenteCompleto: string;
  numeroDocumento: string;
  nombreRepresentanteOConyuge: string | null;
  numeroDocumentoRepresentanteOConyuge: string | null;
  conjuntoUrbano: string;
  direccion: string;
  manzana: string;
  lote: string;
  otroNumero: string | null;
  porcentajeCondomino: string;
  fechaAdquisicion: string;
  clasificacionPredio: string;
  estadoPredio: string;
  tipoPredio: string;
  condicionPropiedad: string;
  nivelPiso: string;
  fechaConstruccion: string;
  incremento5: string;
  estadoConservacion: string;
  material: string;
  areaConstruida: string;
  letraMuros: string;
  letraTechos: string;
  letraPisos: string;
  letraPuertas: string;
  letraRevestimiento: string;
  letraBanios: string;
  letraInstElect: string;
  valorUnitario: string;
  depreciacion: string;
  valorUnitarioDepreciado: string;
  valorAreaConstruida: string;
  valorConstruccion: string;
  arancel: string;
  areaTerreno: string;
  areaTotalConstruida: string;
  valorTotalConstruccion: string;
  valorTerreno: string;
  valorOtrasInstalaciones: string;
  autoavaluo: string;
}

/**
 * Interfaz para los datos crudos que vienen del API de PU
 */
export interface PURaw {
  codPredio?: string;
  codContribuyente?: string | number;
  nombreContribuyenteCompleto?: string;
  numeroDocumento?: string;
  nombreRepresentanteOConyuge?: string | null;
  numeroDocumentoRepresentanteOConyuge?: string | null;
  conjuntoUrbano?: string;
  direccion?: string;
  manzana?: string;
  lote?: string;
  otroNumero?: string | null;
  porcentajeCondomino?: string | number;
  fechaAdquisicion?: string;
  clasificacionPredio?: string;
  estadoPredio?: string;
  tipoPredio?: string;
  condicionPropiedad?: string;
  nivelPiso?: string;
  fechaConstruccion?: string;
  incremento5?: string | number;
  estadoConservacion?: string;
  material?: string;
  areaConstruida?: string | number;
  letraMuros?: string;
  letraTechos?: string;
  letraPisos?: string;
  letraPuertas?: string;
  letraRevestimiento?: string;
  letraBanios?: string;
  letraInstElect?: string;
  valorUnitario?: string | number;
  depreciacion?: string | number;
  valorUnitarioDepreciado?: string | number;
  valorAreaConstruida?: string | number;
  valorConstruccion?: string | number;
  arancel?: string | number;
  areaTerreno?: string | number;
  areaTotalConstruida?: string | number;
  valorTotalConstruccion?: string | number;
  valorTerreno?: string | number;
  valorOtrasInstalaciones?: string | number;
  autoavaluo?: string | number;
}

export interface PUQueryParams {
  codContribuyente?: string;
  codPredio?: string;
}

/**
 * Servicio para gestión de Predio Urbano (PU)
 */
class PUService extends BaseApiService<PUData, void, void> {
  private static instance: PUService;

  private constructor() {
    super(
      "/api/pu",
      {
        normalizeItem: (item: PURaw): PUData => ({
          codPredio: (item.codPredio || "").trim(),
          codContribuyente: item.codContribuyente?.toString() || "",
          nombreContribuyenteCompleto: item.nombreContribuyenteCompleto || "",
          numeroDocumento: item.numeroDocumento || "",
          nombreRepresentanteOConyuge: item.nombreRepresentanteOConyuge || null,
          numeroDocumentoRepresentanteOConyuge:
            item.numeroDocumentoRepresentanteOConyuge || null,
          conjuntoUrbano: item.conjuntoUrbano || "",
          direccion: item.direccion || "",
          manzana: item.manzana || "",
          lote: item.lote || "",
          otroNumero: item.otroNumero || null,
          porcentajeCondomino: String(item.porcentajeCondomino || "0"),
          fechaAdquisicion: item.fechaAdquisicion || "",
          clasificacionPredio: item.clasificacionPredio || "",
          estadoPredio: item.estadoPredio || "",
          tipoPredio: item.tipoPredio || "",
          condicionPropiedad: item.condicionPropiedad || "",
          nivelPiso: item.nivelPiso || "",
          fechaConstruccion: item.fechaConstruccion || "",
          incremento5: String(item.incremento5 || "0"),
          estadoConservacion: item.estadoConservacion || "",
          material: item.material || "",
          areaConstruida: String(item.areaConstruida || "0"),
          letraMuros: item.letraMuros || "",
          letraTechos: item.letraTechos || "",
          letraPisos: item.letraPisos || "",
          letraPuertas: item.letraPuertas || "",
          letraRevestimiento: item.letraRevestimiento || "",
          letraBanios: item.letraBanios || "",
          letraInstElect: item.letraInstElect || "",
          valorUnitario: String(item.valorUnitario || "0"),
          depreciacion: String(item.depreciacion || "0"),
          valorUnitarioDepreciado: String(item.valorUnitarioDepreciado || "0"),
          valorAreaConstruida: String(item.valorAreaConstruida || "0"),
          valorConstruccion: String(item.valorConstruccion || "0"),
          arancel: String(item.arancel || "0"),
          areaTerreno: String(item.areaTerreno || "0"),
          areaTotalConstruida: String(item.areaTotalConstruida || "0"),
          valorTotalConstruccion: String(item.valorTotalConstruccion || "0"),
          valorTerreno: String(item.valorTerreno || "0"),
          valorOtrasInstalaciones: String(item.valorOtrasInstalaciones || "0"),
          autoavaluo: String(item.autoavaluo || "0"),
        }),
        // El endpoint por contribuyente puede devolver codPredio=null para
        // cada nivel del inmueble. Esas filas siguen siendo válidas y no
        // deben descartarse si contienen el contribuyente consultado.
        validateItem: (item: PUData) => !!item.codContribuyente,
      },
      "pu",
    );
  }

  public static getInstance(): PUService {
    if (!PUService.instance) {
      PUService.instance = new PUService();
    }
    return PUService.instance;
  }

  async buscarPU(params: PUQueryParams): Promise<PUData[]> {
    try {
      if (!params.codContribuyente) {
        logger.warn(
          "[PUService] codContribuyente es requerido para la consulta de PU.",
        );
        return [];
      }

      const url = buildApiUrl(this.endpoint);
      const queryParams = new URLSearchParams();
      queryParams.append("codContribuyente", params.codContribuyente);
      if (params.codPredio?.trim()) {
        queryParams.append("codPredio", params.codPredio.trim());
      }

      const payload = await apiClient.request<unknown>(
        `${url}?${queryParams.toString()}`,
      );
      const items = unwrapApiList<Record<string, unknown>>(payload);

      return this.normalizeData(Array.isArray(items) ? items : []);
    } catch (error) {
      if (isApiNotFoundError(error)) return [];
      logger.warn("[PUService] Error al buscar PU:", error);
      throw error;
    }
  }
}

export const puService = PUService.getInstance();
export default puService;
