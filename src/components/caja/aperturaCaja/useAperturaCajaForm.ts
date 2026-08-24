import { useEffect, useMemo, useState } from "react";
import { getAuthenticatedUserCode } from "../../../config/api.unified.config";
import { useUsuarios } from "../../../hooks/useUsuarios";
import type {
  AperturaCajaData,
  AperturaCajaErrors,
  AperturaCajaFormData,
} from "./aperturaCaja.types";

const createInitialData = (): AperturaCajaFormData => ({
  numeroCaja: "",
  fechaApertura: new Date().toLocaleDateString("es-PE"),
  montoInicial: "",
  observacion: "Aperturar caja",
  codUsuario: getAuthenticatedUserCode(),
  codAsignacionCaja: null,
});

export function useAperturaCajaForm(
  open: boolean,
  onSave: (data: AperturaCajaData) => void,
  onClose: () => void,
) {
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const cajeros = useMemo(
    () => usuarios.filter(({ rol }) => rol?.trim().toLowerCase() === "cajero"),
    [usuarios],
  );
  const [form, setForm] = useState(createInitialData);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<AperturaCajaErrors>({});
  const selectedUser =
    cajeros.find(({ codUsuario }) => codUsuario === form.codUsuario) ?? null;

  const reset = () => {
    setForm(createInitialData());
    setConfirmed(false);
    setErrors({});
  };

  useEffect(() => {
    if (open) reset();
  }, [open]);

  const change = <Key extends keyof AperturaCajaFormData>(
    field: Key,
    value: AperturaCajaFormData[Key],
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field])
      setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const changeAmount = (value: string) => {
    change("montoInicial", value === "" ? "" : Number(value));
    setConfirmed(false);
    if (errors.montoConfirmado)
      setErrors((previous) => ({
        ...previous,
        montoConfirmado: undefined,
      }));
  };

  const confirmAmount = (value: boolean) => {
    setConfirmed(value);
    if (errors.montoConfirmado)
      setErrors((previous) => ({
        ...previous,
        montoConfirmado: undefined,
      }));
  };

  const submit = () => {
    const nextErrors: AperturaCajaErrors = {};
    if (
      form.montoInicial === "" ||
      !Number.isFinite(form.montoInicial) ||
      form.montoInicial < 0
    )
      nextErrors.montoInicial = "Ingrese un monto inicial mayor o igual a 0";
    if (!confirmed)
      nextErrors.montoConfirmado =
        "Debe confirmar expresamente el monto inicial";
    if (
      !selectedUser ||
      !Number.isInteger(form.codUsuario) ||
      form.codUsuario <= 0
    )
      nextErrors.codUsuario = "Debe seleccionar un cajero válido";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || form.montoInicial === "") return;
    onSave({ ...form, montoInicial: form.montoInicial });
  };

  const close = () => {
    reset();
    onClose();
  };

  return {
    form,
    cajeros,
    selectedUser,
    loadingUsuarios,
    confirmed,
    errors,
    change,
    changeAmount,
    confirmAmount,
    submit,
    close,
  };
}
