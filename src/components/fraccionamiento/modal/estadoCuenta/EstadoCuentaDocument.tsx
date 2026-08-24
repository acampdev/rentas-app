import { Box, Typography } from "@mui/material";
import type { Fraccionamiento } from "../../../../types/fraccionamiento.types";
import type { EstadoCuentaViewData } from "./estadoCuenta.types";
import { formatDate, formatMoney } from "./estadoCuenta.utils";

interface Props {
  data: EstadoCuentaViewData;
  fraccionamiento: Fraccionamiento | null;
}
const textSx = { fontSize: 11 };
const cellStyle = { textAlign: "center" as const, padding: 2 };

export function EstadoCuentaDocument({ data, fraccionamiento }: Props) {
  return (
    <Box
      id="estado-cuenta-print"
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        p: "12mm 15mm",
        boxSizing: "border-box",
        bgcolor: "white",
        color: "#000",
        boxShadow: 3,
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
          MUNICIPALIDAD DISTRITAL DE LA ESPERANZA
        </Typography>
        <Typography sx={{ fontSize: 12 }}>
          FECHA: <strong>{data.fechaEmision}</strong>
        </Typography>
      </Box>
      <Typography
        component="h1"
        sx={{ fontSize: 15, fontWeight: 700, textAlign: "center", my: 2.5 }}
      >
        ESTADO DE CUENTA FRACCIONADA
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "70px 120px 90px 1fr 70px 1fr",
          rowGap: 1.2,
        }}
      >
        <Typography sx={textSx}>Código:</Typography>
        <Typography sx={textSx}>{data.codigo}</Typography>
        <Typography sx={textSx}>Resolución:</Typography>
        <Typography sx={textSx}>
          {fraccionamiento?.codResolucion ?? "-"}
        </Typography>
        <Typography sx={textSx}>Usuario:</Typography>
        <Typography sx={textSx}>{data.usuario}</Typography>
        <Typography sx={textSx}>Sr. (a):</Typography>
        <Typography sx={{ ...textSx, gridColumn: "span 5" }}>
          {data.nombre}
        </Typography>
        <Typography sx={textSx}>Dirección:</Typography>
        <Typography sx={{ ...textSx, gridColumn: "span 5" }}>
          {data.direccion}
        </Typography>
      </Box>
      <Box sx={{ borderTop: "1px dotted #555", mt: 1, pt: 1 }}>
        <Typography sx={textSx}>{data.periodo}</Typography>
        <Typography sx={{ ...textSx, mt: 1 }}>
          Deuda Fraccionada S/ {formatMoney(data.deudaFraccionada)} Nuevos Soles
        </Typography>
        <Typography sx={{ ...textSx, mt: 1 }}>
          N° de Cuotas {fraccionamiento?.numeroCuotas ?? data.cronograma.length}
        </Typography>
      </Box>
      <Box sx={{ borderTop: "1px dotted #555", mt: 1.2, pt: 0.8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Nro. Cuota", "Importe", "Fecha Vencimiento", "Fecha Pago"].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      padding: "3px 8px",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>0</td>
              <td style={cellStyle}>S/ {formatMoney(data.cuotaInicial)}</td>
              <td style={cellStyle}>{formatDate(data.fechaCuotaInicial)}</td>
              <td style={cellStyle}>{formatDate(data.fechaCuotaInicial)}</td>
            </tr>
            {data.cronograma.map((fee) => (
              <tr key={`${fee.anio}-${fee.codResolucion}-${fee.numeroCuota}`}>
                <td style={cellStyle}>{fee.numeroCuota}</td>
                <td style={cellStyle}>S/ {formatMoney(fee.montoCuota)}</td>
                <td style={cellStyle}>{formatDate(fee.fechaVencimiento)}</td>
                <td style={cellStyle}>{formatDate(fee.fechaPago)}</td>
              </tr>
            ))}
            {data.cronograma.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 14 }}>
                  No se encontraron cuotas para el fraccionamiento seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
      <Typography
        sx={{
          borderTop: "1px dotted #555",
          borderBottom: "1px dotted #555",
          mt: 1,
          py: 1,
          fontSize: 11,
        }}
      >
        Saldo al {data.fechaEmision} S/. {formatMoney(data.saldoPendiente)}
      </Typography>
    </Box>
  );
}
