import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { ContribuyenteOption } from "../../../models/Caja";

export const DeudaContribuyenteSummary = ({ contributor }: { contributor: ContribuyenteOption }) => (
  <TableContainer component={Paper} variant="outlined">
    <Table size="small">
      <TableHead><TableRow><TableCell sx={{ fontWeight: 700, bgcolor: "action.hover" }}>Código</TableCell><TableCell sx={{ fontWeight: 700, bgcolor: "action.hover" }}>Contribuyente</TableCell><TableCell sx={{ fontWeight: 700, bgcolor: "action.hover" }}>Dirección</TableCell></TableRow></TableHead>
      <TableBody><TableRow><TableCell>{contributor.codigo || contributor.codigoPredio || "---"}</TableCell><TableCell>{contributor.contribuyente || contributor.nombreCompleto || contributor.label || "---"}</TableCell><TableCell>{contributor.direccion || contributor.direccionPredio || "---"}</TableCell></TableRow></TableBody>
    </Table>
  </TableContainer>
);
