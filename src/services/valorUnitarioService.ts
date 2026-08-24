// src/services/valorUnitarioService.ts
import {
  buildApiUrl,
  getAuthenticatedUserCode,
} from "../config/api.unified.config";
import BaseApiService from "./BaseApiService";
import {
  createValorUnitarioPayload,
  createValorUnitarioStatistics,
  createValoresPorCategoria,
  filterValoresUnitarios,
  isValidValorUnitario,
  normalizeValorUnitario,
  unwrapValorUnitarioResponse,
  validateCreateValorUnitario,
  validateUpdateValorUnitario,
} from "./valorUnitario/valorUnitario.adapters";
import type {
  BusquedaValorUnitarioParams,
  CrearValorUnitarioApiDTO,
  CreateValorUnitarioDTO,
  UpdateValorUnitarioDTO,
  ValorUnitarioApiResponse,
  ValorUnitarioData,
  ValorUnitarioEstadisticas,
  ValorUnitarioRaw,
  ValoresPorCategoria,
} from "./valorUnitario/valorUnitario.types";

export * from "./valorUnitario/valorUnitario.catalog";
export type * from "./valorUnitario/valorUnitario.types";

export const VALOR_UNITARIO_API_URL = buildApiUrl("/api/valoresunitarios");

type ValorUnitarioDefaults = Omit<
  CrearValorUnitarioApiDTO,
  "codigoValorUnitario" | "codigoValorUnitarioAnterior"
>;

class ValorUnitarioService extends BaseApiService<
  ValorUnitarioData,
  CreateValorUnitarioDTO,
  UpdateValorUnitarioDTO,
  ValorUnitarioRaw
> {
  private static instance: ValorUnitarioService;

  private constructor() {
    super(
      VALOR_UNITARIO_API_URL,
      {
        normalizeItem: normalizeValorUnitario,
        validateItem: isValidValorUnitario,
      },
      "valor_unitario",
    );
  }

  static getInstance(): ValorUnitarioService {
    if (!ValorUnitarioService.instance) {
      ValorUnitarioService.instance = new ValorUnitarioService();
    }
    return ValorUnitarioService.instance;
  }

  async listarValoresUnitarios(
    incluirInactivos = false,
  ): Promise<ValorUnitarioData[]> {
    const values = await this.getAll();
    return incluirInactivos
      ? values
      : values.filter((value) => value.estado === "ACTIVO");
  }

  async consultarValoresUnitarios(params: {
    anio?: number;
  }): Promise<ValorUnitarioData[]> {
    const currentYear = new Date().getFullYear();
    const year = params.anio && params.anio > 0 ? params.anio : currentYear;
    const response = await this.makeRequest<ValorUnitarioApiResponse>(
      `?anio=${year}`,
      {
        method: "GET",
      },
    );

    return unwrapValorUnitarioResponse(response)
      .map((item, index) =>
        normalizeValorUnitario(
          { ...item, anio: item.anio ?? item.año ?? year },
          index,
        ),
      )
      .filter(isValidValorUnitario);
  }

  listarPorAño(año: number): Promise<ValorUnitarioData[]> {
    return this.consultarValoresUnitarios({ anio: año });
  }

  async buscarValoresUnitarios(
    criterios: BusquedaValorUnitarioParams,
  ): Promise<ValorUnitarioData[]> {
    const anio = criterios.anio ?? criterios.año ?? new Date().getFullYear();
    const values = await this.consultarValoresUnitarios({ anio });
    return filterValoresUnitarios(values, criterios);
  }

  async obtenerValorUnitario(
    año: number,
    categoria: string,
    subcategoria: string,
    letra: string,
  ): Promise<ValorUnitarioData | null> {
    const values = await this.buscarValoresUnitarios({
      año,
      categoria,
      subcategoria,
      letra,
    });
    return values[0] ?? null;
  }

  async obtenerValoresPorCategoria(año: number): Promise<ValoresPorCategoria> {
    return createValoresPorCategoria(await this.listarPorAño(año));
  }

  async verificarExiste(
    año: number,
    categoria: string,
    subcategoria: string,
    letra: string,
    excluirId?: string,
  ): Promise<boolean> {
    const values = await this.buscarValoresUnitarios({
      año,
      categoria,
      subcategoria,
      letra,
    });
    return excluirId
      ? values.some((value) => value.id !== excluirId)
      : values.length > 0;
  }

  async crearValorUnitario(
    datos: CreateValorUnitarioDTO,
  ): Promise<ValorUnitarioData> {
    const exists = await this.verificarExiste(
      datos.año,
      datos.categoria,
      datos.subcategoria,
      datos.letra,
    );
    if (exists) {
      throw new Error("Ya existe un valor unitario con esas características");
    }

    return this.create({
      ...datos,
      codUsuario: getAuthenticatedUserCode(),
      estado: "ACTIVO",
      fechaRegistro: new Date().toISOString(),
    } as CreateValorUnitarioDTO);
  }

  async crearValorUnitarioSinAuth(
    datos: CrearValorUnitarioApiDTO,
  ): Promise<ValorUnitarioData> {
    validateCreateValorUnitario(datos);
    const payload = createValorUnitarioPayload(datos);
    const response = await this.makeRequest<ValorUnitarioApiResponse>("", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const raw = unwrapValorUnitarioResponse(response)[0];
    if (!raw) throw new Error("El API no devolvió el valor unitario creado");
    return normalizeValorUnitario(
      { ...raw, anio: raw.anio ?? payload.anio },
      0,
    );
  }

  crearValorUnitarioConDefaults(
    datos: ValorUnitarioDefaults,
  ): Promise<ValorUnitarioData> {
    return this.crearValorUnitarioSinAuth(createValorUnitarioPayload(datos));
  }

  async actualizarValorUnitario(
    id: string,
    datos: UpdateValorUnitarioDTO,
  ): Promise<ValorUnitarioData> {
    const current = await this.getById(id);
    if (!current) throw new Error("Valor unitario no encontrado");
    validateUpdateValorUnitario(datos);

    const changesIdentity = ["año", "categoria", "subcategoria", "letra"].some(
      (field) => datos[field as keyof UpdateValorUnitarioDTO] !== undefined,
    );
    if (changesIdentity) {
      const exists = await this.verificarExiste(
        datos.año ?? current.año,
        datos.categoria ?? current.categoria,
        datos.subcategoria ?? current.subcategoria,
        datos.letra ?? current.letra,
        id,
      );
      if (exists)
        throw new Error(
          "Ya existe otro valor unitario con esas características",
        );
    }

    return this.update(id, {
      ...datos,
      fechaModificacion: new Date().toISOString(),
    });
  }

  async eliminarValorUnitario(id: string): Promise<void> {
    await this.update(id, {
      estado: "INACTIVO",
      fechaModificacion: new Date().toISOString(),
    });
  }

  async eliminarPorAño(año: number): Promise<number> {
    const activeValues = (await this.listarPorAño(año)).filter(
      (value) => value.estado === "ACTIVO",
    );
    for (const value of activeValues)
      await this.eliminarValorUnitario(value.id);
    return activeValues.length;
  }

  async copiarValoresDeAño(
    añoOrigen: number,
    añoDestino: number,
  ): Promise<number> {
    if ((await this.listarPorAño(añoDestino)).length) {
      throw new Error(`Ya existen valores unitarios para el año ${añoDestino}`);
    }

    const sourceValues = await this.listarPorAño(añoOrigen);
    if (!sourceValues.length) {
      throw new Error(
        `No hay valores unitarios en el año ${añoOrigen} para copiar`,
      );
    }

    for (const value of sourceValues) {
      await this.crearValorUnitario({
        año: añoDestino,
        categoria: value.categoria,
        subcategoria: value.subcategoria,
        letra: value.letra,
        costo: value.costo,
      });
    }
    return sourceValues.length;
  }

  async obtenerEstadisticas(año?: number): Promise<ValorUnitarioEstadisticas> {
    const values = año ? await this.listarPorAño(año) : await this.getAll();
    return createValorUnitarioStatistics(values);
  }
}

export const valorUnitarioService = ValorUnitarioService.getInstance();
export default ValorUnitarioService;
