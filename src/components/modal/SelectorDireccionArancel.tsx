// src/components/modal/SelectorDireccionArancel.tsx
import { Box, Dialog, DialogContent, useTheme } from "@mui/material";
import { SelectorArancelActions } from "./selectorDireccionArancel/SelectorArancelActions";
import { SelectorArancelFilters } from "./selectorDireccionArancel/SelectorArancelFilters";
import { SelectorArancelHeader } from "./selectorDireccionArancel/SelectorArancelHeader";
import { SelectorArancelPagination } from "./selectorDireccionArancel/SelectorArancelPagination";
import { SelectorArancelTable } from "./selectorDireccionArancel/SelectorArancelTable";
import type { SelectorDireccionArancelProps } from "./selectorDireccionArancel/selectorDireccionArancel.types";
import { useSelectorDireccionArancel } from "./selectorDireccionArancel/useSelectorDireccionArancel";

const SelectorDireccionArancel = ({
  open,
  onClose,
  onSelectArancel,
  title,
  useGeneralApi = true,
}: SelectorDireccionArancelProps) => {
  const theme = useTheme();
  const controller = useSelectorDireccionArancel({
    open,
    onClose,
    onSelectArancel,
    useGeneralApi,
  });
  const search = useGeneralApi
    ? controller.buscarConApiGeneral
    : controller.buscarPorCodDireccion;

  return (
    <Dialog
      open={open}
      onClose={controller.close}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "70vh",
          maxHeight: "90vh",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: theme.shadows[20],
        },
      }}
    >
      <SelectorArancelHeader title={title} useGeneralApi={useGeneralApi} />
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <SelectorArancelFilters
            useGeneralApi={useGeneralApi}
            parametroBusqueda={controller.parametroBusqueda}
            anioSeleccionado={controller.anioSeleccionado}
            codDireccionBusqueda={controller.codDireccionBusqueda}
            loading={controller.loadingBusqueda}
            hasResults={controller.arancelesEncontrados.length > 0}
            onParametroChange={controller.setParametroBusqueda}
            onAnioChange={controller.setAnioSeleccionado}
            onCodDireccionChange={controller.setCodDireccionBusqueda}
            onResetPage={() => controller.setPage(0)}
            onSearch={() => void search()}
          />
        </Box>
        <Box sx={{ flex: 1, overflow: "auto", px: 3, pb: 2 }}>
          <SelectorArancelTable
            rows={controller.arancelesPaginados}
            totalRows={controller.arancelesEncontrados.length}
            loading={controller.loadingBusqueda}
            useGeneralApi={useGeneralApi}
            selectedArancel={controller.selectedArancel}
            anioSeleccionado={controller.anioSeleccionado}
            codDireccionBusqueda={controller.codDireccionBusqueda}
            onSelect={controller.setSelectedArancel}
          />
        </Box>
        <SelectorArancelPagination
          count={controller.arancelesEncontrados.length}
          page={controller.page}
          rowsPerPage={controller.rowsPerPage}
          onPageChange={controller.setPage}
          onRowsPerPageChange={(rows) => {
            controller.setRowsPerPage(rows);
            controller.setPage(0);
          }}
        />
      </DialogContent>
      <SelectorArancelActions
        selectedArancel={controller.selectedArancel}
        useGeneralApi={useGeneralApi}
        onClose={controller.close}
        onConfirm={controller.confirmSelection}
      />
    </Dialog>
  );
};

export default SelectorDireccionArancel;
