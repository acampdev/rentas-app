import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../../components/utils/Notification";
import { getAuthenticatedUserCode } from "../../../config/api.unified.config";
import direccionService from "../../../services/direccionService";
import { predioService } from "../../../services/predioService";
import { logger } from "../../../utils/logger";
import {
  extractAddressTerms,
  mapPredioToForm,
  parseAddress,
  toFormAddress,
  type PredioFormExtended,
} from "./nuevoPredio.adapters";

async function findAddress(baseAddress: string) {
  for (const term of extractAddressTerms(baseAddress)) {
    const addresses = await direccionService.buscar({
      parametrosBusqueda: term,
      codUsuario: getAuthenticatedUserCode(),
    });
    const match = addresses.find((address) =>
      (address.descripcion ?? "").toLowerCase().includes(term.toLowerCase()),
    );
    if (match) return toFormAddress(match, baseAddress);
  }
  return toFormAddress(undefined, baseAddress);
}

export function useNuevoPredio(anio?: string, codPredio?: string) {
  const navigate = useNavigate();
  const editMode = Boolean(anio && codPredio);
  const [existingPredio, setExistingPredio] =
    useState<Partial<PredioFormExtended>>();
  const [loadingPredio, setLoadingPredio] = useState(false);

  useEffect(() => {
    if (!editMode || !anio || !codPredio) {
      setExistingPredio(undefined);
      setLoadingPredio(false);
      return;
    }
    let active = true;
    const load = async () => {
      setLoadingPredio(true);
      try {
        const predios = await predioService.buscarPrediosConFiltros({
          anio: Number(anio),
          codPredioBase: codPredio,
          parametroBusqueda: "",
        });
        const predio = predios[0];
        if (!predio) {
          NotificationService.warning("No se encontró el predio especificado");
          navigate("/predio/consulta");
          return;
        }
        const { baseAddress } = parseAddress(predio.direccion);
        let address = toFormAddress(undefined, baseAddress);
        try {
          if (baseAddress) address = await findAddress(baseAddress);
        } catch (error) {
          logger.error("❌ [NuevoPredio] Error buscando dirección:", error);
        }
        // Al editar debe conservarse el código de dirección del registro.
        // Una búsqueda textual puede encontrar una dirección parecida y provocar
        // que el PUT modifique la relación equivocada o sea rechazado por el API.
        if (predio.codDireccion) {
          const originalAddressCode = Number(predio.codDireccion);
          address = {
            ...address,
            id: originalAddressCode,
            codigo: originalAddressCode,
          };
        }
        if (active) {
          setExistingPredio(mapPredioToForm(predio, address));
          NotificationService.info("Predio cargado para edición");
        }
      } catch (error) {
        logger.error("❌ [NuevoPredio] Error al cargar predio:", error);
        NotificationService.error("Error al cargar los datos del predio");
        navigate("/predio/consulta");
      } finally {
        if (active) setLoadingPredio(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [anio, codPredio, editMode, navigate]);

  return { editMode, existingPredio, loadingPredio };
}
