import type { SidebarSubMenuItem } from "./sidebar.types";

export const MAINTAINERS_MENU_ITEMS: SidebarSubMenuItem[] = [
  {
    id: "ubicacion",
    label: "Ubicación",
    subMenuItems: [
      {
        id: "sectores-ubicacion",
        label: "Sectores",
        path: "/mantenedores/sectores",
      },
      {
        id: "barrios-ubicacion",
        label: "Barrios",
        path: "/mantenedores/barrios",
      },
      { id: "calles-ubicacion", label: "Calles", path: "/mantenedores/calles" },
      {
        id: "direcciones-ubicacion",
        label: "Direcciones",
        path: "/mantenedores/direcciones",
      },
    ],
  },
  {
    id: "valores",
    label: "Valores",
    subMenuItems: [
      {
        id: "asignacion-arancel",
        label: "Valores Arancelarios",
        path: "/mantenedores/aranceles",
      },
      {
        id: "valoresUnitarios-arancel",
        label: "Valores Unitarios",
        path: "/mantenedores/valores-unitarios",
      },
    ],
  },
  {
    id: "tarifas",
    label: "Tarifas",
    subMenuItems: [
      { id: "uit-epa", label: "UIT - EPA", path: "/mantenedores/uit" },
      { id: "ipm", label: "IPM", path: "/mantenedores/ipm" },
      { id: "arbitrios", label: "Arbitrios", path: "/mantenedores/arbitrios" },
    ],
  },
  {
    id: "escala",
    label: "Escala",
    subMenuItems: [
      { id: "alcabala", label: "Alcabala", path: "/mantenedores/alcabala" },
      {
        id: "depreciacion",
        label: "Depreciación",
        path: "/mantenedores/depreciacion",
      },
      {
        id: "registro-tim",
        label: "Registro TIM",
        path: "/mantenedores/escalas/registro-tim",
      },
      {
        id: "vencimiento",
        label: "Vencimiento",
        path: "/mantenedores/escalas/vencimiento",
      },
      {
        id: "interes",
        label: "Interés",
        path: "/mantenedores/escalas/interes",
      },
    ],
  },
  {
    id: "resolucion-interes-mant",
    label: "Resolución Interés",
    path: "/mantenedores/resolucion-interes",
  },
];
