export interface AperturaCajaData {
  numeroCaja?: string;
  fechaApertura: string;
  montoInicial: number;
  observacion: string;
  codUsuario: number;
  codAsignacionCaja: number | null;
}

export type AperturaCajaFormData = Omit<AperturaCajaData, "montoInicial"> & {
  montoInicial: number | "";
};

export interface AperturaCajaProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AperturaCajaData) => void;
  loading?: boolean;
}

export type AperturaCajaErrors = Partial<
  Record<keyof AperturaCajaFormData | "montoConfirmado", string>
>;
