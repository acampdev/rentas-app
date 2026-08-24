import { LinearProgress, Paper } from "@mui/material";
import { ValorUnitarioHeader } from "./valorUnitarioList/ValorUnitarioHeader";
import { ValorUnitarioLegend } from "./valorUnitarioList/ValorUnitarioLegend";
import { ValorUnitarioMatrix } from "./valorUnitarioList/ValorUnitarioMatrix";
import type { ValorUnitarioListProps } from "./valorUnitarioList/valorUnitarioList.types";

export default function ValorUnitarioList({
  añoSeleccionado,
  onValorSeleccionado,
  onEliminar,
  onAnioChange,
  valoresUnitarios = [],
  loading = false,
}: ValorUnitarioListProps) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <ValorUnitarioHeader
        year={añoSeleccionado}
        loading={loading}
        onYearChange={onAnioChange}
      />
      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
      <ValorUnitarioMatrix
        values={valoresUnitarios}
        loading={loading}
        onSelect={onValorSeleccionado}
        onDelete={onEliminar}
      />
      <ValorUnitarioLegend />
    </Paper>
  );
}

export type { ValorUnitarioListProps } from "./valorUnitarioList/valorUnitarioList.types";
