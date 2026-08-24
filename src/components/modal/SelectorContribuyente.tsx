import type { ContribuyenteListItem } from "../../hooks/useContribuyentes";
import {
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  TablePagination,
  TextField,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { SelectorContribuyenteActions } from "./selectorContribuyente/SelectorContribuyenteActions";
import { SelectorContribuyenteHeader } from "./selectorContribuyente/SelectorContribuyenteHeader";
import { SelectorContribuyenteTable } from "./selectorContribuyente/SelectorContribuyenteTable";
import type { SelectorContribuyenteProps } from "./selectorContribuyente/selectorContribuyente.types";
import { useSelectorContribuyente } from "./selectorContribuyente/useSelectorContribuyente";

const SelectorContribuyente = ({
  isOpen,
  onClose,
  onSelectContribuyente,
  selectedId,
  title = "Seleccionar Contribuyente",
}: SelectorContribuyenteProps) => {
  const selector = useSelectorContribuyente({ isOpen, selectedId });

  const selectAndClose = (item: ContribuyenteListItem) => {
    onSelectContribuyente(item);
    onClose();
  };
  const confirm = () => {
    if (selector.seleccionado) selectAndClose(selector.seleccionado);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 10,
          height: 600,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <SelectorContribuyenteHeader title={title} onClose={onClose} />
      <DialogContent
        sx={{
          p: 3,
          pt: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TextField
          fullWidth
          placeholder="Buscar por nombre, documento o código..."
          value={selector.searchTerm}
          onChange={(event) => selector.updateSearch(event.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
            endAdornment: selector.searchTerm ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => selector.updateSearch("")}
                  aria-label="Limpiar búsqueda"
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
            sx: { borderRadius: 2, bgcolor: "background.paper" },
          }}
          sx={{ mb: 3, flexShrink: 0 }}
        />
        {selector.error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2, flexShrink: 0 }}
          >
            Error al cargar contribuyentes: {String(selector.error)}
          </Alert>
        )}
        <SelectorContribuyenteTable
          contribuyentes={selector.visibles}
          loading={selector.loading}
          seleccionado={selector.seleccionado}
          onSelect={selector.setSeleccionado}
          onConfirmImmediately={selectAndClose}
        />
        <TablePagination
          component="div"
          count={selector.filtrados.length}
          page={selector.page}
          onPageChange={(_, page) => selector.setPage(page)}
          rowsPerPage={selector.rowsPerPage}
          onRowsPerPageChange={(event) =>
            selector.updateRowsPerPage(Number(event.target.value))
          }
          labelRowsPerPage="Filas:"
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ flexShrink: 0 }}
        />
      </DialogContent>
      <SelectorContribuyenteActions
        total={selector.filtrados.length}
        seleccionado={selector.seleccionado}
        onConfirm={confirm}
        onClose={onClose}
      />
    </Dialog>
  );
};

export default SelectorContribuyente;
