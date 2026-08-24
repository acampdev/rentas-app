import { Assignment, Close, Print } from "@mui/icons-material";
import {
  Box,
  Button,
  DialogTitle,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { PrintPageSize } from "./printHR.types";

interface Props {
  pageSize: PrintPageSize;
  onPageSizeChange: (value: PrintPageSize) => void;
  onPrint: () => void;
  onClose: () => void;
}

export const PrintHRHeader = ({
  pageSize,
  onPageSizeChange,
  onPrint,
  onClose,
}: Props) => (
  <DialogTitle
    className="no-print"
    sx={{
      background: "linear-gradient(135deg, #ca8a04 0%, #a16207 100%)",
      color: "white",
      py: 1.5,
      px: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Assignment />
      <Typography variant="h6" fontWeight="bold">
        Vista Previa de Impresión - Formulario HR (Hoja de Resumen)
      </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <ToggleButtonGroup
        value={pageSize}
        exclusive
        size="small"
        onChange={(_, value: PrintPageSize | null) =>
          value && onPageSizeChange(value)
        }
        sx={{
          bgcolor: "rgba(255,255,255,.2)",
          "& .MuiToggleButton-root": {
            color: "white",
            border: 0,
            fontWeight: 600,
          },
          "& .Mui-selected": {
            bgcolor: "white !important",
            color: "#a16207 !important",
          },
        }}
      >
        <ToggleButton value="A4">A4</ToggleButton>
        <ToggleButton value="OFICIO">OFICIO</ToggleButton>
      </ToggleButtonGroup>
      <Button
        variant="contained"
        startIcon={<Print />}
        onClick={onPrint}
        sx={{ bgcolor: "white", color: "#854d0e" }}
      >
        Imprimir
      </Button>
      <IconButton onClick={onClose} sx={{ color: "white" }} aria-label="Cerrar">
        <Close />
      </IconButton>
    </Box>
  </DialogTitle>
);
