import {
  Add,
  Business,
  Calculate,
  Edit,
  Home,
  Save,
  Search,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import type { LimpiezaPublicaController } from "./limpiezaPublica.types";

export const LimpiezaPublicaView = ({
  controller: c,
}: {
  controller: LimpiezaPublicaController;
}) => {
  const theme = useTheme();
  const headerSx = {
    fontWeight: 800,
    bgcolor: alpha(theme.palette.primary.main, 0.07),
    width: "25%",
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={c.tabValue}
          onChange={(_, value) => c.setTabValue(value)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: alpha("#f5f5f5", 0.8),
          }}
        >
          <Tab icon={<Home />} iconPosition="start" label="Casa Habitación" />
          <Tab icon={<Business />} iconPosition="start" label="Otros Usos" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          <RegistroTasa controller={c} />
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Search color="primary" fontSize="small" /> Consultar Tasas
            </Typography>
            <Divider sx={{ mb: 2.5 }} />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
              <TextField
                label="Filtrar por Año"
                type="number"
                size="small"
                value={c.anioBusqueda}
                onChange={(event) =>
                  c.setAnioBusqueda(Number(event.target.value))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") c.buscar();
                }}
                sx={{ width: 150 }}
              />
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={c.buscar}
                disabled={c.loading}
                sx={{
                  bgcolor: "#3b82f6",
                  color: "white",
                  fontWeight: 700,
                  height: 40,
                  minWidth: 100,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#2563eb" },
                }}
              >
                Buscar
              </Button>
              {c.loading && <CircularProgress size={24} />}
            </Box>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 500, borderRadius: 2 }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={headerSx}>
                      {c.tabValue === 0
                        ? "Zona de Servicios"
                        : "Criterio de Uso"}
                    </TableCell>
                    <TableCell align="center" sx={headerSx}>
                      Tasa Mensual (S/ x m2)
                    </TableCell>
                    <TableCell align="center" sx={headerSx}>
                      Tasa Anual (S/)
                    </TableCell>
                    <TableCell align="center" sx={headerSx}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {c.currentList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          No se encontraron tasas registradas para el año{" "}
                          {c.anioBusqueda}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    c.currentList.map((row, index) => (
                      <TableRow key={row.codigo || index} hover>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight={600}>
                            {c.tabValue === 0
                              ? row.nombreZona || `Zona ${row.codZona}`
                              : row.criterioUso ||
                                `Criterio ${row.codCriterio}`}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`S/ ${row.tasaMensual.toFixed(3)}`}
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              minWidth: 95,
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            fontWeight={800}
                            color="primary.main"
                          >
                            S/ {row.tasaAnual.toFixed(3)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => c.editar(row)}
                              sx={{
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.05,
                                ),
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const RegistroTasa = ({
  controller: c,
}: {
  controller: LimpiezaPublicaController;
}) => (
  <Paper
    variant="outlined"
    sx={{ p: 3, mb: 5, bgcolor: alpha("#f5f5f5", 0.5), borderRadius: 2 }}
  >
    <Typography
      variant="subtitle1"
      fontWeight={700}
      gutterBottom
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Calculate color="primary" fontSize="small" /> Registro de Tasas
    </Typography>
    <Divider sx={{ mb: 3 }} />
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: 100 }, flexShrink: 0 }}>
        <TextField
          fullWidth
          label="Año"
          type="number"
          size="small"
          value={c.anioRegistro}
          onChange={(event) => c.setAnioRegistro(Number(event.target.value))}
        />
      </Box>
      <Box sx={{ width: { xs: "100%", sm: 140 }, flexShrink: 0 }}>
        <TextField
          fullWidth
          label="Tasa Mensual"
          type="number"
          size="small"
          value={c.tasaVal}
          onChange={(event) => c.setTasaVal(event.target.value)}
          InputProps={{
            startAdornment: (
              <Typography sx={{ mr: 1, fontWeight: 700, fontSize: "0.85rem" }}>
                S/
              </Typography>
            ),
          }}
        />
      </Box>
      {c.tabValue === 0 ? (
        <Box sx={{ width: { xs: "100%", sm: 120 }, flexShrink: 0 }}>
          <Autocomplete
            fullWidth
            size="small"
            options={c.zonas}
            value={c.zonaSel}
            onChange={(_, value) => c.setZonaSel(value)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => <TextField {...params} label="Zona" />}
          />
        </Box>
      ) : (
        <Box sx={{ width: { xs: "100%", sm: 220 }, flexShrink: 0 }}>
          <Autocomplete
            fullWidth
            size="small"
            options={c.criterios}
            value={c.criterioSel}
            onChange={(_, value) => c.setCriterioSel(value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value?.value
            }
            renderInput={(params) => (
              <TextField {...params} label="Criterio de Uso" />
            )}
          />
        </Box>
      )}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          flexShrink: 0,
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "flex-end", sm: "flex-start" },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={c.limpiar}
          sx={{
            color: "text.secondary",
            borderColor: "divider",
            fontWeight: 600,
            height: 38,
          }}
        >
          Nuevo
        </Button>
        <Button
          variant="contained"
          startIcon={
            c.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Save />
            )
          }
          onClick={c.guardar}
          disabled={c.isButtonDisabled}
          sx={{
            bgcolor: "#10b981 !important",
            color: "white !important",
            fontWeight: 700,
            minWidth: 160,
            height: 38,
            "&:hover": { bgcolor: "#059669 !important" },
          }}
        >
          {c.registroEditando ? "Actualizar Tasa" : "Guardar Tasa"}
        </Button>
      </Stack>
    </Box>
  </Paper>
);
