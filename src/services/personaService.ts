import { getEndpoint } from "../config/api.unified.config";
import BaseApiService from "./BaseApiService";
import { isApiNotFoundError } from "./apiClient";
import type { ContribuyenteData } from "./contribuyenteService";
import {
  buildPersonaPayload,
  mapPersonaFormToApi,
  mapPersonaToContribuyente,
  normalizePersona,
  resolveCreatedPersona,
  resolveUpdatedPersona,
  unwrapPersonaList,
  validatePersonaDocument,
} from "./persona/persona.adapters";
import {
  guardarPersonaRequest,
  listarPersonaRequest,
} from "./persona/persona.api";
import type {
  BusquedaPersonaParams,
  CreatePersonaAPIDTO,
  CreatePersonaDTO,
  DocumentoValidation,
  PersonaData,
  PersonaRaw,
  UpdatePersonaDTO,
} from "./persona/persona.types";

export type {
  BusquedaPersonaParams,
  CreatePersonaAPIDTO,
  CreatePersonaDTO,
  PersonaData,
  PersonaRaw,
  UpdatePersonaDTO,
} from "./persona/persona.types";

class PersonaService extends BaseApiService<
  PersonaData,
  CreatePersonaDTO,
  UpdatePersonaDTO,
  PersonaRaw
> {
  private static instance: PersonaService;

  private constructor() {
    super(
      getEndpoint("persona", "base"),
      {
        normalizeItem: normalizePersona,
        validateItem: (item) =>
          Boolean(item.codPersona && item.numerodocumento),
      },
      "persona",
    );
  }

  static getInstance(): PersonaService {
    if (!PersonaService.instance) {
      PersonaService.instance = new PersonaService();
    }
    return PersonaService.instance;
  }

  async obtenerPorId(id: number): Promise<PersonaData | null> {
    try {
      return await this.getById(id);
    } catch (error) {
      if (isApiNotFoundError(error)) return null;
      throw error;
    }
  }

  async listarPersona(
    codTipoDocumento = "4101",
    numeroDocumento: string,
  ): Promise<PersonaData[]> {
    const response = await listarPersonaRequest(
      String(codTipoDocumento),
      String(numeroDocumento),
    );
    return this.normalizeData(unwrapPersonaList(response));
  }

  async obtenerPorDocumento(
    dni: string,
    codTipoDocumento = "4101",
  ): Promise<PersonaData | null> {
    try {
      const directResults = await this.listarPersona(codTipoDocumento, dni);
      if (directResults.length > 0) return directResults[0];

      const fallbackResults = await this.getAll({ parametroBusqueda: dni });
      return (
        fallbackResults.find((persona) => persona.numerodocumento === dni) ??
        fallbackResults[0] ??
        null
      );
    } catch (error) {
      if (isApiNotFoundError(error)) return null;
      throw error;
    }
  }

  async listarPorTipoYNombre(
    params: BusquedaPersonaParams,
  ): Promise<PersonaData[]> {
    const numeroDocumento = params.numeroDocumento || params.parametroBusqueda;
    if (!numeroDocumento || numeroDocumento === "a") return [];

    try {
      return await this.listarPersona(
        params.codTipoDocumento || "4101",
        numeroDocumento,
      );
    } catch (error) {
      if (isApiNotFoundError(error)) return [];
      throw error;
    }
  }

  async crearPersonaAPI(data: CreatePersonaDTO): Promise<PersonaData> {
    const response = await guardarPersonaRequest(
      "POST",
      buildPersonaPayload(data),
    );
    return resolveCreatedPersona(response, data);
  }

  async actualizarPersonaAPI(data: UpdatePersonaDTO): Promise<PersonaData> {
    const payload = buildPersonaPayload(data);
    const response = await guardarPersonaRequest("PUT", payload);
    return resolveUpdatedPersona(response, payload);
  }

  convertirFormularioAApiDTO(datosFormulario: object): CreatePersonaAPIDTO {
    return mapPersonaFormToApi(datosFormulario);
  }

  convertirAContribuyente(persona: PersonaData): Partial<ContribuyenteData> {
    return mapPersonaToContribuyente(persona);
  }

  validarDocumento(
    tipoDocumento: string,
    numeroDocumento: string,
  ): DocumentoValidation {
    return validatePersonaDocument(tipoDocumento, numeroDocumento);
  }
}

export const personaService = PersonaService.getInstance();
export default PersonaService;
