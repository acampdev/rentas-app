import {
  useClasificacionPredio,
  useCondicionPropiedadOptions,
  useEstadoPredioOptions,
  useListaConductorOptions,
  useTipoPredioOptions,
  useUsoPredioOptions,
  type OptionFormat,
} from "../../../hooks/useConstantesOptions";

export interface SubdivicionCatalog {
  options: OptionFormat[];
  loading: boolean;
  error: string | null;
}

export interface SubdivicionCatalogs {
  usos: SubdivicionCatalog;
  estados: SubdivicionCatalog;
  tipos: SubdivicionCatalog;
  clasificaciones: SubdivicionCatalog;
  condiciones: SubdivicionCatalog;
  conductores: SubdivicionCatalog;
}

export const useSubdivicionCatalogs = (): SubdivicionCatalogs => {
  const usos = useUsoPredioOptions();
  const estados = useEstadoPredioOptions();
  const tipos = useTipoPredioOptions();
  const clasificaciones = useClasificacionPredio();
  const condiciones = useCondicionPropiedadOptions();
  const conductores = useListaConductorOptions();

  return { usos, estados, tipos, clasificaciones, condiciones, conductores };
};
