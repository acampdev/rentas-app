import { useEffect, useMemo, useRef, useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { BUSINESS_CODES } from "../../config/constants";
import type { ContribuyenteFormValues } from "../../hooks/useContribuyenteForm";
import { useContribuyentes } from "../../hooks/useContribuyentes";
import {
  useEstadoCivilOptions,
  useSexoOptions,
  useTipoDocumentoOptions,
} from "../../hooks/useConstantesOptions";
import { usePersonas } from "../../hooks/usePersonas";
import { adaptarPersonaAFormulario, limpiarPersonaEncontrada } from "./personaForm.adapters";
import type { EstadoConsultaDocumento } from "./personaForm.types";
import { filtrarTiposDocumento, obtenerConfiguracionDocumento } from "./personaForm.validators";

interface Params {
  form: UseFormReturn<ContribuyenteFormValues>;
  isJuridica: boolean;
}

export const usePersonaFormController = ({ form, isJuridica }: Params) => {
  const tipoDocumento = useWatch({ control: form.control, name: "tipoDocumento" });
  const numeroDocumento = useWatch({ control: form.control, name: "numeroDocumento" });
  const nFinca = useWatch({ control: form.control, name: "nFinca" });
  const otroNumero = useWatch({ control: form.control, name: "otroNumero" });
  const { listarPersona, error: errorPersona } = usePersonas();
  const { error: errorContribuyente } = useContribuyentes();
  const tipoDocumentoCatalogo = useTipoDocumentoOptions(isJuridica);
  const estadoCivil = useEstadoCivilOptions();
  const sexo = useSexoOptions();
  const [consultandoDocumento, setConsultandoDocumento] = useState(false);
  const [mensajeConsulta, setMensajeConsulta] = useState<string | null>(null);
  const [estadoConsulta, setEstadoConsulta] = useState<EstadoConsultaDocumento>("info");
  const ultimaConsultaRef = useRef("");
  const consultaActivaRef = useRef(0);
  const tipoContribuyenteAnterior = useRef(isJuridica);

  const tipoDocumentoOptions = useMemo(
    () => filtrarTiposDocumento(tipoDocumentoCatalogo.options, isJuridica),
    [isJuridica, tipoDocumentoCatalogo.options],
  );
  const documentoConfig = useMemo(
    () => obtenerConfiguracionDocumento(tipoDocumento, tipoDocumentoOptions),
    [tipoDocumento, tipoDocumentoOptions],
  );

  useEffect(() => {
    if (tipoDocumentoCatalogo.loading || !tipoDocumentoOptions.length) return;
    const current = String(form.getValues("tipoDocumento") || "").trim();
    const allowed = tipoDocumentoOptions.some((option) => String(option.value).trim() === current);
    const contributorTypeChanged = tipoContribuyenteAnterior.current !== isJuridica;
    tipoContribuyenteAnterior.current = isJuridica;
    if (allowed && !contributorTypeChanged) return;
    const preferredCode = isJuridica ? BUSINESS_CODES.TIPO_DOCUMENTO.RUC : BUSINESS_CODES.TIPO_DOCUMENTO.DNI;
    const preferred = tipoDocumentoOptions.find((option) => String(option.value).trim() === preferredCode) || tipoDocumentoOptions[0];
    form.setValue("tipoDocumento", String(preferred.value), { shouldDirty: contributorTypeChanged, shouldValidate: true });
    form.setValue("numeroDocumento", "", { shouldDirty: contributorTypeChanged, shouldValidate: false });
    form.clearErrors("numeroDocumento");
  }, [form, isJuridica, tipoDocumentoCatalogo.loading, tipoDocumentoOptions]);

  useEffect(() => {
    const type = String(tipoDocumento || "").trim();
    const number = String(numeroDocumento || "").trim();
    if (!type || !documentoConfig.pattern.test(number)) {
      consultaActivaRef.current += 1;
      ultimaConsultaRef.current = "";
      setConsultandoDocumento(false);
      setMensajeConsulta(null);
      if (form.getValues("codPersona")) {
        const empty = limpiarPersonaEncontrada();
        Object.entries(empty).forEach(([field, value]) => form.setValue(field as keyof ContribuyenteFormValues, value));
      }
      return;
    }
    const key = `${type}:${number}`;
    if (ultimaConsultaRef.current === key) return;
    const timer = window.setTimeout(async () => {
      ultimaConsultaRef.current = key;
      const requestId = ++consultaActivaRef.current;
      setConsultandoDocumento(true);
      setMensajeConsulta(null);
      try {
        const results = await listarPersona(type, number);
        if (requestId !== consultaActivaRef.current) return;
        const found = results.find((person) => String(person.numerodocumento).trim() === number) || results[0];
        if (!found) {
          form.setValue("codPersona", null);
          setEstadoConsulta("info");
          setMensajeConsulta("No existe una persona con este documento. Puede continuar con el registro.");
          return;
        }
        const adapted = adaptarPersonaAFormulario(found, isJuridica, type, number);
        Object.entries(adapted).forEach(([field, value]) => form.setValue(field as keyof ContribuyenteFormValues, value));
        form.clearErrors();
        setEstadoConsulta("success");
        setMensajeConsulta(`Persona encontrada. El formulario está en modo edición (código ${found.codPersona}).`);
      } catch (error) {
        if (requestId !== consultaActivaRef.current) return;
        ultimaConsultaRef.current = "";
        setEstadoConsulta("error");
        setMensajeConsulta(error instanceof Error ? error.message : "No se pudo consultar el documento. Verifique la conexión e intente nuevamente.");
      } finally {
        if (requestId === consultaActivaRef.current) setConsultandoDocumento(false);
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [documentoConfig.pattern, form, isJuridica, listarPersona, numeroDocumento, tipoDocumento]);

  return {
    tipoDocumentoOptions,
    documentoConfig,
    estadoCivilOptions: estadoCivil.options,
    sexoOptions: sexo.options,
    loadingTipoDocumento: tipoDocumentoCatalogo.loading,
    loadingEstadoCivil: estadoCivil.loading,
    loadingSexo: sexo.loading,
    errorTipoDocumento: tipoDocumentoCatalogo.error,
    errorEstadoCivil: estadoCivil.error,
    errorSexo: sexo.error,
    errorPersona,
    errorContribuyente,
    hasLoadingErrors: Boolean(tipoDocumentoCatalogo.error || estadoCivil.error || sexo.error),
    consultandoDocumento,
    mensajeConsulta,
    estadoConsulta,
    nFinca,
    otroNumero,
  };
};
