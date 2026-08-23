// src/routes/AppRouter.tsx - Versión actualizada con Material-UI
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';



// Páginas
import {
  DemoPage,
  CallePage,
  NuevoContribuyente,
  SectoresPage,
  BarriosPage,
  DireccionesPage,
  ArancelesPage,
  ValoresUnitariosPage,
  ConsultaContribuyente,
  DeduccionBeneficioPage,
  UitPage,
  IPMPage,
  AlcabalaPage,
  DepreciacionPage,
  ArbitriosPage,
  NuevoPredio,
  ConsultaPredioPage,
  RegistroPisoPage,
  ConsultaPisosPage,
  AsignacionPredioPage,
  ConsultaAsignacionPage,
  ConsultaPUHRPage,
  TransferenciaAlcabalaPage,
  ReporteAlcabalaPage,
  CajaPage,
  ConsultasCaja,
  RegistroTIMPage,
  VencimientoPage,
  InteresPage,
  ReportesPage,
  SolicitudFraccionamientoPage,
  ConsultaFraccionamientoPage,
  AprobacionFraccionamientoPage,
  CronogramaPage,
  ResolucionInteresPage,
  UsuariosPage,
  RolesPage,
  PermisosPage,
  AuditoriaPage,
  RespaldoPage,
  CoactivaPage,
  ExpedientePage,
  ResolucionesPage,
  NotificacionesPage,
  UsersPage,
  CajasPage,
  PersonaPage,
} from '../pages/lazy';
import { lazyWithRetry } from '../utils/lazyWithRetry';

// Importar página de cuenta corriente
const CuentaConsultaPage = lazyWithRetry('cuenta-corriente', () => import('../pages/cuenta/CuentaConsultaPage'));

// Importar página de asignación de caja
const AsignacionCajaPage = lazyWithRetry('asignacion-caja', () => import('../pages/caja/AsignacionCajaPage'));

// Providers y contextos
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { SidebarProvider } from '../context/SidebarContext';
import { CommandProvider } from '../context/CommandContext';
import MuiThemeProviderWrapper from '../providers/MuiThemeProvider';


// Componentes de autenticación
const LoginPage = lazyWithRetry('login', () => import('../pages/Login/LoginPage'));
const ModuleUnavailablePage = lazyWithRetry('modulo-no-disponible', () => import('../pages/ModuleUnavailablePage'));
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthHandler from '../components/auth/AuthHandler';
import RouteErrorBoundary from '../components/utils/RouteErrorBoundary';

// Sistema de notificaciones
import NotificationContainer from '../components/utils/Notification';
import {
  ADMIN_ROLES,
  CASH_OPERATION_ROLES,
  CASH_MANAGEMENT_ROLES,
  AUDIT_ROLES,
  AUTHENTICATED_ROLES,
  TAX_READ_ROLES,
  TAX_OPERATION_ROLES,
  TAX_MANAGEMENT_ROLES,
  COACTIVE_COLLECTION_ROLES
} from '../config/accessControl';

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MuiThemeProviderWrapper>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <CommandProvider>
              <SidebarProvider>
                <Router>
                  <RouteErrorBoundary>
                  {/* Manejador de autenticación automática y notificaciones */}
                  <AuthHandler />

                  {/* Container de notificaciones global */}
                  <NotificationContainer />
                
                <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando módulo…</div>}>
                <Routes>
                  {/* Ruta pública - Login */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Ruta por defecto */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Rutas protegidas - Dashboard */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                      <DemoPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de contribuyente */}
                  <Route path="/contribuyente/nuevo" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <NuevoContribuyente />
                    </ProtectedRoute>
                  } />
                  <Route path="/contribuyente/editar/:id" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <NuevoContribuyente />
                    </ProtectedRoute>
                  } />
                  <Route path="/contribuyente/consulta" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ConsultaContribuyente />
                    </ProtectedRoute>
                  } />
                  <Route path="/contribuyente/deduccion-beneficio" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <DeduccionBeneficioPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de predio */}
                  <Route path="/predio/nuevo" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <NuevoPredio />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/editar/:anio/:codPredio" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <NuevoPredio />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/consulta" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ConsultaPredioPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/asignacion/nuevo" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <AsignacionPredioPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/asignacion/consulta" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ConsultaAsignacionPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de pisos */}
                  <Route path="/predio/pisos/registro" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <RegistroPisoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/pisos/consulta" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ConsultaPisosPage />
                    </ProtectedRoute>
                  } />

                  {/* Ruta PU-HR */}
                  <Route path="/predio/puhr/consulta-pu-hr" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ConsultaPUHRPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Transferencia */}
                  <Route path="/predio/transferencia/alcabala" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <TransferenciaAlcabalaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/transferencia/reporte-alcabala" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ReporteAlcabalaPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Caja */}
                  <Route path="/caja/apertura" element={
                    <ProtectedRoute allowedRoles={CASH_OPERATION_ROLES}>
                      <CajaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/caja/cierre" element={
                    <ProtectedRoute allowedRoles={CASH_OPERATION_ROLES}>
                      <CajaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/caja/cobro" element={
                    <ProtectedRoute allowedRoles={CASH_OPERATION_ROLES}>
                      <CajaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/caja/movimiento" element={
                    <ProtectedRoute allowedRoles={CASH_OPERATION_ROLES}>
                      <CajaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/caja/asignacion" element={
                    <ProtectedRoute allowedRoles={CASH_MANAGEMENT_ROLES}>
                      <AsignacionCajaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/caja/consultas" element={
                    <ProtectedRoute allowedRoles={CASH_OPERATION_ROLES}>
                      <ConsultasCaja />
                    </ProtectedRoute>
                  } />
                  {/* Rutas de Cuenta Corriente */}
                  <Route path="/cuenta-corriente/cargo/nuevo" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <ModuleUnavailablePage title="Nuevo cargo" />
                    </ProtectedRoute>
                  } />
                  <Route path="/cuenta-corriente/abono/nuevo" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <ModuleUnavailablePage title="Nuevo abono" />
                    </ProtectedRoute>
                  } />
                  <Route path="/cuenta-corriente/consulta" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <CuentaConsultaPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Reportes */}
                  <Route path="/reportes/contribuyentes" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes/predios" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes/cuentas" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes/recaudacion" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Fraccionamiento */}
                  <Route path="/fraccionamiento/solicitud" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <SolicitudFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/nuevo" element={
                    <ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}>
                      <SolicitudFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/consulta" element={
                    <ProtectedRoute allowedRoles={TAX_READ_ROLES}>
                      <ConsultaFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/aprobacion" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <AprobacionFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/cronograma" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <CronogramaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/cronograma/:id" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <CronogramaPage />
                    </ProtectedRoute>
                  } />
                  {/* Rutas coactiva */}
                  <Route path="/coactiva" element={
                    <ProtectedRoute allowedRoles={COACTIVE_COLLECTION_ROLES}>
                      <CoactivaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/coactiva/expedientes" element={
                    <ProtectedRoute allowedRoles={COACTIVE_COLLECTION_ROLES}>
                      <ExpedientePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/coactiva/resoluciones" element={
                    <ProtectedRoute allowedRoles={COACTIVE_COLLECTION_ROLES}>
                      <ResolucionesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/coactiva/notificaciones" element={
                    <ProtectedRoute allowedRoles={COACTIVE_COLLECTION_ROLES}>
                      <NotificacionesPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rutas de mantenedores - Ubicación */}
                  <Route path="/mantenedores/sectores" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <SectoresPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/mantenedores/barrios" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <BarriosPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/direcciones" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <DireccionesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/calles" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <CallePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rutas de mantenedores - Aranceles */}
                  <Route path="/mantenedores/aranceles" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <ArancelesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/valores-unitarios" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <ValoresUnitariosPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rutas de mantenedores - Tarifas */}
                  <Route path="/mantenedores/resolucion-interes" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <ResolucionInteresPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/uit" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <UitPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/ipm" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <IPMPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/alcabala" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <AlcabalaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/depreciacion" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <DepreciacionPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/arbitrios" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <ArbitriosPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/caja/cajas" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <CajasPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Escalas */}
                  <Route path="/mantenedores/escalas/registro-tim" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <RegistroTIMPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/escalas/vencimiento" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <VencimientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/escalas/interes" element={
                    <ProtectedRoute allowedRoles={TAX_MANAGEMENT_ROLES}>
                      <InteresPage />
                    </ProtectedRoute>
                  } />

                  
                  {/* Rutas de sistema */}
                  <Route path="/sistema/usuarios" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <UsuariosPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/sistema/roles" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <RolesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/sistema/permisos" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <PermisosPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/sistema/configuracion" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <ModuleUnavailablePage
                        title="Configuración del sistema en restauración"
                        description="Este módulo aún no está conectado de forma segura a la configuración real del sistema. No se muestran valores ficticios ni se habilitan acciones de guardado simuladas."
                      />
                    </ProtectedRoute>
                  } />
                  <Route path="/sistema/auditoria" element={
                    <ProtectedRoute allowedRoles={AUDIT_ROLES}>
                      <AuditoriaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/sistema/respaldo" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <RespaldoPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de usuarios */}
                  <Route path="/persona/nueva" element={<ProtectedRoute allowedRoles={TAX_OPERATION_ROLES}><PersonaPage /></ProtectedRoute>} />
                  <Route path="/persona/consulta" element={<ProtectedRoute allowedRoles={TAX_READ_ROLES}><PersonaPage /></ProtectedRoute>} />
                  <Route path="/usuarios/crear-cuenta" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/usuarios/consulta" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/usuarios/recuperar-password" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/usuarios/otras-opciones" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de migracion */}
                  <Route path="/migracion" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <ModuleUnavailablePage title="Migración de datos" />
                    </ProtectedRoute>
                  } />
                  <Route path="/migracion/importar" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <ModuleUnavailablePage title="Importar datos" />
                    </ProtectedRoute>
                  } />
                  <Route path="/migracion/exportar" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <ModuleUnavailablePage title="Exportar datos" />
                    </ProtectedRoute>
                  } />
                  <Route path="/migracion/historial" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <ModuleUnavailablePage title="Historial de migraciones" />
                    </ProtectedRoute>
                  } />

                  {/* Rutas adicionales */}
                  <Route path="/perfil" element={
                    <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                      <ModuleUnavailablePage title="Perfil de usuario" />
                    </ProtectedRoute>
                  } />
                  <Route path="/configuracion" element={
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                      <Navigate to="/sistema/configuracion" replace />
                    </ProtectedRoute>
                  } />
                  <Route path="/buscar" element={
                    <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                      <ModuleUnavailablePage title="Búsqueda global" />
                    </ProtectedRoute>
                  } />

                  {/* Ruta 404 */}
                  <Route path="*" element={
                    <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
                          <p className="text-gray-600 dark:text-gray-300">Página no encontrada</p>
                        </div>
                      </div>
                    </ProtectedRoute>
                  } />
                </Routes>
                </Suspense>
                  </RouteErrorBoundary>
              </Router>
            </SidebarProvider>
          </CommandProvider>
        </LocalizationProvider>
      </MuiThemeProviderWrapper>
    </ThemeProvider>
  </AuthProvider>
);
};

export default AppRouter;
