import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type {
  DireccionData,
  PredioFormData,
} from "../../../hooks/usePredioForm";
import { buildDireccionCompleta } from "./predioForm.utils";

export const usePredioDireccion = (form: UseFormReturn<PredioFormData>) => {
  const direccion = form.watch("direccion");
  const numeroFinca = form.watch("numeroFinca");
  const otroNumero = form.watch("otroNumero");

  useEffect(() => {
    if (!direccion) return;
    const descripcion = buildDireccionCompleta(
      direccion as DireccionData,
      numeroFinca,
      otroNumero,
    );
    if (direccion.descripcion !== descripcion) {
      form.setValue("direccion", { ...direccion, descripcion });
    }
  }, [direccion, numeroFinca, otroNumero, form]);

  return { direccion, numeroFinca, otroNumero };
};
