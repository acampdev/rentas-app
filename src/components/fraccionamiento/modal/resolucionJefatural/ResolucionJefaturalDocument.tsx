import { Box, Typography } from "@mui/material";
import type { Fraccionamiento } from "../../../../types/fraccionamiento.types";
import type { ResolucionJefaturalData } from "./resolucionJefatural.types";
import {
  formatDate,
  formatLongDate,
  formatMoney,
} from "./resolucionJefatural.utils";

interface Props {
  data: ResolucionJefaturalData;
  fraccionamiento: Fraccionamiento | null;
}
const paragraphSx = {
  fontSize: 12,
  lineHeight: 1.9,
  textAlign: "justify" as const,
  mb: 1.4,
};

export function ResolucionJefaturalDocument({ data, fraccionamiento }: Props) {
  return (
    <Box
      id="resolucion-jefatural-print"
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        p: "15mm 16mm",
        boxSizing: "border-box",
        bgcolor: "white",
        color: "#000",
        boxShadow: 3,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
        <Typography sx={{ fontSize: 11 }}>
          Usuario: <strong>{data.usuario}</strong>
        </Typography>
        <Typography sx={{ fontSize: 11 }}>
          {new Date().toLocaleDateString("es-PE")}
        </Typography>
      </Box>
      <Typography sx={{ textAlign: "center", fontSize: 14, mb: 2 }}>
        RESOLUCIÓN JEFATURAL&nbsp;&nbsp;&nbsp; N°&nbsp;&nbsp;&nbsp;
        <strong>{fraccionamiento?.codResolucion ?? "-"}</strong>
        &nbsp;&nbsp;&nbsp; -MDE-JR/BETRIUM
      </Typography>
      <Typography sx={{ textAlign: "center", fontSize: 13, mb: 3 }}>
        LA ESPERANZA,&nbsp;&nbsp;&nbsp; {formatLongDate(data.fechaResolucion)}
      </Typography>
      <Typography sx={paragraphSx}>
        <Box component="span" sx={{ ml: 18 }}>
          VISTO,
        </Box>
        &nbsp;&nbsp;&nbsp; la Solicitud de Pago presentada por el Contribuyente
        &nbsp;
        <strong>
          ({data.codigo}), {data.nombre}
        </strong>
        , identificado con {data.tipoDocumento} N° &nbsp;
        <strong>{data.documento}</strong>, domiciliado en &nbsp;
        <strong>{data.direccion}</strong>, Provincia de Trujillo, Departamento
        de La Libertad, para suscribir el ACTA DE COMPROMISO FRACCIONADO DE
        PAGO, en los términos:
      </Typography>
      <Typography sx={paragraphSx}>
        <strong>
          <u>PRIMERO:</u>
        </strong>
        &nbsp;&nbsp;&nbsp; Que en salvaguarda del bienestar de los
        contribuyentes, la Administración Municipal viene desarrollando el
        &nbsp;<strong>PROGRAMA DE BENEFICIOS TRIBUTARIOS: BETRIUM</strong>,
        aprobado mediante Ordenanza Municipal N° <strong>01-2019-MDE</strong>,
        orientado a otorgar las máximas facilidades al{" "}
        <strong>CONTRIBUYENTE</strong> para el cumplimiento de sus obligaciones
        tributarias.
      </Typography>
      <Typography sx={paragraphSx}>
        <strong>
          <u>SEGUNDO: EL CONTRIBUYENTE</u>
        </strong>
        &nbsp;&nbsp;&nbsp; reconoce mantener una deuda con la Administración
        Municipal, comprendida desde &nbsp;
        <strong>{fraccionamiento?.anioDeudaInicio ?? "-"}</strong> al &nbsp;
        <strong>{fraccionamiento?.anioDeudaFin ?? "-"}</strong>, la cual
        asciende a la suma de S/. <strong>{formatMoney(data.deuda, 4)}</strong>{" "}
        Nuevos Soles, sin intereses moratorios y multas, a efecto que se acoja
        al presente fraccionamiento.
      </Typography>
      <Typography sx={paragraphSx}>
        <strong>
          <u>TERCERO:</u>
        </strong>
        &nbsp;&nbsp;&nbsp; Se reconoce el siguiente cronograma de pago: una
        inicial de &nbsp;<strong>{formatMoney(data.cuotaInicial, 4)}</strong>
        &nbsp; Nuevos Soles en efectivo. El saldo en &nbsp;
        <strong>
          {fraccionamiento?.numeroCuotas ?? data.cronograma.length}
        </strong>
        &nbsp; cuotas fijas, incrementadas con su reajuste, deberá ser cancelado
        en las fechas estipuladas:
      </Typography>
      <Box sx={{ width: "72%", mx: "auto", mt: 1, fontSize: 11.5 }}>
        <ScheduleRow
          number={0}
          amount={data.cuotaInicial}
          date={data.fechaResolucion}
        />
        {data.cronograma.map((fee) => (
          <ScheduleRow
            key={`${fee.anio}-${fee.codResolucion}-${fee.numeroCuota}`}
            number={fee.numeroCuota}
            amount={fee.montoCuota}
            date={fee.fechaVencimiento}
          />
        ))}
        {data.cronograma.length === 0 && (
          <Typography sx={{ fontSize: 11, textAlign: "center", mt: 2 }}>
            No se encontraron cuotas posteriores a la cuota inicial.
          </Typography>
        )}
      </Box>
      <Typography sx={{ textAlign: "center", fontSize: 12, mt: 7 }}>
        Regístrese, Comuníquese y Cúmplase
      </Typography>
    </Box>
  );
}

function ScheduleRow({
  number,
  amount,
  date,
}: {
  number: number;
  amount: number;
  date: Date | string | null | undefined;
}) {
  return (
    <Box
      className="cronograma-row"
      sx={{
        display: "grid",
        gridTemplateColumns: "35px 1fr 1fr",
        columnGap: 1,
      }}
    >
      <Box sx={{ textAlign: "right" }}>{number}</Box>
      <Box>CUOTA EN S/.&nbsp;&nbsp; {formatMoney(amount)}</Box>
      <Box>FECHA DE PAGO&nbsp;&nbsp; {formatDate(date)}</Box>
    </Box>
  );
}
