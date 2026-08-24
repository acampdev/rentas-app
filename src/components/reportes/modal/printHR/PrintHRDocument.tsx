import { Box, Divider, Typography } from "@mui/material";
import type { HRData } from "../../../../services/hrService";
import type { HRContribuyente, HRTotals, PrintPageSize } from "./printHR.types";
import { formatHRNumber } from "./printHR.utils";

interface Props {
  pageSize: PrintPageSize;
  contribuyente: HRContribuyente | null;
  rows: HRData[];
  totals: HRTotals;
}
const border = "1px solid #854d0e";
const cell = { border, padding: 4 };

const Section = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => (
  <Box sx={{ border, borderRadius: 1, overflow: "hidden" }}>
    <Box sx={{ bgcolor: "#fef08a", px: 1, py: 0.25, borderBottom: border }}>
      <Typography sx={{ fontSize: 8.5, fontWeight: 800, color: "#854d0e" }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Box>
);

const PropertyTable = ({ rows }: { rows: HRData[] }) => (
  <Section title="VALOR DE LOS PREDIOS DECLARADOS">
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 7.5 }}>
      <thead>
        <tr style={{ background: "#fefce8" }}>
          <th style={cell}>N°</th>
          <th style={cell}>CÓD. PREDIO</th>
          <th style={cell}>TIPO</th>
          <th style={cell}>DIRECCIÓN</th>
          <th style={cell}>% COND.</th>
          <th style={cell}>AUTOAVALÚO</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((row, index) => (
            <tr key={`${row.codPredio}-${index}`}>
              <td style={cell}>{index + 1}</td>
              <td style={cell}>{row.codPredio}</td>
              <td style={cell}>{row.tipoPredio || "URBANO"}</td>
              <td style={cell}>{row.direccionFiscal}</td>
              <td style={cell}>{row.porcentajeCondomino || 100}%</td>
              <td style={{ ...cell, textAlign: "right" }}>
                S/ {formatHRNumber(row.autoavaluo)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} style={{ ...cell, textAlign: "center" }}>
              Sin predios declarados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </Section>
);

const TaxSummary = ({
  first,
  totals,
}: {
  first?: HRData;
  totals: HRTotals;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    <Section title="DATOS DEL CÓNYUGE">
      <Box sx={{ p: 0.6, fontSize: 8 }}>
        {first?.nombreRepresentanteOConyuge || "-"} &nbsp;{" "}
        {first?.numeroDocumentoRepresentanteOConyuge || ""}
      </Box>
    </Section>
    <Box sx={{ border, bgcolor: "#fefce8", p: 0.8, fontSize: 8 }}>
      <b>TOTAL AUTOAVALÚO:</b> S/ {formatHRNumber(totals.autoavaluo)}
      <br />
      <b>IMPUESTO ANUAL:</b> S/ {formatHRNumber(totals.impuestoAnual)}
      <br />
      <b>IMPUESTO TRIMESTRAL:</b> S/ {formatHRNumber(totals.impuestoTrimestral)}
    </Box>
    <Box sx={{ border, p: 0.8, textAlign: "center" }}>
      <Typography sx={{ fontSize: 7, fontWeight: 700 }}>
        DECLARO BAJO JURAMENTO QUE LOS DATOS CONSIGNADOS SON VERDADEROS
      </Typography>
      <Box sx={{ borderBottom: border, width: "80%", mx: "auto", mt: 3 }} />
      <Typography sx={{ fontSize: 7 }}>
        Firma del propietario o representante legal
      </Typography>
    </Box>
  </Box>
);

export const PrintHRDocument = ({
  pageSize,
  contribuyente,
  rows,
  totals,
}: Props) => {
  const today = new Date().toLocaleDateString("es-PE");
  const year = new Date().getFullYear();
  const first = rows[0];
  const owner =
    contribuyente?.contribuyente ||
    contribuyente?.nombreCompleto ||
    first?.nombreContribuyenteCompleto ||
    "-";
  const document =
    contribuyente?.numDocumento ||
    contribuyente?.dni ||
    first?.numeroDocumento ||
    "-";
  const address =
    contribuyente?.direccionFiscal || first?.direccionFiscal || "-";

  return (
    <Box
      id="printable-hr-document"
      sx={{
        width: pageSize === "A4" ? "210mm" : "216mm",
        minHeight: pageSize === "A4" ? "297mm" : "356mm",
        mx: "auto",
        bgcolor: "white",
        p: 2.5,
        border: "2px solid #854d0e",
        fontFamily: "Arial, sans-serif",
        color: "#422006",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "120px 1fr 180px",
          border: "2px solid #854d0e",
          mb: 1,
        }}
      >
        <Box
          sx={{
            borderRight: "2px solid #854d0e",
            bgcolor: "#fefce8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="h3" fontWeight={900} color="#854d0e">
            HR
          </Typography>
          <Box
            component="img"
            src="/escudoMDE.png"
            alt="Escudo municipal"
            sx={{ width: 34, height: 34, objectFit: "contain" }}
          />
        </Box>
        <Box sx={{ p: 0.8, textAlign: "center" }}>
          <Typography sx={{ fontSize: 13, fontWeight: 900, color: "#854d0e" }}>
            MUNICIPALIDAD DISTRITAL DE LA ESPERANZA
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
            DECLARACIÓN JURADA DE AUTOAVALÚO AÑO {year}
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 900, color: "#854d0e" }}>
            HOJA RESUMEN
          </Typography>
          <Typography sx={{ fontSize: 8.5, fontWeight: 700 }}>
            IMPUESTO AL VALOR DEL PATRIMONIO PREDIAL - DECRETO LEGISLATIVO 776
          </Typography>
        </Box>
        <Box sx={{ borderLeft: "2px solid #854d0e", p: 1, bgcolor: "#fefce8" }}>
          <Typography sx={{ fontSize: 8, fontWeight: 700 }}>
            F. N° &nbsp; 001
          </Typography>
          <Divider sx={{ borderColor: "#854d0e", my: 1 }} />
          <Typography sx={{ fontSize: 8, fontWeight: 700 }}>
            FECHA RECEPCIÓN &nbsp; {today}
          </Typography>
        </Box>
      </Box>

      <Section title="IDENTIFICACIÓN DEL CONTRIBUYENTE (PROPIETARIO)">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "110px 1fr 130px 100px",
            fontSize: 9,
          }}
        >
          <Box sx={{ p: 0.5, borderRight: border }}>
            <small>[4] COD. CONTRIB.</small>
            <br />
            <b>{contribuyente?.codigo || first?.codContribuyente || "-"}</b>
          </Box>
          <Box sx={{ p: 0.5, borderRight: border }}>
            <small>[5] APELLIDOS Y NOMBRES O RAZÓN SOCIAL</small>
            <br />
            <b>{owner}</b>
          </Box>
          <Box sx={{ p: 0.5, borderRight: border }}>
            <small>[3] R.U.C. / DNI</small>
            <br />
            <b>{document}</b>
          </Box>
          <Box sx={{ p: 0.5 }}>
            <small>[21] CLASE PERSONA</small>
            <br />
            <b>{first?.tipoContribuyente || "NATURAL"}</b>
          </Box>
        </Box>
      </Section>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 250px",
          gap: 1,
          my: 1,
        }}
      >
        <Section title="DOMICILIO FISCAL">
          <Box sx={{ p: 0.6, fontSize: 8 }}>
            <b>LA LIBERTAD / TRUJILLO / LA ESPERANZA</b>
            <br />
            {address}
          </Box>
        </Section>
        <Section title="CANTIDAD DE FORMULARIOS Y VALOR">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 7,
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={cell}>HR</th>
                <th style={cell}>PU</th>
                <th style={cell}>TOTAL</th>
                <th style={cell}>TOT. PAGAR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cell}>1</td>
                <td style={cell}>{rows.length || 1}</td>
                <td style={cell}>{(rows.length || 1) + 1}</td>
                <td style={cell}>
                  S/ {formatHRNumber(((rows.length || 1) + 1) * 5)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 260px",
          gap: 1,
          mb: 1,
        }}
      >
        <PropertyTable rows={rows} />
        <TaxSummary first={first} totals={totals} />
      </Box>
      <Section title="ESCALA DEL IMPUESTO PREDIAL ANUAL">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 6.5,
            textAlign: "center",
          }}
        >
          <tbody>
            <tr>
              <td style={cell}>Hasta 15 UIT</td>
              <td style={cell}>0.2 %</td>
              <td style={cell}>0.2% del autoavalúo</td>
            </tr>
            <tr>
              <td style={cell}>Más de 15 UIT hasta 60 UIT</td>
              <td style={cell}>0.6 %</td>
              <td style={cell}>0.6% del exceso de 15 UIT</td>
            </tr>
            <tr>
              <td style={cell}>Más de 60 UIT</td>
              <td style={cell}>1.0 %</td>
              <td style={cell}>1.0% del exceso de 60 UIT</td>
            </tr>
          </tbody>
        </table>
      </Section>
      <Box sx={{ mt: 1, p: 0.6, border, bgcolor: "#fffbeb" }}>
        <Typography sx={{ fontSize: 6.5 }}>
          El Impuesto Predial grava anualmente el valor de los predios urbanos y
          rústicos. La declaración se presenta anualmente, por transferencia o
          cuando lo determine la Administración Tributaria.
        </Typography>
      </Box>
      <Typography
        sx={{
          mt: 1,
          pt: 0.5,
          borderTop: border,
          textAlign: "center",
          fontSize: 8.5,
          fontWeight: 900,
          color: "#854d0e",
        }}
      >
        ¡CON TUS TRIBUTOS, CONSTRUIREMOS UN FUTURO MEJOR; LA ESPERANZA AVANZA!
      </Typography>
    </Box>
  );
};
