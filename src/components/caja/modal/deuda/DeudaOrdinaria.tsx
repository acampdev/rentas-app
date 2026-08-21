// src/components/caja/modal/deuda/DeudaOrdinaria.tsx
/**
 * Componente que representa la pestaña de Deuda Ordinaria,
 * compatible con la API de pago unificado de saldosDeuda.
 */
import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  Button
} from '@mui/material';
import { EstadoCuentaDetalle } from '../../../../services/cuentaCorrienteService';

// Interface para los items de deuda ordinaria
export interface DeudaOrdinaria {
  id: string;
  año: number;
  titulo: string;
  mes1: number;
  mes2: number;
  mes3: number;
  mes4: number;
  mes5: number;
  mes6: number;
  mes7: number;
  mes8: number;
  mes9: number;
  mes10: number;
  mes11: number;
  mes12: number;
  deuda: number;
}

interface DeudaOrdinariaProps {
  allDetails: { year: number; details: EstadoCuentaDetalle[] }[];
  tipoMonto: string;
  selectedRows: string[];
  onRowSelection: (itemId: string) => void;
  getCellColor: (itemId: string, mesKey: string, deudaMes: number) => string;
  calcularDeudaTotal: () => number;
  listAños: number[];
  selectedAño: number | null;
  onAñoClick: (año: number) => void;
  onCellClick: (rowId: string, cellKey: string, cellValue: number) => void;
}

const DeudaOrdinariaComponent: React.FC<DeudaOrdinariaProps> = ({
  allDetails,
  tipoMonto,
  selectedRows,
  onRowSelection,
  getCellColor,
  calcularDeudaTotal,
  listAños,
  selectedAño,
  onAñoClick,
  onCellClick
}) => {
  // Realizar el mapeo de deudas ordinarias localmente para el año seleccionado
  const data = useMemo(() => {
    if (!selectedAño) return [];
    const yearDetails = allDetails.find(item => item.year === selectedAño)?.details || [];
    return yearDetails
      .filter(det => det.saldoNeto > 0)
      .map((det, idx) => ({
        id: `debt-${selectedAño}-${det.tributo}-${idx}`,
        año: selectedAño,
        titulo: det.tributo,
        mes1: Math.max(0, det.cargo1 - det.abono1),
        mes2: Math.max(0, det.cargo2 - det.abono2),
        mes3: Math.max(0, det.cargo3 - det.abono3),
        mes4: Math.max(0, det.cargo4 - det.abono4),
        mes5: Math.max(0, det.cargo5 - det.abono5),
        mes6: Math.max(0, det.cargo6 - det.abono6),
        mes7: Math.max(0, det.cargo7 - det.abono7),
        mes8: Math.max(0, det.cargo8 - det.abono8),
        mes9: Math.max(0, det.cargo9 - det.abono9),
        mes10: Math.max(0, det.cargo10 - det.abono10),
        mes11: Math.max(0, det.cargo11 - det.abono11),
        mes12: Math.max(0, det.cargo12 - det.abono12),
        deuda: det.saldoNeto
      }));
  }, [allDetails, selectedAño]);

  return (
    <Box sx={{ display: 'flex', gap: 2, height: '100%', overflow: 'hidden' }}>
      {/* Sidebar de Años */}
      <Box 
        sx={{ 
          width: 130, 
          minWidth: 130, 
          borderRight: '1px solid #e0e0e0', 
          pr: 1.5, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1, 
          overflowY: 'auto' 
        }}
      >
        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Años Disponibles
        </Typography>
        {listAños.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            No hay deudas
          </Typography>
        ) : (
          listAños.map((año) => {
            const isSelected = selectedAño === año;
            return (
              <Button
                key={año}
                variant={isSelected ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onAñoClick(año)}
                sx={{
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  py: 1,
                  backgroundColor: isSelected ? '#1976d2 !important' : 'transparent',
                  color: isSelected ? '#ffffff !important' : '#1976d2 !important',
                  borderColor: '#1976d2 !important',
                  '&:hover': {
                    backgroundColor: isSelected ? '#115293 !important' : 'rgba(25, 118, 210, 0.04) !important',
                  }
                }}
              >
                {año}
              </Button>
            );
          })
        )}
      </Box>

      {/* Tabla de Deuda Ordinaria */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#555',
              },
            },
          }}
        >
          <Table size="small" stickyHeader sx={{ minWidth: 780, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 40, maxWidth: 40, p: 0.25 }}>
                  {/* Checkbox Header */}
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 35, maxWidth: 35, p: 0.25, fontSize: '0.75rem' }}>
                  Año
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 80, maxWidth: 80, p: 0, pl: 0.25, fontSize: '0.75rem' }}>
                  Tributo
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  1
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  2
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  3
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  4
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  5
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  6
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  7
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  8
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  9
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  10
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  11
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 30, maxWidth: 30, p: 0, fontSize: '0.7rem' }}>
                  12
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 50, maxWidth: 50, p: 0.25, fontSize: '0.75rem' }}>
                  Deuda
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={16} align="center" sx={{ py: 4 }}>
                    No hay deudas ordinarias registradas para este año.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ p: 0.25 }}>
                      <Checkbox
                        size="small"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => onRowSelection(item.id)}
                        disabled={tipoMonto === 'repartir'}
                        inputProps={{
                          'aria-label': `${item.titulo} - ${item.año}`
                        }}
                        sx={{ p: 0 }}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0.25, fontSize: '0.7rem' }}>{item.año}</TableCell>
                    <TableCell sx={{ p: 0, pl: 0.25, fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.titulo}</TableCell>
                    
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes) => {
                      const mesKey = `mes${mes}` as keyof DeudaOrdinaria;
                      const mesValue = item[mesKey] as number;
                      const cellColor = getCellColor(item.id, `mes${mes}`, mesValue);
                      const isClickable = false;
                      
                      return (
                        <TableCell 
                          key={mes}
                          align="right" 
                          onClick={() => isClickable && onCellClick(item.id, `mes${mes}`, mesValue)}
                          sx={{
                            p: 0,
                            fontSize: '0.65rem',
                            background: cellColor,
                            color: cellColor !== 'transparent' ? 'white' : 'inherit',
                            cursor: isClickable ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: isClickable ? 'rgba(25, 118, 210, 0.12) !important' : undefined
                            }
                          }}
                        >
                          {mesValue > 0 ? mesValue.toFixed(2) : '-'}
                        </TableCell>
                      );
                    })}

                    {(() => {
                      const cellColor = getCellColor(item.id, 'deuda', item.deuda);
                      const isClickable = false;
                      
                      return (
                        <TableCell 
                          align="right" 
                          onClick={() => isClickable && onCellClick(item.id, 'deuda', item.deuda)}
                          sx={{ 
                            p: 0.25, 
                            fontSize: '0.7rem', 
                            fontWeight: 'bold',
                            background: cellColor,
                            color: cellColor !== 'transparent' ? 'white' : 'inherit',
                            cursor: isClickable ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: isClickable ? 'rgba(25, 118, 210, 0.12) !important' : undefined
                            }
                          }}
                        >
                          S/. {item.deuda.toFixed(2)}
                        </TableCell>
                      );
                    })()}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* TextField Deuda Ordinaria Total */}
      <Box sx={{ flex: '0 1 200px', minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Deuda Ordinaria
        </Typography>
        <TextField
          value={`S/. ${calcularDeudaTotal().toFixed(2)}`}
          size="small"
          fullWidth
          disabled
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: 'white',
              color: 'white',
              fontWeight: 'bold'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.dark',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default DeudaOrdinariaComponent;
