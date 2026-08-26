import { Alert, Divider, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SelectorDireccionArancel from "../modal/SelectorDireccionArancel";
import { usePredioForm } from "../../hooks/usePredioForm";
import { PredioFields } from "./predioForm/PredioFields";
import { PredioFormActions } from "./predioForm/PredioFormActions";
import { PredioFormHeader } from "./predioForm/PredioFormHeader";
import { PredioImages } from "./predioForm/PredioImages";
import type { PredioFormProps } from "./predioForm/predioForm.types";
import { usePredioDireccion } from "./predioForm/usePredioDireccion";

const PredioForm = ({
  predioExistente,
  onSubmit: onSubmitCallback,
  codPersona,
  loading: externalLoading = false,
}: PredioFormProps) => {
  const navigate = useNavigate();
  const predio = usePredioForm(predioExistente, codPersona, onSubmitCallback);
  const direccion = usePredioDireccion(predio.form);
  const loading = externalLoading || predio.form.formState.isSubmitting;

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={predio.onFormSubmit}>
        <Stack spacing={3}>
          <PredioFormHeader editing={!!predioExistente} />
          {predio.feedback && (
            <Alert
              severity={predio.feedback.severity}
              role="status"
              sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
            >
              {predio.feedback.message}
            </Alert>
          )}
          <PredioFields
            form={predio.form}
            options={predio.options}
            isUsoPredioDisabled={predio.isUsoPredioDisabled}
            loading={loading}
            onOpenDireccion={() => predio.setShowSelectorDireccionArancel(true)}
            {...direccion}
          />
          <Divider />
          <PredioImages
            images={predio.selectedImages}
            setImages={predio.setSelectedImages}
            loading={loading}
            onUpload={predio.handleImageUpload}
          />
          <Divider />
          <PredioFormActions
            editing={!!predioExistente}
            loading={loading}
            onReset={() => {
              if (predioExistente) {
                navigate("/predio/nuevo");
                return;
              }
              predio.resetForm();
            }}
          />
        </Stack>
      </form>
      <SelectorDireccionArancel
        open={predio.showSelectorDireccionArancel}
        onClose={() => predio.setShowSelectorDireccionArancel(false)}
        onSelectArancel={predio.handleSelectArancel}
        title="Seleccionar Dirección"
      />
    </Paper>
  );
};

export default PredioForm;
