import { useEffect, useState } from "react";
import { useInteres } from "../../../hooks/useInteres";
import type { InteresData } from "../../../models/Interes";
import { emptyInteresForm, type InteresFormState } from "./interes.types";

export function useInteresView() {
  const api = useInteres();
  const [tab, setTab] = useState(0);
  const [searchYear, setSearchYear] = useState(api.anio);
  const [form, setForm] = useState<InteresFormState>(emptyInteresForm);
  const [editing, setEditing] = useState(false);

  useEffect(() => setSearchYear(api.anio), [api.anio]);

  const updateForm = (field: keyof InteresFormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setForm(emptyInteresForm());
    setEditing(false);
  };

  const edit = (item: InteresData) => {
    setForm({
      codInteres: String(item.codInteres),
      anio: String(item.anio),
      tasa: String(item.tasa),
      codTipo: item.codTipo,
      codClase: item.codClase,
    });
    setEditing(true);
    setTab(1);
  };

  const save = async () => {
    if (!form.anio || !form.tasa || !form.codTipo || !form.codClase) return;
    const payload = {
      codInteres: Number.parseInt(form.codInteres) || 0,
      anio: Number.parseInt(form.anio),
      tasa: Number.parseFloat(form.tasa),
      codTipo: form.codTipo,
      codClase: form.codClase,
    };
    try {
      if (editing) await api.actualizarInteres(payload);
      else await api.crearInteres(payload);
      api.setAnio(payload.anio);
      setTab(0);
      reset();
    } catch {
      // El hook de datos presenta el error mediante NotificationService.
    }
  };

  const inactivate = async (item: InteresData) => {
    if (
      !window.confirm(
        `¿Está seguro de inactivar el interés con código ${item.codInteres} del año ${item.anio}?`,
      )
    )
      return;
    try {
      await api.inactivarInteres({
        codInteres: item.codInteres,
        anio: item.anio,
      });
    } catch {
      // El hook de datos presenta el error mediante NotificationService.
    }
  };

  const search = () => api.setAnio(searchYear);
  const formInvalid =
    !form.anio ||
    !form.tasa ||
    !form.codTipo ||
    !form.codClase ||
    (!editing && !form.codInteres);
  return {
    ...api,
    tab,
    setTab,
    searchYear,
    setSearchYear,
    form,
    updateForm,
    editing,
    reset,
    edit,
    save,
    inactivate,
    search,
    formInvalid,
  };
}
