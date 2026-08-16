// src/components/fraccionamiento/modal/EstadoCuenta.tsx
import React, { useEffect, useMemo, useState } from "react";
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
  Print as PrintIcon,
  ReceiptLong as ReceiptIcon,
} from "@mui/icons-material";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import { fraccionamientoService } from "../../../services/fraccionamientoService";
import type {
  CronogramaContribuyente,
  Fraccionamiento,
} from "../../../types/fraccionamiento.types";

interface EstadoCuentaProps {
  open: boolean;
  onClose: () => void;
  fraccionamiento: Fraccionamiento | null;
  contribuyente?: ContribuyenteListItem | null;
}

interface StoredUser {
  username?: string;
  nombreCompleto?: string;
}

const formatMoney = (value: number | null | undefined): string =>
  Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value: Date | string | null | undefined): string => {
  if (!value) return "-";
  const raw = String(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString("es-PE");
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

const EstadoCuenta: React.FC<EstadoCuentaProps> = ({
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
            : "No se pudo cargar el estado de cuenta",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, fraccionamiento]);

  const saldoPendiente = useMemo(
    () =>
      cronograma.reduce((total, cuota) => {
        if (cuota.pagado) return total;
        return total + Math.max(cuota.montoCuota - (cuota.montoPagado || 0), 0);
      }, 0),
    [cronograma],
  );

  const storedUser = getStoredUser();
  const codigo =
    fraccionamiento?.codContribuyente ??
    fraccionamiento?.codigoContribuyente ??
    contribuyente?.codigo ??
    "-";
  const nombre =
    contribuyente?.contribuyente ||
    fraccionamiento?.nombreContribuyente ||
    fraccionamiento?.solicitante ||
    "-";
  const direccion = contribuyente?.direccion || "-";
  const usuario = storedUser.nombreCompleto || storedUser.username || "-";
  const fechaEmision = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const fechaCuotaInicial =
    fraccionamiento?.fechaAprobacion || fraccionamiento?.fechaSolicitud;
  const periodo = `Fraccionamiento desde el ${fraccionamiento?.periodoInicio ?? "-"} trimestre del ${fraccionamiento?.anioDeudaInicio ?? "-"} hasta el ${fraccionamiento?.periodoFin ?? "-"} trimestre del ${fraccionamiento?.anioDeudaFin ?? "-"}`;
  const deudaFraccionada =
    fraccionamiento?.totalFraccionado ??
    fraccionamiento?.montoTotal ??
    fraccionamiento?.deudaInsoluta;
  const cuotaInicial =
    fraccionamiento?.cuotaInicial ?? fraccionamiento?.montoCuotaInicial;

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
            #estado-cuenta-print, #estado-cuenta-print * { visibility: visible !important; }
            #estado-cuenta-print {
              position: absolute !important;
              inset: 0 auto auto 0 !important;
              width: 100% !important;
              min-height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            #estado-cuenta-print thead { display: table-header-group; }
            #estado-cuenta-print tr { break-inside: avoid; page-break-inside: avoid; }
            .no-print { display: none !important; }
            @page { size: A4 portrait; margin: 12mm; }
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
          <ReceiptIcon color="primary" />
          <Typography variant="h6" component="span">
            Estado de Cuenta Fraccionada
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
            <Typography sx={{ mt: 2 }}>Cargando estado de cuenta...</Typography>
          </Box>
        ) : error ? (
          <Alert className="no-print" severity="error">
            {error}
          </Alert>
        ) : (
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
                FECHA: <strong>{fechaEmision}</strong>
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: 15,
                fontWeight: 700,
                textAlign: "center",
                my: 2.5,
              }}
            >
              ESTADO DE CUENTA FRACCIONADA
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "70px 120px 90px 1fr 70px 1fr",
                rowGap: 1.2,
                alignItems: "baseline",
              }}
            >
              <Typography sx={{ fontSize: 11 }}>Código:</Typography>
              <Typography sx={{ fontSize: 11 }}>{codigo}</Typography>
              <Typography sx={{ fontSize: 11 }}>Resolución:</Typography>
              <Typography sx={{ fontSize: 11 }}>
                {fraccionamiento?.codResolucion ?? "-"}
              </Typography>
              <Typography sx={{ fontSize: 11 }}>Usuario:</Typography>
              <Typography sx={{ fontSize: 11 }}>{usuario}</Typography>

              <Typography sx={{ fontSize: 11 }}>Sr. (a):</Typography>
              <Typography sx={{ gridColumn: "span 5", fontSize: 11 }}>
                {nombre}
              </Typography>

              <Typography sx={{ fontSize: 11 }}>Dirección:</Typography>
              <Typography sx={{ gridColumn: "span 5", fontSize: 11 }}>
                {direccion}
              </Typography>
            </Box>

            <Box sx={{ borderTop: "1px dotted #555", mt: 1, pt: 1 }}>
              <Typography sx={{ fontSize: 11 }}>{periodo}</Typography>
              <Typography sx={{ fontSize: 11, mt: 1 }}>
                Deuda Fraccionada S/ {formatMoney(deudaFraccionada)} Nuevos
                Soles
              </Typography>
              <Typography sx={{ fontSize: 11, mt: 1 }}>
                N° de Cuotas{" "}
                {fraccionamiento?.numeroCuotas ?? cronograma.length}
              </Typography>
            </Box>

            <Box sx={{ borderTop: "1px dotted #555", mt: 1.2, pt: 0.8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      "Nro. Cuota",
                      "Importe",
                      "Fecha Vencimiento",
                      "Fecha Pago",
                    ].map((header) => (
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
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", padding: 2 }}>0</td>
                    <td style={{ textAlign: "center", padding: 2 }}>
                      S/ {formatMoney(cuotaInicial)}
                    </td>
                    <td style={{ textAlign: "center", padding: 2 }}>
                      {formatDate(fechaCuotaInicial)}
                    </td>
                    <td style={{ textAlign: "center", padding: 2 }}>
                      {formatDate(fechaCuotaInicial)}
                    </td>
                  </tr>
                  {cronograma.map((cuota) => (
                    <tr
                      key={`${cuota.anio}-${cuota.codResolucion}-${cuota.numeroCuota}`}
                    >
                      <td style={{ textAlign: "center", padding: 2 }}>
                        {cuota.numeroCuota}
                      </td>
                      <td style={{ textAlign: "center", padding: 2 }}>
                        S/ {formatMoney(cuota.montoCuota)}
                      </td>
                      <td style={{ textAlign: "center", padding: 2 }}>
                        {formatDate(cuota.fechaVencimiento)}
                      </td>
                      <td style={{ textAlign: "center", padding: 2 }}>
                        {formatDate(cuota.fechaPago)}
                      </td>
                    </tr>
                  ))}
                  {cronograma.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{ textAlign: "center", padding: 14 }}
                      >
                        No se encontraron cuotas para el fraccionamiento
                        seleccionado.
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
              Saldo al {fechaEmision} S/. {formatMoney(saldoPendiente)}
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

export default EstadoCuenta;
