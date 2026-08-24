import {
  Alert,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { InstallmentsTable } from "./fraccionada/InstallmentsTable";
import { ResolutionTable } from "./fraccionada/ResolutionTable";
import { TributesTable } from "./fraccionada/TributesTable";
import type { DeudaFraccionadaProps } from "./deudaFraccionada.types";
import { useDeudaFraccionada } from "./useDeudaFraccionada";

export type {
  CuotaFraccionamiento,
  ResolucionFraccionamiento,
  TributoFraccionado,
} from "./deudaFraccionada.types";

const DeudaFraccionada = (props: DeudaFraccionadaProps) => {
  const {
    loading,
    error,
    resoluciones,
    tributes,
    selectResolution,
    toggleInstallment,
  } = useDeudaFraccionada(props);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={30} />
        <Typography variant="body2" color="text.secondary">
          Cargando cronograma de fraccionamiento...
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        gap: 1,
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <ResolutionTable
          rows={resoluciones}
          year={props.selectedAño}
          code={props.selectedResolucionCode}
          onSelect={selectResolution}
        />
        <InstallmentsTable
          rows={props.cuotasFraccionamiento}
          hasContributor={Boolean(props.codContribuyente)}
          onToggle={toggleInstallment}
        />
        <TributesTable
          rows={tributes}
          getColor={props.getCellColorFraccionamiento}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          Deuda Fraccionada:
        </Typography>
        <TextField
          value={props.montoFraccionado || "S/. 0.00"}
          size="small"
          disabled
          sx={{
            width: 150,
            "& .MuiInputBase-root": { bgcolor: "primary.main", color: "white" },
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "white",
              fontWeight: "bold",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.dark",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DeudaFraccionada;
