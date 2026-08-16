// src/components/fraccionamiento/modal/ResolucionJefatural.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Gavel as GavelIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import { fraccionamientoService } from "../../../services/fraccionamientoService";
import type {
  CronogramaContribuyente,
  Fraccionamiento,
} from "../../../types/fraccionamiento.types";

interface ResolucionJefaturalProps {
  open: boolean;
  onClose: () => void;
  fraccionamiento: Fraccionamiento | null;
  contribuyente?: ContribuyenteListItem | null;
}

interface StoredUser {
  username?: string;
  nombreCompleto?: string;
}

const formatMoney = (value: number | null | undefined, decimals = 2): string =>
  Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const parseDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value: Date | string | null | undefined): string => {
  const date = parseDate(value);
  return date ? date.toLocaleDateString("es-PE") : "-";
};

const formatLongDate = (value: Date | string | null | undefined): string => {
  const date = parseDate(value) || new Date();
  const day = date.getDate();
  const month = date
    .toLocaleDateString("es-PE", { month: "long" })
    .toUpperCase();
  return `${day} de ${month} del ${date.getFullYear()}`;
};

const getStoredUser = (): StoredUser => {
  try {
    return JSON.parse(
      sessionStorage.getItem("auth_user") || "{}",
    ) as StoredUser;
  } catch {
    return {};
  }
};

const ResolucionJefatural: React.FC<ResolucionJefaturalProps> = ({
  open,
  onClose,
  fraccionamiento,
  contribuyente,
}) => {
  const [cronograma, setCronograma] = useState<CronogramaContribuyente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !fraccionamiento?.codContribuyente) {
      setCronograma([]);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    void fraccionamientoService
      .listarCronogramaContribuyente(fraccionamiento.codContribuyente)
      .then((data) => {
        if (!active) return;
        setCronograma(
          data
            .filter(
              (cuota) =>
                cuota.numeroCuota !== 0 &&
                (!fraccionamiento.codResolucion ||
                  cuota.codResolucion === fraccionamiento.codResolucion) &&
                (!fraccionamiento.anio || cuota.anio === fraccionamiento.anio),
            )
            .sort((a, b) => a.numeroCuota - b.numeroCuota),
        );
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setCronograma([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo cargar el cronograma de la resolución",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, fraccionamiento]);

  const storedUser = getStoredUser();
  const usuario = storedUser.nombreCompleto || storedUser.username || "-";
  const codigo =
    fraccionamiento?.codContribuyente ??
    contribuyente?.codigo ??
    fraccionamiento?.codigoContribuyente ??
    "-";
  const nombre =
    contribuyente?.contribuyente ||
    fraccionamiento?.nombreContribuyente ||
    fraccionamiento?.solicitante ||
    "-";
  const documento =
    contribuyente?.documento || fraccionamiento?.numDocumento || "-";
  const tipoDocumento = fraccionamiento?.tipoDocumento || "DNI";
  const direccion = contribuyente?.direccion || "-";
  const fechaResolucion =
    fraccionamiento?.fechaAprobacion || fraccionamiento?.fechaSolicitud;
  const cuotaInicial = Number(
    fraccionamiento?.cuotaInicial ?? fraccionamiento?.montoCuotaInicial ?? 0,
  );
  const deuda =
    fraccionamiento?.totalFraccionado ??
    fraccionamiento?.montoTotal ??
    fraccionamiento?.deudaInsoluta;

  const paragraphSx = {
    fontSize: 12,
    lineHeight: 1.9,
    textAlign: "justify" as const,
    mb: 1.4,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxHeight: "96vh" } }}
    >
      <style>
        {`
          @media print {
            body * { visibility: hidden !important; }
            #resolucion-jefatural-print, #resolucion-jefatural-print * { visibility: visible !important; }
            #resolucion-jefatural-print {
              position: absolute !important;
              inset: 0 auto auto 0 !important;
              width: 100% !important;
              min-height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            #resolucion-jefatural-print .cronograma-row { break-inside: avoid; page-break-inside: avoid; }
            .no-print { display: none !important; }
            @page { size: A4 portrait; margin: 15mm; }
          }
        `}
      </style>

      <DialogTitle
        className="no-print"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GavelIcon color="primary" />
          <Typography variant="h6" component="span">
            Resolución Jefatural
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "grey.200", py: 3 }}>
        {loading ? (
          <Box className="no-print" sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando resolución...</Typography>
          </Box>
        ) : error ? (
          <Alert className="no-print" severity="error">
            {error}
          </Alert>
        ) : (
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
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}
            >
              <Typography sx={{ fontSize: 11 }}>
                Usuario: <strong>{usuario}</strong>
              </Typography>
              <Typography sx={{ fontSize: 11 }}>
                {new Date().toLocaleDateString("es-PE")}
              </Typography>
            </Box>

            <Typography sx={{ textAlign: "center", fontSize: 14, mb: 2 }}>
              RESOLUCIÓN JEFATURAL&nbsp;&nbsp;&nbsp;&nbsp; N°&nbsp;&nbsp;&nbsp;
              <strong>{fraccionamiento?.codResolucion ?? "-"}</strong>
              &nbsp;&nbsp;&nbsp; -MDE-JR/BETRIUM
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: 13, mb: 3 }}>
              LA ESPERANZA,&nbsp;&nbsp;&nbsp; {formatLongDate(fechaResolucion)}
            </Typography>

            <Typography sx={paragraphSx}>
              <Box component="span" sx={{ ml: 18 }}>
                VISTO,
              </Box>
              &nbsp;&nbsp;&nbsp; la Solicitud de Pago presentada por el
              Contribuyente &nbsp;{" "}
              <strong>
                ({codigo}), {nombre}
              </strong>
              , identificado con {tipoDocumento} N° &nbsp;{" "}
              <strong>{documento}</strong>, domiciliado en &nbsp;
              <strong>{direccion}</strong>, Provincia de Trujillo, Departamento
              de La Libertad, para suscribir el ACTA DE COMPROMISO FRACCIONADO
              DE PAGO, en los términos:
            </Typography>

            <Typography sx={paragraphSx}>
              <strong>
                <u>PRIMERO:</u>
              </strong>
              &nbsp;&nbsp;&nbsp; Que en salvaguarda del bienestar de los
              contribuyentes, la Administración Municipal viene desarrollando el
              &nbsp;
              <strong>PROGRAMA DE BENEFICIOS TRIBUTARIOS: BETRIUM</strong>,
              aprobado mediante Ordenanza Municipal N°{" "}
              <strong>01-2019-MDE</strong>, orientado a otorgar las máximas
              facilidades al <strong>CONTRIBUYENTE</strong> para el cumplimiento
              de sus obligaciones tributarias.
            </Typography>

            <Typography sx={paragraphSx}>
              <strong>
                <u>SEGUNDO: EL CONTRIBUYENTE</u>
              </strong>
              &nbsp;&nbsp;&nbsp; reconoce mantener una deuda con la
              Administración Municipal, comprendida desde &nbsp;
              <strong>{fraccionamiento?.anioDeudaInicio ?? "-"}</strong> al
              &nbsp;
              <strong>{fraccionamiento?.anioDeudaFin ?? "-"}</strong>, la cual
              asciende a la suma de S/. <strong>{formatMoney(deuda, 4)}</strong>{" "}
              Nuevos Soles, sin intereses moratorios y multas, a efecto que se
              acoja al presente fraccionamiento.
            </Typography>

            <Typography sx={paragraphSx}>
              <strong>
                <u>TERCERO:</u>
              </strong>
              &nbsp;&nbsp;&nbsp; Se reconoce el siguiente cronograma de pago:
              una inicial de &nbsp;
              <strong>{formatMoney(cuotaInicial, 4)}</strong>&nbsp; Nuevos Soles
              en efectivo. El saldo en &nbsp;
              <strong>
                {fraccionamiento?.numeroCuotas ?? cronograma.length}
              </strong>
              &nbsp; cuotas fijas, incrementadas con su reajuste, deberá ser
              cancelado en las fechas estipuladas:
            </Typography>

            <Box sx={{ width: "72%", mx: "auto", mt: 1, fontSize: 11.5 }}>
              <Box
                className="cronograma-row"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "35px 1fr 1fr",
                  columnGap: 1,
                }}
              >
                <Box sx={{ textAlign: "right" }}>0</Box>
                <Box>CUOTA EN S/.&nbsp;&nbsp; {formatMoney(cuotaInicial)}</Box>
                <Box>
                  FECHA DE PAGO&nbsp;&nbsp; {formatDate(fechaResolucion)}
                </Box>
              </Box>
              {cronograma.map((cuota) => (
                <Box
                  className="cronograma-row"
                  key={`${cuota.anio}-${cuota.codResolucion}-${cuota.numeroCuota}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "35px 1fr 1fr",
                    columnGap: 1,
                  }}
                >
                  <Box sx={{ textAlign: "right" }}>{cuota.numeroCuota}</Box>
                  <Box>
                    CUOTA EN S/.&nbsp;&nbsp; {formatMoney(cuota.montoCuota)}
                  </Box>
                  <Box>
                    FECHA DE PAGO&nbsp;&nbsp;{" "}
                    {formatDate(cuota.fechaVencimiento)}
                  </Box>
                </Box>
              ))}
              {cronograma.length === 0 && (
                <Typography sx={{ fontSize: 11, textAlign: "center", mt: 2 }}>
                  No se encontraron cuotas posteriores a la cuota inicial.
                </Typography>
              )}
            </Box>

            <Typography sx={{ textAlign: "center", fontSize: 12, mt: 7 }}>
              Regístrese, Comuníquese y Cúmplase
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions className="no-print" sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          disabled={loading || !!error}
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResolucionJefatural;
