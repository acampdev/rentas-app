import type { AsignacionCaja } from '../../../models/Caja';
import type { CajaData } from '../../../services/cajaService';
import type { TurnoData } from '../../../services/turnoService';
import type { UsuarioData } from '../../../services/usuarioService';
import type { SelectedCatalogId } from './asignacionCaja.types';

export const normalizeLookupText = (value: unknown): string =>
  String(value ?? '').trim().toLocaleLowerCase('es-PE').replace(/\s+/g, ' ');

export const normalizeLookupCode = (value: unknown): string =>
  normalizeLookupText(value).replace(/[^a-z0-9]/g, '');

export const parseAssignmentDate = (value: string | null | undefined): Date => {
  if (!value) return new Date();
  const parts = value.split('-');
  if (parts.length === 3) {
    return new Date(
      Number.parseInt(parts[0], 10),
      Number.parseInt(parts[1], 10) - 1,
      Number.parseInt(parts[2], 10),
    );
  }
  return new Date(value);
};

const validId = (value: unknown): SelectedCatalogId => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : '';
};

interface ResolveCatalogParams {
  asignacion: AsignacionCaja;
  usuarios: UsuarioData[];
  cajas: CajaData[];
  turnos: TurnoData[];
}

export const resolveAssignmentCatalogIds = ({ asignacion, usuarios, cajas, turnos }: ResolveCatalogParams) => {
  const directUser = validId(asignacion.codUsuario);
  const directBox = validId(asignacion.codCaja);
  const directShift = validId(asignacion.codTurno);

  const userName = normalizeLookupText(asignacion.nombreUsuario);
  const boxNumber = normalizeLookupCode(asignacion.numCaja);
  const shiftName = normalizeLookupText(asignacion.turno);

  return {
    codCajero: directUser || validId(usuarios.find((usuario) =>
      normalizeLookupText(usuario.username) === userName
      || normalizeLookupText(usuario.nombrePersona) === userName)?.codUsuario),
    codCaja: directBox || validId(cajas.find((caja) =>
      normalizeLookupCode(caja.numcaja) === boxNumber
      || normalizeLookupCode(caja.descripcion) === boxNumber)?.codCaja),
    codTurno: directShift || validId(turnos.find((turno) =>
      normalizeLookupText(turno.nombreTurno) === shiftName)?.codTurno),
  };
};

export const isActiveCashier = (usuario: UsuarioData, selectedId: SelectedCatalogId): boolean =>
  (usuario.rol?.trim().toLowerCase() === 'cajero' && usuario.estado?.trim().toUpperCase() === 'ACTIVO')
  || Number(usuario.codUsuario) === selectedId;

export const getBoxLabel = (caja: CajaData): string => {
  const name = caja.numcaja?.trim() || `Caja ${caja.codCaja}`;
  const description = caja.descripcion?.trim();
  return description && description !== name ? `${name} - ${description}` : name;
};
