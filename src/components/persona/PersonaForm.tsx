// src/components/persona/PersonaForm.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import {
  useEstadoCivilOptions,
  useSexoOptions,
  useTipoContribuyenteOptions,
  useTipoDocumentoOptions,
} from "../../hooks/useConstantesOptions";
import { usePersonas } from "../../hooks/usePersonas";
import type { PersonaData } from "../../services/personaService";
import { getAuthenticatedUserCode } from "../../config/api.unified.config";
import SelectorDirecciones from "../modal/SelectorDirecciones";
import type { ContribuyenteDireccion } from "../../types/formTypes";

interface PersonaFormProps {
  persona?: PersonaData | null;
  onSaved: () => void;
}

type FormValues = {
  codTipopersona: string;
  codTipoDocumento: string;
  numerodocumento: string;
  nombres: string;
  apellidopaterno: string;
  apellidomaterno: string;
  fechanacimiento: string;
  codestadocivil: string;
  codsexo: string;
  telefono: string;
  nFinca: string;
  otroNumero: string;
};

const emptyValues: FormValues = {
  codTipopersona: "0301",
  codTipoDocumento: "4101",
  numerodocumento: "",
  nombres: "",
  apellidopaterno: "",
  apellidomaterno: "",
  fechanacimiento: "",
  codestadocivil: "",
  codsexo: "",
  telefono: "",
  nFinca: "",
  otroNumero: "",
};

const PersonaForm: React.FC<PersonaFormProps> = ({ persona, onSaved }) => {
  const {
    crearPersona,
    actualizarPersona,
    isCreating,
    isUpdating,
    validarDocumento,
    listarPersona,
  } = usePersonas();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [error, setError] = useState("");
  const [personaEnEdicion, setPersonaEnEdicion] = useState<PersonaData | null>(
    persona ?? null,
  );
  const [consultandoDocumento, setConsultandoDocumento] = useState(false);
  const [mensajeConsulta, setMensajeConsulta] = useState("");
  const [estadoConsulta, setEstadoConsulta] = useState<
    "success" | "info" | "error" | null
  >(null);
  const [selectorDireccionesOpen, setSelectorDireccionesOpen] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] =
    useState<ContribuyenteDireccion | null>(null);
  const isJuridica = values.codTipopersona === "0302";
  const { options: tiposPersona } = useTipoContribuyenteOptions();
  const { options: documentos } = useTipoDocumentoOptions(isJuridica);
  const { options: estadosCiviles } = useEstadoCivilOptions();
  const { options: sexos } = useSexoOptions();
  const submitting = isCreating || isUpdating || consultandoDocumento;
  const ultimaConsultaRef = useRef("");
  const consultaActivaRef = useRef(0);
  const documentosOrdenados = useMemo(() => {
    const ordenDocumento = (label: string) => {
      const nombre = label.toUpperCase();
      const esCarnetExtranjeria =
        nombre.includes("CARNET") ||
        nombre.includes("EXTRANJ") ||
        /\bC\.?E\.?\b/.test(nombre);
      if (nombre.includes("DNI") && !nombre.includes("SIN")) return 1;
      if (nombre.includes("PARTIDA")) return 2;
      if (nombre.includes("SIN DNI")) return 3;
      if (esCarnetExtranjeria) return 4;
      if (nombre.includes("RUC")) return 5;
      return 99;
    };
    return [...documentos].sort(
      (a, b) => ordenDocumento(a.label) - ordenDocumento(b.label),
    );
  }, [documentos]);
  // Las constantes se cargan de forma asíncrona. MUI no admite un valor que
  // aún no exista entre los MenuItem, por eso se muestra vacío hasta cargarlo.
  const documentoSeleccionado = documentos.some(
    (option) => String(option.value) === values.codTipoDocumento,
  )
    ? values.codTipoDocumento
    : "";
  const tipoPersonaSeleccionado = tiposPersona.some(
    (option) => String(option.value) === values.codTipopersona,
  )
    ? values.codTipopersona
    : "";
  const estadoCivilSeleccionado = estadosCiviles.some(
    (option) => String(option.value) === values.codestadocivil,
  )
    ? values.codestadocivil
    : "";
  const sexoSeleccionado = sexos.some(
    (option) => String(option.value) === values.codsexo,
  )
    ? values.codsexo
    : "";
  const documentoConfig = useMemo(() => {
    const nombre =
      documentos
        .find((option) => String(option.value) === values.codTipoDocumento)
        ?.label.toUpperCase() || "";
    const esCarnetExtranjeria =
      nombre.includes("CARNET") ||
      nombre.includes("EXTRANJ") ||
      /\bC\.?E\.?\b/.test(nombre);
    if (
      (nombre.includes("DNI") && !nombre.includes("SIN")) ||
      values.codTipoDocumento === "4101"
    )
      return { maxLength: 8, helperText: "DNI: 8 dígitos" };
    if (nombre.includes("PARTIDA") || nombre.includes("SIN DNI"))
      return {
        maxLength: 15,
        helperText: nombre.includes("SIN")
          ? "Sin DNI: de 1 a 15 dígitos"
          : "Partida de nacimiento: de 1 a 15 dígitos",
      };
    if (esCarnetExtranjeria || values.codTipoDocumento === "4103")
      return { maxLength: 9, helperText: "Carnet de extranjería: 9 dígitos" };
    if (nombre.includes("RUC") || values.codTipoDocumento === "4102")
      return { maxLength: 10, helperText: "RUC: 10 dígitos" };
    return { maxLength: 15, helperText: "" };
  }, [documentos, values.codTipoDocumento]);

  const cargarPersonaEnFormulario = useCallback(
    (personaEncontrada: PersonaData) => {
      setValues({
        codTipopersona: personaEncontrada.codTipopersona || "0301",
        codTipoDocumento: personaEncontrada.codTipoDocumento || "4101",
        numerodocumento: personaEncontrada.numerodocumento || "",
        nombres:
          personaEncontrada.nombres || personaEncontrada.razonSocial || "",
        apellidopaterno: personaEncontrada.apellidopaterno || "",
        apellidomaterno: personaEncontrada.apellidomaterno || "",
        fechanacimiento: String(personaEncontrada.fechanacimiento || "").slice(
          0,
          10,
        ),
        codestadocivil: personaEncontrada.codestadocivil || "",
        codsexo: personaEncontrada.codsexo || "",
        telefono: personaEncontrada.telefono || "",
        nFinca:
          personaEncontrada.lote != null ? String(personaEncontrada.lote) : "",
        otroNumero: personaEncontrada.otros || "",
      });
      setDireccionSeleccionada(
        personaEncontrada.codDireccion
          ? {
              id: personaEncontrada.codDireccion,
              descripcion:
                personaEncontrada.direccion || "Dirección registrada",
            }
          : null,
      );
    },
    [],
  );

  useEffect(() => {
    consultaActivaRef.current += 1;
    ultimaConsultaRef.current = "";
    setMensajeConsulta("");
    setEstadoConsulta(null);
    setPersonaEnEdicion(persona ?? null);

    if (persona) {
      cargarPersonaEnFormulario(persona);
    } else {
      setValues(emptyValues);
      setDireccionSeleccionada(null);
    }
  }, [cargarPersonaEnFormulario, persona]);

  const consultarDocumento = useCallback(async () => {
    const codTipoDocumento = values.codTipoDocumento;
    const numeroDocumento = values.numerodocumento.trim();
    const validacion = validarDocumento(codTipoDocumento, numeroDocumento);

    if (!codTipoDocumento || !numeroDocumento || !validacion.valido) return;

    const claveConsulta = `${codTipoDocumento}:${numeroDocumento}`;
    if (ultimaConsultaRef.current === claveConsulta) return;

    ultimaConsultaRef.current = claveConsulta;
    const consultaActual = ++consultaActivaRef.current;
    setConsultandoDocumento(true);
    setMensajeConsulta("");
    setEstadoConsulta(null);

    try {
      const personasEncontradas = await listarPersona(
        codTipoDocumento,
        numeroDocumento,
      );
      if (consultaActual !== consultaActivaRef.current) return;

      const personaEncontrada = personasEncontradas[0];
      if (personaEncontrada) {
        setPersonaEnEdicion(personaEncontrada);
        cargarPersonaEnFormulario(personaEncontrada);
        setMensajeConsulta(
          `Persona encontrada. El formulario está en modo edición (código ${personaEncontrada.codPersona}).`,
        );
        setEstadoConsulta("success");
        return;
      }

      setPersonaEnEdicion(null);
      setDireccionSeleccionada(null);
      setValues((prev) => ({
        ...emptyValues,
        codTipopersona: prev.codTipopersona,
        codTipoDocumento,
        numerodocumento: numeroDocumento,
      }));
      setMensajeConsulta(
        "No existe una persona con este documento. Puede continuar con el registro.",
      );
      setEstadoConsulta("info");
    } catch {
      if (consultaActual !== consultaActivaRef.current) return;
      ultimaConsultaRef.current = "";
      setMensajeConsulta(
        "No se pudo consultar el documento. Verifique la conexión e intente nuevamente.",
      );
      setEstadoConsulta("error");
    } finally {
      if (consultaActual === consultaActivaRef.current) {
        setConsultandoDocumento(false);
      }
    }
  }, [
    cargarPersonaEnFormulario,
    listarPersona,
    validarDocumento,
    values.codTipoDocumento,
    values.numerodocumento,
  ]);

  useEffect(() => {
    const validacion = validarDocumento(
      values.codTipoDocumento,
      values.numerodocumento.trim(),
    );
    if (!validacion.valido) return;

    const timer = window.setTimeout(() => {
      void consultarDocumento();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [
    consultarDocumento,
    validarDocumento,
    values.codTipoDocumento,
    values.numerodocumento,
  ]);

  const direccionCompleta = useMemo(() => {
    if (!direccionSeleccionada) return "";

    return [
      direccionSeleccionada.descripcion,
      values.nFinca.trim() ? `N.º Finca ${values.nFinca.trim()}` : "",
      values.otroNumero.trim() ? `Otro N.º ${values.otroNumero.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" - ");
  }, [direccionSeleccionada, values.nFinca, values.otroNumero]);

  const setField = (field: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const cambiarTipoDocumento = (codTipoDocumento: string) => {
    consultaActivaRef.current += 1;
    ultimaConsultaRef.current = "";
    setConsultandoDocumento(false);
    setPersonaEnEdicion(null);
    setDireccionSeleccionada(null);
    setMensajeConsulta("");
    setEstadoConsulta(null);
    setValues((prev) => ({
      ...emptyValues,
      codTipopersona: prev.codTipopersona,
      codTipoDocumento,
    }));
  };

  const cambiarNumeroDocumento = (numeroDocumento: string) => {
    const numeroNormalizado = numeroDocumento
      .replace(/\D/g, "")
      .slice(0, documentoConfig.maxLength);

    if (numeroNormalizado !== values.numerodocumento) {
      consultaActivaRef.current += 1;
      ultimaConsultaRef.current = "";
      setConsultandoDocumento(false);
      setMensajeConsulta("");
      setEstadoConsulta(null);
    }

    if (
      personaEnEdicion &&
      numeroNormalizado !== personaEnEdicion.numerodocumento
    ) {
      setPersonaEnEdicion(null);
      setDireccionSeleccionada(null);
      setValues((prev) => ({
        ...emptyValues,
        codTipopersona: prev.codTipopersona,
        codTipoDocumento: prev.codTipoDocumento,
        numerodocumento: numeroNormalizado,
      }));
      return;
    }

    setField("numerodocumento", numeroNormalizado);
  };

  const limpiar = () => {
    consultaActivaRef.current += 1;
    ultimaConsultaRef.current = "";
    setValues(emptyValues);
    setPersonaEnEdicion(null);
    setDireccionSeleccionada(null);
    setSelectorDireccionesOpen(false);
    setError("");
    setMensajeConsulta("");
    setEstadoConsulta(null);
  };

  const guardar = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!values.numerodocumento || !values.nombres) {
      setError("Complete el documento y el nombre o razón social.");
      return;
    }
    const validacion = validarDocumento(
      values.codTipoDocumento,
      values.numerodocumento,
    );
    if (!validacion.valido) {
      setError(validacion.mensaje || "Documento inválido.");
      return;
    }
    const { nFinca, otroNumero, ...datosPersona } = values;
    const payload = {
      ...datosPersona,
      fechanacimiento: values.fechanacimiento || "1998-02-23",
      codestadocivil: values.codestadocivil || "1801",
      codsexo: values.codsexo || "2001",
      codDireccion: direccionSeleccionada?.id ?? null,
      lote: nFinca.trim() || null,
      otros: otroNumero.trim() || null,
      usuario: getAuthenticatedUserCode(),
    };
    try {
      if (personaEnEdicion?.codPersona)
        await actualizarPersona({
          ...payload,
          codPersona: personaEnEdicion.codPersona,
        });
      else await crearPersona(payload);
      limpiar();
      onSaved();
    } catch {
      /* La notificación del hook informa el error. */
    }
  };

  return (
    <Paper component="form" onSubmit={guardar} elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        {personaEnEdicion ? "Editar persona" : "Nueva persona"}
      </Typography>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {mensajeConsulta && estadoConsulta && (
        <Alert severity={estadoConsulta} sx={{ mb: 2 }}>
          {mensajeConsulta}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel shrink>Tipo de persona</InputLabel>
            <Select
              label="Tipo de persona"
              value={tipoPersonaSeleccionado}
              displayEmpty
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  codTipopersona: e.target.value,
                  codTipoDocumento: "",
                }))
              }
            >
              <MenuItem value="" disabled>
                Seleccione un tipo de persona
              </MenuItem>
              {tiposPersona.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel shrink>Tipo de documento</InputLabel>
            <Select
              label="Tipo de documento"
              value={documentoSeleccionado}
              displayEmpty
              onChange={(e) => cambiarTipoDocumento(e.target.value)}
            >
              <MenuItem value="" disabled>
                Seleccione un tipo de documento
              </MenuItem>
              {documentosOrdenados.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="Número de documento"
            value={values.numerodocumento}
            onChange={(e) => cambiarNumeroDocumento(e.target.value)}
            onBlur={() => void consultarDocumento()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void consultarDocumento();
              }
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: documentoConfig.maxLength,
            }}
            InputProps={{
              endAdornment: consultandoDocumento ? (
                <CircularProgress size={20} />
              ) : undefined,
            }}
            helperText={documentoConfig.helperText}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: isJuridica ? 12 : 4 }}>
          <TextField
            fullWidth
            required
            label={isJuridica ? "Razón social" : "Nombres"}
            value={values.nombres}
            onChange={(e) => setField("nombres", e.target.value)}
          />
        </Grid>
        {!isJuridica && (
          <>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Apellido paterno"
                value={values.apellidopaterno}
                onChange={(e) => setField("apellidopaterno", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Apellido materno"
                value={values.apellidomaterno}
                onChange={(e) => setField("apellidomaterno", e.target.value)}
              />
            </Grid>
          </>
        )}
        {!isJuridica && (
          <>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de nacimiento"
                InputLabelProps={{ shrink: true }}
                value={values.fechanacimiento}
                onChange={(e) => setField("fechanacimiento", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel shrink>Estado civil</InputLabel>
                <Select
                  label="Estado civil"
                  value={estadoCivilSeleccionado}
                  displayEmpty
                  onChange={(e) => setField("codestadocivil", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Seleccione un estado civil
                  </MenuItem>
                  {estadosCiviles.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel shrink>Sexo</InputLabel>
                <Select
                  label="Sexo"
                  value={sexoSeleccionado}
                  displayEmpty
                  onChange={(e) => setField("codsexo", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Seleccione un sexo
                  </MenuItem>
                  {sexos.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="Teléfono"
            value={values.telefono}
            onChange={(e) => setField("telefono", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<LocationIcon />}
            onClick={() => setSelectorDireccionesOpen(true)}
            sx={{
              height: 40,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 1,
            }}
          >
            Direcciones
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="N.º Finca"
            value={values.nFinca}
            onChange={(e) => setField("nFinca", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="Otro N.º"
            value={values.otroNumero}
            onChange={(e) => setField("otroNumero", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            disabled
            label="Dirección seleccionada"
            value={direccionCompleta}
            placeholder="Seleccione una dirección"
            slotProps={{ input: { readOnly: true } }}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "text.primary",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "text.secondary",
              },
            }}
          />
        </Grid>
      </Grid>

      <SelectorDirecciones
        open={selectorDireccionesOpen}
        onClose={() => setSelectorDireccionesOpen(false)}
        onSelectDireccion={setDireccionSeleccionada}
        direccionSeleccionada={direccionSeleccionada}
        titulo="Seleccionar dirección de la persona"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          mt: 4,
          pt: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button
          type="button"
          onClick={limpiar}
          startIcon={<ClearIcon />}
          variant="outlined"
          sx={{
            borderColor: "#64748b !important",
            color: "#334155 !important",
            fontWeight: 700,
            "&:hover": {
              borderColor: "#334155 !important",
              backgroundColor: "#f1f5f9 !important",
            },
          }}
        >
          Limpiar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: "#2563eb !important",
            color: "#ffffff !important",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#1d4ed8 !important" },
            "&.Mui-disabled": {
              backgroundColor: "#94a3b8 !important",
              color: "#ffffff !important",
            },
          }}
        >
          {submitting ? "Guardando..." : "Guardar persona"}
        </Button>
      </Box>
    </Paper>
  );
};

export default PersonaForm;
