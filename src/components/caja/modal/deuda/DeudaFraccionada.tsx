// src/components/caja/modal/deuda/DeudaFraccionada.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
  CircularProgress
} from '@mui/material';
import { useFraccionamiento } from '../../../../hooks/useFraccionamiento';
import { EstadoCuentaDetalle } from '../../../../services/cuentaCorrienteService';

// Interfaces
export interface CuotaFraccionamiento {
  nCuota: number;
  deuda: number; // Saldo Inicial
  im: number; // Interés
  cuota: number; // Monto Cuota
  fVenc: string;
  checked: boolean;
  pagado?: boolean;
}

export interface ResolucionFraccionamiento {
  año: number;
  resolucion: string;
  codResolucion: number;
  cuotas: CuotaFraccionamiento[];
}

export interface TributoFraccionado {
  tributo: string;
  valores: number[]; // 12 valores para los 12 meses
}

interface DeudaFraccionadaProps {
  codContribuyente: number | string;
  allDetails: { year: number; details: EstadoCuentaDetalle[] }[];
  cuotasFraccionamiento: CuotaFraccionamiento[];
  setCuotasFraccionamiento?: React.Dispatch<React.SetStateAction<CuotaFraccionamiento[]>>;
  selectedAño: number | null;
  setSelectedAño?: (año: number | null) => void;
  selectedResolucion?: string;
  setSelectedResolucion?: (resolucion: string) => void;
  selectedResolucionCode?: number | null;
  setSelectedResolucionCode?: (code: number | null) => void;
  montoFraccionado: string;
  setMontoFraccionado?: (monto: string) => void;
  setMontoAPagar?: (monto: string) => void;
  setTributosFraccionados?: React.Dispatch<React.SetStateAction<TributoFraccionado[]>>;
  getCellColorFraccionamiento: (rowIndex: number, mesIndex: number) => string;
}

const tributosFraccionadosBase: TributoFraccionado[] = [
  { tributo: 'Parques y Jardines', valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { tributo: 'Impuesto Predial', valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { tributo: 'Serenazgo', valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { tributo: 'Limpieza Publica', valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { tributo: 'Formularios D.J', valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { tributo: 'TIM Impuesto Predial', valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { tributo: 'TIM Parques y Jardines', valores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
];

const DeudaFraccionada: React.FC<DeudaFraccionadaProps> = ({
  codContribuyente,
  allDetails,
  cuotasFraccionamiento,
  setCuotasFraccionamiento,
  selectedAño,
  setSelectedAño,
  selectedResolucion,
  setSelectedResolucion,
  selectedResolucionCode,
  setSelectedResolucionCode,
  montoFraccionado,
  setMontoFraccionado,
  setMontoAPagar,
  setTributosFraccionados,
  getCellColorFraccionamiento
}) => {
  const [loading, setLoading] = useState(false);
  const [resoluciones, setResoluciones] = useState<ResolucionFraccionamiento[]>([]);

  const { obtenerCronogramaContribuyente } = useFraccionamiento({}, { enabledList: false, enabledStats: false });

  // Cargar cronograma real del contribuyente
  useEffect(() => {
    const loadCronograma = async () => {
      if (!codContribuyente) return;
      setLoading(true);
      try {
        console.log('🔄 [DeudaFraccionada] Cargando cronograma para codContribuyente:', codContribuyente);
        const data = await obtenerCronogramaContribuyente(codContribuyente);
        
        // Agrupar por año y código de resolución
        const groups: { [key: string]: ResolucionFraccionamiento } = {};
        
        data.forEach((item: any) => {
          const key = `${item.anio}-${item.codResolucion}`;
          if (!groups[key]) {
            groups[key] = {
              año: item.anio,
              resolucion: `R${String(item.codResolucion).padStart(3, '0')}`,
              codResolucion: item.codResolucion,
              cuotas: []
            };
          }
          
          groups[key].cuotas.push({
            nCuota: item.numeroCuota,
            deuda: typeof item.saldoInicio === 'number' ? item.saldoInicio : parseFloat(String(item.saldoInicio || '0')) || 0,
            im: typeof item.interes === 'number' ? item.interes : parseFloat(String(item.interes || '0')) || 0,
            cuota: typeof item.montoCuota === 'number' ? item.montoCuota : parseFloat(String(item.montoCuota || '0')) || 0,
            fVenc: item.fechaVencimiento,
            checked: false,
            pagado: item.pagado
          });
        });
        
        const groupedArray = Object.values(groups);
        
        // Ordenar cuotas de cada resolución
        groupedArray.forEach(g => {
          g.cuotas.sort((a, b) => a.nCuota - b.nCuota);
          
          // Por defecto marcar con checked la primera cuota impaga
          const firstUnpaidIndex = g.cuotas.findIndex(c => !c.pagado);
          if (firstUnpaidIndex !== -1) {
            g.cuotas[firstUnpaidIndex].checked = true;
          } else if (g.cuotas.length > 0) {
            g.cuotas[0].checked = true;
          }
        });
        
        // Ordenar resoluciones descendente por año y resolución
        groupedArray.sort((a, b) => b.año - a.año || b.codResolucion - a.codResolucion);
        
        setResoluciones(groupedArray);
        
        // Auto-seleccionar la primera resolución
        if (groupedArray.length > 0) {
          const firstRes = groupedArray[0];
          if (typeof setSelectedAño === 'function') setSelectedAño(firstRes.año);
          if (typeof setSelectedResolucion === 'function') setSelectedResolucion(firstRes.resolucion);
          if (typeof setSelectedResolucionCode === 'function') setSelectedResolucionCode(firstRes.codResolucion);
          if (typeof setCuotasFraccionamiento === 'function') setCuotasFraccionamiento(firstRes.cuotas);
          
          const totalFraccionado = firstRes.cuotas
            .filter(c => c.checked)
            .reduce((sum, c) => sum + c.cuota, 0);
          if (typeof setMontoFraccionado === 'function') setMontoFraccionado(`S/. ${totalFraccionado.toFixed(2)}`);
          if (typeof setMontoAPagar === 'function') setMontoAPagar(totalFraccionado > 0 ? totalFraccionado.toFixed(2) : '');
        } else {
          if (typeof setSelectedAño === 'function') setSelectedAño(null);
          if (typeof setSelectedResolucion === 'function') setSelectedResolucion('');
          if (typeof setSelectedResolucionCode === 'function') setSelectedResolucionCode(null);
          if (typeof setCuotasFraccionamiento === 'function') setCuotasFraccionamiento([]);
          if (typeof setMontoFraccionado === 'function') setMontoFraccionado('');
          if (typeof setMontoAPagar === 'function') setMontoAPagar('');
        }
      } catch (err) {
        console.error('❌ [DeudaFraccionada] Error al cargar cronograma:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCronograma();
  }, [codContribuyente]);

  // Manejar click en resolución (año y código de resolución)
  const handleAñoClick = (res: ResolucionFraccionamiento) => {
    if (typeof setSelectedAño === 'function') setSelectedAño(res.año);
    if (typeof setSelectedResolucion === 'function') setSelectedResolucion(res.resolucion);
    if (typeof setSelectedResolucionCode === 'function') setSelectedResolucionCode(res.codResolucion);
    if (typeof setCuotasFraccionamiento === 'function') setCuotasFraccionamiento(res.cuotas);
    
    const totalFraccionado = res.cuotas
      .filter(c => c.checked)
      .reduce((sum, c) => sum + c.cuota, 0);
    if (typeof setMontoFraccionado === 'function') setMontoFraccionado(`S/. ${totalFraccionado.toFixed(2)}`);
    if (typeof setMontoAPagar === 'function') setMontoAPagar(totalFraccionado > 0 ? totalFraccionado.toFixed(2) : '');
  };

  // Manejar checked de cuotas
  const handleCuotaCheck = (nCuota: number) => {
    const nuevasCuotas = cuotasFraccionamiento.map(cuota => 
      cuota.nCuota === nCuota 
        ? { ...cuota, checked: !cuota.checked }
        : cuota
    );
    if (typeof setCuotasFraccionamiento === 'function') setCuotasFraccionamiento(nuevasCuotas);
    
    const totalFraccionado = nuevasCuotas
      .filter(c => c.checked)
      .reduce((sum, c) => sum + c.cuota, 0);
    if (typeof setMontoFraccionado === 'function') setMontoFraccionado(`S/. ${totalFraccionado.toFixed(2)}`);
    if (typeof setMontoAPagar === 'function') setMontoAPagar(totalFraccionado > 0 ? totalFraccionado.toFixed(2) : '');
    
    // Persistir estado checked en el listado completo de resoluciones
    setResoluciones(prev => prev.map(res => {
      if (res.año === selectedAño && res.codResolucion === selectedResolucionCode) {
        return {
          ...res,
          cuotas: nuevasCuotas
        };
      }
      return res;
    }));
  };

  // Llenar tercera tabla usando el detalle de la Cuenta Corriente para el año seleccionado
  const tributosParaTabla = useMemo(() => {
    if (!selectedAño) return [];
    const yearData = allDetails.find(item => item.year === selectedAño);
    if (!yearData) return [];
    
    return yearData.details.map(det => ({
      tributo: det.tributo,
      valores: [
        Math.max(0, det.cargo1 - det.abono1),
        Math.max(0, det.cargo2 - det.abono2),
        Math.max(0, det.cargo3 - det.abono3),
        Math.max(0, det.cargo4 - det.abono4),
        Math.max(0, det.cargo5 - det.abono5),
        Math.max(0, det.cargo6 - det.abono6),
        Math.max(0, det.cargo7 - det.abono7),
        Math.max(0, det.cargo8 - det.abono8),
        Math.max(0, det.cargo9 - det.abono9),
        Math.max(0, det.cargo10 - det.abono10),
        Math.max(0, det.cargo11 - det.abono11),
        Math.max(0, det.cargo12 - det.abono12)
      ]
    }));
  }, [selectedAño, allDetails]);

  // Actualizar el estado de tributosFraccionados en el padre para las operaciones de cálculo de color y de pago
  const rowsParaRenderizar = tributosParaTabla.length > 0 ? tributosParaTabla : tributosFraccionadosBase;
  useEffect(() => {
    if (typeof setTributosFraccionados === 'function') {
      setTributosFraccionados(rowsParaRenderizar);
    }
  }, [rowsParaRenderizar, setTributosFraccionados]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, height: '100%' }}>
        <CircularProgress size={30} />
        <Typography variant="body2" color="text.secondary">
          Cargando cronograma de fraccionamiento...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Contenedor de las tres tablas */}
      <Box sx={{ display: 'flex', gap: 0, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Primera tabla: Año y Res */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            width: '120px',
            minWidth: '120px',
            height: '100%',
            borderRadius: 0,
            borderRight: 0,
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
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '60px', fontSize: '0.75rem' }}>
                  Año
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '60px', fontSize: '0.75rem' }}>
                  Res
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resoluciones.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      backgroundColor: (selectedAño === item.año && selectedResolucionCode === item.codResolucion) ? 'primary.main' : 'transparent',
                      color: (selectedAño === item.año && selectedResolucionCode === item.codResolucion) ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: (selectedAño === item.año && selectedResolucionCode === item.codResolucion) ? 'primary.dark' : 'primary.light',
                        color: 'white'
                      }
                    }}
                    onClick={() => handleAñoClick(item)}
                  >
                    {item.año}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>
                    {item.resolucion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Segunda tabla: Check, N°Cuota, Deuda, Interes, Cuota, F.Venc */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            width: '350px',
            minWidth: '350px',
            height: '100%',
            borderRadius: 0,
            borderRight: 0,
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
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', width: '30px', p: 0.5 }}>
                  {/* Check header */}
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  N°Cuota
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  Deuda
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  Interes
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  Cuota
                </TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  F.Venc.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cuotasFraccionamiento.length > 0 ? cuotasFraccionamiento.map((cuota) => (
                <TableRow key={cuota.nCuota} sx={{ opacity: cuota.pagado ? 0.6 : 1 }}>
                  <TableCell sx={{ p: 0.5 }}>
                    <Checkbox
                      size="small"
                      checked={cuota.checked}
                      disabled={cuota.pagado}
                      onChange={() => handleCuotaCheck(cuota.nCuota)}
                      sx={{ p: 0 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: cuota.pagado ? 'normal' : 'bold' }}>
                    {cuota.nCuota} {cuota.pagado && '(Pagada)'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                    {(cuota.deuda || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                    {(cuota.im || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                    {(cuota.cuota || 0).toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>
                    {cuota.fVenc}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ fontSize: '0.7rem', color: 'text.secondary', py: 2 }}>
                    {codContribuyente ? 'Seleccione una resolución para ver las cuotas' : 'Seleccione un contribuyente'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tercera tabla: Tributo y columnas 1-12 con scroll horizontal */}
        <Box sx={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden', border: '1px solid #e0e0e0', borderRadius: 0 }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              flex: 1,
              height: '100%',
              overflowX: 'auto',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                height: '8px',
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
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      borderRight: '1px solid #e0e0e0'
                    }}
                  >
                    Tributo
                  </TableCell>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes) => (
                    <TableCell
                      key={mes}
                      align="right"
                      sx={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        minWidth: '45px'
                      }}
                    >
                      {mes}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsParaRenderizar.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        fontSize: '0.7rem',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: 'white',
                        zIndex: 2,
                        borderRight: '1px solid #e0e0e0'
                      }}
                    >
                      {row.tributo}
                    </TableCell>
                    {row.valores.map((valor, mesIndex) => (
                      <TableCell
                        key={mesIndex}
                        align="right"
                        sx={{
                          fontSize: '0.65rem',
                          minWidth: '45px',
                          background: getCellColorFraccionamiento(index, mesIndex),
                          color: getCellColorFraccionamiento(index, mesIndex) !== 'transparent' ? 'white' : 'inherit'
                        }}
                      >
                        {valor > 0 ? valor.toFixed(2) : '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* TextField Deuda Fraccionada */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, flex: 0, pt: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Deuda Fraccionada:
        </Typography>
        <TextField
          value={montoFraccionado || 'S/. 0.00'}
          size="small"
          disabled
          sx={{
            width: '150px',
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

export default DeudaFraccionada;
