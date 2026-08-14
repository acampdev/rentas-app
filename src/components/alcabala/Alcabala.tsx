// src/components/alcabala/Alcabala.tsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface AlcabalaProps {
  aniosDisponibles: { value: number | string, label: string }[];
  anioSeleccionado: number | null;
  tasa: number;
  onAnioChange: (anio: number | null) => void;
  onTasaChange: (tasa: number) => void;
  onRegistrar: () => void;
  loading?: boolean;
}

const currentYear = new Date().getFullYear();

/**
 * Componente Alcabala unificado con formulario compacto
 */
const Alcabala: React.FC<AlcabalaProps> = ({
  anioSeleccionado,
  tasa,
  onAnioChange,
  onTasaChange,
  onRegistrar,
  loading = false
}) => {
  const [tasaInput, setTasaInput] = useState<string>(tasa === 0 ? '' : String(tasa));

  useEffect(() => {
    setTasaInput(tasa === 0 ? '' : String(tasa));
  }, [tasa]);

  const handleTasaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTasaInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) onTasaChange(numValue);
    else if (value === '' || value === '.') onTasaChange(0);
  };

  const handleTasaFocus = () => { if (tasa === 0) setTasaInput(''); };
  const handleTasaBlur = () => { if (tasaInput === '') { setTasaInput('0'); onTasaChange(0); } };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, alignItems: 'center' }}>
        <Box sx={{ width: '100px', flexShrink: 0 }}>
          <TextField
            label="Año"
            type="number"
            size="small"
            fullWidth
            value={anioSeleccionado || ''}
            onChange={(e) => onAnioChange(e.target.value ? Number(e.target.value) : null)}
            placeholder={String(currentYear)}
          />
        </Box>

        <Box sx={{ width: '140px', flexShrink: 0 }}>
          <TextField
            label="Tasa Alcabala"
            type="text"
            size="small"
            fullWidth
            value={tasaInput}
            onChange={handleTasaInputChange}
            onFocus={handleTasaFocus}
            onBlur={handleTasaBlur}
            autoComplete="off"
            inputProps={{ inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => { onAnioChange(null); onTasaChange(0); }}
            disabled={loading}
            sx={{ height: '38px', textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}
          >
            Nuevo
          </Button>
          
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={onRegistrar}
            disabled={loading || tasa < 0 || !anioSeleccionado}
            style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 700, minWidth: '160px', height: '38px' }}
            sx={{ textTransform: 'none' }}
          >
            Guardar Tasa
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Alcabala;
