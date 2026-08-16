// src/services/pisoService.ts
import BaseApiService from './BaseApiService';
import { buildApiUrl, getAuthenticatedUserCode } from '../config/api.unified.config';

/**
 * Interfaces para Piso
 * GET /api/piso?anio=2024&codPiso=&codPredio=2&numeroPiso=
 */
export interface PisoData {
  id: number;
  codigoPredio: number | string;
  numeroPiso: number;
  numeroPisoDesc?: string;
  areaConstruida: number;
  areaTotalConstruccion?: number;
  estado?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number | null;
  // Campos del API GET
  anio?: number | null;
  codPredio?: string;
  codPredioBase?: string | null;
  codPiso?: number;
  fechaConstruccion?: string | null;
  fechaConstruccionStr?: string | null;
  // Componentes estructurales
  codLetraMurosColumnas?: string | null;
  murosColumnas?: string | null;
  codLetraTechos?: string | null;
  techos?: string | null;
  codLetraPisos?: string | null;
  pisos?: string | null;
  codLetraPuertasVentanas?: string | null;
  puertasVentanas?: string | null;
  codLetraRevestimiento?: string | null;
  revestimiento?: string | null;
  codLetraBanios?: string | null;
  banios?: string | null;
  codLetraInstalacionesElectricas?: string | null;
  instalacionesElectricas?: string | null;
  // Estados y códigos
  codEstadoConservacion?: string | null;
  codMaterialEstructural?: string | null;
  codEstado?: string | null;
  codGrupoUso?: string | null;
  codUbicacionAreaVerde?: string | null;
  descripcionUso?: string | null;
  // Valores monetarios y de construcción
  valorUnitario?: number;
  incremento?: number;
  depreciacion?: number;
  montoDepreciacion?: number | null;
  valorUnitarioDepreciado?: number | null;
  valorAreaConstruida?: number | null;
  valorAreasComunes?: number | null;
  valorConstruccion?: number | null;
  valorOtrasInstalaciones?: number | null;
  valorTerreno?: number | null;
  valorTotalConstruccion?: number | null;
  autoavaluo?: number | null;
  totalAreaConstruccion?: number | null;
  numeroCondominos?: number | null;
  // Información adicional
  nombreSectorCompleto?: string | null;
  direccion?: string | null;
  rutaImagenPlano?: string | null;
  parametroBusqueda?: string | null;
}

/**
 * DTO para crear pisos según la estructura exacta del API
 * URL: POST /api/piso
 */
export interface CreatePisoApiDTO {
  anio: number;
  codPredio: string;
  codPiso: number;
  numeroPiso: number;
  fechaConstruccion: string;
  murosColumnas: string;
  techos: string;
  pisos: string;
  puertasVentanas: string;
  revestimiento: string;
  banios: string;
  instalacionesElectricas: string;
  codLetraMurosColumnas: string;
  codLetraTechos: string;
  codLetraPisos: string;
  codLetraPuertasVentanas: string;
  codLetraRevestimiento: string;
  codLetraBanios: string;
  codLetraInstalacionesElectricas: string;
  codEstadoConservacion: string;
  codMaterialEstructural: string;
  areaConstruida: string;
  valorAreasComunes: string;
  codUsuario: number;
}

/**
 * Interfaz para los datos crudos que vienen del API de Piso
 */
export interface PisoRaw {
  codPiso?: number;
  id?: number;
  anio?: number;
  codPredio?: string | number;
  codPredioBase?: string | number | null;
  numeroPiso?: number | null;
  numeroPisoDesc?: string | null;
  areaConstruida?: number | string;
  totalAreaConstruccion?: number | string | null;
  areaTotalConstruccion?: number | string | null;
  estado?: string;
  estPredio?: string;
  fechaRegistro?: string;
  fechaModificacion?: string;
  codUsuario?: number | null;
  fechaConstruccion?: string | number | null;
  fechaConstruccionStr?: string | null;
  codLetraMurosColumnas?: string | null;
  murosColumnas?: string | null;
  codLetraTechos?: string | null;
  techos?: string | null;
  codLetraPisos?: string | null;
  pisos?: string | null;
  codLetraPuertasVentanas?: string | null;
  puertasVentanas?: string | null;
  codLetraRevestimiento?: string | null;
  revestimiento?: string | null;
  codLetraBanios?: string | null;
  banios?: string | null;
  codLetraInstalacionesElectricas?: string | null;
  instalacionesElectricas?: string | null;
  codEstadoConservacion?: string | null;
  codMaterialEstructural?: string | null;
  codEstado?: string | null;
  codGrupoUso?: string | null;
  codUbicacionAreaVerde?: string | null;
  descripcionUso?: string | null;
  valorUnitario?: number | string | null;
  incremento?: number | string | null;
  depreciacion?: number | string | null;
  montoDepreciacion?: number | string | null;
  valorUnitarioDepreciated?: number | string | null;
  valorUnitarioDepreciado?: number | string | null;
  valorAreaConstruida?: number | string | null;
  valorAreasComunes?: number | string | null;
  valorConstruccion?: number | string | null;
  valorOtrasInstalaciones?: number | string | null;
  valorTerreno?: number | string | null;
  valorTotalConstruccion?: number | string | null;
  autoavaluo?: number | string | null;
  numeroCondominos?: number | string | null;
  nombreSectorCompleto?: string | null;
  direccion?: string | null;
  rutaImagenPlano?: string | null;
  parametroBusqueda?: string | null;
}

/**
 * Servicio para gestión de pisos
 * Sin autenticación para GET y POST
 */
class PisoService extends BaseApiService<PisoData, CreatePisoApiDTO, Partial<CreatePisoApiDTO>, PisoRaw> {
  private static instance: PisoService;

  private constructor() {
    super('/api/piso', {
      normalizeItem: (item: PisoRaw, index: number) => {
        let fechaConstruccionStr = item.fechaConstruccionStr;
        if (!fechaConstruccionStr && item.fechaConstruccion) {
          if (typeof item.fechaConstruccion === 'number') {
            const fecha = new Date(item.fechaConstruccion);
            fechaConstruccionStr = fecha.toISOString().split('T')[0];
          } else {
            fechaConstruccionStr = String(item.fechaConstruccion);
          }
        }

        const codPredioLimpio = item.codPredio ? String(item.codPredio).trim() : '';
        const codPredioBaseLimpio = item.codPredioBase ? String(item.codPredioBase).trim() : null;

        // Extraer numeroPiso de numeroPisoDesc si numeroPiso es null
        let numeroPisoCalculado = item.numeroPiso;
        if (numeroPisoCalculado === null || numeroPisoCalculado === undefined) {
          if (item.numeroPisoDesc) {
            const match = String(item.numeroPisoDesc).match(/^(\d+)/);
            if (match) {
              numeroPisoCalculado = parseInt(match[1], 10);
            }
          }
          if (numeroPisoCalculado === null || numeroPisoCalculado === undefined) {
            numeroPisoCalculado = item.codPiso || index + 1;
          }
        }

        return {
          id: item.codPiso ?? index + 1,
          codPiso: item.codPiso,
          anio: item.anio,
          codigoPredio: codPredioLimpio,
          codPredio: codPredioLimpio,
          codPredioBase: codPredioBaseLimpio,
          numeroPiso: numeroPisoCalculado,
          numeroPisoDesc: item.numeroPisoDesc,
          numeroCondominos: typeof item.numeroCondominos === 'string' ? parseInt(item.numeroCondominos) : item.numeroCondominos,
          fechaConstruccion: fechaConstruccionStr,
          fechaConstruccionStr: fechaConstruccionStr,
          codLetraMurosColumnas: item.codLetraMurosColumnas,
          murosColumnas: item.murosColumnas,
          codLetraTechos: item.codLetraTechos,
          techos: item.techos,
          codLetraPisos: item.codLetraPisos,
          pisos: item.pisos,
          codLetraPuertasVentanas: item.codLetraPuertasVentanas,
          puertasVentanas: item.puertasVentanas,
          codLetraRevestimiento: item.codLetraRevestimiento,
          revestimiento: item.revestimiento,
          codLetraBanios: item.codLetraBanios,
          banios: item.banios,
          codLetraInstalacionesElectricas: item.codLetraInstalacionesElectricas,
          instalacionesElectricas: item.instalacionesElectricas,
          codEstadoConservacion: item.codEstadoConservacion,
          codMaterialEstructural: item.codMaterialEstructural,
          codEstado: item.codEstado,
          codGrupoUso: item.codGrupoUso,
          codUbicacionAreaVerde: item.codUbicacionAreaVerde,
          codUsuario: item.codUsuario,
          descripcionUso: item.descripcionUso,
          valorUnitario: parseFloat(String(item.valorUnitario || 0)),
          areaConstruida: parseFloat(
            String(
              item.areaConstruida !== null && item.areaConstruida !== undefined && item.areaConstruida !== ''
                ? item.areaConstruida
                : (item.areaTotalConstruccion || item.totalAreaConstruccion || 0)
            )
          ),
          areaTotalConstruccion: parseFloat(String(item.areaTotalConstruccion || item.totalAreaConstruccion || 0)),
          totalAreaConstruccion: parseFloat(String(item.totalAreaConstruccion || item.areaTotalConstruccion || 0)),
          incremento: parseFloat(String(item.incremento || 0)),
          depreciacion: parseFloat(String(item.depreciacion || 0)),
          montoDepreciacion: item.montoDepreciacion ? parseFloat(String(item.montoDepreciacion)) : null,
          valorUnitarioDepreciado: parseFloat(String(item.valorUnitarioDepreciado || 0)),
          valorAreaConstruida: parseFloat(String(item.valorAreaConstruida || 0)),
          valorAreasComunes: item.valorAreasComunes != null ? parseFloat(String(item.valorAreasComunes)) : null,
          valorConstruccion: parseFloat(String(item.valorConstruccion || 0)),
          valorOtrasInstalaciones: item.valorOtrasInstalaciones != null ? parseFloat(String(item.valorOtrasInstalaciones)) : null,
          valorTerreno: item.valorTerreno ? parseFloat(String(item.valorTerreno)) : null,
          valorTotalConstruccion: item.valorTotalConstruccion ? parseFloat(String(item.valorTotalConstruccion)) : null,
          autoavaluo: item.autoavaluo ? parseFloat(String(item.autoavaluo)) : null,
          nombreSectorCompleto: item.nombreSectorCompleto,
          direccion: item.direccion,
          rutaImagenPlano: item.rutaImagenPlano,
          parametroBusqueda: item.parametroBusqueda,
          estado: item.estado || item.estPredio || 'ACTIVO',
          fechaRegistro: item.fechaRegistro,
          fechaModificacion: item.fechaModificacion
        } as PisoData;
      }
    }, 'piso');
  }

  static getInstance(): PisoService {
    if (!PisoService.instance) {
      PisoService.instance = new PisoService();
    }
    return PisoService.instance;
  }

  /**
   * Consulta pisos usando el API GET con query params
   */
  async consultarPisos(params: {
    codPiso?: number;
    anio?: number;
    codPredio?: string;
    codPredioBase?: string;
    numeroPiso?: number;
  }): Promise<PisoData[]> {
    try {
      console.log('🔍 [PisoService] Consultando pisos con parámetros:', params);

      const limpiarParametro = (valor: string | number | undefined): string => {
        if (valor === undefined) return '';
        return String(valor).trim().replace(/\s+/g, '');
      };

      const queryParams = new URLSearchParams();
      queryParams.set('anio', limpiarParametro(params.anio !== undefined ? params.anio : new Date().getFullYear()));
      queryParams.set('codPiso', limpiarParametro(params.codPiso));
      
      const codPredioBaseVal = params.codPredioBase || params.codPredio;
      queryParams.set('codPredioBase', limpiarParametro(codPredioBaseVal));
      queryParams.set('numeroPiso', limpiarParametro(params.numeroPiso));

      const queryString = `?${queryParams.toString()}`;
      console.log('📡 [PisoService] GET Query:', queryString);

      const response_json = await this.makeRequest<PisoRaw[] | { data: PisoRaw | PisoRaw[], success?: boolean }>(queryString, {
        method: 'GET'
      });

      // Extraer datos del wrapper
      let data: PisoRaw | PisoRaw[];
      if (response_json && typeof response_json === 'object' && 'success' in response_json && response_json.success !== undefined) {
        data = (response_json as { data: PisoRaw | PisoRaw[] }).data;
      } else if (response_json && typeof response_json === 'object' && 'data' in response_json) {
        data = (response_json as { data: PisoRaw | PisoRaw[] }).data;
      } else {
        data = response_json as PisoRaw | PisoRaw[];
      }

      const pisosData = Array.isArray(data) ? data : [data];
      return this.normalizeData(pisosData);

    } catch (error: unknown) {
      console.error('❌ [PisoService] Error consultando pisos:', error);
      return [];
    }
  }

  /**
   * Obtiene el detalle completo de un piso antes de editarlo.
   * GET /api/piso/all?anio=2025&codPredioBase=5&numeroPiso=1
   */
  async consultarPisoParaEdicion(params: {
    anio: number;
    codPredioBase: string;
    numeroPiso: number;
  }): Promise<PisoData | null> {
    const queryParams = new URLSearchParams();
    queryParams.set('anio', String(params.anio));
    queryParams.set('codPredioBase', String(params.codPredioBase).trim());
    queryParams.set('numeroPiso', String(params.numeroPiso));

    const response = await this.makeRequest<PisoRaw[] | PisoRaw | { data?: PisoRaw[] | PisoRaw }>(
      `/all?${queryParams.toString()}`,
      { method: 'GET' }
    );

    const rawData = response && typeof response === 'object' && !Array.isArray(response) && 'data' in response
      ? response.data
      : response;
    const items = Array.isArray(rawData) ? rawData : rawData ? [rawData as PisoRaw] : [];
    const pisos = this.normalizeData(items);

    return pisos.find((piso) => Number(piso.numeroPiso) === Number(params.numeroPiso)) ?? pisos[0] ?? null;
  }

  /**
   * Actualiza un piso existente usando PUT
   */
  async actualizarPiso(datos: CreatePisoApiDTO): Promise<PisoData> {
    try {
      console.log('🔄 [PisoService] Actualizando piso:', datos);

      if (!datos.codPredio || !datos.codPredio.trim()) {
        throw new Error('codPredio es requerido');
      }

      if (!datos.codPiso || datos.codPiso <= 0) {
        throw new Error('codPiso es requerido para actualizar');
      }

      const datosParaEnviar = {
        anio: Number(datos.anio),
        codPredio: String(datos.codPredio).trim(),
        codPiso: Number(datos.codPiso),
        numeroPiso: Number(datos.numeroPiso),
        fechaConstruccion: String(datos.fechaConstruccion || "1990-01-01"),
        murosColumnas: String(datos.murosColumnas || "100101"),
        techos: String(datos.techos || "100102"),
        pisos: String(datos.pisos || "100201"),
        puertasVentanas: String(datos.puertasVentanas || "100202"),
        revestimiento: String(datos.revestimiento || "100203"),
        banios: String(datos.banios || "100204"),
        instalacionesElectricas: String(datos.instalacionesElectricas || "100301"),
        codLetraMurosColumnas: String(datos.codLetraMurosColumnas || "1101"),
        codLetraTechos: String(datos.codLetraTechos || "1101"),
        codLetraPisos: String(datos.codLetraPisos || "1101"),
        codLetraPuertasVentanas: String(datos.codLetraPuertasVentanas || "1101"),
        codLetraRevestimiento: String(datos.codLetraRevestimiento || "1101"),
        codLetraBanios: String(datos.codLetraBanios || "1101"),
        codLetraInstalacionesElectricas: String(datos.codLetraInstalacionesElectricas || "1101"),
        codEstadoConservacion: String(datos.codEstadoConservacion || "9402"),
        codMaterialEstructural: String(datos.codMaterialEstructural || "0703"),
        areaConstruida: String(datos.areaConstruida),
        valorAreasComunes: String(datos.valorAreasComunes || "0"),
        codUsuario: getAuthenticatedUserCode()
      };

      const responseData = await this.makeRequest<PisoRaw | { data: PisoRaw, success?: boolean }>('', {
        method: 'PUT',
        body: JSON.stringify(datosParaEnviar)
      });

      if (responseData && typeof responseData === 'object' && 'success' in responseData && responseData.success === false) {
        throw new Error((responseData as { message?: string }).message || 'Error al actualizar piso');
      }

      console.log('✅ [PisoService] Piso actualizado exitosamente:', responseData);

      const rawPiso = (responseData && typeof responseData === 'object' && 'data' in responseData) 
        ? (responseData as { data: PisoRaw }).data 
        : responseData as PisoRaw;

      const normalized = this.normalizeData([rawPiso])[0];
      return normalized;

    } catch (error: unknown) {
      console.error('❌ [PisoService] Error actualizando piso:', error);
      throw error;
    }
  }

  /**
   * Elimina un piso usando PUT
   */
  async eliminarPiso(params: { anio: number; codPredio: string; numeroPiso: number; codPiso?: number }): Promise<boolean> {
    try {
      console.log('🗑️ [PisoService] Eliminando piso:', params);

      if (!params.codPredio || !params.codPredio.trim()) {
        throw new Error('codPredio es requerido');
      }

      if (!params.numeroPiso || params.numeroPiso <= 0) {
        throw new Error('numeroPiso es requerido');
      }

      const datosParaEnviar: Record<string, string | number> = {
        anio: Number(params.anio || new Date().getFullYear()),
        codPredio: String(params.codPredio).trim(),
        numeroPiso: Number(params.numeroPiso)
      };

      if (params.codPiso && params.codPiso > 0) {
        datosParaEnviar.codPiso = Number(params.codPiso);
      }

      console.log('📤 [PisoService] Datos a enviar para eliminar:', datosParaEnviar);

      const responseData = await this.makeRequest<{ 
        success?: boolean, 
        message?: string, 
        error?: boolean | string, 
        descripcion?: string,
        codigo?: string,
        mensaje?: string
      }>('/eliminar', {
        method: 'PUT',
        body: JSON.stringify(datosParaEnviar)
      });

      console.log('📋 [PisoService] Respuesta del servidor:', responseData);

      if (responseData) {
        if (responseData.success === false) {
          const errorMsg = String(responseData.message || responseData.error || responseData.descripcion || 'Error al eliminar piso');
          throw new Error(errorMsg);
        }

        if (responseData.codigo && responseData.codigo !== 'OK' && responseData.codigo !== '200' && responseData.codigo !== 'SUCCESS') {
          const errorMsg = String(responseData.mensaje || responseData.message || responseData.descripcion || 'Error al eliminar piso');
          throw new Error(errorMsg);
        }

        if (responseData.error === true || responseData.error === 'true') {
          const errorMsg = String(responseData.message || responseData.mensaje || responseData.descripcion || 'Error al eliminar piso');
          throw new Error(errorMsg);
        }
      }

      console.log('✅ [PisoService] Piso eliminado exitosamente:', responseData);
      return true;

    } catch (error: unknown) {
      console.error('❌ [PisoService] Error eliminando piso:', error);
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el piso';
      if (message === 'Operation Failed!' || message === 'Error al eliminar piso') {
        throw new Error('No se pudo eliminar el piso. Verifique que el piso exista y no tenga dependencias.');
      }
      throw error;
    }
  }

  /**
   * Crea un nuevo piso usando POST sin autenticación
   */
  async crearPisoSinAuth(datos: CreatePisoApiDTO): Promise<PisoData> {
    try {
      console.log('➕ [PisoService] Creando piso:', datos);

      if (!datos.codPredio || !datos.codPredio.trim()) {
        throw new Error('codPredio es requerido');
      }

      if (!datos.numeroPiso || datos.numeroPiso <= 0) {
        throw new Error('numeroPiso es requerido y debe ser mayor a 0');
      }

      if (!datos.areaConstruida || parseFloat(datos.areaConstruida) <= 0) {
        throw new Error('areaConstruida es requerido y debe ser mayor a 0');
      }

      const datosParaEnviar: any = {
        anio: Number(datos.anio),
        codPredio: String(datos.codPredio).trim(),
        numeroPiso: Number(datos.numeroPiso),
        fechaConstruccion: String(datos.fechaConstruccion || "1990-01-01"),
        murosColumnas: String(datos.murosColumnas || "100101"),
        techos: String(datos.techos || "100102"),
        pisos: String(datos.pisos || "100201"),
        puertasVentanas: String(datos.puertasVentanas || "100202"),
        revestimiento: String(datos.revestimiento || "100203"),
        banios: String(datos.banios || "100204"),
        instalacionesElectricas: String(datos.instalacionesElectricas || "100301"),
        codLetraMurosColumnas: String(datos.codLetraMurosColumnas || "1101"),
        codLetraTechos: String(datos.codLetraTechos || "1101"),
        codLetraPisos: String(datos.codLetraPisos || "1101"),
        codLetraPuertasVentanas: String(datos.codLetraPuertasVentanas || "1101"),
        codLetraRevestimiento: String(datos.codLetraRevestimiento || "1101"),
        codLetraBanios: String(datos.codLetraBanios || "1101"),
        codLetraInstalacionesElectricas: String(datos.codLetraInstalacionesElectricas || "1101"),
        codEstadoConservacion: String(datos.codEstadoConservacion || "9402"),
        codMaterialEstructural: String(datos.codMaterialEstructural || "0703"),
        areaConstruida: String(datos.areaConstruida),
        valorAreasComunes: String(datos.valorAreasComunes || "0"),
        codUsuario: getAuthenticatedUserCode(),
        codPiso: Number(datos.codPiso || 1)
      };

      const responseData = await this.makeRequest<PisoRaw | { data: PisoRaw, success?: boolean }>('', {
        method: 'POST',
        body: JSON.stringify(datosParaEnviar)
      });

      if (responseData && typeof responseData === 'object' && 'success' in responseData && responseData.success === false) {
        throw new Error((responseData as { message?: string }).message || 'Error al crear piso');
      }

      if (!responseData || (typeof responseData === 'object' && Object.keys(responseData).length === 0)) {
        throw new Error('El servidor no devolvió datos del piso creado');
      }

      console.log('✅ [PisoService] Piso creado exitosamente:', responseData);

      const rawPiso = (responseData && typeof responseData === 'object' && 'data' in responseData) 
        ? (responseData as { data: PisoRaw }).data 
        : responseData as PisoRaw;

      const normalized = this.normalizeData([rawPiso])[0];
      return normalized;

    } catch (error: unknown) {
      console.error('❌ [PisoService] Error creando piso:', error);
      throw error;
    }
  }
}

export const pisoService = PisoService.getInstance();
export default PisoService;
