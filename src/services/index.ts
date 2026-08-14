// src/services/index.ts

export { default as authService } from './authService';
export { personaService, type PersonaData, type CreatePersonaDTO, type UpdatePersonaDTO } from './personaService';
export { contribuyenteService, type ContribuyenteData, type CreateContribuyenteDTO, type UpdateContribuyenteDTO } from './contribuyenteService';
export { predioService, type PredioData, type CreatePredioDTO } from './predioService';
export { pisoService, type PisoData, type CreatePisoApiDTO } from './pisoService';
export { asignacionService, type AsignacionPredio, type CreateAsignacionAPIDTO } from './asignacionService';
export { hrService, type HRData } from './hrService';
export { puService, type PUData } from './puService';
export { cuentaCorrienteService, type EstadoCuentaAnual, type EstadoCuentaDetalle } from './cuentaCorrienteService';
export { usuarioService, type UsuarioData, type CreateUsuarioDTO, type UpdateUsuarioDTO } from './usuarioService';
export { constanteService, type ConstanteData, CODIGO_CONSTANTE_PADRE } from './constanteService';
export { barrioService, type BarrioData } from './barrioService';
export { sectorService, type SectorData } from './SectorService';
export { uitService, type UITData } from './uitService';
export { valorUnitarioService, type ValorUnitarioData } from './valorUnitarioService';
export { arancelService, type ArancelData } from './arancelService';
export { direccionService, type DireccionData } from './direccionService';
export { limpiezaPublicaService, type LimpiezaPublicaData } from './limpiezaPublicaService';
export { parquesJardinesService, type ParquesJardinesData } from './parquesJardinesService';
export { serenazgoService, type SerenazgoData } from './serenazgoService';
export { resolucionInteresService, type ResolucionInteresData } from './resolucionInteresService';
export { vencimientoService, type VencimientoData } from './vencimientoService';
export { fraccionamientoService } from './fraccionamientoService';
export { interesService } from './interesService';
export { timService, type TimData } from './timService';
export { auditoriaService, type AuditoriaItem } from './auditoriaService';
