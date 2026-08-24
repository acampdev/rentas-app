import { Box, Paper, Stack, TablePagination, Typography } from "@mui/material";
import type { DireccionData } from "../../services/direccionService";
import { DireccionListToolbar } from "./list/DireccionListToolbar";
import { DireccionTable } from "./list/DireccionTable";
import type { DireccionListProps } from "./list/direccionList.types";
import { useDireccionList } from "./list/useDireccionList";

const DireccionList = ({
  direcciones = [],
  direccionSeleccionada,
  onSelectDireccion,
  onEditDireccion,
  loading = false,
  onSearch,
  searchTerm = "",
}: DireccionListProps) => {
  const list = useDireccionList({ direcciones, onSearch, searchTerm });
  const edit = onEditDireccion ?? onSelectDireccion;

  const handleNew = () => {
    list.clearSearch();
    onEditDireccion?.({} as DireccionData);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        background: "linear-gradient(to bottom, #ffffff, #fafafa)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        <DireccionListToolbar
          searchTerm={list.localSearchTerm}
          onChange={list.changeSearch}
          onSearch={list.search}
          onNew={handleNew}
        />
        <DireccionTable
          rows={list.rows}
          selected={direccionSeleccionada}
          searchTerm={list.localSearchTerm}
          loading={loading}
          order={list.order}
          orderBy={list.orderBy}
          onSort={list.requestSort}
          onEdit={edit}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Mostrando {list.rows.length} de {list.total} direcciones
          </Typography>
          <TablePagination
            component="div"
            count={list.total}
            page={list.page}
            onPageChange={(_event, page) => list.setPage(page)}
            rowsPerPage={list.rowsPerPage}
            onRowsPerPageChange={list.changeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="Filas por página:"
            sx={{ border: "none" }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default DireccionList;
