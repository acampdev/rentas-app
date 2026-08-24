import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useAsignacionCajas } from '../../../hooks/useAsignacionCajas';
import { useCajas } from '../../../hooks/useCajas';
import { useTurnos } from '../../../hooks/useTurnos';
import { useUsuarios } from '../../../hooks/useUsuarios';
import type { AsignacionCaja } from '../../../models/Caja';
import type { ListarAsignacionCajaParams } from '../../../services/asignacionCajaService';
import { NotificationService } from '../../utils/Notification';
import {
  getBoxLabel,
  isActiveCashier,
  parseAssignmentDate,
  resolveAssignmentCatalogIds,
} from './asignacionCaja.adapters';
import type {
  AsignacionCajaFormState,
  AsignacionCajaSearchState,
  SelectedCatalogId,
} from './asignacionCaja.types';

const createFormState = (): AsignacionCajaFormState => ({
  fecha: new Date(), codCajero: '', codCaja: '', codTurno: '',
});

const createSearchState = (): AsignacionCajaSearchState => ({
  fecha: new Date(), termino: '', codUsuario: '',
});

export const useAsignacionCajaController = (codigoSupervisor: string) => {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<AsignacionCajaFormState>(createFormState);
  const [search, setSearch] = useState<AsignacionCajaSearchState>(createSearchState);
  const [editing, setEditing] = useState<AsignacionCaja | null>(null);

  const {
    asignaciones,
    loading,
    error,
    limpiarError,
    buscarAsignaciones,
    crearAsignacion,
    actualizarAsignacion,
    eliminarAsignacion,
  } = useAsignacionCajas();
  const { turnos, loading: loadingTurnos } = useTurnos();
  const { cajas, loading: loadingCajas } = useCajas();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();

  const cashiers = useMemo(
    () => usuarios.filter((usuario) => isActiveCashier(usuario, form.codCajero)),
    [form.codCajero, usuarios],
  );
  const selectedCashier = cashiers.find((item) => Number(item.codUsuario) === form.codCajero) || null;
  const selectedBox = cajas.find((item) => Number(item.codCaja) === form.codCaja) || null;

  useEffect(() => {
    if (!editing) return;
    const resolved = resolveAssignmentCatalogIds({ asignacion: editing, usuarios, cajas, turnos });
    setForm((current) => {
      const next = {
        ...current,
        codCajero: current.codCajero || resolved.codCajero,
        codCaja: current.codCaja || resolved.codCaja,
        codTurno: current.codTurno || resolved.codTurno,
      };
      return next.codCajero === current.codCajero && next.codCaja === current.codCaja && next.codTurno === current.codTurno
        ? current
        : next;
    });
  }, [cajas, editing, turnos, usuarios]);

  const setFormField = useCallback(<K extends keyof AsignacionCajaFormState>(
    field: K,
    value: AsignacionCajaFormState[K],
  ) => setForm((current) => ({ ...current, [field]: value })), []);

  const setSearchField = useCallback(<K extends keyof AsignacionCajaSearchState>(
    field: K,
    value: AsignacionCajaSearchState[K],
  ) => setSearch((current) => ({ ...current, [field]: value })), []);

  const resetForm = useCallback(() => {
    limpiarError();
    setForm(createFormState());
    setEditing(null);
  }, [limpiarError]);

  const searchAssignments = useCallback(async () => {
    const params: ListarAsignacionCajaParams = {};
    if (search.termino) params.terminoBusqueda = search.termino;
    if (search.fecha) params.fecha = format(search.fecha, 'yyyy-MM-dd');
    if (search.codUsuario) params.codUsuario = Number(search.codUsuario);
    await buscarAsignaciones(params);
  }, [buscarAsignaciones, search]);

  const saveAssignment = useCallback(async () => {
    if (!form.codCajero || !form.codCaja || !form.codTurno || !form.fecha) {
      NotificationService.warning('Por favor complete todos los campos');
      return;
    }

    const success = editing
      ? await actualizarAsignacion({
          codAsignacionCaja: editing.codAsignacionCaja,
          codUsuario: Number(form.codCajero),
          codCaja: Number(form.codCaja),
          codTurno: Number(form.codTurno),
          usuario: codigoSupervisor,
        })
      : await crearAsignacion({
          codUsuario: Number(form.codCajero),
          codCaja: Number(form.codCaja),
          codTurno: Number(form.codTurno),
          fecha: format(form.fecha, 'yyyy-MM-dd'),
          usuario: codigoSupervisor,
        });

    if (success) {
      resetForm();
      setActiveTab(1);
    }
  }, [actualizarAsignacion, codigoSupervisor, crearAsignacion, editing, form, resetForm]);

  const editAssignment = useCallback((assignment: AsignacionCaja) => {
    limpiarError();
    const resolved = resolveAssignmentCatalogIds({ asignacion: assignment, usuarios, cajas, turnos });
    setEditing(assignment);
    setForm({
      fecha: parseAssignmentDate(assignment.fechaStr || assignment.fecha),
      codCajero: resolved.codCajero,
      codCaja: resolved.codCaja,
      codTurno: resolved.codTurno,
    });
    setActiveTab(0);
  }, [cajas, limpiarError, turnos, usuarios]);

  const deleteAssignment = useCallback(async (code: number) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
      await eliminarAsignacion(code, codigoSupervisor);
    }
  }, [codigoSupervisor, eliminarAsignacion]);

  return {
    activeTab,
    form,
    search,
    editing,
    assignments: asignaciones,
    loading,
    error,
    cashiers,
    boxes: cajas,
    shifts: turnos,
    selectedCashier,
    selectedBox,
    loadingCashiers: loadingUsuarios,
    loadingBoxes: loadingCajas,
    loadingShifts: loadingTurnos,
    getBoxLabel,
    setActiveTab,
    setFormField,
    setSearchField,
    clearError: limpiarError,
    resetForm,
    resetSearch: () => setSearch(createSearchState()),
    searchAssignments,
    saveAssignment,
    editAssignment,
    deleteAssignment,
  };
};

export type AsignacionCajaController = ReturnType<typeof useAsignacionCajaController>;
export type { SelectedCatalogId };
