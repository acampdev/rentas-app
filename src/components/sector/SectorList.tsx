import { Paper, Stack, TablePagination } from "@mui/material";
import { SectorListToolbar } from "./list/SectorListToolbar";
import { SectorTable } from "./list/SectorTable";
import type { SectorListProps } from "./list/sectorList.types";
import { useSectorList } from "./list/useSectorList";

const SectorList = ({
  sectores,
  onSelectSector,
  onEdit,
  isOfflineMode = false,
  loading = false,
  onSearch,
  searchTerm = "",
  selectedSector,
}: SectorListProps) => {
  const list = useSectorList({
    sectores,
    onSearch,
    searchTerm,
    onSelectSector,
  });

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "100%", md: "90%", lg: "100%" },
        minWidth: { xs: "100%", md: 700 },
        borderRadius: 2,
        background: "linear-gradient(to bottom, #ffffff, #fafafa)",
        border: "1px solid",
        borderColor: "divider",
        mx: "auto",
      }}
    >
      <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
        <SectorListToolbar
          searchTerm={list.localSearchTerm}
          isOfflineMode={isOfflineMode}
          onSearchChange={list.changeSearch}
          onClearSearch={list.clearSearch}
        />
        <SectorTable
          sectors={list.rows}
          selectedSector={selectedSector}
          searchTerm={list.localSearchTerm}
          loading={loading}
          order={list.order}
          orderBy={list.orderBy}
          onSort={list.requestSort}
          onEdit={(sector) => (onEdit ?? onSelectSector)(sector)}
        />
        <TablePagination
          component="div"
          count={list.total}
          page={list.page}
          onPageChange={(_event, page) => list.setPage(page)}
          rowsPerPage={list.rowsPerPage}
          onRowsPerPageChange={list.changeRowsPerPage}
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

export default SectorList;
