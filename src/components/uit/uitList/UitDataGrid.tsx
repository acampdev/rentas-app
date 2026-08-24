import MoneyIcon from "@mui/icons-material/AttachMoney";
import {
  alpha,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import type { UITData } from "../../../services/uitService";

interface UitDataGridProps {
  rows: UITData[];
  columns: GridColDef<UITData>[];
  loading: boolean;
  searchTerm: string;
  paginationModel: GridPaginationModel;
  selectedId?: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export const UitDataGrid = ({
  rows,
  columns,
  loading,
  searchTerm,
  paginationModel,
  selectedId,
  onPaginationModelChange,
}: UitDataGridProps) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        height: 350,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 15]}
        disableRowSelectionOnClick
        loading={loading}
        rowHeight={56}
        getRowClassName={({ row }) =>
          row.id === selectedId ? "Mui-selected" : ""
        }
        localeText={{
          noRowsLabel: "No hay datos de UIT disponibles",
          paginationRowsPerPage: "Filas por página:",
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
        }}
        slots={{
          noRowsOverlay: () => (
            <Stack
              height="100%"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                }}
              >
                <MoneyIcon
                  sx={{
                    fontSize: 52,
                    color: alpha(theme.palette.primary.main, 0.4),
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  No hay datos de UIT disponibles
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {searchTerm
                    ? `No se encontraron resultados para "${searchTerm}"`
                    : "Aún no se han registrado valores UIT"}
                </Typography>
              </Box>
            </Stack>
          ),
          loadingOverlay: () => (
            <Stack
              height="100%"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <CircularProgress size={48} thickness={4} />
              <Typography color="text.secondary">
                Cargando datos de UIT...
              </Typography>
            </Stack>
          ),
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderBottom: `2px solid ${theme.palette.primary.main}`,
          },
          "& .MuiDataGrid-columnHeader": {
            justifyContent: "center",
            "&:focus, &:focus-within": { outline: "none" },
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: "primary.main",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: "0.85rem",
          },
          "& .MuiDataGrid-cell": {
            justifyContent: "center",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            "&:focus, &:focus-within": { outline: "none" },
          },
          "& .MuiDataGrid-row": {
            transition: "background-color 0.2s",
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) },
            "&.Mui-selected": {
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              borderLeft: `4px solid ${theme.palette.primary.main}`,
            },
          },
          "& .MuiDataGrid-footerContainer": {
            bgcolor: alpha(theme.palette.grey[50], 0.5),
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 4,
          },
        }}
      />
    </Paper>
  );
};
