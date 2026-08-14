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
  TableContainer
} from '@mui/material';
import { EstadoCuentaDetalle } from '../../../../services/cuentaCorrienteService';

// Interfaces
export interface DeudaGlobalItem {
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

interface DeudaGlobalProps {
  allDetails: { year: number; details: EstadoCuentaDetalle[] }[];
}

export const mapDetallesToGlobalItems = (
  allDetails: { year: number; details: EstadoCuentaDetalle[] }[]
): DeudaGlobalItem[] => {
  const globalItems: DeudaGlobalItem[] = [];
  allDetails.forEach(({ year, details }) => {
    details.forEach((det, idx) => {
      if (det.saldoNeto > 0) {
        globalItems.push({
          id: `debt-${year}-${det.tributo}-${idx}`,
          año: year,
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
        });
      }
    });
  });
  return globalItems;
};

const DeudaGlobal: React.FC<DeudaGlobalProps> = ({ allDetails }) => {
  // Realizar el mapeo de deudas globales localmente
  const data = useMemo(() => mapDetallesToGlobalItems(allDetails), [allDetails]);

  // Precomputar la cantidad de filas por cada año para el rowSpan
  const filasPorAño = useMemo(() => {
    const counts: { [key: number]: number } = {};
    data.forEach(item => {
      counts[item.año] = (counts[item.año] || 0) + 1;
    });
    return counts;
  }, [data]);

  // Calcular deuda global total
  const calcularDeudaGlobalTotal = () => {
    return data.reduce((sum, item) => sum + item.deuda, 0);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, height: '100%', overflow: 'hidden' }}>
      {/* Tabla de Deuda Global */}
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
          <Table size="small" stickyHeader sx={{ minWidth: 750, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 45, maxWidth: 45, p: 0.25, fontSize: '0.75rem', textAlign: 'center' }}>
                  Año
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: 80, maxWidth: 80, p: 0, pl: 0.25, fontSize: '0.75rem' }}>
                  Titulo
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
              {(() => {
                const añosRenderizados: { [key: number]: boolean } = {};
                return data.map((item, index) => {
                  const isFirstRowOfYear = !añosRenderizados[item.año];
                  if (isFirstRowOfYear) {
                    añosRenderizados[item.año] = true;
                  }
                  
                  const isLastRow = index === data.length - 1 || data[index].año !== data[index + 1].año;
                  const borderBottomStyle = isLastRow ? '2px solid #94a3b8' : '1px solid #e2e8f0';

                  return (
                    <TableRow key={item.id} hover>
                      {isFirstRowOfYear && (
                        <TableCell 
                          rowSpan={filasPorAño[item.año]} 
                          align="center"
                          sx={{ 
                            p: 0.25, 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold',
                            verticalAlign: 'middle',
                            backgroundColor: '#f8fafc',
                            borderRight: '1px solid #e2e8f0',
                            borderBottom: '2px solid #94a3b8' // La celda del año siempre termina con el borde grueso
                          }}
                        >
                          {item.año}
                        </TableCell>
                      )}
                      <TableCell sx={{ p: 0, pl: 0.25, fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderBottom: borderBottomStyle }}>{item.titulo}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes1 > 0 ? item.mes1.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes2 > 0 ? item.mes2.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes3 > 0 ? item.mes3.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes4 > 0 ? item.mes4.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes5 > 0 ? item.mes5.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes6 > 0 ? item.mes6.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes7 > 0 ? item.mes7.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes8 > 0 ? item.mes8.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes9 > 0 ? item.mes9.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes10 > 0 ? item.mes10.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes11 > 0 ? item.mes11.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0, fontSize: '0.65rem', borderBottom: borderBottomStyle }}>{item.mes12 > 0 ? item.mes12.toFixed(2) : '-'}</TableCell>
                      <TableCell align="right" sx={{ p: 0.25, fontSize: '0.7rem', fontWeight: 'bold', borderBottom: borderBottomStyle }}>
                        S/. {item.deuda.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                });
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* TextField Deuda Global Total */}
      <Box sx={{ flex: '0 1 200px', minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Deuda Global
        </Typography>
        <TextField
          value={`S/. ${calcularDeudaGlobalTotal().toFixed(2)}`}
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

export default DeudaGlobal;
