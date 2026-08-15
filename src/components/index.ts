
export { default as Breadcrumb } from './utils/Breadcrumb';
export { default as BreadcrumbItem } from './utils/Breadcrumb';
export { default as NotificationContainer } from './utils/Notification';

// Exportaciones de componentes específicos

export { default as PersonaForm } from './contribuyentes/PersonaForm';
export { default as PersonaMaintenanceForm } from './persona/PersonaForm';
export { default as PersonaList } from './persona/PersonaList';
export { default as ContribuyenteForm } from './contribuyentes/ContribuyenteForm';
export { default as ContribuyenteConsulta } from './contribuyentes/ContribuyenteConsulta';
export { default as DeduccionBeneficio } from './contribuyentes/DeduccionBeneficio';

export { default as FormSection } from './utils/FormSection';


// Exportación de componentes para mantenedores
// Calle
export { default as CalleForm } from './calles/CalleForm';
export {default as CalleList} from  './calles/CalleList';

// Sector
export { default as SectorForm } from './sector/SectorForm';
export { default as SectorList } from './sector/SectorList';
// Barrio
export { default as BarrioForm } from './barrio/BarrioForm';
export { default as BarrioList } from './barrio/BarrioList';
// Direcciones
export { default as DireccionForm } from './direcciones/DireccionForm';
export { default as DireccionList } from './direcciones/DireccionList';
// Aranceles Asignacion
export {  AsignacionArancelForm as ArancelComponent, AsignacionArancelForm } from './aranceles/ArancelForm';
export {  ArancelList } from './aranceles/ArancelList';
// Valores Unitarios
export { default as ValorUnitarioForm } from './unitarios/ValorUnitarioForm';
export { default as ValorUnitarioList } from './unitarios/ValorUnitarioList';


// Exportación centralizada de los componentes UIT
export { default as UitFormAlicuota } from './uit/UitFormAlicuota';
export { default as UitList } from './uit/UitList';

// Exportación centralizada de los componentes Alcabala
export { default as AlcabalaComponent } from './alcabala/Alcabala';
export { default as AlcabalaList } from './alcabala/AlcabalaList';
export { default as AlcabalaForm } from './alcabala/AlcabalaForm';

// Exportación centralizada de los componentes Depreciación
export { default as DepreciacionUnificado } from './depreciacion/DepreciacionUnificado';

export {default as LoginForm } from './auth/LoginForm'
export {default as ProtectedRoute} from './auth/ProtectedRoute'

// Utils
export { default as FormErrorBoundary } from './utils/FormErrorBoundary';
// Exportación de componentes de navegación

export {default as navigationGuard } from './utils/navigationGuard'

// Components de Predio
export { default as PredioForm } from './predio/PredioForm'
export {default as ConsultaPredios} from  './predio/ConsultaPredios'
export {default as ConsultaPisos } from './predio/pisos/ConsultaPisos'
export { default as RegistrosPisos } from './predio/pisos/RegistrosPisos'
export { default as AsignacionPredio } from './predio/asignacion/AsignacionPredio'

export { default as ConsultaAsignacion } from './predio/asignacion/ConsultaAsignacion'
export { default as PU } from './reportes/PU';
export { default as HR } from './reportes/HR';

// Modal
export { default as SelectorContribuyente } from './modal/SelectorContribuyente';
export { default as SelectorDireccionArancel } from './modal/SelectorDireccionArancel';
export { default as SelectorPredio } from './modal/SelectorPredio';
export {default as SelectorDirecciones } from './modal/SelectorDirecciones';

// Transferencia
export { default as RegistroTransferencia } from './predio/transferencia/RegistroTransferencia';
export { ConsultaTransferencia } from './predio/transferencia/ConsultaTransferencia';
export { default as ReporteAlcabala } from './predio/transferencia/ReporteAlcabala';


// 🎯 NUEVOS COMPONENTES DE CAJA
export { default as AperturaCajaComponent } from './caja/AperturaCaja';
export { default as Pagos } from './caja/Pagos';

// Componentes de Consultas de Caja
export { default as PorFecha } from './caja/consultas/PorFecha';
export { default as PorContribuyente } from './caja/consultas/PorContribuyente';
export { default as PorNumeroRecibo } from './caja/consultas/PorNumeroRecibo';

// Componentes de Mantenedores de Caja
export { default as Cajas } from './caja/mantenedores/Cajas';
export { default as Turnos } from './caja/mantenedores/Turnos';
export { default as AsignacionCajaComponent } from './caja/AsignacionCaja';



// También exportar los tipos para uso externo
export type { AperturaCajaData } from './caja/AperturaCaja';

// Exportación de componentes de Escalas
export { default as RegistroTIM } from './escalas/RegistroTIM';
export { default as Vencimiento } from './escalas/Vencimiento';
export { default as Interes } from './escalas/Interes';


export { default as Options } from './usuarios/Options';

// Exportación de componentes de Cuenta Corriente
export { default as CuentaList } from './cuenta/CuentaList';

// Exportaciones adicionales para compatibilidad con páginas de mantenedores
export { default as BarrioComponent } from './barrio/BarrioForm';
export { default as CalleComponent } from './calles/CalleForm';
export { default as SectorComponent } from './sector/SectorForm';

// Exportación de componentes de Fraccionamiento
export { default as SolicitudFraccionamiento } from './fraccionamiento/SolicitudFraccionamiento';
export { default as ConsultaFraccionamiento } from './fraccionamiento/ConsultaFraccionamiento';
export { default as AprobacionFraccionamiento } from './fraccionamiento/AprobacionFraccionamiento';
export { default as Cronograma } from './fraccionamiento/Cronograma';
export { default as ReportesFraccionamiento } from './fraccionamiento/ReportesFraccionamiento';
