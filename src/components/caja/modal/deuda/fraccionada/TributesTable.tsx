import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { TributoFraccionado } from "../deudaFraccionada.types";

interface Props {
  rows: TributoFraccionado[];
  getColor: (row: number, month: number) => string;
}

export const TributesTable = ({ rows, getColor }: Props) => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      height: "100%",
      overflow: "hidden",
      border: "1px solid #e0e0e0",
    }}
  >
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ flex: 1, height: "100%", overflow: "auto" }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                bgcolor: "#f5f5f5",
                fontWeight: "bold",
                fontSize: ".75rem",
                position: "sticky",
                left: 0,
                zIndex: 3,
                borderRight: "1px solid #e0e0e0",
              }}
            >
              Tributo
            </TableCell>
            {Array.from({ length: 12 }, (_, index) => (
              <TableCell
                key={index}
                align="right"
                sx={{
                  bgcolor: "#f5f5f5",
                  fontWeight: "bold",
                  fontSize: ".7rem",
                  minWidth: 45,
                }}
              >
                {index + 1}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={`${row.anio}-${row.tributo}`}>
              <TableCell
                sx={{
                  fontSize: ".7rem",
                  position: "sticky",
                  left: 0,
                  bgcolor: "white",
                  zIndex: 2,
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                {row.tributo} ({row.anio})
              </TableCell>
              {row.valores.map((value, monthIndex) => {
                const color = getColor(rowIndex, monthIndex);
                return (
                  <TableCell
                    key={monthIndex}
                    align="right"
                    sx={{
                      fontSize: ".65rem",
                      minWidth: 45,
                      background: color,
                      color: color !== "transparent" ? "white" : "inherit",
                    }}
                  >
                    {value > 0 ? value.toFixed(2) : "-"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);
