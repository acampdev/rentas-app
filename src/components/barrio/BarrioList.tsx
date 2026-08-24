import { Paper, Stack, TablePagination } from "@mui/material";
import { BarrioListSearch } from "./BarrioListSearch";
import { BarrioListTable } from "./BarrioListTable";
import type { BarrioListProps } from "./barrioList.types";
import { useBarrioList } from "./useBarrioList";

export type { BarrioListProps } from "./barrioList.types";

const BarrioList = ({
  barrios = [],
  sectores = [],
  onEdit,
  onSelect,
  onSelectBarrio,
  loading = false,
  searchTerm = "",
  onSearch,
  selectedBarrio,
}: BarrioListProps) => {
  const controller = useBarrioList({ barrios, sectores, searchTerm, onSearch });
  const handleRowClick = onSelectBarrio || onSelect || onEdit;
  const handleEdit = onEdit || onSelectBarrio;

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: 2,
        background: "linear-gradient(to bottom, #fff, #fafafa)",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <BarrioListSearch
          value={controller.localSearchTerm}
          onChange={controller.changeSearch}
        />
        <BarrioListTable
          rows={controller.visibleRows}
          loading={loading}
          query={controller.localSearchTerm}
          selected={selectedBarrio}
          order={controller.order}
          orderBy={controller.orderBy}
          getSectorName={controller.getSectorName}
          onSort={controller.requestSort}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
        />
        <TablePagination
          component="div"
          count={controller.rows.length}
          page={controller.page}
          onPageChange={(_, page) => controller.setPage(page)}
          rowsPerPage={controller.rowsPerPage}
          onRowsPerPageChange={controller.changeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: 1, borderColor: "divider" }}
        />
      </Stack>
    </Paper>
  );
};

export default BarrioList;
