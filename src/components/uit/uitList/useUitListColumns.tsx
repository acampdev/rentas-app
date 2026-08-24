import EditIcon from "@mui/icons-material/Edit";
import {
  alpha,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import type { UITData } from "../../../services/uitService";
import { UitCell } from "./UitCell";
import { formatUitNumber } from "./uitList.adapters";

export const useUitListColumns = (
  onEditar?: (uit: UITData) => void,
): GridColDef<UITData>[] => {
  const theme = useTheme();
  return useMemo(
    () => [
      {
        field: "anio",
        headerName: "Año",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Chip
              label={value}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 600, height: 24 }}
            />
          </UitCell>
        ),
      },
      {
        field: "valorUit",
        headerName: "Valor UIT",
        width: 130,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Typography variant="body2" fontWeight={700} color="success.main">
              S/ {formatUitNumber(row.valorUit ?? row.valor ?? 0)}
            </Typography>
          </UitCell>
        ),
      },
      {
        field: "alicuota",
        headerName: "Alícuota (%)",
        width: 130,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Typography variant="body2" fontWeight={500}>
              {value ? `${(Number(value) * 100).toFixed(1)}%` : "-"}
            </Typography>
          </UitCell>
        ),
      },
      {
        field: "rangoInicial",
        headerName: "Rango Inicial",
        width: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Typography variant="body2" color="text.secondary">
              {value !== undefined ? formatUitNumber(Number(value)) : "-"}
            </Typography>
          </UitCell>
        ),
      },
      {
        field: "rangoFinal",
        headerName: "Rango Final",
        width: 130,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Typography variant="body2" color="text.secondary">
              {value === 0
                ? "∞"
                : value !== undefined
                  ? formatUitNumber(Number(value))
                  : "-"}
            </Typography>
          </UitCell>
        ),
      },
      {
        field: "impuestoParcial",
        headerName: "Imp. Parcial",
        width: 130,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Typography variant="body2" color="info.main" fontWeight={500}>
              {value !== undefined ? formatUitNumber(Number(value)) : "-"}
            </Typography>
          </UitCell>
        ),
      },
      {
        field: "impuestoAcumulado",
        headerName: "Imp. Acumulado",
        width: 160,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Typography variant="body2" color="warning.main" fontWeight={600}>
              {value !== undefined ? formatUitNumber(Number(value)) : "-"}
            </Typography>
          </UitCell>
        ),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 120,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<UITData>) => (
          <UitCell>
            <Tooltip title="Editar UIT" arrow>
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditar?.(row);
                }}
                aria-label={`Editar UIT ${row.anio}`}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  width: 28,
                  height: 28,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: "scale(1.05)",
                  },
                }}
              >
                <EditIcon sx={{ fontSize: 16, color: "primary.main" }} />
              </IconButton>
            </Tooltip>
          </UitCell>
        ),
      },
    ],
    [onEditar, theme],
  );
};
