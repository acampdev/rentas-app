import { Box, Typography } from "@mui/material";
import type { CSSProperties } from "react";
import { formatMoney } from "./estadoDeuda.adapters";
import type {
  DeudaAnualReporte,
  EstadoDeudaIdentity,
  EstadoDeudaTotals,
} from "./estadoDeuda.types";

interface Props {
  rows: DeudaAnualReporte[];
  totals: EstadoDeudaTotals;
  identity: EstadoDeudaIdentity;
}

const cellStyle: CSSProperties = {
  padding: "5px 8px",
  fontSize: 11,
  textAlign: "right",
};

const headers = [
  "Año",
  "Periodo",
  "Monto",
  "InteresM.",
  "Fracción",
  "PagoTotal",
];

export function EstadoDeudaDocument({ rows, totals, identity }: Props) {
  return (
    <Box
      id="estado-deuda-print"
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        p: "15mm 12mm",
        boxSizing: "border-box",
        bgcolor: "white",
        color: "#000",
        boxShadow: 3,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Typography sx={{ textAlign: "center", fontSize: 12 }}>
        VERIFICACIÓN DE ESTADO DE DEUDA
      </Typography>
      <Box
        sx={{ borderTop: "1px dotted #555", width: "42%", mx: "auto", mt: 1.2 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "100px 70px 1fr",
          rowGap: 0.7,
          mt: 3.5,
        }}
      >
        <Typography sx={{ fontSize: 11 }}>Contribuyente:</Typography>
        <Typography sx={{ fontSize: 11 }}>{identity.codigo}</Typography>
        <Typography sx={{ fontSize: 11 }}>{identity.nombre}</Typography>
        <Typography sx={{ fontSize: 11 }}>Dirección:</Typography>
        <Typography sx={{ fontSize: 11 }}>:</Typography>
        <Typography sx={{ fontSize: 11 }}>{identity.direccion}</Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          rowGap: 0.6,
          mt: 2,
        }}
      >
        <Typography sx={{ fontSize: 11 }}>Impreso por:</Typography>
        <Typography sx={{ fontSize: 11 }}>{identity.usuario}</Typography>
        <Typography sx={{ fontSize: 11 }}>Fecha y Hora:</Typography>
        <Typography sx={{ fontSize: 11 }}>{identity.fechaHora}</Typography>
      </Box>
      <Box sx={{ borderTop: "1px dotted #555", mt: 0.7, pt: 0.4 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  style={{
                    ...cellStyle,
                    textAlign:
                      index === 0 ? "center" : index === 1 ? "left" : "right",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.anio}>
                <td style={{ ...cellStyle, textAlign: "center" }}>
                  {row.anio}
                </td>
                <td
                  style={{
                    ...cellStyle,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {Array.from(row.periodos)
                    .sort((a, b) => a - b)
                    .join(" ")}
                </td>
                <td style={cellStyle}>{formatMoney(row.monto)}</td>
                <td style={cellStyle}>{formatMoney(row.interes)}</td>
                <td style={cellStyle}>{formatMoney(row.fraccion)}</td>
                <td style={cellStyle}>{formatMoney(row.pagoTotal)}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td
                  colSpan={6}
                  style={{ ...cellStyle, textAlign: "center", padding: 16 }}
                >
                  No se encontraron deudas de años anteriores.
                </td>
              </tr>
            )}
          </tbody>
          {!!rows.length && (
            <tfoot>
              <tr
                style={{
                  borderTop: "1px dotted #555",
                  borderBottom: "1px dotted #555",
                }}
              >
                <td colSpan={2} style={{ ...cellStyle, fontWeight: 700 }}>
                  Total:
                </td>
                <td style={{ ...cellStyle, fontWeight: 700 }}>
                  {formatMoney(totals.monto)}
                </td>
                <td style={{ ...cellStyle, fontWeight: 700 }}>
                  {formatMoney(totals.interes)}
                </td>
                <td style={{ ...cellStyle, fontWeight: 700 }}>
                  {formatMoney(totals.fraccion)}
                </td>
                <td style={{ ...cellStyle, fontWeight: 700 }}>
                  {formatMoney(totals.pagoTotal)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </Box>
    </Box>
  );
}
