import { Box, Divider, Typography } from "@mui/material";
import type { PrintablePUData, PrintPUContribuyente } from "./printPU.types";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      bgcolor: "#dcfce7",
      px: 1,
      py: 0.2,
      borderBottom: "1px solid #166534",
    }}
  >
    <Typography
      variant="caption"
      fontWeight="bold"
      sx={{ fontSize: "9px", color: "#166534" }}
    >
      {children}
    </Typography>
  </Box>
);

const InfoCell = ({
  label,
  value,
  centered = false,
  last = false,
}: {
  label: string;
  value: React.ReactNode;
  centered?: boolean;
  last?: boolean;
}) => (
  <Box
    sx={{
      borderRight: last ? "none" : "1px solid #166534",
      p: 0.5,
      textAlign: centered ? "center" : "left",
    }}
  >
    <Typography sx={{ fontSize: "7px", fontWeight: "bold" }}>
      {label}
    </Typography>
    <Typography fontWeight="bold">{value}</Typography>
  </Box>
);

export const PrintPUDocumentHeader = ({ date }: { date: string }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "120px 1fr 180px",
      border: "2px solid #166534",
      borderRadius: "4px",
      mb: 1,
    }}
  >
    <Box
      sx={{
        p: 1,
        borderRight: "2px solid #166534",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0fdf4",
      }}
    >
      <Typography sx={{ fontSize: "7px", fontWeight: "bold" }}>
        MOTIVO DE LA DECLARACIÓN
      </Typography>
      <Box
        sx={{ border: "1px solid #166534", width: "90%", height: 16, mb: 0.5 }}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="h3" fontWeight="900" sx={{ lineHeight: 1 }}>
          PU
        </Typography>
        <Box
          component="img"
          src="/escudoMDE.png"
          alt="Escudo"
          sx={{ width: 32, height: 32, objectFit: "contain" }}
        />
      </Box>
    </Box>
    <Box
      sx={{
        p: 1,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="900"
        sx={{ fontSize: "13px" }}
      >
        MUNICIPALIDAD DISTRITAL DE LA ESPERANZA
      </Typography>
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        sx={{ fontSize: "11px" }}
      >
        DECLARACION JURADA DEL IMPUESTO PREDIAL
      </Typography>
      <Typography
        sx={{ fontSize: "9px", fontStyle: "italic", fontWeight: "bold" }}
      >
        (Decreto Legislativo 776 - Artículo 14º)
      </Typography>
      <Typography fontWeight="bold" sx={{ fontSize: "10px", mt: 0.5 }}>
        PREDIO URBANO
      </Typography>
    </Box>
    <Box
      sx={{
        borderLeft: "2px solid #166534",
        p: 0.5,
        bgcolor: "#f0fdf4",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 0.5 }}>
        <Typography sx={{ fontSize: "8px", fontWeight: "bold" }}>
          FORMULARIO N°
        </Typography>
        <Box
          sx={{
            border: "1px solid #166534",
            width: 60,
            height: 16,
            bgcolor: "white",
            textAlign: "center",
            fontSize: "9px",
            fontWeight: "bold",
          }}
        >
          001
        </Box>
      </Box>
      <Divider sx={{ borderColor: "#166534", my: 0.5 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 0.5 }}>
        <Typography sx={{ fontSize: "8px", fontWeight: "bold" }}>
          FECHA RECEPCIÓN
        </Typography>
        <Box
          sx={{
            border: "1px solid #166534",
            width: 70,
            height: 16,
            bgcolor: "white",
            textAlign: "center",
            fontSize: "9px",
          }}
        >
          {date}
        </Box>
      </Box>
    </Box>
  </Box>
);

export const PrintPUIdentitySections = ({
  contribuyente,
  pu,
}: {
  contribuyente: PrintPUContribuyente | null;
  pu: PrintablePUData | null;
}) => (
  <>
    <Box sx={{ border: "1.5px solid #166534", mb: 1, borderRadius: "4px" }}>
      <SectionTitle>
        IDENTIFICACIÓN DEL CONTRIBUYENTE (PROPIETARIO):
      </SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "120px 1fr 140px 100px 100px",
          fontSize: "9px",
        }}
      >
        <InfoCell
          label="COD. CONTRIBUYENTE"
          value={contribuyente?.codigo || "-"}
        />
        <InfoCell
          label="APELLIDOS Y NOMBRES O RAZON SOCIAL"
          value={
            contribuyente?.contribuyente || contribuyente?.nombreCompleto || "-"
          }
        />
        <InfoCell
          label="DOCUMENTO DE IDENTIDAD"
          value={contribuyente?.numDocumento || contribuyente?.dni || "-"}
        />
        <InfoCell
          centered
          label="CONDICIÓN DE PROPIEDAD"
          value="PROPIETARIO UNICO"
        />
        <InfoCell centered last label="N° DE CONDOMINIOS" value="1" />
      </Box>
    </Box>
    <Box sx={{ border: "1.5px solid #166534", mb: 1, borderRadius: "4px" }}>
      <SectionTitle>UBICACIÓN DEL PREDIO</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "120px 1fr 1fr 140px",
          fontSize: "9px",
        }}
      >
        <InfoCell label="CÓDIGO DEL PREDIO" value={pu?.codPredio || "-"} />
        <InfoCell
          label="SECTOR, URBANIZACIÓN, AA.HH., BARRIO, ETC."
          value={pu?.barrio || pu?.sector || "LA ESPERANZA"}
        />
        <InfoCell
          label="AVENIDA, JIRÓN, CALLE O PASAJE, KM"
          value={pu?.direccion || "-"}
        />
        <InfoCell
          last
          label="N° DOMICIL., OPTO, PISO, ETC."
          value={pu?.numDomicilio || "S/N"}
        />
      </Box>
    </Box>
    <Box sx={{ border: "1.5px solid #166534", mb: 1, borderRadius: "4px" }}>
      <SectionTitle>DATOS RELATIVOS A LA CONSTRUCCIÓN</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "80px 140px 140px 140px 1fr",
          fontSize: "9px",
        }}
      >
        <InfoCell
          centered
          label="[3] ESTADO"
          value={pu?.estadoPredio || "TERMINADO"}
        />
        <InfoCell
          centered
          label="[4] TIPO DE PREDIO"
          value={pu?.tipoPredio || "CASA HABITACION"}
        />
        <InfoCell centered label="[5] USO" value="HABITACIONAL" />
        <InfoCell centered label="[6] FRENTE A" value="VIA PUBLICA" />
        <InfoCell centered last label="% CONDOMINIO" value="100.00 %" />
      </Box>
    </Box>
  </>
);
