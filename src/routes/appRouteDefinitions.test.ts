import { describe, expect, it } from "vitest";
import { getAllowedRolesForPath } from "../config/accessControl";
import { PROTECTED_APP_ROUTES } from "./appRouteDefinitions";

describe("app route definitions", () => {
  it("no contiene rutas duplicadas", () => {
    const paths = PROTECTED_APP_ROUTES.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("mantiene sincronizados los roles explícitos con la matriz central", () => {
    for (const route of PROTECTED_APP_ROUTES) {
      const matrixRoles = getAllowedRolesForPath(route.path);
      expect(
        matrixRoles,
        `Falta regla de acceso para ${route.path}`,
      ).toBeDefined();
      expect([...route.allowedRoles].sort()).toEqual(
        [...(matrixRoles ?? [])].sort(),
      );
    }
  });
});
