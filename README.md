# Rentas MDE

Aplicación web para la gestión de rentas municipales: contribuyentes, predios, pisos, cuenta corriente, caja, fraccionamientos, coactiva, mantenedores y administración.

## Requisitos

- Node.js 20 o superior.
- pnpm 11. El proyecto usa exclusivamente `pnpm-lock.yaml`.
- Acceso al backend mediante una URL del navegador o el proxy de desarrollo.

Si `pnpm` no está disponible:

```powershell
corepack enable
corepack prepare pnpm@11.19.0 --activate
```

## Configuración

Copie `.env.example` como `.env`. Para desarrollo se recomienda mantener las
peticiones del navegador en el mismo origen y configurar únicamente el destino
interno del proxy de Vite:

```env
VITE_API_URL=
API_PROXY_TARGET=http://localhost:8085
```

El destino HTTP anterior es válido únicamente entre el servidor local de Vite y
el backend de desarrollo; el navegador no lo recibe ni lo utiliza directamente.

`VITE_API_URL` y `API_PROXY_TARGET` cumplen funciones diferentes:

- `VITE_API_URL`: base visible y utilizada por el navegador. Déjela vacía para
  rutas `/api` y `/auth` del mismo origen, o configure una URL HTTPS absoluta si
  el backend permite CORS.
- `API_PROXY_TARGET`: destino privado usado solamente por el servidor de
  desarrollo de Vite. No se incorpora al bundle del navegador.

En producción HTTPS, use una API HTTPS o un proxy inverso del mismo origen. No
publique secretos en variables `VITE_*`, porque forman parte del código del navegador.
El build rechaza expresamente cualquier `VITE_API_URL` que comience con
`http://` cuando se ejecuta en modo producción.

## Comandos

```powershell
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm preview
```

El servidor de desarrollo se publica por defecto en `http://localhost:3000`.

## Arquitectura

- `src/pages`: páginas cargadas de manera diferida por ruta.
- `src/components`: formularios, tablas, modales y componentes por dominio.
- `src/hooks`: estado de React Query y lógica reutilizable.
- `src/services`: acceso al backend.
- `src/config/api.unified.config.ts`: única fuente para URL, headers y autenticación de API.
- `src/routes/AppRouter.tsx`: rutas y autorización por rol.

React Query es la única caché de datos del cliente. `BaseApiService` centraliza peticiones, autenticación, timeout y reintentos seguros, pero no mantiene una segunda caché.

## Autenticación

El frontend acepta token Bearer y solicitudes con cookies mediante `credentials: include`. La opción recomendada para producción es que el backend use cookies `HttpOnly`, `Secure` y `SameSite`, además de implementar `/auth/refresh` y `/auth/logout`.

## Pruebas y calidad

Las pruebas se ejecutan con Vitest e incluyen contratos de servicios, política de reintentos y utilidades de dominio:

```powershell
pnpm test
```

Antes de entregar cambios se debe ejecutar:

```powershell
pnpm lint
pnpm build
```

Las rutas cuyo backend o interfaz aún no existe muestran explícitamente “módulo no disponible”; nunca reutilizan el dashboard con datos de demostración.

## Build de producción

El build elimina `console.*`, `debugger` y sourcemaps públicos. Las páginas, gráficos y herramientas PDF se dividen en chunks para reducir la descarga inicial.
