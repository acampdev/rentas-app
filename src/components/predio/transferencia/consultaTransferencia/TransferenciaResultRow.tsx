import { Edit as EditIcon } from "@mui/icons-material";
import {
  alpha,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  useTheme,
} from "@mui/material";
import type { TransferenciaPredioData } from "../../../../services/transferenciaService";

interface Props {
  row: TransferenciaPredioData;
  index: number;
  onEdit: (row: TransferenciaPredioData) => void;
}

const cellSx = { whiteSpace: "nowrap", fontSize: "0.8rem" } as const;

export function TransferenciaResultRow({ row, index, onEdit }: Props) {
  const theme = useTheme();
  return (
    <TableRow
      hover
      sx={{
        backgroundColor:
          index % 2 ? alpha(theme.palette.grey[500], 0.04) : "transparent",
        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
        "&:last-child td": { border: 0 },
      }}
    >
      <TableCell sx={cellSx}>{row.codTransferencia}</TableCell>
      <TableCell sx={cellSx}>{row.anio}</TableCell>
      <TableCell sx={cellSx}>{row.codPredio}</TableCell>
      <TableCell sx={cellSx}>{row.codContribuyenteVenta}</TableCell>
      <TableCell sx={{ ...cellSx, fontWeight: 500 }}>
        {row.nombreContribuyenteVenta || "-"}
      </TableCell>
      <TableCell sx={cellSx}>{row.codContribuyenteCompra}</TableCell>
      <TableCell sx={{ ...cellSx, fontWeight: 500 }}>
        {row.nombreContribuyenteCompra || "-"}
      </TableCell>
      <TableCell align="right" sx={cellSx}>
        {row.porcentajeTransferencia.toLocaleString("es-PE", {
          maximumFractionDigits: 2,
        })}
        %
      </TableCell>
      <TableCell sx={cellSx}>{row.fechaMinuta}</TableCell>
      <TableCell sx={cellSx}>{row.documento}</TableCell>
      <TableCell sx={cellSx}>
        {row.descripcionModoTransferencia || row.codModoTransferencia}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          ...cellSx,
          fontFamily: "monospace",
          fontWeight: 600,
          color: theme.palette.success.main,
        }}
      >
        {row.valorTransferencia.toLocaleString("es-PE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </TableCell>
      <TableCell align="center">
        <Chip
          label={row.esConstructor ? "Sí" : "No"}
          size="small"
          color={row.esConstructor ? "success" : "default"}
          variant="outlined"
        />
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Editar transferencia" arrow>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(row)}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
