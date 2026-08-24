import { useCallback, useEffect, useMemo, useState } from "react";
import { useFraccionamiento } from "../../../../hooks/useFraccionamiento";
import { getApiErrorMessage } from "../../../../services/apiClient";
import type {
  DeudaFraccionadaProps,
  ResolucionFraccionamiento,
} from "./deudaFraccionada.types";
import {
  accountDetailToTributes,
  EMPTY_TRIBUTES,
  groupSchedule,
  installmentTotal,
} from "./deudaFraccionada.utils";

type Props = Omit<
  DeudaFraccionadaProps,
  "getCellColorFraccionamiento" | "montoFraccionado"
>;

export const useDeudaFraccionada = (props: Props) => {
  const {
    codContribuyente,
    allDetails,
    cuotasFraccionamiento,
    setCuotasFraccionamiento,
    selectedAño,
    setSelectedAño,
    setSelectedResolucion,
    selectedResolucionCode,
    setSelectedResolucionCode,
    setMontoFraccionado,
    setMontoAPagar,
    setTributosFraccionados,
  } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resoluciones, setResoluciones] = useState<ResolucionFraccionamiento[]>(
    [],
  );
  const { obtenerCronogramaContribuyente } = useFraccionamiento(
    {},
    { enabledList: false, enabledStats: false },
  );

  const updateAmount = useCallback(
    (installments: typeof cuotasFraccionamiento) => {
      const total = installmentTotal(installments);
      setMontoFraccionado?.(`S/. ${total.toFixed(2)}`);
      setMontoAPagar?.(total > 0 ? total.toFixed(2) : "");
    },
    [setMontoAPagar, setMontoFraccionado],
  );

  const selectResolution = useCallback(
    (resolution: ResolucionFraccionamiento) => {
      setSelectedAño?.(resolution.año);
      setSelectedResolucion?.(resolution.resolucion);
      setSelectedResolucionCode?.(resolution.codResolucion);
      setCuotasFraccionamiento?.(resolution.cuotas);
      updateAmount(resolution.cuotas);
    },
    [
      setCuotasFraccionamiento,
      setSelectedAño,
      setSelectedResolucion,
      setSelectedResolucionCode,
      updateAmount,
    ],
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!codContribuyente) return;
      setLoading(true);
      setError(null);
      try {
        const grouped = groupSchedule(
          await obtenerCronogramaContribuyente(codContribuyente),
        );
        if (!active) return;
        setResoluciones(grouped);
        if (grouped[0]) selectResolution(grouped[0]);
        else {
          setSelectedAño?.(null);
          setSelectedResolucion?.("");
          setSelectedResolucionCode?.(null);
          setCuotasFraccionamiento?.([]);
          setMontoFraccionado?.("");
          setMontoAPagar?.("");
        }
      } catch (cause) {
        if (active)
          setError(
            getApiErrorMessage(
              cause,
              "No se pudo cargar el cronograma de fraccionamiento.",
            ),
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [
    codContribuyente,
    obtenerCronogramaContribuyente,
    selectResolution,
    setCuotasFraccionamiento,
    setMontoAPagar,
    setMontoFraccionado,
    setSelectedAño,
    setSelectedResolucion,
    setSelectedResolucionCode,
  ]);

  const tributes = useMemo(() => {
    const details =
      allDetails.find((item) => item.year === selectedAño)?.details ?? [];
    const mapped = accountDetailToTributes(details);
    return mapped.length ? mapped : EMPTY_TRIBUTES;
  }, [allDetails, selectedAño]);

  useEffect(
    () => setTributosFraccionados?.(tributes),
    [setTributosFraccionados, tributes],
  );

  const toggleInstallment = (number: number) => {
    const installments = cuotasFraccionamiento.map((item) =>
      item.nCuota === number ? { ...item, checked: !item.checked } : item,
    );
    setCuotasFraccionamiento?.(installments);
    updateAmount(installments);
    setResoluciones((current) =>
      current.map((item) =>
        item.año === selectedAño &&
        item.codResolucion === selectedResolucionCode
          ? { ...item, cuotas: installments }
          : item,
      ),
    );
  };

  return {
    loading,
    error,
    resoluciones,
    tributes,
    selectResolution,
    toggleInstallment,
  };
};
