import { logger } from '../../utils/logger';
// src/components/tim/ConsultaTim.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { timService, TimData } from '../../services/timService';
import ActualizarTim from './ActulizarTim.tsx';
import { useTim, useTimComboOptions } from '../../hooks/useTim';

export const ConsultaTim: React.FC = () => {
  // Filter States
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [periodo, setPeriodo] = useState<number>(1);
  const [codTributo, setCodTributo] = useState<number | string>('');
  const [codResolucionInteres, setCodResolucionInteres] = useState<number>(2);

  // Search Results & Loading
  const [resultados, setResultados] = useState<TimData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal/Delete Hooks
  const { eliminarTim, isDeleting } = useTim();
  const [selectedTim, setSelectedTim] = useState<TimData | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Load Tributos from TIM combo options API
  const { options: tributoOptions, loading: loadingTributos } = useTimComboOptions();

  // Set default tributo once loaded
  useEffect(() => {
    if (tributoOptions.length > 0 && !codTributo) {
      setCodTributo(Number(tributoOptions[0].value));
    }
  }, [tributoOptions, codTributo]);

  const handleBuscar = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await timService.obtenerTim({
        anio,
        periodo,
        codTributo: Number(codTributo),
        codResolucionInteres
      });
      setResultados(data);
    } catch (err) {
      logger.error('Error loading TIM records:', err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (record: TimData) => {
    setSelectedTim(record);
    setEditOpen(true);
  };

  const handleDeleteClick = async (record: TimData) => {
    if (window.confirm('¿Está seguro de eliminar esta escala TIM?')) {
      try {
        await eliminarTim({
          codTIM: record.codTIM,
          codResolucionInteres: record.codResolucionInteres
        });
        handleBuscar();
      } catch (err) {
        logger.error('Error deleting TIM:', err);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Panel de Filtros */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Filtros de Búsqueda TIM
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Año */}
          <TextField
            label="Año"
            type="number"
            value={anio}
            onChange={(e) => setAnio(parseInt(e.target.value) || new Date().getFullYear())}
            size="small"
            sx={{ width: 100 }}
            inputProps={{ min: 2000, max: 2100 }}
          />

          {/* Periodo */}
          <TextField
            label="Periodo (Mes)"
            type="number"
            value={periodo}
            onChange={(e) => setPeriodo(parseInt(e.target.value) || 1)}
            size="small"
            sx={{ width: 140 }}
            inputProps={{ min: 1, max: 12 }}
          />

          {/* Tributo */}
          <TextField
            select
            label="Tributo"
            value={codTributo}
            onChange={(e) => setCodTributo(parseInt(e.target.value) || 0)}
            size="small"
            sx={{ width: 250 }}
            disabled={loadingTributos}
            InputProps={{
              endAdornment: loadingTributos && <CircularProgress size={20} />
            }}
          >
            {tributoOptions.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label} ({t.value})
              </MenuItem>
            ))}
          </TextField>

          {/* Resolución */}
          <TextField
            label="Cód. Resolución de Interés"
            type="number"
            value={codResolucionInteres}
            onChange={(e) => setCodResolucionInteres(parseInt(e.target.value) || 2)}
            size="small"
            sx={{ width: 220 }}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleBuscar}
            sx={{
              height: 40,
              backgroundColor: '#3b82f6 !important',
              color: 'white !important',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#2563eb !important'
              }
            }}
          >
            Buscar
          </Button>
        </Box>
      </Paper>

      {/* Resultados */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : hasSearched && resultados.length === 0 ? (
        <Alert severity="info">No se encontraron escalas TIM con los filtros especificados.</Alert>
      ) : resultados.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            borderRadius: 2,
            maxHeight: 400,
            overflowX: 'auto',
            overflowY: 'auto'
          }}
        >
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Cód. TIM</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Año</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mes</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tributo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tasa</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Resolución</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Vigencia</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultados.map((row) => (
                <TableRow key={row.codTIM} hover>
                  <TableCell>{row.codTIM}</TableCell>
                  <TableCell>{row.anio}</TableCell>
                  <TableCell>{row.mes || `Mes ${row.periodo}`}</TableCell>
                  <TableCell>{row.tributo || `Tributo ${row.codTributo}`}</TableCell>
                  <TableCell>{row.tasa}</TableCell>
                  <TableCell>{row.resolucion || `Resolución ${row.codResolucionInteres}`}</TableCell>
                  <TableCell>
                    {row.fechaInicio} a {row.fechaFin || 'Indefinido'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditClick(row)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(row)} color="error" size="small" disabled={isDeleting}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}

      {/* Modal de Actualización */}
      <ActualizarTim
        open={editOpen}
        onClose={() => setEditOpen(false)}
        timData={selectedTim}
        onSuccess={handleBuscar}
      />
    </Box>
  );
};

export default ConsultaTim;