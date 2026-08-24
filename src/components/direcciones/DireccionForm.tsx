import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useBarrios } from "../../hooks/useBarrios";
import { useCalles } from "../../hooks/useCalles";
import {
  useRutasOptions,
  useTiposLadosDireccion,
  useUbicacionAreaVerdeOptions,
  useZonasOptions,
} from "../../hooks/useConstantesOptions";
import { useSectores } from "../../hooks/useSectores";
import { logger } from "../../utils/logger";
import { DireccionFormFields } from "./DireccionFormFields";
import {
  buildDireccionPayload,
  direccionSchema,
  mapDireccionToForm,
  type DireccionFormData,
  type DireccionFormProps,
} from "./direccionForm.schema";

const DireccionFormMUI = ({
  direccionSeleccionada,
  onSubmit,
  onNuevo,
  loading = false,
  isEditMode = false,
}: DireccionFormProps) => {
  const { sectores } = useSectores();
  const { barrios } = useBarrios();
  const { calles } = useCalles();
  const { options: ladoOptions } = useTiposLadosDireccion();
  const { options: rutaOptions, loading: loadingRutas } = useRutasOptions();
  const { options: zonaOptions, loading: loadingZonas } = useZonasOptions();
  const { options: areasVerdesOptions, loading: loadingAreasVerdes } =
    useUbicacionAreaVerdeOptions();
  const initialValues = useMemo(
    () => mapDireccionToForm(direccionSeleccionada, isEditMode),
    [direccionSeleccionada, isEditMode],
  );
  const form = useForm<DireccionFormData, unknown, DireccionFormData>({
    resolver: zodResolver(direccionSchema) as Resolver<DireccionFormData>,
    defaultValues: initialValues,
  });
  const { watch, reset, setValue, getValues } = form;
  const sector = watch("codigoSector");
  const barrio = watch("codigoBarrio");

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);
  useEffect(() => {
    if (!isEditMode || !direccionSeleccionada) return;
    const description = (direccionSeleccionada.descripcion || "").toUpperCase();
    const setFromDescription = (
      field: "codigoSector" | "codigoBarrio" | "codigoCalle",
      items: any[],
      regex: RegExp,
      label: (item: any) => string,
      id: (item: any) => number | undefined,
    ) => {
      if (getValues(field) || !description) return;
      const name = description.match(regex)?.[1]?.trim();
      if (!name) return;
      const found = items.find((item) => {
        const value = label(item).toUpperCase();
        return value.includes(name) || name.includes(value);
      });
      if (found) setValue(field, id(found) || null);
    };
    setFromDescription(
      "codigoSector",
      sectores,
      /(?:SECT\.|SECTOR|URB\.|URBANIZACIÓN|AA\.HH\.|A\.H\.|P\.J\.|ASOC\.|ASOCIACIÓN|RES\.|RESIDENCIAL)\s*(?:“|")?([^,”"]+)(?:”|")?/i,
      (item) => item.nombre || "",
      (item) => item.id,
    );
    setFromDescription(
      "codigoBarrio",
      barrios,
      /(?:B\.?º|B\.?Â?º|B\.|BARRIO)\s*([^,]+)/i,
      (item) => item.nombre || "",
      (item) => item.id,
    );
    setFromDescription(
      "codigoCalle",
      calles,
      /(?:JR\.|AV\.|CA\.|CL\.|CALLE|PSJE\.|PASAJE|JIRÓN|AVENIDA|VIA)\s*([^,]+?)(?:,|CUADRA|MZ\.|$)/i,
      (item) => item.nombreVia || "",
      (item) => item.codVia || item.id || item.codigo,
    );
    const matchOption = (
      field: "ruta" | "zona" | "ubicacionAreaVerde",
      name: unknown,
      options: { label: string; value: string | number }[],
    ) => {
      if (getValues(field) || !name) return;
      const target = String(name).toUpperCase();
      const option = options.find(
        (item) =>
          String(item.label).toUpperCase().includes(target) ||
          target.includes(String(item.label).toUpperCase()),
      );
      if (option) setValue(field, Number(option.value));
    };
    matchOption("ruta", direccionSeleccionada.rutaNombre, rutaOptions);
    matchOption("zona", direccionSeleccionada.zonaNombre, zonaOptions);
    matchOption(
      "ubicacionAreaVerde",
      direccionSeleccionada.ubicacionAreaVerdeNombre,
      areasVerdesOptions,
    );
    const currentLado = getValues("lado");
    if (
      direccionSeleccionada.lado &&
      !ladoOptions.some((item) => String(item.value) === String(currentLado))
    ) {
      const option = ladoOptions.find(
        (item) =>
          String(item.label).toUpperCase() ===
            direccionSeleccionada.lado?.toUpperCase() ||
          String(item.value) === direccionSeleccionada.lado,
      );
      if (option) setValue("lado", String(option.value));
    }
  }, [
    areasVerdesOptions,
    barrios,
    calles,
    direccionSeleccionada,
    getValues,
    isEditMode,
    ladoOptions,
    rutaOptions,
    sectores,
    setValue,
    zonaOptions,
  ]);

  const barriosFiltrados = useMemo(
    () =>
      !sector
        ? barrios
        : barrios.filter(
            (item: any) => Number(item.codSector) === Number(sector),
          ),
    [barrios, sector],
  );
  const callesFiltradas = useMemo(
    () =>
      !barrio
        ? calles
        : calles.filter(
            (item: any) =>
              Number(item.codBarrio || item.codigoBarrio) === Number(barrio),
          ),
    [calles, barrio],
  );
  const submit = async (data: DireccionFormData) => {
    try {
      await onSubmit(buildDireccionPayload(data));
    } catch (error) {
      logger.error("Error al guardar dirección:", error);
    }
  };
  return (
    <DireccionFormFields
      form={form}
      sectores={sectores}
      barrios={barriosFiltrados}
      calles={callesFiltradas}
      ladoOptions={ladoOptions}
      rutaOptions={rutaOptions}
      zonaOptions={zonaOptions}
      areasVerdesOptions={areasVerdesOptions}
      loadingRutas={loadingRutas}
      loadingZonas={loadingZonas}
      loadingAreasVerdes={loadingAreasVerdes}
      loading={loading}
      isEditMode={isEditMode}
      onSubmit={submit}
      onNuevo={onNuevo}
    />
  );
};

export default DireccionFormMUI;
