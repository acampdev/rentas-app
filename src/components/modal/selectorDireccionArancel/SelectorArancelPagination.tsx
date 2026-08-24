import { Box, TablePagination } from "@mui/material";

interface SelectorArancelPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export const SelectorArancelPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: SelectorArancelPaginationProps) => {
  if (!count) return null;
  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        px: 2,
      }}
    >
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(_event, value) => onPageChange(value)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          onRowsPerPageChange(Number(event.target.value))
        }
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count: total }) =>
          `${from}-${to} de ${total}`
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{ "& .MuiTablePagination-toolbar": { px: 0 } }}
      />
    </Box>
  );
};
