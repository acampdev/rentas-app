export interface Contribuyente {
  codigo: string | number;
  contribuyente: string;
  documento: string;
  direccion: string;
  telefono?: string;
  tipoPersona?: "natural" | "juridica" | string;
  tipoContribuyente?: string;
  esExonerado?: boolean | null;
  esPensionista?: boolean | null;
  estado?: "activo" | "inactivo";
}

export interface ContribuyenteConsultaFiltro {
  parametroBusqueda?: string;
  codigoContribuyente?: string;
  codTipoContribuyente?: string;
  esExonerado?: string;
  esPensionista?: string;
}

export interface ContribuyenteConsultaProps {
  contribuyentes: Contribuyente[];
  onBuscar: (filtro: ContribuyenteConsultaFiltro) => void;
  onNuevo?: () => void;
  onEditar: (codigo: string | number) => void;
  loading?: boolean;
}

export interface ConsultaFiltersState {
  texto: string;
  codigo: string;
  tipo: string;
  exonerado: string;
  pensionista: string;
}
