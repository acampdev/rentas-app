import { Suspense } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthHandler from "../components/auth/AuthHandler";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotificationContainer from "../components/utils/Notification";
import RouteErrorBoundary from "../components/utils/RouteErrorBoundary";
import { AUTHENTICATED_ROLES } from "../config/accessControl";
import { AuthProvider } from "../context/AuthContext";
import { CommandProvider } from "../context/CommandContext";
import { SidebarProvider } from "../context/SidebarContext";
import { ThemeProvider } from "../context/ThemeContext";
import { DemoPage } from "../pages/lazy";
import MuiThemeProviderWrapper from "../providers/MuiThemeProvider";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import { PROTECTED_APP_ROUTES } from "./appRouteDefinitions";

const LoginPage = lazyWithRetry(
  "login",
  () => import("../pages/Login/LoginPage"),
);

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center">
    <section className="text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
        404
      </h1>
      <p className="text-gray-600 dark:text-gray-300">Página no encontrada</p>
    </section>
  </main>
);

const ApplicationRoutes = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center">
        Cargando módulo…
      </div>
    }
  >
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
            <DemoPage />
          </ProtectedRoute>
        }
      />
      {PROTECTED_APP_ROUTES.map(({ path, element, allowedRoles }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              {element}
            </ProtectedRoute>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
            <NotFound />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Suspense>
);

const AppRouter = () => (
  <AuthProvider>
    <ThemeProvider>
      <MuiThemeProviderWrapper>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <CommandProvider>
            <SidebarProvider>
              <BrowserRouter>
                <RouteErrorBoundary>
                  <AuthHandler />
                  <NotificationContainer />
                  <ApplicationRoutes />
                </RouteErrorBoundary>
              </BrowserRouter>
            </SidebarProvider>
          </CommandProvider>
        </LocalizationProvider>
      </MuiThemeProviderWrapper>
    </ThemeProvider>
  </AuthProvider>
);

export default AppRouter;
