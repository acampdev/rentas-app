import { useEffect, useState } from "react";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import { useTransferencia } from "../../../hooks/useTransferencia";
import type {
  CreateTransferenciaPredioDTO,
  UpdateTransferenciaPredioDTO,
} from "../../../services/transferenciaService";
import { NotificationService } from "../../utils/Notification";
import type {
  RegistroTransferenciaProps,
  TransferenciaFieldChange,
} from "./registroTransferencia.types";
import {
  buildTransferenciaPayload,
  crearFormularioTransferencia,
  mapTransferenciaToForm,
  validarTransferencia,
} from "./registroTransferencia.utils";

export const useRegistroTransferencia = ({
  transferenciaEditar = null,
  onGuardado,
  onCancelarEdicion,
}: RegistroTransferenciaProps) => {
  const [formData, setFormData] = useState(crearFormularioTransferencia);
  const [openModalVendedor, setOpenModalVendedor] = useState(false);
  const [openModalComprador, setOpenModalComprador] = useState(false);
  const {
    crearTransferencia,
    actualizarTransferencia,
    isCreating,
    isUpdating,
  } = useTransferencia();

  useEffect(() => {
    setFormData(
      transferenciaEditar
        ? mapTransferenciaToForm(transferenciaEditar)
        : crearFormularioTransferencia(),
    );
  }, [transferenciaEditar]);
  const changeField: TransferenciaFieldChange = (field, value) =>
    setFormData((current) => ({ ...current, [field]: value }));
  const selectVendedor = (value: ContribuyenteListItem) => {
    changeField("vendedor", value);
    setOpenModalVendedor(false);
  };
  const selectComprador = (value: ContribuyenteListItem) => {
    changeField("comprador", value);
    setOpenModalComprador(false);
  };
  const limpiar = () => {
    const editando = formData.codTransferencia !== null;
    setFormData(crearFormularioTransferencia());
    if (editando) onCancelarEdicion?.();
  };

  const guardar = async () => {
    const error = validarTransferencia(formData);
    if (error) {
      NotificationService.warning(error);
      return;
    }
    try {
      const payload = buildTransferenciaPayload(formData);
      if (payload.codTransferencia === null)
        await crearTransferencia(payload as CreateTransferenciaPredioDTO);
      else
        await actualizarTransferencia(payload as UpdateTransferenciaPredioDTO);
      setFormData(crearFormularioTransferencia());
      onGuardado?.();
    } catch {
      /* useTransferencia presenta el detalle normalizado del API. */
    }
  };

  return {
    formData,
    changeField,
    guardar,
    limpiar,
    guardando: isCreating || isUpdating,
    openModalVendedor,
    openModalComprador,
    setOpenModalVendedor,
    setOpenModalComprador,
    selectVendedor,
    selectComprador,
  };
};
