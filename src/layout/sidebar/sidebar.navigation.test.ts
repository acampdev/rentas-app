import { describe, expect, it } from "vitest";
import type { SidebarMenuItem } from "./sidebar.types";
import {
  findActiveParentIds,
  hasActiveItem,
  isRouteActive,
} from "./sidebar.navigation";
import { SYSTEM_MENU_ITEMS } from "./sidebar.system-menu";

const menu: SidebarMenuItem[] = [
  {
    id: "predio",
    label: "Predio",
    icon: null,
    subMenuItems: [
      {
        id: "transferencia",
        label: "Transferencia",
        subMenuItems: [
          {
            id: "alcabala",
            label: "Alcabala",
            path: "/predio/transferencia/alcabala",
          },
        ],
      },
    ],
  },
];

describe("sidebar navigation", () => {
  it("considera activas las rutas hijas sin confundir prefijos parciales", () => {
    expect(isRouteActive("/predio/consulta/2", "/predio/consulta")).toBe(true);
    expect(isRouteActive("/predios", "/predio")).toBe(false);
  });

  it("detecta actividad de forma recursiva", () => {
    expect(hasActiveItem(menu[0], "/predio/transferencia/alcabala")).toBe(true);
  });

  it("abre todos los antecesores de una ruta anidada", () => {
    expect(findActiveParentIds(menu, "/predio/transferencia/alcabala")).toEqual(
      ["predio", "transferencia"],
    );
  });

  it("no muestra Configuración ni Respaldo en el menú Sistema", () => {
    const sistema = SYSTEM_MENU_ITEMS.find((item) => item.id === "sistema");
    const paths = sistema?.subMenuItems?.map((item) => item.path) ?? [];

    expect(paths).not.toContain("/sistema/configuracion");
    expect(paths).not.toContain("/sistema/respaldo");
    expect(paths).toContain("/sistema/auditoria");
  });
});
