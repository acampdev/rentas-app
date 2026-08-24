// src/components/uit/UitList.tsx
import { Box, Paper, useTheme } from "@mui/material";
import { UitDataGrid } from "./uitList/UitDataGrid";
import { UitListFilters } from "./uitList/UitListFilters";
import { UitListHeader } from "./uitList/UitListHeader";
import type { UitListProps } from "./uitList/uitList.types";
import { useUitList } from "./uitList/useUitList";
import { useUitListColumns } from "./uitList/useUitListColumns";

const UitList = ({
  uits,
  onEditar,
  loading = false,
  uitSeleccionada,
}: UitListProps) => {
  const theme = useTheme();
  const controller = useUitList(uits);
  const columns = useUitListColumns(onEditar);

  return (
    <Paper
      elevation={3}
      sx={{
        maxHeight: 700,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <UitListHeader />
      <Box sx={{ px: 3, py: 2 }}>
        <UitListFilters
          searchTerm={controller.searchTerm}
          isSearching={controller.isSearching}
          hasSearched={controller.hasSearched}
          onSearchTermChange={controller.setSearchTerm}
          onSearch={() => void controller.search()}
          onClear={controller.clearSearch}
          onKeyDown={controller.handleSearchKeyDown}
        />
      </Box>
      <Box sx={{ px: 3, pb: 3 }}>
        <UitDataGrid
          rows={controller.rows}
          columns={columns}
          loading={loading || controller.isSearching}
          searchTerm={controller.searchTerm}
          paginationModel={controller.paginationModel}
          selectedId={uitSeleccionada?.id}
          onPaginationModelChange={controller.setPaginationModel}
        />
      </Box>
    </Paper>
  );
};

export default UitList;
