// src/config/constants.ts
export const API_PREFIX = '';

// Definir explícitamente AUTH_ENDPOINTS
export const AUTH_ENDPOINTS = {
  LOGIN: `/auth/login`,
  LOGOUT: `/auth/logout`,
  REFRESH: `/auth/refresh`,
  REGISTER: `/auth/register`,
};

// Roles de usuario disponibles
export const USER_ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  ADMIN: 'ADMIN', // Alias heredado; se normaliza como ADMINISTRADOR.
  CAJERO: 'CAJERO',
  GERENTE: 'GERENTE',
  SUPERVISOR: 'SUPERVISOR',
  AUDITOR: 'AUDITOR',
  USER: 'USER'
} as const;

// Tipo para roles
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Estados de usuario
export const USER_ESTADOS = {
  ACTIVO: '4567',
  INACTIVO: '4568',
  SUSPENDIDO: '4569'
} as const;

// Códigos de constantes de negocio (Hijos de CODIGO_CONSTANTE_PADRE)
export const BUSINESS_CODES = {
  TIPO_PERSONA: {
    NATURAL: '0301',
    JURIDICA: '0302',
  },
  TIPO_DOCUMENTO: {
    DNI: '4101',
    RUC: '4102',
    CE: '4103',
    PASAPORTE: '4104',
  },
  ESTADO_CIVIL: {
    SOLTERO: '1801',
    CASADO: '1802',
    VIUDO: '1803',
    DIVORCIADO: '1804',
  },
  SEXO: {
    MASCULINO: '2001',
    FEMENINO: '2002',
  },
  ESTADO_CONSERVACION: {
    MUY_BUENO: '9401',
    BUENO: '9402',
    REGULAR: '9403',
    MALO: '9404',
  }
} as const;

// Actualizar endpoints para no requerir autenticación
export const API_ENDPOINTS = {
  // Mantenedores (sin autenticación)
  BARRIO: `/api/barrio`,
  sector: {
    base: '/api/sector',
    listarCuadrante: '/api/sector/listarCuadrante',
    listarUnidadUrbana: '/api/sector/listarTipoUnidadUrbana',
  },
  VIA:{
    base: '/api/via',
    listarVia: `/api/via/listarVia`,
  },
  SERENAZGO:'/api/arbitrioSerenazgo',
  LIMPIEZA_PUBLICA:{
    base: '/api/arbitrioLimpiezaPublica',
    listarLimpiezaPublicaOtros: '/api/arbitrioLimpiezaPublica/listarArbitrioLimpiezaPublicaOtros',
    insertarLimpiezaPublicaOtros: '/api/arbitrioLimpiezaPublica/insertarArbitrioLimpiezaPublicaOtros',
    actualizarLimpiezaPublicaOtros: '/api/arbitrioLimpiezaPublica/actualizarArbitrioLimpiezaPublicaOtros',
  },
  PARQUES_JARDINES:'/api/arbitrioParquesjardines',

  
  CONTRIBUYENTE: {
    base: '/api/contribuyente',
    general: '/api/contribuyente/general',
  },
  persona: {
      base: '/api/persona',
      listarPorTipoYNombre: '/api/persona/listarPersonaPorTipoPersonaNombreRazon',
      listarPorContribuyente: '/api/persona/listarPersonaPorTipoPersonaNombreRazonContribuyente',
      listarPorTipoVia: '/api/persona/listarPersonaPorTipoPersonaNombreVia'
    },
  ARANCEL: `/api/arancel`,
  VALOR_UNITARIO: `/api/valoresunitarios`,
  UIT: `/api/uitEpa`,
  ALCABALA: `/api/alcabala`,
  DEPRECIACION: `/api/depreciacion`,
  PREDIO: {
    base: '/api/predio',
    all: '/api/predio/all',
    usos: '/api/predio/usos',
  },
  PISO: `/api/piso`,
  ASIGNACION_PREDIO: {
    base: '/api/asignacionpredio',
    prevalidarBeneficioPensionista: '/api/asignacionpredio/prevalidarBeneficioPensionista',
    prevalidarBeneficioAdultoMayor: '/api/asignacionpredio/prevalidarBeneficioAdultoMayor',
  },
  constante: {
      base: '/api/constante',
      listarPadre: '/api/constante/listarConstantePadre',
      listarHijo: '/api/constante/listarConstanteHijo'
  },
  CUENTA_CORRIENTE: {
    base: '/api/estadoCuenta',
    listar: '/api/estadoCuenta/listar',
    listarDetalle: '/api/estadoCuenta/listarDetalle',
  },
  RESOLUCION_INTERES: '/api/resolucionInteres',
  Vencimiento: '/api/vencimiento',
  ASIGNACION_CAJA:{
    base: '/api/asignacionCaja',
    listar: '/api/asignacionCaja/listar',
    insertar: '/api/asignacionCaja/insertar',
    actualizar: '/api/asignacionCaja/actualizar',
    eliminar: '/api/asignacionCaja/eliminar', 
  },
  CAJA:{
    base: '/api/caja',
    listar: '/api/caja/listar',
    insertar: '/api/caja/insertar',
    actualizar: '/api/caja/actualizar',
    eliminar: '/api/caja/eliminar',
  },
  TURNO:'/api/turno',
  APERTURA_CAJA:{
    base: '/api/aperturaCaja',
    aperturar: '/api/aperturaCaja/aperturar',
    cierre: '/api/aperturaCaja/cierre',
  },
  USUARIO:{
    base: '/api/usuario',
    listar: '/api/usuario/listar',
    insertar: '/api/usuario/insertar',
    actualizar: '/api/usuario/actualizar',
    cambiarClave: '/api/usuario/cambiarClave',
    darBaja: '/api/usuario/darBaja',
    activar: '/api/usuario/activar',
  },
  PU:'/api/pu',
  HR:'/api/hr',

  // Autenticación (referencia a AUTH_ENDPOINTS)
  AUTH: `/auth`,


};
