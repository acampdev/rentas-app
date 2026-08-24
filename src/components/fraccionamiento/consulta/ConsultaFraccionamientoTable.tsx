import PrintIcon from "@mui/icons-material/Print";
import ViewIcon from "@mui/icons-material/Visibility";
import {
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ChangeEvent } from "react";
import type { Fraccionamiento } from "../../../types/fraccionamiento.types";
import {
  formatMoney,
  formatPercentage,
  isSelectedFraccionamiento,
} from "./consultaFraccionamiento.adapters";

interface Props {
  rows: Fraccionamiento[];
  total: number;
  selected: Fraccionamiento | null;
  loading: boolean;
  page: number;
  rowsPerPage: number;
  onSelect: (row: Fraccionamiento) => void;
  onView: (row: Fraccionamiento) => void;
  onPrint: (row: Fraccionamiento) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const columns: Array<{
  label: string;
  align?: "left" | "right" | "center";
}> = [
  { label: "CÓD. CONTRIBUYENTE", align: "center" },
  { label: "TIPO RESOLUCIÓN" },
  { label: "DEUDA INSOLUTA", align: "right" },
  { label: "CUOTA INICIAL", align: "right" },
  { label: "N° CUOTAS", align: "center" },
  { label: "AÑO INICIO", align: "center" },
  { label: "PERIODO INICIO", align: "center" },
  { label: "AÑO FIN", align: "center" },
  { label: "PERIODO FIN", align: "center" },
  { label: "SOLICITANTE" },
  { label: "TIPO DOC." },
  { label: "N° DOCUMENTO" },
  { label: "CARGO" },
  { label: "AÑO", align: "center" },
  { label: "TASA MENSUAL", align: "right" },
  { label: "TOTAL INTERÉS", align: "right" },
  { label: "TOTAL FRACCIONADO", align: "right" },
  { label: "ACCIONES", align: "center" },
];

type DataRowProps = Pick<
  Props,
  "selected" | "onSelect" | "onView" | "onPrint"
> & { row: Fraccionamiento };

const DataRow = ({
  row,
  selected,
  onSelect,
  onView,
  onPrint,
}: DataRowProps) => (
  <TableRow
    hover
    selected={isSelectedFraccionamiento(selected, row)}
    onClick={() => onSelect(row)}
    sx={{ cursor: "pointer" }}
  >
    <TableCell align="center">{row.codContribuyente}</TableCell>
    <TableCell>{row.tipoResolucion}</TableCell>
    <TableCell align="right">{formatMoney(row.deudaInsoluta)}</TableCell>
    <TableCell align="right">{formatMoney(row.cuotaInicial)}</TableCell>
    <TableCell align="center">{row.numeroCuotas}</TableCell>
    <TableCell align="center">{row.anioDeudaInicio}</TableCell>
    <TableCell align="center">{row.periodoInicio}</TableCell>
    <TableCell align="center">{row.anioDeudaFin}</TableCell>
    <TableCell align="center">{row.periodoFin}</TableCell>
    <TableCell>{row.solicitante}</TableCell>
    <TableCell>{row.tipoDocumento}</TableCell>
    <TableCell>{row.numDocumento}</TableCell>
    <TableCell>{row.cargo}</TableCell>
    <TableCell align="center">{row.anio}</TableCell>
    <TableCell align="right">{formatPercentage(row.tasaMensual)}</TableCell>
    <TableCell align="right">{formatMoney(row.totalInteres)}</TableCell>
    <TableCell align="right" sx={{ fontWeight: 600 }}>
      {formatMoney(row.totalFraccionado)}
    </TableCell>
    <TableCell align="center">
      <Stack direction="row" spacing={0.5} justifyContent="center">
        <Tooltip title="Ver detalle">
          <IconButton
            size="small"
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              onView(row);
            }}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Imprimir convenio">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onPrint(row);
            }}
          >
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </TableCell>
  </TableRow>
);

export const ConsultaFraccionamientoTable = (props: Props) => (
  <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
    <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
      <Table stickyHeader sx={{ minWidth: 2000 }}>
        <TableHead>
          <TableRow>
            {columns.map(({ label, align }) => (
              <TableCell
                key={label}
                align={align}
                sx={{ bgcolor: "grey.100", fontWeight: 600, px: 2 }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Buscando fraccionamientos...
                </Typography>
              </TableCell>
            </TableRow>
          ) : props.rows.length > 0 ? (
            props.rows.map((row, index) => (
              <DataRow
                key={row.id !== undefined ? `fracc-${row.id}` : `row-${index}`}
                row={row}
                selected={props.selected}
                onSelect={props.onSelect}
                onView={props.onView}
                onPrint={props.onPrint}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                <Typography color="text.secondary">
                  No se encontraron resultados
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 50]}
      component="div"
      count={props.total}
      rowsPerPage={props.rowsPerPage}
      page={props.page}
      onPageChange={(_event, page) => props.onPageChange(page)}
      onRowsPerPageChange={props.onRowsPerPageChange}
    />
  </Paper>
);
