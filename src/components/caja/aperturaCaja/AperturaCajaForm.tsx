import { CreditCard as CreditCardIcon } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { UsuarioData } from "../../../services/usuarioService";
import type {
  AperturaCajaErrors,
  AperturaCajaFormData,
} from "./aperturaCaja.types";

interface Props {
  form: AperturaCajaFormData;
  cajeros: UsuarioData[];
  selectedUser: UsuarioData | null;
  loadingUsers: boolean;
  loading: boolean;
  confirmed: boolean;
  errors: AperturaCajaErrors;
  onChange: <Key extends keyof AperturaCajaFormData>(
    field: Key,
    value: AperturaCajaFormData[Key],
  ) => void;
  onAmountChange: (value: string) => void;
  onConfirm: (value: boolean) => void;
}

const userLabel = (user: UsuarioData) =>
  `${user.nombrePersona} (${user.username?.trim()})`;

export function AperturaCajaForm({
  form,
  cajeros,
  selectedUser,
  loadingUsers,
  loading,
  confirmed,
  errors,
  onChange,
  onAmountChange,
  onConfirm,
}: Props) {
  return (
    <Box sx={{ p: 1 }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "#f8f9fa",
          border: "1px solid #e9ecef",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Usuario:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {selectedUser ? userLabel(selectedUser) : "---"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {form.fechaApertura}
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {form.montoInicial === ""
              ? "APERTURA S/. —"
              : `APERTURA S/. ${form.montoInicial.toFixed(4)}`}
          </Typography>
        </Box>
      </Paper>
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" gap={2}>
          <TextField
            label="Monto Inicio de Caja"
            type="number"
            value={form.montoInicial}
            onChange={(event) => onAmountChange(event.target.value)}
            onFocus={(event) => event.target.select()}
            error={Boolean(errors.montoInicial)}
            helperText={errors.montoInicial}
            required
            disabled={loading}
            size="small"
            sx={{ flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">S/.</InputAdornment>
                ),
              },
              htmlInput: { step: 0.0001, min: 0 },
            }}
          />
          <Autocomplete
            size="small"
            options={cajeros}
            loading={loadingUsers}
            value={selectedUser}
            onChange={(_, user) =>
              onChange("codUsuario", user?.codUsuario ?? 0)
            }
            getOptionLabel={userLabel}
            isOptionEqualToValue={(option, value) =>
              option.codUsuario === value.codUsuario
            }
            disabled={loading}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Usuario"
                placeholder="Seleccionar usuario..."
                error={Boolean(errors.codUsuario)}
                helperText={errors.codUsuario}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingUsers && (
                          <CircularProgress color="inherit" size={20} />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmed}
                onChange={(event) => onConfirm(event.target.checked)}
                disabled={loading || form.montoInicial === ""}
              />
            }
            label="Confirmo que el monto inicial ingresado es correcto"
          />
          {errors.montoConfirmado && (
            <Typography variant="caption" color="error" display="block">
              {errors.montoConfirmado}
            </Typography>
          )}
        </Box>
        <TextField
          fullWidth
          label="Observación"
          value={form.observacion}
          onChange={(event) => onChange("observacion", event.target.value)}
          disabled={loading}
          size="small"
          placeholder="Ej. Aperturar caja"
        />
      </Box>
      <Alert
        severity="info"
        sx={{
          mt: 2,
          backgroundColor: "primary.main",
          color: "white",
          "& .MuiAlert-icon": { color: "white" },
        }}
        icon={<CreditCardIcon />}
      >
        <Typography variant="body2">
          Se registrará la apertura de caja con el monto inicial especificado.
          Verifique que todos los datos sean correctos antes de proceder.
        </Typography>
      </Alert>
    </Box>
  );
}
