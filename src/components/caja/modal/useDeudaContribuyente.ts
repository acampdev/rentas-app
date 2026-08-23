import { useCallback, useEffect, useMemo, useState } from "react";
import { useModuleHotkeys } from "../../../hooks/useModuleHotkeys";
import type { ContribuyenteOption } from "../../../models/Caja";
import { mapDetallesToGlobalItems } from "./deuda/DeudaGlobal";
import type { CuotaFraccionamiento, TributoFraccionado } from "./deuda/DeudaFraccionada";
import { calcularDistribucionOrdinaria, calcularMontoCeldas, crearPagoFraccionado, crearPagoOrdinario, montoExcedeSeleccion } from "./deudaContribuyente.adapters";
import type { DatosPagoDeudaOrdinaria, SelectedDebtCells, TipoSeleccionMonto } from "./deudaContribuyente.types";
import { useDeudaCuentaCorriente } from "./useDeudaCuentaCorriente";

interface Params {
  open: boolean;
  contributor: ContribuyenteOption | null;
  onClose: () => void;
  onPayment?: (data: DatosPagoDeudaOrdinaria) => void;
}

export const useDeudaContribuyente = ({ open, contributor, onClose, onPayment }: Params) => {
  const account = useDeudaCuentaCorriente(open, contributor);
  const items = useMemo(() => mapDetallesToGlobalItems(account.details), [account.details]);
  const [amount, setAmount] = useState("");
  const [selectionType, setSelectionType] = useState<TipoSeleccionMonto>("repartir");
  const [tab, setTab] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<SelectedDebtCells>({});
  const [ordinaryYear, setOrdinaryYear] = useState<number | null>(null);
  const [fractionYear, setFractionYear] = useState<number | null>(null);
  const [resolution, setResolution] = useState("");
  const [resolutionCode, setResolutionCode] = useState<number | null>(null);
  const [installments, setInstallments] = useState<CuotaFraccionamiento[]>([]);
  const [fractionTributes, setFractionTributes] = useState<TributoFraccionado[]>([]);
  const [fractionAmount, setFractionAmount] = useState("");

  const selectedYearIds = useCallback((year: number | null) => items.filter((item) => item.año === year && item.deuda > 0).map((item) => item.id), [items]);

  useEffect(() => {
    if (!account.years.length) {
      setOrdinaryYear(null);
      setSelectedRows([]);
      return;
    }
    const year = account.years.includes(Number(ordinaryYear)) ? ordinaryYear : account.years[0];
    setOrdinaryYear(year);
    if (selectionType === "repartir") setSelectedRows(selectedYearIds(year));
  }, [account.years, ordinaryYear, selectedYearIds, selectionType]);

  const distribution = useMemo(() => calcularDistribucionOrdinaria(items, Number(amount) || 0, selectionType, ordinaryYear, selectedRows), [amount, items, ordinaryYear, selectedRows, selectionType]);
  const exceedsDebt = tab === 1 && montoExcedeSeleccion(Number(amount) || 0, items, selectionType, ordinaryYear, selectedRows);

  const selectYear = useCallback((year: number) => {
    setOrdinaryYear(year);
    setAmount("");
    setSelectedCells({});
    setSelectedRows(selectionType === "repartir" ? selectedYearIds(year) : []);
  }, [selectedYearIds, selectionType]);

  const selectRow = useCallback((id: string) => {
    if (selectionType !== "seleccionar") return;
    setSelectedRows((currentRows) => {
      const selecting = !currentRows.includes(id);
      const nextRows = selecting ? [...currentRows, id] : currentRows.filter((row) => row !== id);
      setSelectedCells((currentCells) => {
        const nextCells = { ...currentCells };
        if (selecting) {
          const row = items.find((item) => item.id === id);
          nextCells[id] = row ? Array.from({ length: 12 }, (_, index) => `mes${index + 1}`).filter((key) => Number(row[key as keyof typeof row] || 0) > 0).concat("deuda") : [];
        } else delete nextCells[id];
        setAmount(calcularMontoCeldas(items, nextCells).toFixed(2).replace(/^0\.00$/, ""));
        return nextCells;
      });
      return nextRows;
    });
  }, [items, selectionType]);

  const selectCell = useCallback((rowId: string, key: string, value: number) => {
    if (selectionType !== "seleccionar" || value <= 0) return;
    setSelectedCells((current) => {
      const row = items.find((item) => item.id === rowId);
      if (!row) return current;
      const rowCells = current[rowId] || [];
      const nextRowCells = rowCells.includes(key) ? rowCells.filter((item) => item !== key && item !== "deuda") : [...rowCells.filter((item) => item !== "deuda"), key];
      const next = { ...current };
      if (nextRowCells.length) next[rowId] = nextRowCells;
      else delete next[rowId];
      setSelectedRows((rows) => nextRowCells.length ? [...new Set([...rows, rowId])] : rows.filter((id) => id !== rowId));
      setAmount(calcularMontoCeldas(items, next).toFixed(2).replace(/^0\.00$/, ""));
      return next;
    });
  }, [items, selectionType]);

  const changeSelectionType = useCallback((value: TipoSeleccionMonto) => {
    setSelectionType(value);
    setAmount("");
    setSelectedCells({});
    setSelectedRows(value === "repartir" ? selectedYearIds(ordinaryYear) : []);
  }, [ordinaryYear, selectedYearIds]);

  const changeTab = useCallback((value: number) => {
    setTab(value);
    setAmount("");
    setSelectedCells({});
    setSelectedRows(value === 1 && selectionType === "repartir" ? selectedYearIds(ordinaryYear) : []);
    setFractionYear(null);
    setResolution("");
    setResolutionCode(null);
  }, [ordinaryYear, selectedYearIds, selectionType]);

  const changeAmount = useCallback((value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) setAmount(value);
  }, []);

  const cellColor = useCallback((itemId: string, monthKey: string, debt: number) => {
    if (tab !== 1) return "transparent";
    if (selectionType === "seleccionar") return selectedCells[itemId]?.includes(monthKey) ? "#1976d2" : "transparent";
    const payment = distribution[itemId]?.[monthKey] || 0;
    if (!payment) return "transparent";
    return payment >= debt ? "#1976d2" : `linear-gradient(to right, #1976d2 ${(payment / debt) * 100}%, transparent ${(payment / debt) * 100}%)`;
  }, [distribution, selectedCells, selectionType, tab]);

  const fractionCellColor = useCallback((rowIndex: number, monthIndex: number) => {
    let remaining = Number(amount) || Number(fractionAmount.replace("S/.", "")) || 0;
    for (let month = 0; month < 12; month += 1) {
      for (let row = 0; row < fractionTributes.length; row += 1) {
        const debt = fractionTributes[row].valores[month] || 0;
        if (remaining > 0 && debt > 0) {
          if (row === rowIndex && month === monthIndex) return remaining >= debt ? "#1976d2" : `linear-gradient(to bottom, #1976d2 ${(remaining / debt) * 100}%, transparent ${(remaining / debt) * 100}%)`;
          remaining -= Math.min(remaining, debt);
        }
      }
    }
    return "transparent";
  }, [amount, fractionAmount, fractionTributes]);

  const resetPayment = useCallback(() => {
    setAmount("");
    setSelectionType("repartir");
    setSelectedRows(tab === 1 ? selectedYearIds(ordinaryYear) : []);
    setSelectedCells({});
    setFractionYear(null);
    setResolution("");
    setResolutionCode(null);
    setInstallments([]);
    setFractionTributes([]);
    setFractionAmount("");
  }, [ordinaryYear, selectedYearIds, tab]);

  const close = useCallback(() => {
    resetPayment();
    setTab(0);
    onClose();
  }, [onClose, resetPayment]);

  const pay = useCallback(() => {
    const numericAmount = Number(amount);
    if (!contributor || numericAmount <= 0) return;
    const payment = tab === 1
      ? crearPagoOrdinario(numericAmount, items, distribution, contributor)
      : tab === 2 && fractionYear
        ? crearPagoFraccionado(numericAmount, fractionYear, resolution, resolutionCode, installments, fractionTributes, contributor)
        : null;
    if (!payment?.conceptos.length) return;
    onPayment?.(payment);
    close();
  }, [amount, close, contributor, distribution, fractionTributes, fractionYear, installments, items, onPayment, resolution, resolutionCode, tab]);

  const canPay = tab === 1 ? Boolean(Number(amount) > 0 && !exceedsDebt && selectedRows.length) : tab === 2 ? Boolean(Number(amount) > 0 && fractionYear && installments.some((item) => item.checked)) : false;

  useModuleHotkeys("Deuda Contribuyente", [
    { id: "pagar-deuda", name: "Pagar", description: "Procesar el pago de la deuda seleccionada", hotkey: { key: "F4", preventDefault: true, enabled: open }, action: pay, enabled: open && canPay, icon: "payment" },
    { id: "nuevo-pago", name: "Nuevo", description: "Limpiar campos para nuevo pago", hotkey: { key: "F2", preventDefault: true, enabled: open }, action: resetPayment, enabled: open && tab !== 0 && Boolean(amount || selectedRows.length), icon: "refresh" },
    { id: "cerrar-modal", name: "Cerrar", description: "Cerrar el modal de deuda", hotkey: { key: "Escape", preventDefault: true, enabled: open }, action: close, enabled: open, icon: "close" },
  ]);

  return {
    account, items, amount, changeAmount, selectionType, changeSelectionType, tab, changeTab,
    selectedRows, selectRow, selectCell, ordinaryYear, selectYear, distribution, cellColor, exceedsDebt,
    fractionYear, setFractionYear, resolution, setResolution, resolutionCode, setResolutionCode,
    installments, setInstallments, fractionTributes, setFractionTributes, fractionAmount, setFractionAmount,
    fractionCellColor, resetPayment, close, pay, canPay,
  };
};
