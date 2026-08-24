import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import PrintIcon from "@mui/icons-material/Print";
import {
  Box,
  Button,
  DialogActions,
  DialogTitle,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { PrintPageSize } from "./printPU.types";

interface HeaderProps {
  pageSize: PrintPageSize;
  onPageSizeChange: (size: PrintPageSize) => void;
  onPrint: () => void;
  onClose: () => void;
}

export const PrintPUHeader = ({
  pageSize,
  onPageSizeChange,
  onPrint,
  onClose,
}: HeaderProps) => (
  <DialogTitle
    className="no-print"
    sx={{
      background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
      color: "white",
      py: 1.5,
      px: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <DescriptionIcon />
      <Typography variant="h6" fontWeight="bold">
        Vista Previa de Impresión - Formulario PU (Predio Urbano)
      </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <ToggleButtonGroup
        value={pageSize}
        exclusive
        onChange={(_event, value: PrintPageSize | null) =>
          value && onPageSizeChange(value)
        }
        size="small"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.15)",
          "& .MuiToggleButton-root": {
            color: "white",
            borderColor: "transparent",
            fontWeight: 600,
            fontSize: "0.75rem",
            "&.Mui-selected": { bgcolor: "white", color: "#15803d" },
          },
        }}
      >
        <ToggleButton value="A4">A4</ToggleButton>
        <ToggleButton value="OFICIO">OFICIO</ToggleButton>
      </ToggleButtonGroup>
      <Button
        variant="contained"
        startIcon={<PrintIcon />}
        onClick={onPrint}
        sx={{ bgcolor: "white", color: "#15803d", fontWeight: "bold" }}
      >
        Imprimir
      </Button>
      <IconButton onClick={onClose} sx={{ color: "white" }}>
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>
);

export const PrintPUFooter = ({
  onPrint,
  onClose,
}: Pick<HeaderProps, "onPrint" | "onClose">) => (
  <DialogActions
    className="no-print"
    sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #e2e8f0" }}
  >
    <Button onClick={onClose} variant="outlined" color="inherit">
      Cerrar
    </Button>
    <Button
      onClick={onPrint}
      variant="contained"
      startIcon={<PrintIcon />}
      sx={{ bgcolor: "#15803d", "&:hover": { bgcolor: "#166534" } }}
    >
      Imprimir Reporte PU
    </Button>
  </DialogActions>
);
