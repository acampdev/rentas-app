import { describe, expect, it } from "vitest";
import type { DireccionData } from "../../../services/direccionService";
import {
  filterDirecciones,
  paginateDirecciones,
  sortDirecciones,
} from "./direccionList.adapters";

const rows: DireccionData[] = [
  { id: 2, codigo: 20, descripcion: "Avenida Norte", rutaNombre: "Ruta B" },
  { id: 1, codigo: 10, descripcion: "Calle Centro", zonaNombre: "Zona A" },
];

describe("direccion list adapters", () => {
  it("busca en descripción, ruta, zona y código", () => {
    expect(filterDirecciones(rows, "centro")).toEqual([rows[1]]);
    expect(filterDirecciones(rows, "ruta b")).toEqual([rows[0]]);
    expect(filterDirecciones(rows, "20")).toEqual([rows[0]]);
  });

  it("ordena valores numéricos sin convertir 10 en mayor que 2", () => {
    expect(sortDirecciones(rows, "codigo", "asc")).toEqual([rows[1], rows[0]]);
  });

  it("pagina conservando el orden recibido", () => {
    expect(paginateDirecciones(rows, 1, 1)).toEqual([rows[1]]);
  });
});
