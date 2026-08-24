import { CreditCard, History, Receipt, Schedule } from "@mui/icons-material";
import { Box, Button, Chip, Container, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { EstadoCaja } from "./cajaPage.types";

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));
const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  color: "white",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
}));
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
}));
const disabledSx = {
  "&.Mui-disabled": {
    background: "#e0e0e0 !important",
    color: "#a0a0a0 !important",
  },
};

export const CajaHeader = ({ abierta }: { abierta: boolean }) => (
  <HeaderBox>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <CreditCard sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Gestión de Caja
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Sistema de control de ingresos y egresos
          </Typography>
        </Box>
      </Box>
      <Chip
        label={abierta ? "CAJA ABIERTA" : "CAJA CERRADA"}
        sx={{
          fontWeight: "bold",
          fontSize: "0.9rem",
          px: 2,
          py: 1,
          color: "white",
          background: abierta
            ? "linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)"
            : "linear-gradient(135deg, #f44336 0%, #e57373 100%)",
        }}
      />
    </Box>
  </HeaderBox>
);

interface ControlsProps {
  estado: EstadoCaja;
  onOpen: () => void;
  onClose: () => void;
  onMovements: () => void;
  onHistory: () => void;
}
export const CajaControls = ({
  estado,
  onOpen,
  onClose,
  onMovements,
  onHistory,
}: ControlsProps) => (
  <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Controles de Caja
    </Typography>
    <Box display="flex" gap={2} flexWrap="wrap">
      <ActionButton
        variant="contained"
        startIcon={<CreditCard />}
        onClick={onOpen}
        disabled={estado.abierta}
        sx={{
          background:
            "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%) !important",
          color: "#fff !important",
          "&:hover": {
            background:
              "linear-gradient(45deg, #388e3c 30%, #4caf50 90%) !important",
          },
          ...disabledSx,
        }}
      >
        Abrir Caja
      </ActionButton>
      <ActionButton
        variant="contained"
        startIcon={<Schedule />}
        onClick={onClose}
        disabled={!estado.abierta}
        sx={{
          background:
            "linear-gradient(45deg, #f44336 30%, #e57373 90%) !important",
          color: "#fff !important",
          "&:hover": {
            background:
              "linear-gradient(45deg, #d32f2f 30%, #f44336 90%) !important",
          },
          ...disabledSx,
        }}
      >
        Cerrar Caja
      </ActionButton>
      <ActionButton
        variant="outlined"
        startIcon={<Receipt />}
        onClick={onMovements}
        disabled={!estado.abierta}
        sx={{
          borderColor: "#10b981 !important",
          color: "#10b981 !important",
          "&:hover": {
            borderColor: "#059669 !important",
            backgroundColor: "rgba(16, 185, 129, 0.08) !important",
          },
          "&.Mui-disabled": {
            borderColor: "#e0e0e0 !important",
            color: "#a0a0a0 !important",
          },
        }}
      >
        Ver Movimientos
      </ActionButton>
      <ActionButton
        variant="outlined"
        startIcon={<History />}
        onClick={onHistory}
        sx={{
          borderColor: "#1976d2 !important",
          color: "#1976d2 !important",
          "&:hover": {
            borderColor: "#115293 !important",
            backgroundColor: "rgba(25, 118, 210, 0.08) !important",
          },
        }}
      >
        Historial Aperturas
      </ActionButton>
    </Box>
  </Paper>
);
