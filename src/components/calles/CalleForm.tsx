// src/components/calles/CalleForm.tsx
import React from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { CalleFormData } from '../../models/Calle';
import { useCalleForm } from '../../hooks/useCalleForm';

import { Barrio } from '../../models/Barrio';
import { Sector } from '../../models/Sector';

interface CalleFormProps {
  onSubmit: (data: any) => void | Promise<void>;
  onNew?: () => void;
  onNuevo?: () => void;
  onUpdateSector?: (sectorId: number, nombre: string) => Promise<boolean>;
  initialData?: Partial<CalleFormData>;
  isSubmitting?: boolean;
  barrios?: Barrio[];
  sectores?: Sector[];
}

const CalleForm: React.FC<CalleFormProps> = ({
  onSubmit,
  onNew,
  onNuevo,
  onUpdateSector,
  initialData,
  isSubmitting: externalLoading = false,
  barrios: _barrios,
  sectores: _externalSectores
}) => {
  const _handleNuevo = () => {
    if (onNew) onNew();
    if (onNuevo) onNuevo();
  };
  const {
    form,
    tiposVia,
    loadingTiposVia,
    errorTiposVia,
    sectores,
    loadingSectores,
    errorSectores,
    barriosFiltrados,
    errorBarrios,
    openEditSectorDialog,
    setOpenEditSectorDialog,
    editingSector,
    newSectorName,
    setNewSectorName,
    handleFormSubmit,
    handleEditSector,
    selectedSector
  } = useCalleForm(initialData, onSubmit);

  const { control, register, formState: { errors }, reset } = form;
  const isSubmitting = externalLoading;
  const hasInitialData = !!initialData;

  const handleEditSectorConfirm = async () => {
    if (!editingSector || !onUpdateSector || !newSectorName.trim()) return;
    await onUpdateSector(editingSector.id, newSectorName.trim());
    setOpenEditSectorDialog(false);
  };

  const hasErrors = errorTiposVia || errorSectores || errorBarrios;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(to bottom, #ffffff, #fafafa)', border: '1px solid', borderColor: 'divider' }}>
      {hasErrors && <Alert severity="warning" sx={{ mb: 2 }}>Algunos datos no se pudieron cargar.</Alert>}
      
      <form onSubmit={handleFormSubmit}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {/* Box Tipo de Vía */}
          <Box sx={{ flex: '1 1 150px' }}>
            <Controller
              name="tipoVia"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={tiposVia}
                  getOptionLabel={(o) => o.nombre || ''}
                  value={tiposVia.find(t => t.codConstante === field.value) || null}
                  onChange={(_, v) => field.onChange(v?.codConstante || 0)}
                  loading={loadingTiposVia}
                  renderInput={(params) => <TextField {...params} label="Tipo de Vía *" error={!!errors.tipoVia} helperText={errors.tipoVia?.message} size="small" />}
                />
              )}
            />
          </Box>
          {/* Box Sector */}
          <Box sx={{ flex: '1 1 180px' }}>
            <Controller
              name="codSector"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={sectores || []}
                  getOptionLabel={(o) => o.nombre || ''}
                  value={sectores?.find(s => s.id === field.value) || null}
                  onChange={(_, v) => field.onChange(v?.id || 0)}
                  loading={loadingSectores}
                  renderOption={(props, option) => {
                    const { key, ...op } = props as any;
                    return (
                      <Box component="li" key={key} {...op} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {option.nombre}
                        {onUpdateSector && <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditSector(option); }}><EditIcon fontSize="small" /></IconButton>}
                      </Box>
                    );
                  }}
                  renderInput={(params) => <TextField {...params} label="Sector *" error={!!errors.codSector} helperText={errors.codSector?.message} size="small" />}
                />
              )}
            />
          </Box>
          {/* Box Barrio */}
          <Box sx={{ flex: '1 1 180px' }}>
            <Controller
              name="codBarrio"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={barriosFiltrados || []}
                  getOptionLabel={(o) => o.nombre || ''}
                  value={barriosFiltrados?.find(b => b.id === field.value) || null}
                  onChange={(_, v) => field.onChange(v?.id || 0)}
                  disabled={!selectedSector}
                  renderInput={(params) => <TextField {...params} label="Barrio" size="small" placeholder="Seleccione un barrio" />}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 250px' }}>
            <TextField {...register('nombreCalle')} label="Nombre de la Calle *" fullWidth size="small" error={!!errors.nombreCalle} helperText={errors.nombreCalle?.message} disabled={isSubmitting} />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          mt: 2
        }}>
          {/* Boton Nuevo */}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              reset({ tipoVia: 0, codSector: 0, codBarrio: 0, nombreCalle: '' });
              _handleNuevo();
            }}
            disabled={isSubmitting}
            sx={{
              minWidth: 80,
              height: 40,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: 'white !important',
              color: '#1976d2 !important',
              border: '1px solid #1976d2 !important',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04) !important'
              },
              '&.Mui-disabled': {
                backgroundColor: '#f3f4f6 !important',
                color: '#9ca3af !important',
                border: '1px solid #e5e7eb !important',
                boxShadow: 'none !important'
              }
            }}
          >
            Nuevo
          </Button>

          {/* Boton Guardar */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : (hasInitialData ? <EditIcon /> : <SaveIcon />)}
            disabled={isSubmitting}
            sx={{
              minWidth: 100,
              height: 40,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#1976d2 !important',
              color: 'white !important',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#1565c0 !important',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)'
              },
              '&.Mui-disabled': {
                backgroundColor: '#f3f4f6 !important',
                color: '#9ca3af !important',
                border: '1px solid #e5e7eb !important',
                boxShadow: 'none !important'
              }
            }}
          >
            {isSubmitting ? 'Guardando...' : (hasInitialData ? 'Actualizar' : 'Guardar')}
          </Button>

        </Box>
      </form>

      <Dialog open={openEditSectorDialog} onClose={() => setOpenEditSectorDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Sector</DialogTitle>
        <DialogContent><TextField autoFocus fullWidth label="Nombre del Sector" value={newSectorName} onChange={(e) => setNewSectorName(e.target.value)} sx={{ mt: 1 }} size="small" /></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditSectorDialog(false)}>Cancelar</Button>
          <Button onClick={handleEditSectorConfirm} variant="contained" disabled={!newSectorName.trim()}>Actualizar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CalleForm;
