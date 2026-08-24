import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import { logger } from "../../utils/logger";
import type { ContribuyenteFormValues } from "./contribuyenteForm.types";
import { toPersonaPayload } from "./contribuyenteForm.adapters";

async function savePerson(data: ContribuyenteFormValues, juridica: boolean) {
  const { personaService } = await import("../../services/personaService");
  const payload = toPersonaPayload(data, juridica);
  const person = data.codPersona
    ? {
        ...(await personaService.actualizarPersonaAPI({
          ...payload,
          codPersona: data.codPersona,
        })),
        codPersona: data.codPersona,
      }
    : await personaService.crearPersonaAPI(payload);
  if (!person?.codPersona) {
    logger.error(
      "[useContribuyenteForm] La respuesta no contiene código de persona:",
      person,
    );
    throw new Error(
      "Error al crear persona principal: El servidor no retornó un código de persona válido.",
    );
  }
  return person;
}

export async function persistContributor(
  main: ContribuyenteFormValues,
  related: ContribuyenteFormValues | null,
  juridica: boolean,
) {
  const mainPerson = await savePerson(main, juridica);
  let relatedPersonId: number | null = null;
  if (related?.numeroDocumento && (related.nombres || related.razonSocial)) {
    relatedPersonId = (await savePerson(related, false)).codPersona;
  }
  const { contribuyenteService } =
    await import("../../services/contribuyenteService");
  const contributor = await contribuyenteService.crearContribuyenteAPI({
    codPersona: mainPerson.codPersona,
    codConyuge: relatedPersonId,
    codRepresentanteLegal: juridica ? relatedPersonId : null,
    codestado: "0201",
    codUsuario: getAuthenticatedUserCode(),
    esExonerado: Boolean(main.esExonerado),
    esPensionista: Boolean(main.esPensionista),
  });
  if (!contributor) throw new Error("Error al crear contribuyente");
  return {
    persona: mainPerson,
    contribuyente: contributor,
    conyugeRepresentante: relatedPersonId,
  };
}
