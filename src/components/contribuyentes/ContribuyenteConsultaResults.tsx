import { Business, Edit, Person } from "@mui/icons-material";
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { Contribuyente } from "./contribuyenteConsulta.types";

interface Props {
  rows: Contribuyente[];
  loading: boolean;
  onEdit: (code: string | number) => void;
}
const isLegal = (type?: string) =>
  ["juridica", "0302"].includes(String(type || "").toLowerCase());
const PersonTypeIcon = ({
  type,
  size = 18,
}: {
  type?: string;
  size?: number;
}) =>
  isLegal(type) ? (
    <Business sx={{ fontSize: size }} />
  ) : (
    <Person sx={{ fontSize: size }} />
  );
const booleanLabel = (value?: boolean | null) =>
  value === true ? "SÍ" : value === false ? "NO" : "-";

const MobileResults = ({ rows, onEdit }: Omit<Props, "loading">) => (
  <Box sx={{ display: { xs: "block", sm: "none" } }}>
    <Stack spacing={2}>
      {rows.map((item) => (
        <Card key={item.codigo} variant="outlined">
          <CardContent>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonTypeIcon
                    type={item.tipoContribuyente || item.tipoPersona}
                  />
                </Avatar>
                <Typography variant="subtitle2" fontWeight={700}>
                  {item.contribuyente}
                </Typography>
              </Stack>
              <IconButton
                size="small"
                onClick={() => onEdit(item.codigo)}
                color="primary"
                aria-label="Editar contribuyente"
              >
                <Edit fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Doc: {item.documento || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Dir: {item.direccion || "-"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Chip
                label={`Exonerado: ${booleanLabel(item.esExonerado)}`}
                size="small"
                color={item.esExonerado ? "success" : "default"}
              />
              <Chip
                label={`Pensionista: ${booleanLabel(item.esPensionista)}`}
                size="small"
                color={item.esPensionista ? "info" : "default"}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
);

export const ContribuyenteConsultaResults = ({
  rows,
  loading,
  onEdit,
}: Props) => {
  const theme = useTheme();
  if (loading)
    return (
      <Stack spacing={2}>
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} variant="rectangular" height={60} />
        ))}
      </Stack>
    );
  if (!rows.length)
    return (
      <Alert severity="info">
        No se encontraron contribuyentes para el criterio seleccionado.
      </Alert>
    );
  return (
    <>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Paper
          variant="outlined"
          sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
        >
          <Box
            sx={{
              p: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              gap: 1,
            }}
          >
            <Person color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="primary.dark"
            >
              RESULTADOS DE LA BÚSQUEDA DE CONTRIBUYENTES
            </Typography>
          </Box>
          <TableContainer sx={{ maxHeight: 450, overflow: "auto" }}>
            <Table stickyHeader size="small" sx={{ minWidth: 1080 }}>
              <TableHead>
                <TableRow>
                  {[
                    "CÓDIGO",
                    "CONTRIBUYENTE",
                    "DOCUMENTO",
                    "DIRECCIÓN",
                    "TIPO",
                    "EXONERADO",
                    "PENSIONISTA",
                    "ACCIONES",
                  ].map((label) => (
                    <TableCell
                      key={label}
                      align={
                        [
                          "TIPO",
                          "EXONERADO",
                          "PENSIONISTA",
                          "ACCIONES",
                        ].includes(label)
                          ? "center"
                          : "left"
                      }
                      sx={{ fontWeight: 700, bgcolor: "#eef5ff" }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.codigo} hover>
                    <TableCell>
                      <Chip
                        label={item.codigo}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                          }}
                        >
                          <PersonTypeIcon
                            type={item.tipoContribuyente || item.tipoPersona}
                            size={14}
                          />
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {item.contribuyente}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{item.documento || "-"}</TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography noWrap variant="body2">
                        {item.direccion || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.tipoContribuyente || "Natural"}
                        size="small"
                        color={
                          isLegal(item.tipoContribuyente || item.tipoPersona)
                            ? "primary"
                            : "secondary"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={booleanLabel(item.esExonerado)}
                        size="small"
                        color={item.esExonerado ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={booleanLabel(item.esPensionista)}
                        size="small"
                        color={item.esPensionista ? "info" : "default"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar Contribuyente">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(item.codigo)}
                          color="primary"
                        >
                          <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <MobileResults rows={rows} onEdit={onEdit} />
    </>
  );
};
