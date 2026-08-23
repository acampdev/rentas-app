import { describe, expect, it } from "vitest";
import type { PersonaData } from "../../services/personaService";
import { adaptarPersonaAFormulario } from "./personaForm.adapters";

describe("adaptador de persona al formulario", () => {
  it("carga los datos y dirección devueltos por el API", () => {
    const persona: PersonaData = {
      codPersona: 17,
      codTipoDocumento: "4101",
      numerodocumento: "12345678",
      nombres: "Silvia",
      apellidopaterno: "Miñano",
      codDireccion: 9,
      direccion: "Urb. Manuel Arévalo",
      lote: 45,
      otros: "Interior 2",
    };
    expect(adaptarPersonaAFormulario(persona, false, "4101", "12345678")).toMatchObject({
      codPersona: 17,
      nombres: "Silvia",
      apellidoPaterno: "Miñano",
      direccion: { id: 9, descripcion: "Urb. Manuel Arévalo" },
      nFinca: "45",
      otroNumero: "Interior 2",
    });
  });
});
