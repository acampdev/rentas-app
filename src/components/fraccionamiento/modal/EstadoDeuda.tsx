// src/components/fraccionamiento/modal/EstadoDeuda.tsx
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
  FactCheck as FactCheckIcon,
} from "@mui/icons-material";
import type { ContribuyenteListItem } from "../../../hooks/useContribuyentes";
import {
  cuentaCorrienteService,
  type EstadoCuentaAnual,
} from "../../../services/cuentaCorrienteService";
import type { Fraccionamiento } from "../../../types/fraccionamiento.types";

interface EstadoDeudaProps {
  open: boolean;
  onClose: () => void;
  fraccionamiento: Fraccionamiento | null;
  contribuyente?: ContribuyenteListItem | null;
}

interface StoredUser {
  username?: string;
  nombreCompleto?: string;
}

interface DeudaAnualReporte {
  anio: number;
  periodos: Set<number>;
  monto: number;
  interes: number;
  fraccion: number;
  pagoTotal: number;
}

const formatMoney = (value: number): string =>
  Number(value || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getStoredUser = (): StoredUser => {
  try {
    return JSON.parse(
      sessionStorage.getItem("auth_user") || "{}",
    ) as StoredUser;
  } catch {
    return {};
  }
};

const getPeriodos = (item: EstadoCuentaAnual): number[] => {
  const periodosConSaldo: number[] = [];
  const periodosConCargo: number[] = [];

  for (let mes = 1; mes <= 12; mes += 1) {
    const record = item as unknown as Record<string, unknown>;
    const cargo = Number(record[`cargo${mes}`]) || 0;
    const abono = Number(record[`abono${mes}`]) || 0;
    if (cargo > 0) periodosConCargo.push(mes);
    if (cargo > abono) periodosConSaldo.push(mes);
  }

  if (periodosConSaldo.length > 0) return periodosConSaldo;
  if (periodosConCargo.length > 0) return periodosConCargo;
  return Array.from({ length: 12 }, (_, index) => index + 1);
};

const agruparDeudas = (items: EstadoCuentaAnual[]): DeudaAnualReporte[] => {
  const currentYear = new Date().getFullYear();
  const agrupadas = new Map<number, DeudaAnualReporte>();

  items
    .filter((item) => item.anio > 0 && item.anio < currentYear)
    .forEach((item) => {
      const principalInformado =
        Number(item.totalPredial || 0) + Number(item.totalArbitrial || 0);
      const cargos = Number(item.totalCargos || 0);
      const pagado = Number(item.totalPagado || 0);
      const saldo = Number(item.saldoNeto || 0);
      const principalPendiente =
        principalInformado > 0
          ? principalInformado
          : Math.max(cargos - pagado, 0);
      const monto = Math.min(principalPendiente, Math.max(saldo, 0));
      const interes = Math.max(saldo - monto, 0);
      const existente = agrupadas.get(item.anio) || {
        anio: item.anio,
        periodos: new Set<number>(),
        monto: 0,
        interes: 0,
        fraccion: 0,
        pagoTotal: 0,
      };

      getPeriodos(item).forEach((periodo) => existente.periodos.add(periodo));
      existente.monto += monto;
      existente.interes += interes;
      existente.pagoTotal += saldo;
      agrupadas.set(item.anio, existente);
    });

  return Array.from(agrupadas.values()).sort((a, b) => a.anio - b.anio);
};

const EstadoDeuda: React.FC<EstadoDeudaProps> = ({
  open,
  onClose,
  fraccionamiento,
  contribuyente,
}) => {
  const [deudas, setDeudas] = useState<EstadoCuentaAnual[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codContribuyente =
      fraccionamiento?.codContribuyente ?? contribuyente?.codigo;
    if (!open || !codContribuyente) {
      setDeudas([]);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    void cuentaCorrienteService
      .listarEstadoCuenta(codContribuyente)
      .then((data) => {
        if (active) setDeudas(data || []);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setDeudas([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo cargar el estado de deuda",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, fraccionamiento, contribuyente]);

  const filas = useMemo(() => agruparDeudas(deudas), [deudas]);
  const totales = useMemo(
    () =>
      filas.reduce(
        (total, fila) => ({
          monto: total.monto + fila.monto,
          interes: total.interes + fila.interes,
          fraccion: total.fraccion + fila.fraccion,
          pagoTotal: total.pagoTotal + fila.pagoTotal,
        }),
        { monto: 0, interes: 0, fraccion: 0, pagoTotal: 0 },
      ),
    [filas],
  );

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
  const direccion = contribuyente?.direccion || "-";
  const fechaHora = new Date().toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const cellStyle: React.CSSProperties = {
    padding: "5px 8px",
    fontSize: 11,
    textAlign: "right",
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
            #estado-deuda-print, #estado-deuda-print * { visibility: visible !important; }
            #estado-deuda-print {
              position: absolute !important;
              inset: 0 auto auto 0 !important;
              width: 100% !important;
              min-height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            #estado-deuda-print thead { display: table-header-group; }
            #estado-deuda-print tr { break-inside: avoid; page-break-inside: avoid; }
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
          <FactCheckIcon color="primary" />
          <Typography variant="h6" component="span">
            Verificación de Estado de Deuda
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
            <Typography sx={{ mt: 2 }}>Cargando estado de deuda...</Typography>
          </Box>
        ) : error ? (
          <Alert className="no-print" severity="error">
            {error}
          </Alert>
        ) : (
          <Box
            id="estado-deuda-print"
            sx={{
              width: "210mm",
              minHeight: "297mm",
              mx: "auto",
              p: "15mm 12mm",
              boxSizing: "border-box",
              bgcolor: "white",
              color: "#000",
              boxShadow: 3,
              fontFamily: "Arial, sans-serif",
            }}
          >
            <Typography sx={{ textAlign: "center", fontSize: 12 }}>
              VERIFICACIÓN DE ESTADO DE DEUDA
            </Typography>
            <Box
              sx={{
                borderTop: "1px dotted #555",
                width: "42%",
                mx: "auto",
                mt: 1.2,
              }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "100px 70px 1fr",
                rowGap: 0.7,
                mt: 3.5,
              }}
            >
              <Typography sx={{ fontSize: 11 }}>Contribuyente:</Typography>
              <Typography sx={{ fontSize: 11 }}>{codigo}</Typography>
              <Typography sx={{ fontSize: 11 }}>{nombre}</Typography>
              <Typography sx={{ fontSize: 11 }}>Dirección:</Typography>
              <Typography sx={{ fontSize: 11 }}>:</Typography>
              <Typography sx={{ fontSize: 11 }}>{direccion}</Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                rowGap: 0.6,
                mt: 2,
              }}
            >
              <Typography sx={{ fontSize: 11 }}>Impreso por:</Typography>
              <Typography sx={{ fontSize: 11 }}>{usuario}</Typography>
              <Typography sx={{ fontSize: 11 }}>Fecha y Hora:</Typography>
              <Typography sx={{ fontSize: 11 }}>{fechaHora}</Typography>
            </Box>

            <Box sx={{ borderTop: "1px dotted #555", mt: 0.7, pt: 0.4 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...cellStyle, textAlign: "center" }}>Año</th>
                    <th style={{ ...cellStyle, textAlign: "left" }}>Periodo</th>
                    <th style={cellStyle}>Monto</th>
                    <th style={cellStyle}>InteresM.</th>
                    <th style={cellStyle}>Fracción</th>
                    <th style={cellStyle}>PagoTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila) => (
                    <tr key={fila.anio}>
                      <td style={{ ...cellStyle, textAlign: "center" }}>
                        {fila.anio}
                      </td>
                      <td
                        style={{
                          ...cellStyle,
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {Array.from(fila.periodos)
                          .sort((a, b) => a - b)
                          .join(" ")}
                      </td>
                      <td style={cellStyle}>{formatMoney(fila.monto)}</td>
                      <td style={cellStyle}>{formatMoney(fila.interes)}</td>
                      <td style={cellStyle}>{formatMoney(fila.fraccion)}</td>
                      <td style={cellStyle}>{formatMoney(fila.pagoTotal)}</td>
                    </tr>
                  ))}
                  {filas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          ...cellStyle,
                          textAlign: "center",
                          padding: 16,
                        }}
                      >
                        No se encontraron deudas de años anteriores.
                      </td>
                    </tr>
                  )}
                </tbody>
                {filas.length > 0 && (
                  <tfoot>
                    <tr
                      style={{
                        borderTop: "1px dotted #555",
                        borderBottom: "1px dotted #555",
                      }}
                    >
                      <td colSpan={2} style={{ ...cellStyle, fontWeight: 700 }}>
                        Total:
                      </td>
                      <td style={{ ...cellStyle, fontWeight: 700 }}>
                        {formatMoney(totales.monto)}
                      </td>
                      <td style={{ ...cellStyle, fontWeight: 700 }}>
                        {formatMoney(totales.interes)}
                      </td>
                      <td style={{ ...cellStyle, fontWeight: 700 }}>
                        {formatMoney(totales.fraccion)}
                      </td>
                      <td style={{ ...cellStyle, fontWeight: 700 }}>
                        {formatMoney(totales.pagoTotal)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </Box>
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

export default EstadoDeuda;
