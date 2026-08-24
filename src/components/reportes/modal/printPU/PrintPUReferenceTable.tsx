import { Box, Typography } from "@mui/material";

const border = "0.5px solid #166534";
const headers = [
  "LETRA",
  "MUROS Y COLUMNAS",
  "TECHOS",
  "PISOS",
  "PUERTAS Y VENTANAS",
  "REVESTIMIENTOS",
  "BAÑOS",
  "INSTALAC. ELECT. Y SANIT.",
];
const rows = [
  [
    "A",
    "Estructura armada especial",
    "Losa aligerada especial",
    "Mármol o granito fino",
    "Aluminio pesado cristal templado",
    "Mármol fino o madera fina",
    "Baños completos lujo",
    "Aire acondic. e instalaciones especiales",
  ],
  [
    "B",
    "Concreto armado columnas",
    "Concreto aligerado comercial",
    "Parquet o cerámica fina",
    "Aluminio comercial o madera fina",
    "Tarrajeo fino o madera comercial",
    "Baños completos color nacional",
    "Agua fría/caliente trifásica",
  ],
  [
    "C",
    "Ladrillo o similar con columnas",
    "Calamina o teja comercial",
    "Losa o vinílico comercial",
    "Madera corriente o fierro",
    "Tarrajeo frotachado con pintura",
    "Baños completos blancos",
    "Agua fría monofásica",
  ],
];

export const PrintPUReferenceTable = () => (
  <>
    <Box
      sx={{ border: "1px solid #166534", borderRadius: "3px", p: 0.5, mb: 1 }}
    >
      <Typography sx={{ fontSize: "6.5px", fontWeight: "bold", mb: 0.2 }}>
        R.M. N° 414-2000-VIVIENDA - VALORES UNITARIOS OFICIALES DE EDIFICACIÓN
      </Typography>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "5.5px",
          textTransform: "uppercase",
        }}
      >
        <thead>
          <tr style={{ background: "#dcfce7" }}>
            {headers.map((header) => (
              <th key={header} style={{ border }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((value, index) => (
                <td
                  key={headers[index]}
                  style={{
                    border,
                    fontWeight: index === 0 ? "bold" : "normal",
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
    <Box
      sx={{
        textAlign: "center",
        mt: 0.5,
        borderTop: "1.5px solid #166534",
        pt: 0.5,
      }}
    >
      <Typography
        fontWeight="900"
        sx={{ fontSize: "8.5px", letterSpacing: 0.5 }}
      >
        ¡ CON TUS TRIBUTOS, CONSTRUIREMOS UN FUTURO MEJOR ; LA ESPERANZA AVANZA
        !
      </Typography>
    </Box>
  </>
);
