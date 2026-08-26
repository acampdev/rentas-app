import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Predio } from "../../../models/Predio";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import { useTipoInscripcionPredio } from "../../../hooks/useConstantesOptions";
import type { CreateAsignacionAPIDTO } from "../../../services/asignacionService";
import { extractApiMessage, getApiErrorMessage } from "../../../services/apiClient";
import { NotificationService } from "../../utils/Notification";
import {
  EMPTY_ASSIGNMENT,
  type AsignacionFormData,
  type AsignacionFeedback,
  type AsignacionPredioProps,
} from "./asignacionPredio.types";
import {
  assignmentFromEdit,
  buildAssignmentPayload,
  filterAssignmentModeOptions,
} from "./asignacionPredio.utils";

export const useAsignacionPredioForm = (props: AsignacionPredioProps) => {
  const {
    onCrearAsignacion,
    onActualizarAsignacion,
    onDesasignar,
    loading: externalLoading = false,
    isEditMode = false,
    isDesasignarMode = false,
    datosEdicion,
  } = props;
  const navigate = useNavigate();
  const { options: apiModes, loading: loadingModes } =
    useTipoInscripcionPredio();
  const modes = useMemo(
    () => filterAssignmentModeOptions(apiModes),
    [apiModes],
  );
  const [form, setForm] = useState<AsignacionFormData>(EMPTY_ASSIGNMENT);
  const [loaded, setLoaded] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [feedback, setFeedback] = useState<AsignacionFeedback | null>(null);
  const [contributorModal, setContributorModal] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [pendingUnassignment, setPendingUnassignment] =
    useState<CreateAsignacionAPIDTO | null>(null);

  useEffect(() => {
    if (
      (isEditMode || isDesasignarMode) &&
      datosEdicion &&
      !loaded &&
      !loadingModes
    ) {
      setForm(assignmentFromEdit(datosEdicion, modes));
      setLoaded(true);
    }
  }, [datosEdicion, isDesasignarMode, isEditMode, loaded, loadingModes, modes]);

  const update = <K extends keyof AsignacionFormData>(
    field: K,
    value: AsignacionFormData[K],
  ) => setForm((current) => ({ ...current, [field]: value }));
  const selectContributor = (item: ContribuyenteListItem) => {
    update("contribuyente", {
      codigo: item.codigo,
      nombreCompleto: item.contribuyente || "",
    });
    setContributorModal(false);
  };
  const selectProperty = (property: Predio) => {
    update("predio", property);
    setPropertyModal(false);
  };

  const execute = async (payload: CreateAsignacionAPIDTO) => {
    const operation = isDesasignarMode
      ? onDesasignar
      : isEditMode
        ? onActualizarAsignacion
        : onCrearAsignacion;
    if (!operation) return;
    setFeedback(null);
    setInternalLoading(true);
    try {
      const result = await operation(payload);
      const resultRecord = result && typeof result === "object"
        ? result as Record<string, unknown>
        : null;
      const operationMessage = typeof resultRecord?.operationMessage === "string"
        ? resultRecord.operationMessage
        : extractApiMessage(
            result,
            isEditMode
              ? "Asignación actualizada correctamente"
              : isDesasignarMode
                ? "Predio desasignado correctamente"
                : "Asignación registrada correctamente",
          );
      setFeedback({ severity: "success", message: operationMessage });

      if (isEditMode || isDesasignarMode) {
        navigate("/predio/asignacion/consulta", {
          state: {
            searchParams: {
              anio: Number(form.predio?.anio || payload.codPredio.slice(0, 4)),
              codContribuyente: String(payload.codContribuyente),
            },
            nombreContribuyente: form.contribuyente?.nombreCompleto || "",
          },
        });
      }
    } catch (error) {
      const message = getApiErrorMessage(error, "Error al procesar la asignación");
      setFeedback({ severity: "error", message });
      NotificationService.error(message);
    } finally {
      setInternalLoading(false);
    }
  };

  const submit = async () => {
    try {
      setFeedback(null);
      const payload = buildAssignmentPayload(form, datosEdicion);
      if (isDesasignarMode) setPendingUnassignment(payload);
      else await execute(payload);
    } catch (error) {
      NotificationService.error(
        error instanceof Error
          ? error.message
          : "Datos de asignación inválidos",
      );
    }
  };
  const confirmUnassignment = async () => {
    if (!pendingUnassignment) return;
    const payload = pendingUnassignment;
    setPendingUnassignment(null);
    await execute(payload);
  };
  const clear = () => {
    setForm(EMPTY_ASSIGNMENT);
    setLoaded(false);
    setFeedback(null);
  };

  return {
    form,
    modes,
    loading: externalLoading || internalLoading || loadingModes,
    isEditMode,
    isDesasignarMode,
    contributorModal,
    propertyModal,
    pendingUnassignment,
    feedback,
    update,
    selectContributor,
    selectProperty,
    setContributorModal,
    setPropertyModal,
    setPendingUnassignment,
    submit,
    confirmUnassignment,
    clear,
  };
};
