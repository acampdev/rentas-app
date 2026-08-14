// src/components/fraccionamiento/SolicitudFraccionamiento.tsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Calculate as CalculateIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  Payment as PaymentIcon,
  RestartAlt as ResetIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { useFraccionamiento } from "../../hooks/useFraccionamiento";
import SelectorContribuyente from "../modal/SelectorContribuyente";
import type { CreateFraccionamientoDTO } from "../../types/fraccionamiento.types";
import {
  useTipoDocumentoOptions,
  useTiposFraccionamientoOptions,
} from "../../hooks/useConstantesOptions";
import {
  cuentaCorrienteService,
  EstadoCuentaAnual,
} from "../../services/cuentaCorrienteService";
import { NotificationService } from "../utils/Notification";
import { getAuthenticatedUserCode } from "../../config/api.unified.config";

const SolicitudFraccionamiento: React.FC = () => {
  const [modalContribuyente, setModalContribuyente] = useState(false);

  // Datos del contribuyente
  const [contribuyente, setContribuyente] = useState({
    codigo: "",
    nombre: "",
  });

  // Datos de Estado de Cuenta Corriente
  const [detallesCuentaCorriente, setDetallesCuentaCorriente] = useState<
    EstadoCuentaAnual[]
  >([]);
  const [cargandoCuentaCorriente, setCargandoCuentaCorriente] = useState(false);

  // Datos del formulario
  const {
    options: tipoFraccionamientoOptions,
    loading: loadingTiposFraccionamiento,
  } = useTiposFraccionamientoOptions();
  const [tipoResolucion, setTipoResolucion] = useState("");
  const [deudaInsoluta, setDeudaInsoluta] = useState("0.00");
  const [cuotaInicial, setCuotaInicial] = useState("1000");
  const [numeroCuotas, setNumeroCuotas] = useState("12");

  const { options: tipoDocumentoOptions } = useTipoDocumentoOptions();
  const [anioDeudaInicio, setAnioDeudaInicio] = useState("2024");
  const [periodoInicio, setPeriodoInicio] = useState("1");
  const [anioDeudaFin, setAnioDeudaFin] = useState("2025");
  const [periodoFin, setPeriodoFin] = useState("12");
  const [solicitante, setSolicitante] = useState("1");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numDocumento, setNumDocumento] = useState("");
  const [cargo, setCargo] = useState("Titular");

  // Campos bloqueados (null por defecto)
  const [anioResoAnterior] = useState("");
  const [codResoAnterior] = useState("");

  const [confirmacionDialogo, setConfirmacionDialogo] = useState(false);

  const { crearSolicitud, cargando, error } = useFraccionamiento(
    {},
    { enabledList: false, enabledStats: false },
  );

  // Set default resolution type when options load
  useEffect(() => {
    if (tipoFraccionamientoOptions.length > 0 && !tipoResolucion) {
      setTipoResolucion(String(tipoFraccionamientoOptions[0].value));
    }
  }, [tipoFraccionamientoOptions, tipoResolucion]);

  useEffect(() => {
    if (tipoDocumentoOptions.length > 0 && !tipoDocumento) {
      setTipoDocumento(String(tipoDocumentoOptions[0].value));
    }
  }, [tipoDocumentoOptions, tipoDocumento]);

  // Cargar deudas y estado de cuenta corriente real del contribuyente
  const handleSeleccionarContribuyente = useCallback(
    async (contrib: any) => {
      const cod = contrib.codigo ? String(contrib.codigo) : "";
      const numDoc =
        contrib.numDocumento ||
        contrib.dni ||
        contrib.documento ||
        cod ||
        "00000000";

      // Asignar valor numérico de la constante de tipo documento (e.g. 4101 para DNI)
      let defaultDocVal =
        tipoDocumentoOptions.length > 0
          ? String(tipoDocumentoOptions[0].value)
          : "";
      if (contrib.tipoDocumento) {
        const found = tipoDocumentoOptions.find(
          (opt) =>
            String(opt.value) === String(contrib.tipoDocumento) ||
            opt.label
              .toUpperCase()
              .includes(String(contrib.tipoDocumento).toUpperCase()),
        );
        if (found) defaultDocVal = String(found.value);
      }

      setContribuyente({
        codigo: cod,
        nombre: contrib.contribuyente || contrib.nombreCompleto || "",
      });
      if (defaultDocVal) setTipoDocumento(defaultDocVal);
      if (numDoc) setNumDocumento(numDoc);
      setModalContribuyente(false);

      if (cod) {
        setCargandoCuentaCorriente(true);
        try {
          console.log(
            `🔍 [SolicitudFraccionamiento] Cargando estado de cuenta corriente para ${cod}`,
          );
          const ctaCorriente =
            await cuentaCorrienteService.listarEstadoCuenta(cod);
          setDetallesCuentaCorriente(ctaCorriente || []);

          if (ctaCorriente && ctaCorriente.length > 0) {
            const currentYr = new Date().getFullYear();
            const aniosValidos = ctaCorriente
              .map((item) => item.anio)
              .filter((a) => a > 0 && a < currentYr);

            if (aniosValidos.length > 0) {
              setAnioDeudaInicio(Math.min(...aniosValidos).toString());
              setAnioDeudaFin(Math.max(...aniosValidos).toString());
            }
          }
        } catch (err) {
          console.error(
            "Error al cargar cuenta corriente del contribuyente:",
            err,
          );
          setDetallesCuentaCorriente([]);
        } finally {
          setCargandoCuentaCorriente(false);
        }
      }
    },
    [tipoDocumentoOptions],
  );

  // Filtrar deudas por años MENORES al año actual
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const deudasFiltradasPorAnio = useMemo(() => {
    return detallesCuentaCorriente.filter(
      (item) => (item.anio || 0) < currentYear,
    );
  }, [detallesCuentaCorriente, currentYear]);

  // Calcular la suma de todos los saldos netos de los años mostrados
  const sumaDeudaInsoluta = useMemo(() => {
    return deudasFiltradasPorAnio.reduce(
      (sum, item) => sum + (Number(item.saldoNeto) || 0),
      0,
    );
  }, [deudasFiltradasPorAnio]);

  // Actualizar el estado de deudaInsoluta automáticamente cuando cambia la suma
  useEffect(() => {
    if (contribuyente.codigo) {
      setDeudaInsoluta(sumaDeudaInsoluta.toFixed(2));
    }
  }, [sumaDeudaInsoluta, contribuyente.codigo]);

  // Enviar el formulario
  const handleEnviar = useCallback(async () => {
    if (!contribuyente.codigo) {
      NotificationService.error(
        "Debe seleccionar un contribuyente antes de enviar la solicitud.",
      );
      return;
    }

    const resType =
      tipoResolucion ||
      (tipoFraccionamientoOptions.length > 0
        ? String(tipoFraccionamientoOptions[0].value)
        : "8501");
    const docType =
      tipoDocumento ||
      (tipoDocumentoOptions.length > 0
        ? String(tipoDocumentoOptions[0].value)
        : "123");
    const docNum = numDocumento || contribuyente.codigo || "2349-2024";

    const solicitudDTO: CreateFraccionamientoDTO = {
      codContribuyente: Number(contribuyente.codigo),
      tipoResolucion: resType,
      deudaInsoluta: parseFloat(deudaInsoluta) || 0,
      cuotaInicial: parseFloat(cuotaInicial || "0"),
      numeroCuotas: parseInt(numeroCuotas || "0"),
      anioDeudaInicio: parseInt(anioDeudaInicio) || 2024,
      periodoInicio: parseInt(periodoInicio) || 1,
      anioDeudaFin: parseInt(anioDeudaFin) || 2024,
      periodoFin: parseInt(periodoFin) || 12,
      solicitante: solicitante || "1",
      tipoDocumento: tipoDocumento || docType,
      numDocumento: numDocumento || docNum,
      cargo: cargo || "Titular",
      codUsuario: getAuthenticatedUserCode(),
      anioResoAnterior: anioResoAnterior ? parseInt(anioResoAnterior) : null,
      codResoAnterior: codResoAnterior ? parseInt(codResoAnterior) : null,
      anio: new Date().getFullYear(),
    };

    console.log("🚀 [SolicitudFraccionamiento] Enviando DTO:", solicitudDTO);

    try {
      const responseAPI = await crearSolicitud(solicitudDTO);
      console.log(
        "✅ [SolicitudFraccionamiento] Respuesta exitosa del API:",
        responseAPI,
      );
      setConfirmacionDialogo(true);
    } catch (err: any) {
      console.error(
        "❌ [SolicitudFraccionamiento] Error al registrar la solicitud:",
        err,
      );
      NotificationService.error(
        err?.message || "Error al procesar la solicitud de fraccionamiento.",
      );
    }
  }, [
    contribuyente.codigo,
    tipoResolucion,
    tipoFraccionamientoOptions,
    deudaInsoluta,
    cuotaInicial,
    numeroCuotas,
    anioDeudaInicio,
    periodoInicio,
    anioDeudaFin,
    periodoFin,
    solicitante,
    tipoDocumento,
    tipoDocumentoOptions,
    numDocumento,
    cargo,
    anioResoAnterior,
    codResoAnterior,
    crearSolicitud,
  ]);

  // Limpiar el formulario
  const handleLimpiar = useCallback(() => {
    setContribuyente({ codigo: "", nombre: "" });
    setDetallesCuentaCorriente([]);
    setTipoResolucion(
      tipoFraccionamientoOptions.length > 0
        ? String(tipoFraccionamientoOptions[0].value)
        : "",
    );
    setDeudaInsoluta("0.00");
    setCuotaInicial("1000");
    setNumeroCuotas("12");
    setAnioDeudaInicio("2024");
    setPeriodoInicio("1");
    setAnioDeudaFin("2025");
    setPeriodoFin("12");
    setSolicitante("1");
    setTipoDocumento(
      tipoDocumentoOptions.length > 0
        ? String(tipoDocumentoOptions[0].value)
        : "",
    );
    setNumDocumento("");
    setCargo("Titular");
  }, [tipoFraccionamientoOptions, tipoDocumentoOptions]);

  // Validación para habilitar el botón Enviar
  const formularioValido = useMemo(() => {
    return (
      contribuyente.codigo !== "" &&
      parseFloat(deudaInsoluta) >= 0 &&
      parseFloat(cuotaInicial || "0") >= 0 &&
      parseInt(numeroCuotas || "0") >= 1 &&
      parseInt(numeroCuotas || "0") <= 60
    );
  }, [contribuyente.codigo, deudaInsoluta, cuotaInicial, numeroCuotas]);

  // Renderizador de periodos mensuales (1..12)
  const renderPeriodosMensuales = (row: EstadoCuentaAnual) => {
    const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return (
      <Box
        sx={{
          display: "flex",
          gap: "3px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {meses.map((mes) => {
          const cargoVal = (row as any)[`cargo${mes}`];
          const abonoVal = (row as any)[`abono${mes}`];

          let color: "error" | "success" | "default" = "default";
          let variant: "filled" | "outlined" = "outlined";

          if (cargoVal && cargoVal > 0) {
            if (abonoVal && abonoVal >= cargoVal) {
              color = "success";
              variant = "filled";
            } else {
              color = "error";
              variant = "filled";
            }
          }

          return (
            <Tooltip
              key={mes}
              title={`Mes ${mes}: Cargo S/ ${cargoVal || 0} - Abono S/ ${abonoVal || 0}`}
            >
              <Chip
                label={mes}
                size="small"
                color={color}
                variant={variant}
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: "0.65rem",
                  fontWeight: "bold",
                  p: 0,
                  "& .MuiChip-label": { px: 0.5 },
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <Container
      maxWidth="md"
      sx={{ py: 4 }}
      className="notranslate"
      translate="no"
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Nueva Solicitud de Fraccionamiento
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingrese los datos necesarios para registrar el fraccionamiento de la
          deuda.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={4}>
          {/* SECCIÓN 1: CONTRIBUYENTE */}
          <Box>
            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PersonIcon />
              Contribuyente
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  label="Nombre del Contribuyente"
                  value={contribuyente.nombre}
                  InputProps={{ readOnly: true }}
                  placeholder="Seleccione un contribuyente..."
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => setModalContribuyente(true)}
                  sx={{
                    height: 56,
                    bgcolor: "#3b82f6 !important",
                    color: "white !important",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "#2563eb !important",
                    },
                  }}
                >
                  Buscar
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Código Contribuyente"
                  value={contribuyente.codigo}
                  InputProps={{ readOnly: true }}
                  placeholder="Código obtenido automáticamente"
                  variant="outlined"
                  helperText="Este campo se autocompleta al seleccionar el contribuyente."
                />
              </Grid>
            </Grid>
          </Box>

          {/* NUEVA SECCIÓN: DETALLE DE LA DEUDA */}
          <Box>
            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ReceiptIcon />
              Detalle de la Deuda
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2, mb: 2, maxHeight: 300, overflowY: "auto" }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#edf2fe" }}>
                    <TableCell
                      sx={{ fontWeight: "bold", width: 80, bgcolor: "#edf2fe" }}
                    >
                      Año
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#edf2fe" }}>
                      Tributo
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", bgcolor: "#edf2fe" }}
                    >
                      Periodos Mensuales (1 .. 12)
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: "bold",
                        width: 130,
                        bgcolor: "#edf2fe",
                      }}
                    >
                      Saldo Neto
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cargandoCuentaCorriente ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={30} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Cargando detalle de cuenta corriente...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : deudasFiltradasPorAnio.length > 0 ? (
                    deudasFiltradasPorAnio.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {row.anio}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.85rem" }}>
                          {row.tributo ||
                            row.grupoTributo ||
                            "IMPUESTO PREDIAL / ARBITRIOS"}
                        </TableCell>
                        <TableCell align="center">
                          {renderPeriodosMensuales(row)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", color: "error.main" }}
                        >
                          S/{" "}
                          {Number(row.saldoNeto || 0).toLocaleString("es-PE", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ py: 3, color: "text.secondary" }}
                      >
                        {contribuyente.codigo
                          ? `No se encontraron deudas para años anteriores a ${currentYear}.`
                          : "Seleccione un contribuyente para visualizar el detalle de la deuda."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Campo Deuda Insoluta bloqueado con la suma de Saldos Netos */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
                mt: 2,
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="text.primary"
              >
                Deuda Insoluta:
              </Typography>
              <TextField
                disabled
                size="small"
                value={`S/ ${Number(deudaInsoluta || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                variant="outlined"
                sx={{
                  width: 200,
                  "& .MuiOutlinedInput-root": {
                    fontWeight: "bold",
                    fontSize: "1rem",
                    bgcolor: "action.hover",
                    color: "primary.main",
                    borderRadius: 2,
                  },
                }}
                helperText="Suma de saldos netos (< año actual)"
              />
            </Box>
          </Box>

          {/* SECCIÓN 2: CONDICIONES DEL FRACCIONAMIENTO */}
          <Box>
            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight={600}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CalculateIcon />
              Condiciones del Fraccionamiento
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* TIPO DE RESOLUCIÓN */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Resolución"
                  value={tipoResolucion}
                  onChange={(e) => setTipoResolucion(e.target.value)}
                  disabled={loadingTiposFraccionamiento}
                  InputProps={{
                    endAdornment: loadingTiposFraccionamiento && (
                      <CircularProgress size={20} />
                    ),
                  }}
                >
                  {tipoFraccionamientoOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* DEUDA INSOLUTA */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  disabled
                  label="Deuda Insoluta"
                  type="number"
                  value={deudaInsoluta}
                  variant="outlined"
                  helperText="Monto total calculado de años anteriores"
                />
              </Grid>
              {/* CUOTA INICIAL */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Cuota Inicial"
                  type="number"
                  value={cuotaInicial}
                  onChange={(e) => setCuotaInicial(e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              {/* Nº DE CUOTAS */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Nº Cuota"
                  type="number"
                  value={numeroCuotas}
                  onChange={(e) => setNumeroCuotas(e.target.value)}
                  inputProps={{ min: 1, max: 60 }}
                  helperText="Rango admitido: 1 a 60 cuotas"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECCIÓN 3: PERIODO DE LA DEUDA */}
          <Box>
            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight={600}
              gutterBottom
            >
              Periodo de la Deuda
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* AÑO DEUDA INICIO */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Año Deuda Inicio"
                  type="number"
                  value={anioDeudaInicio}
                  onChange={(e) => setAnioDeudaInicio(e.target.value)}
                />
              </Grid>
              {/* PERIODO INICIO */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Periodo Inicio (Mes)"
                  type="number"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                  inputProps={{ min: 1, max: 12 }}
                />
              </Grid>
              {/* AÑO DEUDA FIN */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Año Deuda Fin"
                  type="number"
                  value={anioDeudaFin}
                  onChange={(e) => setAnioDeudaFin(e.target.value)}
                />
              </Grid>
              {/* PERIODO FIN */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Periodo Fin (Mes)"
                  type="number"
                  value={periodoFin}
                  onChange={(e) => setPeriodoFin(e.target.value)}
                  inputProps={{ min: 1, max: 12 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECCIÓN 4: DATOS DEL SOLICITANTE */}
          <Box>
            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight={600}
              gutterBottom
            >
              Datos del Solicitante
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* SOLICITANTE */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Solicitante"
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                />
              </Grid>
              {/* TIPO DE DOCUMENTO */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Tipo Documento"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                >
                  {tipoDocumentoOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* NÚMERO DE DOCUMENTO */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Número Documento"
                  value={numDocumento}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,8}$/.test(val)) {
                      setNumDocumento(val);
                    }
                  }}
                  inputProps={{
                    maxLength: 8,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                />
              </Grid>
              {/* CARGO */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECCIÓN 5: RESOLUCIÓN ANTERIOR (BLOQUEADO) */}
          <Box>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontWeight={600}
              gutterBottom
            >
              Resolución Anterior (Bloqueado)
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* AÑO DE RESOLUCIÓN ANTERIOR */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  disabled
                  label="Año Resolución Anterior"
                  value={anioResoAnterior || "null"}
                  variant="outlined"
                  helperText="Campo inactivo para este trámite"
                />
              </Grid>
              {/* CÓDIGO DE RESOLUCIÓN ANTERIOR */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  disabled
                  label="Código Resolución Anterior"
                  value={codResoAnterior || "null"}
                  variant="outlined"
                  helperText="Campo inactivo para este trámite"
                />
              </Grid>
            </Grid>
          </Box>

          {/* ACCIONES DEL FORMULARIO */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}
          >
            {/* LIMPIAR FORMULARIO */}
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={handleLimpiar}
              sx={{
                borderColor: "#ef4444 !important",
                color: "#ef4444 !important",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "rgba(239, 68, 68, 0.08) !important",
                  borderColor: "#dc2626 !important",
                },
              }}
            >
              Limpiar Formulario
            </Button>
            {/* ENVIAR SOLICITUD */}
            <Button
              type="button"
              variant="contained"
              disabled={!formularioValido || cargando}
              startIcon={
                cargando ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PaymentIcon />
                )
              }
              onClick={handleEnviar}
              sx={{
                bgcolor: "#10b981 !important",
                color: "white !important",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#059669 !important",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0, 0, 0, 0.12) !important",
                  color: "rgba(0, 0, 0, 0.26) !important",
                },
              }}
            >
              {cargando ? "Procesando..." : "Enviar Solicitud"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Selector de Contribuyente */}
      {modalContribuyente && (
        <SelectorContribuyente
          isOpen={modalContribuyente}
          onClose={() => setModalContribuyente(false)}
          onSelectContribuyente={handleSeleccionarContribuyente}
        />
      )}

      {/* Diálogo de Confirmación */}
      <Dialog open={confirmacionDialogo} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ bgcolor: "success.main", color: "white", fontWeight: 600 }}
        >
          Solicitud Registrada
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CheckIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              ¡Solicitud Creada Correctamente!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La solicitud de fraccionamiento se ha enviado con éxito al
              servidor.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setConfirmacionDialogo(false);
              handleLimpiar();
            }}
            variant="contained"
            sx={{
              bgcolor: "#10b981 !important",
              color: "white !important",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#059669 !important",
              },
            }}
          >
            Nueva Solicitud
          </Button>
          <Button
            onClick={() => setConfirmacionDialogo(false)}
            variant="outlined"
            sx={{
              borderColor: "rgba(0,0,0,0.23) !important",
              color: "text.primary !important",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04) !important",
              },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SolicitudFraccionamiento;
