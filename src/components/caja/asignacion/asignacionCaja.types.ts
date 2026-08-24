export type SelectedCatalogId = number | '';

export interface AsignacionCajaFormState {
  fecha: Date | null;
  codCajero: SelectedCatalogId;
  codCaja: SelectedCatalogId;
  codTurno: SelectedCatalogId;
}

export interface AsignacionCajaSearchState {
  fecha: Date | null;
  termino: string;
  codUsuario: string;
}

export interface AsignacionCajaProps {
  codigoSupervisor: string;
}
