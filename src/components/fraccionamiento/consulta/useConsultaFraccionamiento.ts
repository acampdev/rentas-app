import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import { fraccionamientoService } from "../../../services/fraccionamientoService";
import type { Fraccionamiento } from "../../../types/fraccionamiento.types";
import { NotificationService } from "../../utils/Notification";
import { paginateFraccionamientos } from "./consultaFraccionamiento.adapters";
import type { DocumentoFraccionamiento } from "./consultaFraccionamiento.types";

const documentoWarning: Record<DocumentoFraccionamiento, string> = {
  convenio: "el convenio",
  estadoCuenta: "el estado de cuenta",
  resolucionJefatural: "la resolución jefatural",
  estadoDeuda: "el estado de deuda",
};

export const useConsultaFraccionamiento = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [documentoOpen, setDocumentoOpen] =
    useState<DocumentoFraccionamiento | null>(null);
  const [contribuyente, setContribuyente] =
    useState<ContribuyenteListItem | null>(null);
  const [contribuyenteResultado, setContribuyenteResultado] =
    useState<ContribuyenteListItem | null>(null);
  const [seleccionado, setSeleccionado] = useState<Fraccionamiento | null>(
    null,
  );
  const [fraccionamientos, setFraccionamientos] = useState<Fraccionamiento[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const rows = useMemo(
    () => paginateFraccionamientos(fraccionamientos, page, rowsPerPage),
    [fraccionamientos, page, rowsPerPage],
  );

  const buscar = useCallback(async () => {
    if (!contribuyente?.codigo) {
      NotificationService.error("Debe seleccionar un contribuyente");
      return;
    }
    setLoading(true);
    try {
      const data = await fraccionamientoService.getAll({
        codContribuyente: String(contribuyente.codigo),
      });
      const resultados = data ?? [];
      setFraccionamientos(resultados);
      setContribuyenteResultado(contribuyente);
      setSeleccionado(resultados[0] ?? null);
      setPage(0);
      if (resultados.length === 0) {
        NotificationService.info(
          "No se encontraron fraccionamientos para este contribuyente",
        );
      } else {
        NotificationService.success(
          `Se encontraron ${resultados.length} fraccionamientos`,
        );
      }
    } catch (error: unknown) {
      setFraccionamientos([]);
      setSeleccionado(null);
      NotificationService.error(
        error instanceof Error
          ? error.message
          : "Error al buscar fraccionamientos",
      );
    } finally {
      setLoading(false);
      setContribuyente(null);
    }
  }, [contribuyente]);

  const limpiar = useCallback(() => {
    setContribuyente(null);
    setContribuyenteResultado(null);
    setFraccionamientos([]);
    setSeleccionado(null);
    setDocumentoOpen(null);
    setPage(0);
  }, []);

  const abrirDocumento = useCallback(
    (tipo: DocumentoFraccionamiento) => {
      if (!seleccionado) {
        NotificationService.warning(
          `Seleccione un fraccionamiento de la tabla para generar ${documentoWarning[tipo]}`,
        );
        return;
      }
      setDocumentoOpen(tipo);
    },
    [seleccionado],
  );

  const imprimirConvenio = useCallback((row: Fraccionamiento) => {
    setSeleccionado(row);
    setDocumentoOpen("convenio");
  }, []);

  const verDetalle = useCallback(
    (row: Fraccionamiento) => {
      navigate(`/fraccionamiento/cronograma/${row.id}`, { state: row });
    },
    [navigate],
  );

  const changeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(Number.parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  return {
    page,
    rowsPerPage,
    rows,
    fraccionamientos,
    loading,
    selectorOpen,
    documentoOpen,
    contribuyente,
    contribuyenteResultado,
    seleccionado,
    setPage,
    setSelectorOpen,
    setDocumentoOpen,
    setContribuyente,
    setSeleccionado,
    buscar,
    limpiar,
    abrirDocumento,
    imprimirConvenio,
    verDetalle,
    changeRowsPerPage,
  };
};
