import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useEstadoCivilOptions,
  useSexoOptions,
  useTipoContribuyenteOptions,
  useTipoDocumentoOptions,
} from "../../../hooks/useConstantesOptions";
import { usePersonas } from "../../../hooks/usePersonas";
import type { PersonaData } from "../../../services/personaService";
import type { ContribuyenteDireccion } from "../../../types/formTypes";
import { getAuthenticatedUserCode } from "../../../config/api.unified.config";
import {
  buildFullAddress,
  buildPersonaPayload,
  createEmptyPersonaFormValues,
  getAvailableOptionValue,
  getDocumentoConfig,
  getPersonaAddress,
  mapPersonaToForm,
  normalizeDocumentNumber,
  sortDocumentOptions,
} from "./personaForm.adapters";
import type {
  ConsultaStatus,
  PersonaFormController,
  PersonaFormProps,
  PersonaFormValues,
} from "./personaForm.types";

export const usePersonaMaintenanceForm = ({
  persona,
  onSaved,
}: PersonaFormProps): PersonaFormController => {
  const {
    crearPersona,
    actualizarPersona,
    isCreating,
    isUpdating,
    validarDocumento,
    listarPersona,
  } = usePersonas();
  const [values, setValues] = useState<PersonaFormValues>(
    createEmptyPersonaFormValues,
  );
  const [error, setError] = useState("");
  const [personaEnEdicion, setPersonaEnEdicion] = useState<PersonaData | null>(
    persona ?? null,
  );
  const [consultandoDocumento, setConsultandoDocumento] = useState(false);
  const [mensajeConsulta, setMensajeConsulta] = useState("");
  const [estadoConsulta, setEstadoConsulta] = useState<ConsultaStatus>(null);
  const [selectorDireccionesOpen, setSelectorDireccionesOpen] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] =
    useState<ContribuyenteDireccion | null>(null);
  const ultimaConsultaRef = useRef("");
  const consultaActivaRef = useRef(0);

  const isJuridica = values.codTipopersona === "0302";
  const { options: tiposPersona } = useTipoContribuyenteOptions();
  const { options: documentos } = useTipoDocumentoOptions(isJuridica);
  const { options: estadosCiviles } = useEstadoCivilOptions();
  const { options: sexos } = useSexoOptions();
  const documentosOrdenados = useMemo(
    () => sortDocumentOptions(documentos),
    [documentos],
  );
  const documentoConfig = useMemo(
    () => getDocumentoConfig(documentos, values.codTipoDocumento),
    [documentos, values.codTipoDocumento],
  );

  const loadPersona = useCallback((found: PersonaData): void => {
    setValues(mapPersonaToForm(found));
    setDireccionSeleccionada(getPersonaAddress(found));
  }, []);

  useEffect(() => {
    consultaActivaRef.current += 1;
    ultimaConsultaRef.current = "";
    setMensajeConsulta("");
    setEstadoConsulta(null);
    setPersonaEnEdicion(persona ?? null);
    if (persona) loadPersona(persona);
    else {
      setValues(createEmptyPersonaFormValues());
      setDireccionSeleccionada(null);
    }
  }, [loadPersona, persona]);

  const consultarDocumento = useCallback(async (): Promise<void> => {
    const documentType = values.codTipoDocumento;
    const documentNumber = values.numerodocumento.trim();
    if (
      !documentType ||
      !documentNumber ||
      !validarDocumento(documentType, documentNumber).valido
    )
      return;

    const queryKey = `${documentType}:${documentNumber}`;
    if (ultimaConsultaRef.current === queryKey) return;
    ultimaConsultaRef.current = queryKey;
    const currentRequest = ++consultaActivaRef.current;
    setConsultandoDocumento(true);
    setMensajeConsulta("");
    setEstadoConsulta(null);

    try {
      const found = (await listarPersona(documentType, documentNumber))[0];
      if (currentRequest !== consultaActivaRef.current) return;
      if (found) {
        setPersonaEnEdicion(found);
        loadPersona(found);
        setMensajeConsulta(
          `Persona encontrada. El formulario está en modo edición (código ${found.codPersona}).`,
        );
        setEstadoConsulta("success");
      } else {
        setPersonaEnEdicion(null);
        setDireccionSeleccionada(null);
        setValues({
          ...createEmptyPersonaFormValues(),
          codTipopersona: values.codTipopersona,
          codTipoDocumento: documentType,
          numerodocumento: documentNumber,
        });
        setMensajeConsulta(
          "No existe una persona con este documento. Puede continuar con el registro.",
        );
        setEstadoConsulta("info");
      }
    } catch (queryError: unknown) {
      if (currentRequest !== consultaActivaRef.current) return;
      ultimaConsultaRef.current = "";
      setMensajeConsulta(
        queryError instanceof Error
          ? queryError.message
          : "No se pudo consultar el documento. Verifique la conexión e intente nuevamente.",
      );
      setEstadoConsulta("error");
    } finally {
      if (currentRequest === consultaActivaRef.current)
        setConsultandoDocumento(false);
    }
  }, [
    listarPersona,
    loadPersona,
    validarDocumento,
    values.codTipoDocumento,
    values.codTipopersona,
    values.numerodocumento,
  ]);

  useEffect(() => {
    if (
      !validarDocumento(values.codTipoDocumento, values.numerodocumento.trim())
        .valido
    )
      return;
    const timer = window.setTimeout(() => void consultarDocumento(), 500);
    return () => window.clearTimeout(timer);
  }, [
    consultarDocumento,
    validarDocumento,
    values.codTipoDocumento,
    values.numerodocumento,
  ]);

  const setField = (field: keyof PersonaFormValues, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const resetDocumentQuery = (): void => {
    consultaActivaRef.current += 1;
    ultimaConsultaRef.current = "";
    setConsultandoDocumento(false);
    setMensajeConsulta("");
    setEstadoConsulta(null);
  };

  const setTipoPersona = (value: string): void => {
    resetDocumentQuery();
    setPersonaEnEdicion(null);
    setDireccionSeleccionada(null);
    setValues({
      ...createEmptyPersonaFormValues(),
      codTipopersona: value,
      codTipoDocumento: "",
    });
  };

  const cambiarTipoDocumento = (value: string): void => {
    resetDocumentQuery();
    setPersonaEnEdicion(null);
    setDireccionSeleccionada(null);
    setValues((current) => ({
      ...createEmptyPersonaFormValues(),
      codTipopersona: current.codTipopersona,
      codTipoDocumento: value,
    }));
  };

  const cambiarNumeroDocumento = (value: string): void => {
    const normalized = normalizeDocumentNumber(
      value,
      documentoConfig.maxLength,
    );
    if (normalized !== values.numerodocumento) resetDocumentQuery();
    if (personaEnEdicion && normalized !== personaEnEdicion.numerodocumento) {
      setPersonaEnEdicion(null);
      setDireccionSeleccionada(null);
      setValues((current) => ({
        ...createEmptyPersonaFormValues(),
        codTipopersona: current.codTipopersona,
        codTipoDocumento: current.codTipoDocumento,
        numerodocumento: normalized,
      }));
      return;
    }
    setField("numerodocumento", normalized);
  };

  const limpiar = (): void => {
    resetDocumentQuery();
    setValues(createEmptyPersonaFormValues());
    setPersonaEnEdicion(null);
    setDireccionSeleccionada(null);
    setSelectorDireccionesOpen(false);
    setError("");
  };

  const guardar = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError("");
    if (!values.numerodocumento || !values.nombres) {
      setError("Complete el documento y el nombre o razón social.");
      return;
    }
    const validation = validarDocumento(
      values.codTipoDocumento,
      values.numerodocumento,
    );
    if (!validation.valido) {
      setError(validation.mensaje || "Documento inválido.");
      return;
    }
    const payload = buildPersonaPayload(
      values,
      direccionSeleccionada,
      getAuthenticatedUserCode(),
    );
    try {
      if (personaEnEdicion?.codPersona)
        await actualizarPersona({
          ...payload,
          codPersona: personaEnEdicion.codPersona,
        });
      else await crearPersona(payload);
      limpiar();
      onSaved();
    } catch {
      // El hook de mutación muestra el mensaje del API.
    }
  };

  return {
    values,
    catalogs: {
      tiposPersona,
      documentos: documentosOrdenados,
      estadosCiviles,
      sexos,
    },
    selections: {
      documento: getAvailableOptionValue(documentos, values.codTipoDocumento),
      tipoPersona: getAvailableOptionValue(tiposPersona, values.codTipopersona),
      estadoCivil: getAvailableOptionValue(
        estadosCiviles,
        values.codestadocivil,
      ),
      sexo: getAvailableOptionValue(sexos, values.codsexo),
    },
    documentoConfig,
    personaEnEdicion,
    direccionSeleccionada,
    direccionCompleta: buildFullAddress(
      direccionSeleccionada,
      values.nFinca,
      values.otroNumero,
    ),
    error,
    mensajeConsulta,
    estadoConsulta,
    selectorDireccionesOpen,
    isJuridica,
    consultandoDocumento,
    submitting: isCreating || isUpdating || consultandoDocumento,
    setField,
    setTipoPersona,
    cambiarTipoDocumento,
    cambiarNumeroDocumento,
    consultarDocumento,
    setDireccionSeleccionada,
    setSelectorDireccionesOpen,
    limpiar,
    guardar,
  };
};
