// src/components/fraccionamiento/modal/ConvenioDeuda.tsx
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
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { fraccionamientoService } from "../../../services/fraccionamientoService";
import type {
  CronogramaContribuyente,
  Fraccionamiento,
} from "../../../types/fraccionamiento.types";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";

interface ConvenioDeudaProps {
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

const formatDate = (value: string | Date | null | undefined): string => {
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

const cellStyle: React.CSSProperties = {
  border: "1px solid #222",
  padding: "5px 6px",
  fontSize: 10,
};

const ConvenioDeuda: React.FC<ConvenioDeudaProps> = ({
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
        const filtrado = data
          .filter(
            (item) =>
              item.numeroCuota !== 0 &&
              (!fraccionamiento.codResolucion ||
                item.codResolucion === fraccionamiento.codResolucion) &&
              (!fraccionamiento.anio || item.anio === fraccionamiento.anio),
          )
          .sort((a, b) => a.numeroCuota - b.numeroCuota);
        setCronograma(filtrado);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setCronograma([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo cargar el cronograma del convenio",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, fraccionamiento]);

  const cuotaInicial = Number(
    fraccionamiento?.cuotaInicial ?? fraccionamiento?.montoCuotaInicial ?? 0,
  );
  const fechaCuotaInicial =
    fraccionamiento?.fechaAprobacion || fraccionamiento?.fechaSolicitud;

  const totals = useMemo(
    () =>
      cronograma.reduce(
        (acc, cuota) => ({
          amortizacion: acc.amortizacion + cuota.amortizacion,
          interes: acc.interes + cuota.interes,
          montoCuota: acc.montoCuota + cuota.montoCuota,
        }),
        {
          amortizacion: cuotaInicial,
          interes: 0,
          montoCuota: cuotaInicial,
        },
      ),
    [cronograma, cuotaInicial],
  );

  const storedUser = getStoredUser();
  const nombreContribuyente =
    contribuyente?.contribuyente ||
    fraccionamiento?.nombreContribuyente ||
    fraccionamiento?.solicitante ||
    "-";
  const documento =
    contribuyente?.documento || fraccionamiento?.numDocumento || "-";
  const direccion = contribuyente?.direccion || "-";
  const telefono = contribuyente?.telefono || "-";
  const usuario = storedUser.nombreCompleto || storedUser.username || "-";
  const fechaEmision = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

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
            #convenio-deuda-print, #convenio-deuda-print * { visibility: visible !important; }
            #convenio-deuda-print {
              position: absolute !important;
              inset: 0 auto auto 0 !important;
              width: 100% !important;
              min-height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            #convenio-deuda-print thead { display: table-header-group; }
            #convenio-deuda-print tr { break-inside: avoid; page-break-inside: avoid; }
            .no-print { display: none !important; }
            @page { size: A4 portrait; margin: 10mm; }
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
          <DescriptionIcon color="primary" />
          <Typography variant="h6" component="span">
            Convenio de Deuda por Fraccionamiento
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        className="no-scrollbar"
        sx={{ bgcolor: "grey.200", py: 3 }}
      >
        {loading ? (
          <Box className="no-print" sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando cronograma...</Typography>
          </Box>
        ) : error ? (
          <Alert className="no-print" severity="error">
            {error}
          </Alert>
        ) : (
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
              <Box
                sx={{ textAlign: "center", justifySelf: "start", width: 150 }}
              >
                <Typography
                  sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}
                >
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
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  mt: 9,
                  whiteSpace: "nowrap",
                }}
              >
                CONVENIO DE DEUDA POR FRACCIONAMIENTO
              </Typography>

              <Box sx={{ textAlign: "right", fontSize: 10 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
                  Gerencia de Administración Tributaria
                </Typography>
                <Typography sx={{ fontSize: 10, mt: 1 }}>
                  {fechaEmision}
                </Typography>
                <Typography sx={{ fontSize: 10, mt: 1 }}>
                  Usuario: <strong>{usuario}</strong>
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
                ["Contribuyente:", nombreContribuyente],
                ["DNI y/o RUC:", documento],
                ["Dirección:", direccion],
                [
                  "Monto de Deuda:",
                  `S/ ${formatMoney(fraccionamiento?.totalFraccionado ?? fraccionamiento?.deudaInsoluta)}`,
                ],
                [
                  "Nro de Cuotas:",
                  String(fraccionamiento?.numeroCuotas ?? cronograma.length),
                ],
                ["Cuota de Acogimiento:", `S/ ${formatMoney(cuotaInicial)}`],
                ["Teléfono:", telefono],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>{value}</Typography>
                </React.Fragment>
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
                      style={{
                        ...cellStyle,
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...cellStyle, textAlign: "center" }}>0</td>
                  <td style={{ ...cellStyle, textAlign: "right" }} />
                  <td style={{ ...cellStyle, textAlign: "right" }}>
                    {formatMoney(cuotaInicial)}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "right" }}>
                    {formatMoney(0)}
                  </td>
                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    {formatMoney(cuotaInicial)}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>
                    {formatDate(fechaCuotaInicial)}
                  </td>
                </tr>
                {cronograma.map((cuota) => (
                  <tr
                    key={`${cuota.anio}-${cuota.codResolucion}-${cuota.numeroCuota}`}
                  >
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {cuota.numeroCuota}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "right" }}>
                      {formatMoney(cuota.saldoInicio)}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "right" }}>
                      {formatMoney(cuota.amortizacion)}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "right" }}>
                      {formatMoney(cuota.interes)}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "right",
                        fontWeight: 700,
                      }}
                    >
                      {formatMoney(cuota.montoCuota)}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {formatDate(cuota.fechaVencimiento)}
                    </td>
                  </tr>
                ))}
                {cronograma.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ ...cellStyle, textAlign: "center", padding: 16 }}
                    >
                      No se encontraron cuotas para el convenio seleccionado.
                    </td>
                  </tr>
                )}
              </tbody>
              {(cuotaInicial > 0 || cronograma.length > 0) && (
                <tfoot>
                  <tr>
                    <td style={cellStyle} />
                    <td
                      style={{
                        ...cellStyle,
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      TOTALES
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      S/ {formatMoney(totals.amortizacion)}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      S/ {formatMoney(totals.interes)}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      S/ {formatMoney(totals.montoCuota)}
                    </td>
                    <td style={cellStyle} />
                  </tr>
                </tfoot>
              )}
            </table>

            {(cuotaInicial > 0 || cronograma.length > 0) && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, mr: 6 }}>
                  Total Deuda:
                </Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
                  S/ {formatMoney(totals.montoCuota)}
                </Typography>
              </Box>
            )}
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
          disabled={
            loading || !!error || (cuotaInicial <= 0 && cronograma.length === 0)
          }
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvenioDeuda;
