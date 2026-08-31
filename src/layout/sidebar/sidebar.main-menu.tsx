import {
  AccountBalance,
  Assessment,
  Business,
  Dashboard,
  Gavel,
  Home,
  People,
  Receipt,
} from "@mui/icons-material";
import type { SidebarMenuItem } from "./sidebar.types";

export const MAIN_MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
  },
  {
    id: "contribuyentes",
    label: "Contribuyentes",
    icon: <People />,
    subMenuItems: [
      {
        id: "nuevo-contribuyente",
        label: "Registro Contribuyente",
        path: "/contribuyente/nuevo",
      },
      {
        id: "consulta-contribuyente",
        label: "Consulta Contribuyente",
        path: "/contribuyente/consulta",
      },
      {
        id: "deduccion-beneficio",
        label: "Deducción y Beneficio",
        path: "/contribuyente/deduccion-beneficio",
      },
    ],
  },
  {
    id: "predio",
    label: "Predio",
    icon: <Home />,
    subMenuItems: [
      {
        id: "registro-predio",
        label: "Registro Predio",
        path: "/predio/nuevo",
      },
      {
        id: "consulta-predio",
        label: "Consulta Predio",
        path: "/predio/consulta",
      },
      {
        id: "registro-pisos",
        label: "Registro Pisos",
        path: "/predio/pisos/registro",
      },
      {
        id: "consulta-pisos",
        label: "Consulta Pisos",
        path: "/predio/pisos/consulta",
      },
      {
        id: "asignacion-predios",
        label: "Asignación",
        path: "/predio/asignacion/nuevo",
      },
      {
        id: "consulta-asignacion",
        label: "Consulta Asignación",
        path: "/predio/asignacion/consulta",
      },
      {
        id: "subdivicion-predio",
        label: "Subdivisión",
        path: "/predio/subdivicion",
      },
      {
        id: "transferencia-predios",
        label: "Transferencia",
        subMenuItems: [
          {
            id: "transferencias-alcabala",
            label: "Transferencias Alcabala",
            path: "/predio/transferencia/alcabala",
          },
          {
            id: "reporte-alcabala",
            label: "Reporte Alcabala",
            path: "/predio/transferencia/reporte-alcabala",
          },
        ],
      },
    ],
  },
  {
    id: "cuenta-corriente",
    label: "Cuenta Corriente",
    icon: <AccountBalance />,
    subMenuItems: [
      {
        id: "consulta-cuenta",
        label: "Consulta Cuenta",
        path: "/cuenta-corriente/consulta",
      },
    ],
  },
  {
    id: "fraccionamiento",
    label: "Fraccionamiento",
    icon: <Business />,
    subMenuItems: [
      {
        id: "nuevo-fraccionamiento",
        label: "Nuevo",
        path: "/fraccionamiento/nuevo",
      },
      {
        id: "consulta-fraccionamiento",
        label: "Consulta",
        path: "/fraccionamiento/consulta",
      },
      {
        id: "cronograma-fraccionamiento",
        label: "Cronograma",
        path: "/fraccionamiento/cronograma",
      },
    ],
  },
  {
    id: "caja",
    label: "Caja",
    icon: <Receipt />,
    subMenuItems: [
      {
        id: "cajas",
        label: "Caja Mantenedor",
        path: "/mantenedores/caja/cajas",
      },
      {
        id: "asignacion-caja",
        label: "Asignacion de Caja",
        path: "/caja/asignacion",
      },
      { id: "caja", label: "Caja", path: "/caja/apertura" },
      { id: "consultas", label: "Consultas", path: "/caja/consultas" },
    ],
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: <Assessment />,
    subMenuItems: [
      {
        id: "pu-hr",
        label: "Consulta PU-HR",
        path: "/predio/puhr/consulta-pu-hr",
      },
    ],
  },
  {
    id: "coactiva",
    label: "Coactiva",
    icon: <Gavel />,
    subMenuItems: [
      {
        id: "expedientes",
        label: "Expedientes",
        path: "/coactiva/expedientes",
      },
      {
        id: "resoluciones",
        label: "Resoluciones",
        path: "/coactiva/resoluciones",
      },
      {
        id: "notificaciones",
        label: "Notificaciones",
        path: "/coactiva/notificaciones",
      },
    ],
  },
];
