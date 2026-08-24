import { Search as SearchIcon } from "@mui/icons-material";
import { Button, Stack, TextField, Typography } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import type { TimData } from "../../../services/timService";
import type {
  TimOption,
  TimSearchState,
  TimSearchValues,
} from "./registroTim.types";
import { TimResultsTable } from "./TimResultsTable";
import { TimTributoField } from "./TimTributoField";

interface Props {
  filters: TimSearchValues;
  setFilters: Dispatch<SetStateAction<TimSearchValues>>;
  options: TimOption[];
  loadingTributes: boolean;
  search: TimSearchState;
  deleting: boolean;
  onSearch: () => void;
  onEdit: (record: TimData) => void;
  onDelete: (record: TimData) => void;
}

export function TimSearchTab({
  filters,
  setFilters,
  options,
  loadingTributes,
  search,
  deleting,
  onSearch,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Stack spacing={4}>
      <Typography variant="h6" fontWeight={600}>
        Filtros de Búsqueda TIM
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          label="Año"
          type="number"
          value={filters.anio}
          onChange={(event) =>
            setFilters((previous) => ({
              ...previous,
              anio:
                Number.parseInt(event.target.value) || new Date().getFullYear(),
            }))
          }
          sx={{ width: 100 }}
          size="small"
          slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
        />
        <TextField
          label="Periodo (Mes)"
          type="number"
          value={filters.periodo}
          onChange={(event) =>
            setFilters((previous) => ({
              ...previous,
              periodo: Number.parseInt(event.target.value) || 1,
            }))
          }
          sx={{ width: 140 }}
          size="small"
          slotProps={{ htmlInput: { min: 1, max: 12 } }}
        />
        <TimTributoField
          value={filters.tributo}
          options={options}
          loading={loadingTributes}
          onChange={(tributo) =>
            setFilters((previous) => ({ ...previous, tributo }))
          }
        />
        <TextField
          label="Cód. Resolución"
          type="number"
          value={filters.resolucionInteres}
          onChange={(event) =>
            setFilters((previous) => ({
              ...previous,
              resolucionInteres: Number.parseInt(event.target.value) || 2,
            }))
          }
          sx={{ width: 150 }}
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={{
            height: 40,
            backgroundColor: "#3b82f6 !important",
            color: "white !important",
            fontWeight: "bold",
          }}
        >
          Buscar
        </Button>
      </Stack>
      <TimResultsTable
        state={search}
        deleting={deleting}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Stack>
  );
}
