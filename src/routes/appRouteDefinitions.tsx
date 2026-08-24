import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  AlcabalaPage,
  ArancelesPage,
  ArbitriosPage,
  AsignacionPredioPage,
  AuditoriaPage,
  BarriosPage,
  CajaPage,
  CajasPage,
  CallePage,
  CoactivaPage,
  ConsultaAsignacionPage,
  ConsultaContribuyente,
  ConsultaFraccionamientoPage,
  ConsultaPisosPage,
  ConsultaPredioPage,
  ConsultaPUHRPage,
  ConsultasCaja,
  CronogramaPage,
  DeduccionBeneficioPage,
  DepreciacionPage,
  DireccionesPage,
  ExpedientePage,
  InteresPage,
  IPMPage,
  NotificacionesPage,
  NuevoContribuyente,
  NuevoPredio,
  PersonaPage,
  PermisosPage,
  RegistroPisoPage,
  RegistroTIMPage,
  ReporteAlcabalaPage,
  ReportesPage,
  RespaldoPage,
  ResolucionesPage,
  ResolucionInteresPage,
  RolesPage,
  SectoresPage,
  SolicitudFraccionamientoPage,
  TransferenciaAlcabalaPage,
  UitPage,
  UsersPage,
  UsuariosPage,
  ValoresUnitariosPage,
  VencimientoPage,
} from "../pages/lazy";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import {
  ADMIN_ROLES,
  AUDIT_ROLES,
  AUTHENTICATED_ROLES,
  CASH_MANAGEMENT_ROLES,
  CASH_OPERATION_ROLES,
  COACTIVE_COLLECTION_ROLES,
  TAX_MANAGEMENT_ROLES,
  TAX_OPERATION_ROLES,
  TAX_READ_ROLES,
} from "../config/accessControl";

const CuentaConsultaPage = lazyWithRetry(
  "cuenta-corriente",
  () => import("../pages/cuenta/CuentaConsultaPage"),
);
const AsignacionCajaPage = lazyWithRetry(
  "asignacion-caja",
  () => import("../pages/caja/AsignacionCajaPage"),
);
const ModuleUnavailablePage = lazyWithRetry(
  "modulo-no-disponible",
  () => import("../pages/ModuleUnavailablePage"),
);

export interface AppRouteDefinition {
  path: string;
  element: ReactNode;
  allowedRoles: readonly string[];
}
const route = (
  path: string,
  element: ReactNode,
  allowedRoles: readonly string[],
): AppRouteDefinition => ({ path, element, allowedRoles });

export const CONTRIBUTOR_PROPERTY_ROUTES: AppRouteDefinition[] = [
  route("/contribuyente/nuevo", <NuevoContribuyente />, TAX_OPERATION_ROLES),
  route(
    "/contribuyente/editar/:id",
    <NuevoContribuyente />,
    TAX_OPERATION_ROLES,
  ),
  route("/contribuyente/consulta", <ConsultaContribuyente />, TAX_READ_ROLES),
  route(
    "/contribuyente/deduccion-beneficio",
    <DeduccionBeneficioPage />,
    TAX_OPERATION_ROLES,
  ),
  route("/predio/nuevo", <NuevoPredio />, TAX_OPERATION_ROLES),
  route(
    "/predio/editar/:anio/:codPredio",
    <NuevoPredio />,
    TAX_OPERATION_ROLES,
  ),
  route("/predio/consulta", <ConsultaPredioPage />, TAX_READ_ROLES),
  route(
    "/predio/asignacion/nuevo",
    <AsignacionPredioPage />,
    TAX_OPERATION_ROLES,
  ),
  route(
    "/predio/asignacion/consulta",
    <ConsultaAsignacionPage />,
    TAX_READ_ROLES,
  ),
  route("/predio/pisos/registro", <RegistroPisoPage />, TAX_OPERATION_ROLES),
  route("/predio/pisos/consulta", <ConsultaPisosPage />, TAX_READ_ROLES),
  route("/predio/puhr/consulta-pu-hr", <ConsultaPUHRPage />, TAX_READ_ROLES),
  route(
    "/predio/transferencia/alcabala",
    <TransferenciaAlcabalaPage />,
    TAX_OPERATION_ROLES,
  ),
  route(
    "/predio/transferencia/reporte-alcabala",
    <ReporteAlcabalaPage />,
    TAX_READ_ROLES,
  ),
  route("/persona/nueva", <PersonaPage />, TAX_OPERATION_ROLES),
  route("/persona/consulta", <PersonaPage />, TAX_READ_ROLES),
];

export const COLLECTION_ROUTES: AppRouteDefinition[] = [
  ...["apertura", "cierre", "cobro", "movimiento"].map((action) =>
    route(`/caja/${action}`, <CajaPage />, CASH_OPERATION_ROLES),
  ),
  route("/caja/asignacion", <AsignacionCajaPage />, CASH_MANAGEMENT_ROLES),
  route("/caja/consultas", <ConsultasCaja />, CASH_OPERATION_ROLES),
  route(
    "/cuenta-corriente/cargo/nuevo",
    <ModuleUnavailablePage title="Nuevo cargo" />,
    TAX_OPERATION_ROLES,
  ),
  route(
    "/cuenta-corriente/abono/nuevo",
    <ModuleUnavailablePage title="Nuevo abono" />,
    TAX_OPERATION_ROLES,
  ),
  route("/cuenta-corriente/consulta", <CuentaConsultaPage />, TAX_READ_ROLES),
  ...["contribuyentes", "predios", "cuentas", "recaudacion"].map((report) =>
    route(`/reportes/${report}`, <ReportesPage />, TAX_READ_ROLES),
  ),
  route(
    "/fraccionamiento/solicitud",
    <SolicitudFraccionamientoPage />,
    TAX_OPERATION_ROLES,
  ),
  route(
    "/fraccionamiento/nuevo",
    <SolicitudFraccionamientoPage />,
    TAX_OPERATION_ROLES,
  ),
  route(
    "/fraccionamiento/consulta",
    <ConsultaFraccionamientoPage />,
    TAX_READ_ROLES,
  ),
  route(
    "/fraccionamiento/cronograma",
    <CronogramaPage />,
    TAX_MANAGEMENT_ROLES,
  ),
  route(
    "/fraccionamiento/cronograma/:id",
    <CronogramaPage />,
    TAX_MANAGEMENT_ROLES,
  ),
  route("/coactiva", <CoactivaPage />, COACTIVE_COLLECTION_ROLES),
  route("/coactiva/expedientes", <ExpedientePage />, COACTIVE_COLLECTION_ROLES),
  route(
    "/coactiva/resoluciones",
    <ResolucionesPage />,
    COACTIVE_COLLECTION_ROLES,
  ),
  route(
    "/coactiva/notificaciones",
    <NotificacionesPage />,
    COACTIVE_COLLECTION_ROLES,
  ),
];

export const MAINTENANCE_ROUTES: AppRouteDefinition[] = [
  route("/mantenedores/sectores", <SectoresPage />, TAX_MANAGEMENT_ROLES),
  route("/mantenedores/barrios", <BarriosPage />, TAX_MANAGEMENT_ROLES),
  route("/mantenedores/direcciones", <DireccionesPage />, TAX_MANAGEMENT_ROLES),
  route("/mantenedores/calles", <CallePage />, TAX_MANAGEMENT_ROLES),
  route("/mantenedores/aranceles", <ArancelesPage />, TAX_MANAGEMENT_ROLES),
  route(
    "/mantenedores/valores-unitarios",
    <ValoresUnitariosPage />,
    TAX_MANAGEMENT_ROLES,
  ),
  route(
    "/mantenedores/resolucion-interes",
    <ResolucionInteresPage />,
    TAX_MANAGEMENT_ROLES,
  ),
  route("/mantenedores/uit", <UitPage />, TAX_MANAGEMENT_ROLES),
  route("/mantenedores/ipm", <IPMPage />, TAX_MANAGEMENT_ROLES),
  route("/mantenedores/alcabala", <AlcabalaPage />, TAX_MANAGEMENT_ROLES),
  route(
    "/mantenedores/depreciacion",
    <DepreciacionPage />,
    TAX_MANAGEMENT_ROLES,
  ),
  route("/mantenedores/arbitrios", <ArbitriosPage />, TAX_MANAGEMENT_ROLES),
  route("/mantenedores/caja/cajas", <CajasPage />, ADMIN_ROLES),
  route(
    "/mantenedores/escalas/registro-tim",
    <RegistroTIMPage />,
    TAX_MANAGEMENT_ROLES,
  ),
  route(
    "/mantenedores/escalas/vencimiento",
    <VencimientoPage />,
    TAX_MANAGEMENT_ROLES,
  ),
  route("/mantenedores/escalas/interes", <InteresPage />, TAX_MANAGEMENT_ROLES),
];

export const SYSTEM_ROUTES: AppRouteDefinition[] = [
  route("/sistema/usuarios", <UsuariosPage />, ADMIN_ROLES),
  route("/sistema/roles", <RolesPage />, ADMIN_ROLES),
  route("/sistema/permisos", <PermisosPage />, ADMIN_ROLES),
  route(
    "/sistema/configuracion",
    <ModuleUnavailablePage
      title="Configuración del sistema en restauración"
      description="Este módulo aún no está conectado de forma segura a la configuración real del sistema."
    />,
    ADMIN_ROLES,
  ),
  route("/sistema/auditoria", <AuditoriaPage />, AUDIT_ROLES),
  route("/sistema/respaldo", <RespaldoPage />, ADMIN_ROLES),
  ...["crear-cuenta", "consulta", "recuperar-password", "otras-opciones"].map(
    (action) => route(`/usuarios/${action}`, <UsersPage />, ADMIN_ROLES),
  ),
  ...["", "/importar", "/exportar", "/historial"].map((action) =>
    route(
      `/migracion${action}`,
      <ModuleUnavailablePage title="Migración de datos" />,
      ADMIN_ROLES,
    ),
  ),
  route(
    "/perfil",
    <ModuleUnavailablePage title="Perfil de usuario" />,
    AUTHENTICATED_ROLES,
  ),
  route(
    "/configuracion",
    <Navigate to="/sistema/configuracion" replace />,
    ADMIN_ROLES,
  ),
  route(
    "/buscar",
    <ModuleUnavailablePage title="Búsqueda global" />,
    AUTHENTICATED_ROLES,
  ),
];

export const PROTECTED_APP_ROUTES = [
  ...CONTRIBUTOR_PROPERTY_ROUTES,
  ...COLLECTION_ROUTES,
  ...MAINTENANCE_ROUTES,
  ...SYSTEM_ROUTES,
];
