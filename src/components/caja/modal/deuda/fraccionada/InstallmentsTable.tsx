import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { CuotaFraccionamiento } from "../deudaFraccionada.types";

interface Props {
  rows: CuotaFraccionamiento[];
  hasContributor: boolean;
  onToggle: (number: number) => void;
}
const headerSx = { bgcolor: "#f5f5f5", fontWeight: "bold", fontSize: ".75rem" };

export const InstallmentsTable = ({
  rows,
  hasContributor,
  onToggle,
}: Props) => (
  <TableContainer
    component={Paper}
    variant="outlined"
    sx={{
      width: 350,
      minWidth: 350,
      height: "100%",
      borderRadius: 0,
      borderRight: 0,
      overflowY: "auto",
    }}
  >
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...headerSx, width: 30 }} />
          <TableCell sx={headerSx}>N°Cuota</TableCell>
          <TableCell align="right" sx={headerSx}>
            Deuda
          </TableCell>
          <TableCell align="right" sx={headerSx}>
            Interés
          </TableCell>
          <TableCell align="right" sx={headerSx}>
            Cuota
          </TableCell>
          <TableCell sx={headerSx}>F.Venc.</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <TableRow key={row.nCuota} sx={{ opacity: row.pagado ? 0.6 : 1 }}>
              <TableCell sx={{ p: 0.5 }}>
                <Checkbox
                  size="small"
                  checked={row.checked}
                  disabled={row.pagado}
                  onChange={() => onToggle(row.nCuota)}
                  sx={{ p: 0 }}
                />
              </TableCell>
              <TableCell
                sx={{
                  fontSize: ".7rem",
                  fontWeight: row.pagado ? "normal" : "bold",
                }}
              >
                {row.nCuota} {row.pagado && "(Pagada)"}
              </TableCell>
              <TableCell align="right" sx={{ fontSize: ".7rem" }}>
                {row.deuda.toFixed(2)}
              </TableCell>
              <TableCell align="right" sx={{ fontSize: ".7rem" }}>
                {row.im.toFixed(2)}
              </TableCell>
              <TableCell align="right" sx={{ fontSize: ".7rem" }}>
                {row.cuota.toFixed(2)}
              </TableCell>
              <TableCell sx={{ fontSize: ".7rem" }}>{row.fVenc}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              align="center"
              sx={{ fontSize: ".7rem", color: "text.secondary", py: 2 }}
            >
              {hasContributor
                ? "Seleccione una resolución para ver las cuotas"
                : "Seleccione un contribuyente"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);
