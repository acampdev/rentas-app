import { Box, Typography } from "@mui/material";
import { Fragment } from "react";
import type { Fraccionamiento } from "../../../types/fraccionamiento.types";
import type { ConvenioViewData } from "./convenioDeuda.types";
import {
  convenioCellStyle as cell,
  formatConvenioDate as date,
  formatConvenioMoney as money,
} from "./convenioDeuda.utils";

export const ConvenioDeudaDocument = ({
  data,
  fraccionamiento,
}: {
  data: ConvenioViewData;
  fraccionamiento: Fraccionamiento | null;
}) => (
  <Box
    id="convenio-deuda-print"
    sx={{
      width: "210mm",
      minHeight: "297mm",
      mx: "auto",
      p: "10mm 12mm",
      boxSizing: "border-box",
      bgcolor: "white",
      color: "#000",
      boxShadow: 3,
      fontFamily: "Arial, sans-serif",
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "start",
        mb: 3,
      }}
    >
      <Box sx={{ textAlign: "center", justifySelf: "start", width: 150 }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>
          Municipalidad Distrital
          <br />
          de la Esperanza
        </Typography>
        <Box
          component="img"
          src="/escudoMDE.png"
          alt="Escudo municipal"
          sx={{ width: 68, height: 68, objectFit: "contain", mt: 0.5 }}
        />
      </Box>
      <Typography
        component="h1"
        sx={{ fontSize: 15, fontWeight: 700, mt: 9, whiteSpace: "nowrap" }}
      >
        CONVENIO DE DEUDA POR FRACCIONAMIENTO
      </Typography>
      <Box sx={{ textAlign: "right" }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
          Gerencia de Administración Tributaria
        </Typography>
        <Typography sx={{ fontSize: 10, mt: 1 }}>
          {data.fechaEmision}
        </Typography>
        <Typography sx={{ fontSize: 10, mt: 1 }}>
          Usuario: <strong>{data.usuario}</strong>
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        mt: 4,
        mb: 5,
        display: "grid",
        gridTemplateColumns: "150px 1fr",
        rowGap: 0.8,
      }}
    >
      {[
        ["Contribuyente:", data.nombreContribuyente],
        ["DNI y/o RUC:", data.documento],
        ["Dirección:", data.direccion],
        [
          "Monto de Deuda:",
          `S/ ${money(fraccionamiento?.totalFraccionado ?? fraccionamiento?.deudaInsoluta)}`,
        ],
        [
          "Nro de Cuotas:",
          String(fraccionamiento?.numeroCuotas ?? data.cronograma.length),
        ],
        ["Cuota de Acogimiento:", `S/ ${money(data.cuotaInicial)}`],
        ["Teléfono:", data.telefono],
      ].map(([label, value]) => (
        <Fragment key={label}>
          <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: 10 }}>{value}</Typography>
        </Fragment>
      ))}
    </Box>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {[
            "N° Cuota",
            "Saldo",
            "Amortización",
            "Interés",
            "Cuota",
            "Vencimiento",
          ].map((header) => (
            <th
              key={header}
              style={{ ...cell, fontWeight: 700, textAlign: "center" }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ ...cell, textAlign: "center" }}>0</td>
          <td style={{ ...cell, textAlign: "right" }} />
          <td style={{ ...cell, textAlign: "right" }}>
            {money(data.cuotaInicial)}
          </td>
          <td style={{ ...cell, textAlign: "right" }}>{money(0)}</td>
          <td style={{ ...cell, textAlign: "right", fontWeight: 700 }}>
            {money(data.cuotaInicial)}
          </td>
          <td style={{ ...cell, textAlign: "center" }}>
            {date(data.fechaCuotaInicial)}
          </td>
        </tr>
        {data.cronograma.map((cuota) => (
          <tr key={`${cuota.anio}-${cuota.codResolucion}-${cuota.numeroCuota}`}>
            <td style={{ ...cell, textAlign: "center" }}>
              {cuota.numeroCuota}
            </td>
            <td style={{ ...cell, textAlign: "right" }}>
              {money(cuota.saldoInicio)}
            </td>
            <td style={{ ...cell, textAlign: "right" }}>
              {money(cuota.amortizacion)}
            </td>
            <td style={{ ...cell, textAlign: "right" }}>
              {money(cuota.interes)}
            </td>
            <td style={{ ...cell, textAlign: "right", fontWeight: 700 }}>
              {money(cuota.montoCuota)}
            </td>
            <td style={{ ...cell, textAlign: "center" }}>
              {date(cuota.fechaVencimiento)}
            </td>
          </tr>
        ))}
        {data.cronograma.length === 0 && (
          <tr>
            <td
              colSpan={6}
              style={{ ...cell, textAlign: "center", padding: 16 }}
            >
              No se encontraron cuotas para el convenio seleccionado.
            </td>
          </tr>
        )}
      </tbody>
      {(data.cuotaInicial > 0 || data.cronograma.length > 0) && (
        <tfoot>
          <tr>
            <td style={cell} />
            <td style={{ ...cell, fontWeight: 700, textAlign: "right" }}>
              TOTALES
            </td>
            <td style={{ ...cell, fontWeight: 700, textAlign: "right" }}>
              S/ {money(data.totals.amortizacion)}
            </td>
            <td style={{ ...cell, fontWeight: 700, textAlign: "right" }}>
              S/ {money(data.totals.interes)}
            </td>
            <td style={{ ...cell, fontWeight: 700, textAlign: "right" }}>
              S/ {money(data.totals.montoCuota)}
            </td>
            <td style={cell} />
          </tr>
        </tfoot>
      )}
    </table>
    {(data.cuotaInicial > 0 || data.cronograma.length > 0) && (
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, mr: 6 }}>
          Total Deuda:
        </Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
          S/ {money(data.totals.montoCuota)}
        </Typography>
      </Box>
    )}
  </Box>
);

export const convenioPrintCss = `@media print { body * { visibility: hidden !important; } #convenio-deuda-print, #convenio-deuda-print * { visibility: visible !important; } #convenio-deuda-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; } #convenio-deuda-print thead { display: table-header-group; } #convenio-deuda-print tr { break-inside: avoid; page-break-inside: avoid; } .no-print { display: none !important; } @page { size: A4 portrait; margin: 10mm; } }`;
