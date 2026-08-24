import { Box, Typography } from "@mui/material";
import { formatPUNumber, numberOr } from "./printPU.utils";
import type { PrintablePUData } from "./printPU.types";

const border = "1px solid #166534";
const headings = [
  "PISO",
  "FECHA CONSTR.",
  "CATEGORÍAS",
  "[7] VALOR UNIT. S/",
  "[8] (+5%) S/",
  "[12] % DEPREC.",
  "[14] VAL. DEPREC. S/",
  "[15] ÁREA M2",
  "[16] VALOR CONSTR. S/",
];

export const PrintPUValuation = ({ pu }: { pu: PrintablePUData | null }) => {
  const unitValue = numberOr(pu?.valorUnitario, 350);
  return (
    <Box sx={{ border: "1.5px solid #166534", mb: 1, borderRadius: "4px" }}>
      <Box
        sx={{
          bgcolor: "#dcfce7",
          px: 1,
          py: 0.2,
          textAlign: "center",
          borderBottom: "1px solid #166534",
        }}
      >
        <Typography fontWeight="bold" sx={{ fontSize: "9px" }}>
          DETERMINACIÓN DEL AUTOAVALÚO
        </Typography>
      </Box>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "8px",
          textAlign: "center",
        }}
      >
        <thead>
          <tr style={{ background: "#f0fdf4" }}>
            {headings.map((heading) => (
              <th key={heading} style={{ border, padding: 2 }}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pu ? (
            <tr style={{ height: 22 }}>
              <td style={{ border }}>1° PISO</td>
              <td style={{ border }}>01/2020</td>
              <td style={{ border, fontWeight: "bold" }}>B - C - D - E - C</td>
              <td style={{ border }}>S/ {formatPUNumber(unitValue)}</td>
              <td style={{ border }}>S/ {formatPUNumber(unitValue * 0.05)}</td>
              <td style={{ border }}>{pu.depreciacion || 10}%</td>
              <td style={{ border }}>S/ {formatPUNumber(unitValue * 0.9)}</td>
              <td style={{ border, fontWeight: "bold" }}>
                {formatPUNumber(numberOr(pu.areaTerreno, 120))}
              </td>
              <td style={{ border, fontWeight: "bold" }}>
                S/ {formatPUNumber(numberOr(pu.autoavaluo, 42000))}
              </td>
            </tr>
          ) : (
            [1, 2, 3].map((row) => (
              <tr key={row} style={{ height: 20 }}>
                {headings.map((heading) => (
                  <td key={heading} style={{ border }}>
                    -
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Box>
  );
};

const TotalRow = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      py: 0.3,
      borderBottom: border,
    }}
  >
    <Typography sx={{ fontSize: "8.5px" }}>{label}</Typography>
    <Typography fontWeight="bold">{value}</Typography>
  </Box>
);

export const PrintPUTerrainTotals = ({
  pu,
}: {
  pu: PrintablePUData | null;
}) => {
  const area = numberOr(pu?.areaTerreno, 120);
  const unitValue = numberOr(pu?.valorUnitario, 150);
  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 1, mb: 1 }}
    >
      <Box sx={{ border: "1.5px solid #166534", borderRadius: "4px", p: 0.8 }}>
        <Typography
          fontWeight="bold"
          sx={{ fontSize: "8px", display: "block", mb: 0.5 }}
        >
          DATOS DEL TERRENO:
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0.5,
            mb: 1,
          }}
        >
          <Box sx={{ border, p: 0.3 }}>
            <Typography sx={{ fontSize: "6.5px" }}>
              FECHA ADQUISICIÓN
            </Typography>
            <Typography fontWeight="bold">01/01/2015</Typography>
          </Box>
          <Box sx={{ border, p: 0.3 }}>
            <Typography sx={{ fontSize: "6.5px" }}>[23] ÁREA M2</Typography>
            <Typography fontWeight="bold">{formatPUNumber(area)} M²</Typography>
          </Box>
          <Box sx={{ border, p: 0.3 }}>
            <Typography sx={{ fontSize: "6.5px" }}>
              [24] VALOR ARANCEL M2
            </Typography>
            <Typography fontWeight="bold">
              S/ {formatPUNumber(unitValue)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
            sx={{ fontSize: "7.5px", fontStyle: "italic", fontWeight: "bold" }}
          >
            DECLARO BAJO JURAMENTO QUE LOS DATOS CONSIGNADOS SON VERDADEROS
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 0.5 }}
          >
            <Typography sx={{ fontSize: "8px" }}>
              DE ____________________
            </Typography>
            <Typography sx={{ fontSize: "8px" }}>
              DEL {new Date().getFullYear()}
            </Typography>
          </Box>
          <Box
            sx={{ borderBottom: border, width: "70%", margin: "20px auto 2px" }}
          />
          <Typography sx={{ fontSize: "7.5px", fontWeight: "bold" }}>
            Firma del Propietario o Representante Legal
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          border: "1.5px solid #166534",
          borderRadius: "4px",
          p: 0.8,
          bgcolor: "#f0fdf4",
        }}
      >
        <TotalRow
          label="TOTAL ÁREA CONSTRUIDA M2:"
          value={`${formatPUNumber(area)} M²`}
        />
        <TotalRow
          label="[19] VALOR TOTAL CONSTRUCCIÓN:"
          value={`S/ ${formatPUNumber(numberOr(pu?.autoavaluo, 42000))}`}
        />
        <TotalRow
          label="[20] VALOR TERRENO (23 * 24):"
          value={`S/ ${formatPUNumber(area * unitValue)}`}
        />
        <TotalRow label="[21] OTRAS INSTALACIONES:" value="S/ 0.00" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.5,
            bgcolor: "#dcfce7",
            px: 0.5,
            mt: 0.5,
            border,
          }}
        >
          <Typography sx={{ fontSize: "9px", fontWeight: 900 }}>
            [22] AUTOAVALÚO TOTAL:
          </Typography>
          <Typography sx={{ fontSize: "10px", fontWeight: 900 }}>
            S/ {formatPUNumber(numberOr(pu?.autoavaluo, 60000))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
