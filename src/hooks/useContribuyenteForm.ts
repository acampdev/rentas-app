import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../components/utils/Notification";
import { BUSINESS_CODES } from "../config/constants";
import type { ContribuyenteDireccion } from "../types/formTypes";
import { logger } from "../utils/logger";
import { getApiErrorMessage } from "../services/apiClient";
import { fullAddressText } from "./contribuyenteForm/contribuyenteForm.adapters";
import { createFormValues } from "./contribuyenteForm/contribuyenteForm.defaults";
import { persistContributor } from "./contribuyenteForm/contribuyenteForm.persistence";
import type {
  ContribuyenteFormValues,
  UseContribuyenteFormProps,
} from "./contribuyenteForm/contribuyenteForm.types";

export type { ContribuyenteFormValues } from "./contribuyenteForm/contribuyenteForm.types";

export const useContribuyenteForm = ({
  onSubmit,
  onEdit,
  onNew,
  initialData,
}: UseContribuyenteFormProps) => {
  const navigate = useNavigate();
  const [internalLoading, setInternalLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    severity: "info" | "error";
    message: string;
  } | null>(null);
  const [showConyugeRepresentante, setShowConyugeRepresentante] =
    useState(false);
  const [isDireccionModalOpen, setIsDireccionModalOpen] = useState(false);
  const [isConyugeDireccionModalOpen, setIsConyugeDireccionModalOpen] =
    useState(false);
  const [tipoContribuyente, setTipoContribuyente] = useState<
    "natural" | "juridica"
  >("natural");
  const principalForm = useForm<ContribuyenteFormValues>({
    defaultValues: createFormValues(initialData),
    mode: "onBlur",
  });
  const conyugeRepresentanteForm = useForm<ContribuyenteFormValues>({
    defaultValues: createFormValues(),
  });
  const esPersonaJuridica = tipoContribuyente === "juridica";

  useEffect(() => {
    if (!initialData) return;
    principalForm.reset(createFormValues(initialData));
    setTipoContribuyente(
      initialData.esPersonaJuridica ? "juridica" : "natural",
    );
  }, [initialData, principalForm]);

  const handleTipoContribuyenteChange = useCallback(
    (_event: MouseEvent<HTMLElement>, value: "natural" | "juridica" | null) => {
      if (!value) return;
      setTipoContribuyente(value);
      principalForm.setValue("esPersonaJuridica", value === "juridica");
      if (value === "juridica") {
        principalForm.setValue(
          "tipoDocumento",
          BUSINESS_CODES.TIPO_DOCUMENTO.RUC,
        );
        principalForm.setValue("nombres", "");
        principalForm.setValue("apellidoPaterno", "");
        principalForm.setValue("apellidoMaterno", "");
      } else {
        principalForm.setValue(
          "tipoDocumento",
          BUSINESS_CODES.TIPO_DOCUMENTO.DNI,
        );
        principalForm.setValue("razonSocial", "");
      }
    },
    [principalForm],
  );

  const handleSelectDireccion = useCallback(
    (address: ContribuyenteDireccion) => {
      principalForm.setValue("direccion", address);
      setIsDireccionModalOpen(false);
    },
    [principalForm],
  );

  const handleSelectConyugeDireccion = useCallback(
    (address: ContribuyenteDireccion) => {
      conyugeRepresentanteForm.setValue("direccion", address);
      setIsConyugeDireccionModalOpen(false);
    },
    [conyugeRepresentanteForm],
  );

  const handleNuevo = useCallback(() => {
    setFeedback(null);
    principalForm.clearErrors();
    conyugeRepresentanteForm.clearErrors();
    principalForm.reset(createFormValues());
    conyugeRepresentanteForm.reset(createFormValues());
    setShowConyugeRepresentante(false);
    setTipoContribuyente("natural");
    onNew?.();
  }, [conyugeRepresentanteForm, onNew, principalForm]);

  const handleSubmit = principalForm.handleSubmit(async (data) => {
    setFeedback(null);
    try {
      setInternalLoading(true);
      const related = showConyugeRepresentante
        ? conyugeRepresentanteForm.getValues()
        : null;
      const result = await persistContributor(data, related, esPersonaJuridica);
      const message =
        result.contribuyente.operationMessage ||
        "Contribuyente guardado correctamente";
      setFeedback({ severity: "info", message });
      await onSubmit?.(result);
      window.setTimeout(
        () => navigate("/contribuyente/consulta", { replace: true }),
        1500,
      );
    } catch (error) {
      logger.error(error);
      const message = getApiErrorMessage(
        error,
        "Error al guardar contribuyente",
      );
      setFeedback({ severity: "error", message });
      NotificationService.error(message);
    } finally {
      setInternalLoading(false);
    }
  });

  return {
    principalForm,
    conyugeRepresentanteForm,
    internalLoading,
    feedback,
    showConyugeRepresentante,
    isDireccionModalOpen,
    isConyugeDireccionModalOpen,
    tipoContribuyente,
    esPersonaJuridica,
    handleTipoContribuyenteChange,
    toggleConyugeForm: () => setShowConyugeRepresentante((value) => !value),
    handleOpenDireccionModal: () => setIsDireccionModalOpen(true),
    handleCloseDireccionModal: () => setIsDireccionModalOpen(false),
    handleOpenConyugeDireccionModal: () => setIsConyugeDireccionModalOpen(true),
    handleCloseConyugeDireccionModal: () =>
      setIsConyugeDireccionModalOpen(false),
    handleSelectDireccion,
    handleSelectConyugeDireccion,
    getDireccionTextoCompleto: fullAddressText,
    handleNuevo,
    handleEditar: () => onEdit?.(),
    handleSubmit,
  };
};
