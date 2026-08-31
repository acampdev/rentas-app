import { useState } from "react";
import { getApiErrorMessage } from "../../../services/apiClient";
import { useSubdivicion } from "../../../hooks/useSubdivicion";
import type { Predio } from "../../../models/Predio";
import type {
  FormFeedback,
  SubdivicionField,
  SubdivicionFormData,
} from "./subdivicion.types";
import {
  applySelectedPredio,
  buildSubdivicionPayload,
  createInitialSubdivicionForm,
} from "./subdivicion.utils";

export const useSubdivicionForm = (initialPredio?: Predio | null) => {
  const [form, setForm] = useState<SubdivicionFormData>(() => {
    const initialForm = createInitialSubdivicionForm();
    return initialPredio
      ? applySelectedPredio(initialForm, initialPredio)
      : initialForm;
  });
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const { registrarSubdivicion, isSubmitting, resetMutation } = useSubdivicion();

  const update = (field: SubdivicionField, value: string | number) => {
    setFeedback(null);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const selectPredio = (predio: Predio) => {
    setForm((current) => applySelectedPredio(current, predio));
    setFeedback(null);
  };

  const clear = () => {
    setForm(createInitialSubdivicionForm());
    setFeedback(null);
    resetMutation();
  };

  const submit = async () => {
    setFeedback(null);
    try {
      const result = await registrarSubdivicion(buildSubdivicionPayload(form));
      setForm(createInitialSubdivicionForm());
      resetMutation();
      setFeedback({ severity: "success", message: result.message });
    } catch (error: unknown) {
      setFeedback({
        severity: "error",
        message: getApiErrorMessage(
          error,
          "No se pudo registrar la subdivisión.",
        ),
      });
    }
  };

  return {
    form,
    selectorOpen,
    feedback,
    isSubmitting,
    update,
    selectPredio,
    clear,
    submit,
    setSelectorOpen,
  };
};
