import { Home, Person } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { AsignacionFormData } from "./asignacionPredio.types";

interface Props {
  form: AsignacionFormData;
  disabled: boolean;
  onContributor: () => void;
  onProperty: () => void;
}
export const AsignacionSelectionCard = ({
  form,
  disabled,
  onContributor,
  onProperty,
}: Props) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Person color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Seleccionar contribuyente y predio
        </Typography>
      </Stack>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={onContributor}
            disabled={disabled}
            startIcon={<Person />}
            sx={{ height: 33, width: 160 }}
          >
            Contribuyente
          </Button>
          <TextField
            label="Código"
            value={form.contribuyente?.codigo || ""}
            size="small"
            disabled
            sx={{ width: 100 }}
          />
          <TextField
            fullWidth
            label="Nombre"
            value={form.contribuyente?.nombreCompleto || ""}
            size="small"
            disabled
            sx={{ flex: 1 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={onProperty}
            disabled={disabled || !form.contribuyente}
            startIcon={<Home />}
            sx={{ height: 33, width: 160 }}
          >
            Predio
          </Button>
          <TextField
            label="Código"
            value={form.predio?.codigoPredio || ""}
            size="small"
            disabled
            sx={{ width: 100 }}
          />
          <TextField
            fullWidth
            label="Dirección"
            value={
              typeof form.predio?.direccion === "string"
                ? form.predio.direccion
                : ""
            }
            size="small"
            disabled
            sx={{ flex: 1 }}
          />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);
