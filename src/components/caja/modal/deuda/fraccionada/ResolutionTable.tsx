import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { ResolucionFraccionamiento } from "../deudaFraccionada.types";

interface Props {
  rows: ResolucionFraccionamiento[];
  year: number | null;
  code?: number | null;
  onSelect: (row: ResolucionFraccionamiento) => void;
}

export const ResolutionTable = ({ rows, year, code, onSelect }: Props) => (
  <TableContainer
    component={Paper}
    variant="outlined"
    sx={{
      width: 120,
      minWidth: 120,
      height: "100%",
      borderRadius: 0,
      borderRight: 0,
      overflowY: "auto",
    }}
  >
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{ bgcolor: "#f5f5f5", fontWeight: "bold", fontSize: ".75rem" }}
          >
            Año
          </TableCell>
          <TableCell
            sx={{ bgcolor: "#f5f5f5", fontWeight: "bold", fontSize: ".75rem" }}
          >
            Res
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => {
          const selected = year === row.año && code === row.codResolucion;
          return (
            <TableRow
              key={`${row.año}-${row.codResolucion}`}
              hover
              onClick={() => onSelect(row)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell
                sx={{
                  fontSize: ".7rem",
                  bgcolor: selected ? "primary.main" : undefined,
                  color: selected ? "white" : undefined,
                }}
              >
                {row.año}
              </TableCell>
              <TableCell sx={{ fontSize: ".7rem" }}>{row.resolucion}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);
