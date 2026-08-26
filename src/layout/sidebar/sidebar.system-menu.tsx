import {
  Computer,
  ManageAccounts,
  Person,
  Settings,
  SwapVert,
} from "@mui/icons-material";
import type { SidebarMenuItem } from "./sidebar.types";
import { MAINTAINERS_MENU_ITEMS } from "./sidebar.maintainers-menu";

export const SYSTEM_MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: "mantenedores",
    label: "Mantenedores",
    icon: <Settings />,
    subMenuItems: MAINTAINERS_MENU_ITEMS,
  },
  {
    id: "sistema",
    label: "Sistema",
    icon: <Computer />,
    subMenuItems: [
      { id: "auditoria", label: "Auditoría", path: "/sistema/auditoria" },
    ],
  },
  {
    id: "personas",
    label: "Persona",
    icon: <Person />,
    subMenuItems: [
      { id: "nueva-persona", label: "Nueva Persona", path: "/persona/nueva" },
      {
        id: "consulta-persona",
        label: "Consulta Persona",
        path: "/persona/consulta",
      },
    ],
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: <ManageAccounts />,
    subMenuItems: [
      {
        id: "crear-cuenta",
        label: "Crear Cuenta",
        path: "/usuarios/crear-cuenta",
      },
      {
        id: "consulta-usuarios",
        label: "Consulta Usuarios",
        path: "/usuarios/consulta",
      },
      {
        id: "recuperar-password",
        label: "Recuperar Password",
        path: "/usuarios/recuperar-password",
      },
      {
        id: "otras-opciones",
        label: "Otras Opciones",
        path: "/usuarios/otras-opciones",
      },
    ],
  },
  {
    id: "migracion",
    label: "Migración",
    icon: <SwapVert />,
    subMenuItems: [
      { id: "importar", label: "Importar", path: "/migracion/importar" },
      { id: "exportar", label: "Exportar", path: "/migracion/exportar" },
      { id: "historial", label: "Historial", path: "/migracion/historial" },
    ],
  },
];
