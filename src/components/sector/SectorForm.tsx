import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSectores } from "../../hooks/useSectores";
import { logger } from "../../utils/logger";
import {
  EMPTY_SECTOR_FORM,
  mapSectorToForm,
  sectorSchema,
  type SectorFormProps,
  type SectorFormValues,
} from "./sectorForm.schema";
import { SectorFormView } from "./SectorFormView";

const SectorForm = (props: SectorFormProps) => {
  const { sectorSeleccionado, onGuardar, onNuevo, isEditMode = false } = props;
  const {
    cuadrantes,
    loadingCuadrantes,
    unidadesUrbanas,
    loadingUnidadesUrbanas,
  } = useSectores();
  const form = useForm<SectorFormValues>({
    resolver: zodResolver(sectorSchema),
    defaultValues: EMPTY_SECTOR_FORM,
    mode: "onChange",
  });
  const { reset } = form;
  useEffect(() => {
    reset(mapSectorToForm(sectorSeleccionado));
  }, [sectorSeleccionado, reset]);
  const submit = async (data: SectorFormValues) => {
    try {
      await onGuardar(data);
      if (!isEditMode) reset(EMPTY_SECTOR_FORM);
    } catch (error) {
      logger.error("Error al guardar sector:", error);
    }
  };
  const nuevo = () => {
    reset(EMPTY_SECTOR_FORM);
    onNuevo();
  };
  return (
    <SectorFormView
      {...props}
      form={form}
      cuadrantes={cuadrantes}
      unidades={unidadesUrbanas}
      loadingCuadrantes={loadingCuadrantes}
      loadingUnidades={loadingUnidadesUrbanas}
      onSubmit={submit}
      onNuevo={nuevo}
    />
  );
};

export default SectorForm;
