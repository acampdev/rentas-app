// src/routes/AppRouter.tsx - Versión actualizada con Material-UI
import React, { lazy, Suspense } from 'react';
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
  ReportesCajaPage,
  RegistroTIMPage,
  VencimientoPage,
  InteresPage,
  ReportesPage,
  SolicitudFraccionamientoPage,
  ConsultaFraccionamientoPage,
  AprobacionFraccionamientoPage,
  CronogramaPage,
  ReportesFraccionamientoPage,
  ResolucionInteresPage,
  UsuariosPage,
  RolesPage,
  PermisosPage,
  ConfiguracionPage,
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

// Importar página de cuenta corriente
const CuentaConsultaPage = lazy(() => import('../pages/cuenta/CuentaConsultaPage'));

// Importar página de asignación de caja
const AsignacionCajaPage = lazy(() => import('../pages/caja/AsignacionCajaPage'));

// Providers y contextos
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { SidebarProvider } from '../context/SidebarContext';
import { CommandProvider } from '../context/CommandContext';
import MuiThemeProviderWrapper from '../providers/MuiThemeProvider';


// Componentes de autenticación
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const ModuleUnavailablePage = lazy(() => import('../pages/ModuleUnavailablePage'));
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthHandler from '../components/auth/AuthHandler';

// Sistema de notificaciones
import NotificationContainer from '../components/utils/Notification';

const ADMIN_ROLES = ['ADMINISTRADOR'] as const;
const CASH_OPERATION_ROLES = ['CAJERO', 'SUPERVISOR'] as const;
const CASH_MANAGEMENT_ROLES = ['SUPERVISOR'] as const;
const CASH_REPORT_ROLES = ['CAJERO', 'SUPERVISOR', 'GERENTE'] as const;
const AUDIT_ROLES = ['AUDITOR', 'GERENTE'] as const;

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MuiThemeProviderWrapper>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <CommandProvider>
              <SidebarProvider>
                <Router>
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
                    <ProtectedRoute>
                      <DemoPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de contribuyente */}
                  <Route path="/contribuyente/nuevo" element={
                    <ProtectedRoute>
                      <NuevoContribuyente />
                    </ProtectedRoute>
                  } />
                  <Route path="/contribuyente/editar/:id" element={
                    <ProtectedRoute>
                      <NuevoContribuyente />
                    </ProtectedRoute>
                  } />
                  <Route path="/contribuyente/consulta" element={
                    <ProtectedRoute>
                      <ConsultaContribuyente />
                    </ProtectedRoute>
                  } />
                  <Route path="/contribuyente/deduccion-beneficio" element={
                    <ProtectedRoute>
                      <DeduccionBeneficioPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de predio */}
                  <Route path="/predio/nuevo" element={
                    <ProtectedRoute>
                      <NuevoPredio />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/editar/:anio/:codPredio" element={
                    <ProtectedRoute>
                      <NuevoPredio />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/consulta" element={
                    <ProtectedRoute>
                      <ConsultaPredioPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/asignacion/nuevo" element={
                    <ProtectedRoute>
                      <AsignacionPredioPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/asignacion/consulta" element={
                    <ProtectedRoute>
                      <ConsultaAsignacionPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de pisos */}
                  <Route path="/predio/pisos/registro" element={
                    <ProtectedRoute>
                      <RegistroPisoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/pisos/consulta" element={
                    <ProtectedRoute>
                      <ConsultaPisosPage />
                    </ProtectedRoute>
                  } />

                  {/* Ruta PU-HR */}
                  <Route path="/predio/puhr/consulta-pu-hr" element={
                    <ProtectedRoute>
                      <ConsultaPUHRPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Transferencia */}
                  <Route path="/predio/transferencia/alcabala" element={
                    <ProtectedRoute>
                      <TransferenciaAlcabalaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/predio/transferencia/reporte-alcabala" element={
                    <ProtectedRoute>
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
                  <Route path="/caja/reportes" element={
                    <ProtectedRoute allowedRoles={CASH_REPORT_ROLES}>
                      <ReportesCajaPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Cuenta Corriente */}
                  <Route path="/cuenta-corriente/cargo/nuevo" element={
                    <ProtectedRoute>
                      <ModuleUnavailablePage title="Nuevo cargo" />
                    </ProtectedRoute>
                  } />
                  <Route path="/cuenta-corriente/abono/nuevo" element={
                    <ProtectedRoute>
                      <ModuleUnavailablePage title="Nuevo abono" />
                    </ProtectedRoute>
                  } />
                  <Route path="/cuenta-corriente/consulta" element={
                    <ProtectedRoute>
                      <CuentaConsultaPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Reportes */}
                  <Route path="/reportes/contribuyentes" element={
                    <ProtectedRoute>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes/predios" element={
                    <ProtectedRoute>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes/cuentas" element={
                    <ProtectedRoute>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes/recaudacion" element={
                    <ProtectedRoute>
                      <ReportesPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas de Fraccionamiento */}
                  <Route path="/fraccionamiento/solicitud" element={
                    <ProtectedRoute>
                      <SolicitudFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/nuevo" element={
                    <ProtectedRoute>
                      <SolicitudFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/consulta" element={
                    <ProtectedRoute>
                      <ConsultaFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/aprobacion" element={
                    <ProtectedRoute>
                      <AprobacionFraccionamientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/cronograma" element={
                    <ProtectedRoute>
                      <CronogramaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/cronograma/:id" element={
                    <ProtectedRoute>
                      <CronogramaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/fraccionamiento/reportes" element={
                    <ProtectedRoute>
                      <ReportesFraccionamientoPage />
                    </ProtectedRoute>
                  } />

                  {/* Rutas coactiva */}
                  <Route path="/coactiva" element={
                    <ProtectedRoute>
                      <CoactivaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/coactiva/expedientes" element={
                    <ProtectedRoute>
                      <ExpedientePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/coactiva/resoluciones" element={
                    <ProtectedRoute>
                      <ResolucionesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/coactiva/notificaciones" element={
                    <ProtectedRoute>
                      <NotificacionesPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rutas de mantenedores - Ubicación */}
                  <Route path="/mantenedores/sectores" element={
                    <ProtectedRoute>
                      <SectoresPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/mantenedores/barrios" element={
                    <ProtectedRoute>
                      <BarriosPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/direcciones" element={
                    <ProtectedRoute>
                      <DireccionesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/calles" element={
                    <ProtectedRoute>
                      <CallePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rutas de mantenedores - Aranceles */}
                  <Route path="/mantenedores/aranceles" element={
                    <ProtectedRoute>
                      <ArancelesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/valores-unitarios" element={
                    <ProtectedRoute>
                      <ValoresUnitariosPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rutas de mantenedores - Tarifas */}
                  <Route path="/mantenedores/resolucion-interes" element={
                    <ProtectedRoute>
                      <ResolucionInteresPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/uit" element={
                    <ProtectedRoute>
                      <UitPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/alcabala" element={
                    <ProtectedRoute>
                      <AlcabalaPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/depreciacion" element={
                    <ProtectedRoute>
                      <DepreciacionPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/arbitrios" element={
                    <ProtectedRoute>
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
                    <ProtectedRoute>
                      <RegistroTIMPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/escalas/vencimiento" element={
                    <ProtectedRoute>
                      <VencimientoPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mantenedores/escalas/interes" element={
                    <ProtectedRoute>
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
                      <ConfiguracionPage />
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
                  <Route path="/persona/nueva" element={<ProtectedRoute><PersonaPage /></ProtectedRoute>} />
                  <Route path="/persona/consulta" element={<ProtectedRoute><PersonaPage /></ProtectedRoute>} />
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
                    <ProtectedRoute>
                      <ModuleUnavailablePage title="Perfil de usuario" />
                    </ProtectedRoute>
                  } />
                  <Route path="/configuracion" element={
                    <ProtectedRoute>
                      <Navigate to="/sistema/configuracion" replace />
                    </ProtectedRoute>
                  } />
                  <Route path="/buscar" element={
                    <ProtectedRoute>
                      <ModuleUnavailablePage title="Búsqueda global" />
                    </ProtectedRoute>
                  } />

                  {/* Ruta 404 */}
                  <Route path="*" element={
                    <ProtectedRoute>
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
