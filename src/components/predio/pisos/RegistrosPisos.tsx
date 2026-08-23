import ApartmentIcon from "@mui/icons-material/Apartment";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Card, CardContent, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import { lazy, Suspense } from "react";
import { PisoCategoriasSection } from "./PisoCategoriasSection";
import { PisoDatosSection } from "./PisoDatosSection";
import { PisoPredioSection } from "./PisoPredioSection";
import { useRegistroPisoForm } from "./useRegistroPisoForm";

const SelectorPredio = lazy(() => import("../../modal/SelectorPredio"));

export const RegistrosPisos = () => {
  const controller = useRegistroPisoForm();
  const { catalogos } = controller;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, bgcolor: "primary.50", border: 1, borderColor: "divider" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <ApartmentIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="h5" fontWeight={800}>{controller.isEditMode ? "Editar piso" : "Registrar piso"}</Typography>
              <Typography color="text.secondary">Gestione los datos constructivos y categorías del predio.</Typography>
            </Box>
          </Stack>
        </Paper>

        <PisoPredioSection predio={controller.predio} error={controller.errors.predio} readOnly={controller.isEditMode} onOpenSelector={() => controller.setSelectorOpen(true)} />
        <PisoDatosSection form={controller.formData} errors={controller.errors} estados={catalogos.opcionesEstadoConservacion} materiales={catalogos.opcionesMaterialPredominante} loadingEstados={catalogos.loadingEstado} loadingMateriales={catalogos.loadingMaterial} onChange={controller.updateField} />
        <PisoCategoriasSection
          parent={controller.categoriaPadre}
          child={controller.categoriaHija}
          letter={controller.letra}
          parents={catalogos.opcionesPadre}
          children={catalogos.opcionesHijas}
          letters={catalogos.opcionesLetras}
          categories={controller.categorias}
          total={controller.totalCategorias}
          error={controller.errors.categorias}
          catalogError={catalogos.errorCatalogos || catalogos.errorPadre || catalogos.errorHijas || catalogos.errorLetras || catalogos.errorEstado || catalogos.errorMaterial}
          onParentChange={controller.changeParent}
          onChildChange={controller.changeChild}
          onLetterChange={controller.setLetra}
          onAdd={controller.addCategory}
          onRemove={controller.removeCategory}
        />

        <Card>
          <CardContent>
            <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={1.5}>
              <Button variant="outlined" startIcon={<CleaningServicesIcon />} onClick={controller.clear} disabled={controller.isSaving}>Limpiar formulario</Button>
              <Button variant="contained" startIcon={controller.isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} onClick={() => void controller.submit()} disabled={controller.isSaving || !controller.predio || !controller.categorias.length}>
                {controller.isSaving ? "Guardando..." : controller.isEditMode ? "Actualizar" : "Registrar"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {controller.selectorOpen && (
          <Suspense fallback={<Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>}>
            <SelectorPredio isOpen onClose={() => controller.setSelectorOpen(false)} onSelectPredio={controller.selectPredio} />
          </Suspense>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default RegistrosPisos;
