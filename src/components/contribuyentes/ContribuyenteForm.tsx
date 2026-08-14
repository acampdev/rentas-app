import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Collapse,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';

import PersonaFormMUI from './PersonaForm';
import FormSectionMUI from '../utils/FormSection';
import SelectorDirecciones from '../modal/SelectorDirecciones';
import { useContribuyenteForm } from '../../hooks/useContribuyenteForm';

interface ContribuyenteFormMUIProps {
  onSubmit?: (data: any) => void | Promise<void>;
  onEdit?: () => void;
  onNew?: () => void;
  initialData?: any;
  loading?: boolean;
}

const ContribuyenteFormMUI: React.FC<ContribuyenteFormMUIProps> = ({
  onSubmit,
  onEdit,
  onNew,
  initialData,
  loading: externalLoading = false
}) => {
  const theme = useTheme();
  const isEditMode = !!initialData?.codContribuyente || !!initialData?.codPersona;
  
  const {
    principalForm,
    conyugeRepresentanteForm,
    internalLoading,
    showConyugeRepresentante,
    isDireccionModalOpen,
    isConyugeDireccionModalOpen,
    tipoContribuyente,
    esPersonaJuridica,
    handleTipoContribuyenteChange,
    toggleConyugeForm,
    handleOpenDireccionModal,
    handleCloseDireccionModal,
    handleOpenConyugeDireccionModal,
    handleCloseConyugeDireccionModal,
    handleSelectDireccion,
    handleSelectConyugeDireccion,
    getDireccionTextoCompleto,
    handleNuevo,
    handleEditar,
    handleSubmit
  } = useContribuyenteForm({ onSubmit, onEdit, onNew, initialData });

  const loading = externalLoading || internalLoading;

  return (
    <>
      <Paper 
        sx={{ 
          p: 3,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 100px)'
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Registro de Contribuyente
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Tipo de Contribuyente
              </Typography>
              <ToggleButtonGroup
                value={tipoContribuyente}
                exclusive
                onChange={handleTipoContribuyenteChange}
                aria-label="tipo de contribuyente"
                sx={{ mt: 1 }}
              >
                <ToggleButton value="natural" aria-label="persona natural">
                  <PersonIcon sx={{ mr: 1 }} />
                  Persona Natural
                </ToggleButton>
                <ToggleButton value="juridica" aria-label="persona jurídica">
                  <BusinessIcon sx={{ mr: 1 }} />
                  Persona Jurídica
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ width: '100%' }}>
            {/* Formulario Persona Principal */}
            <PersonaFormMUI
              form={principalForm}
              isJuridica={esPersonaJuridica}
              onOpenDireccionModal={handleOpenDireccionModal}
              direccion={principalForm.watch('direccion')}
              getDireccionTextoCompleto={getDireccionTextoCompleto}
              disablePersonaFields={loading}
            />

            {/* Acciones */}
            <Box sx={{ my: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Botón para agregar datos del cónyuge/representante */}
              <Button
                variant="contained"
                onClick={toggleConyugeForm}
                disabled={loading}
                startIcon={<GroupsIcon />}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 600,
                  height: '36px'
                }}
                sx={{
                  minWidth: '200px',
                  textTransform: 'none'
                }}
              >
                {showConyugeRepresentante 
                  ? 'Ocultar' 
                  : esPersonaJuridica 
                    ? 'Agregar datos del representante legal' 
                    : 'Agregar datos del cónyuge'}
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Botón para nuevo contribuyente */}
                <Button
                  variant="outlined"
                  onClick={handleNuevo}
                  disabled={loading}
                  startIcon={<AddIcon />}
                  sx={{ minWidth: '120px', height: '36px', textTransform: 'none' }}
                >
                  Nuevo
                </Button>
                {/* Botón para guardar / actualizar contribuyente unificado */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontWeight: 700,
                    minWidth: '120px',
                    height: '36px'
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  {isEditMode 
                    ? (loading ? 'Actualizando...' : 'Actualizar') 
                    : (loading ? 'Guardando...' : 'Guardar')}
                </Button>
              </Box>
            </Box>

            {/* Formulario Cónyuge/Representante */}
            <Collapse in={showConyugeRepresentante}>
              <FormSectionMUI 
                title={esPersonaJuridica ? 'Datos del Representante Legal' : 'Datos del Cónyuge'}
                icon={<GroupsIcon />}
                onDelete={toggleConyugeForm}
              >
                <PersonaFormMUI
                  form={conyugeRepresentanteForm}
                  isRepresentante={true}
                  onOpenDireccionModal={handleOpenConyugeDireccionModal}
                  direccion={conyugeRepresentanteForm.watch('direccion')}
                  getDireccionTextoCompleto={getDireccionTextoCompleto}
                  disablePersonaFields={loading}
                />
              </FormSectionMUI>
            </Collapse>
          </Box>
        </Box>
      </Paper>

      {/* Modales */}
      <SelectorDirecciones
        open={isDireccionModalOpen}
        onClose={handleCloseDireccionModal}
        onSelectDireccion={handleSelectDireccion}
      />
      
      <SelectorDirecciones
        open={isConyugeDireccionModalOpen}
        onClose={handleCloseConyugeDireccionModal}
        onSelectDireccion={handleSelectConyugeDireccion}
      />
    </>
  );
};

export default ContribuyenteFormMUI;
