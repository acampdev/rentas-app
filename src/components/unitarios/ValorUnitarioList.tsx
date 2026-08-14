// src/components/unitarios/ValorUnitarioList.tsx
import React, { type ChangeEvent } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { ValorUnitarioData } from '../../services/valorUnitarioService';

interface ValorUnitarioListProps {
  años: { value: string, label: string }[];
  añoSeleccionado?: number | null;
  onValorSeleccionado?: (val: ValorUnitarioData) => void;
  onEliminar?: (id: string) => void;
  onAnioChange?: (anio: number) => void;
  valoresUnitarios?: ValorUnitarioData[];
  loading?: boolean;
}

// Estructuras estáticas para la Matriz de Edificación (basado en el Reglamento de Tasaciones)
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const SUBCATEGORIAS = [
  { cod: '100101', nombre: 'MUROS Y COLUMNAS', equivalentes: [] },
  { cod: '100102', nombre: 'TECHOS', equivalentes: [] },
  { cod: '100201', nombre: 'PISOS', equivalentes: [] },
  { cod: '100202', nombre: 'PUERTAS Y VENTANAS', equivalentes: [] },
  { cod: '100203', nombre: 'REVESTIMIENTOS', equivalentes: [] },
  { cod: '100204', nombre: 'BAÑOS', equivalentes: [] },
  { cod: '100301', nombre: 'INSTALACIONES ELÉCTRICAS Y SANITARIAS', equivalentes: ['INSTALACIONES ELECTRICAS Y SANITARIAS'] }
];

const ValorUnitarioList: React.FC<ValorUnitarioListProps> = ({
  años: _años,
  añoSeleccionado,
  onValorSeleccionado,
  onEliminar,
  onAnioChange,
  valoresUnitarios = [],
  loading = false
}) => {
  const theme = useTheme();

  // Función de búsqueda flexible en el conjunto de tarifas del año
  const encontrarValor = (letra: string, subcatCod: string, subcatNombre: string, subcatEquivalentes: string[] = []) => {
    return valoresUnitarios.find(v => {
      const vLetra = String(v.letra).trim().toUpperCase();
      const vSub = String(v.subcategoria).trim().toUpperCase();
      
      const letraMatch = vLetra === letra.toUpperCase();
      const subcatMatch = 
        vSub === subcatCod ||
        vSub === subcatNombre.toUpperCase() ||
        subcatEquivalentes.some(eq => vSub === eq.toUpperCase());
        
      return letraMatch && subcatMatch;
    });
  };

  // Función para obtener los estilos de colores condicionales según el valor del costo
  const obtenerEstiloCosto = (costo: number, existe: boolean) => {
    if (!existe) {
      return {
        bgcolor: 'transparent',
        color: '#cbd5e1', // gris muy tenue
        fontWeight: 500,
        border: '1px dashed #e2e8f0'
      };
    }
    
    if (costo < 50) {
      return {
        bgcolor: '#e6fcf5', // verde agua claro
        color: '#0ca678',   // verde turquesa oscuro
        fontWeight: 700,
        border: '1px solid #c3fae8'
      };
    } else if (costo >= 50 && costo <= 100) {
      return {
        bgcolor: '#fff4e6', // naranja claro
        color: '#d9480f',   // naranja oscuro
        fontWeight: 700,
        border: '1px solid #ffe8cc'
      };
    } else {
      return {
        bgcolor: '#fff0f6', // rosa claro
        color: '#c2255c',   // rosa oscuro
        fontWeight: 700,
        border: '1px solid #ffdeeb'
      };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ 
        p: 2, 
        mb: 3,
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        alignItems: 'center', 
        bgcolor: alpha(theme.palette.grey[50], 0.5),
        borderRadius: 1.5
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, flexGrow: 1, color: 'primary.dark' }}>
          LISTADO DE VALORES UNITARIOS
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField 
            size="small" 
            label="Año" 
            type="number" 
            value={añoSeleccionado || ''} 
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onAnioChange?.(Number(e.target.value))
            }
            sx={{ width: 120 }} 
          />
          <Button 
            variant="contained" 
            startIcon={<SearchIcon />} 
            disabled={loading}
            style={{ 
              backgroundColor: '#3b82f6', // Azul premium oficial
              color: 'white',
              fontWeight: 700
            }}
          >
            Buscar
          </Button>
        </Box>
      </Box>

      {/* Barra de progreso de carga lineal */}
      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

      {/* Contenedor de la Tabla Matriz */}
      <TableContainer sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s', overflowX: 'auto' }}>
        <Table size="small" sx={{ borderCollapse: 'collapse', minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {/* Columna Letras */}
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 800, 
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  color: 'primary.dark',
                  border: '1px solid',
                  borderColor: 'divider',
                  py: 2,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em'
                }}
              >
                LETRAS
              </TableCell>
              {/* Columnas de Subcategorías */}
              {SUBCATEGORIAS.map((sub) => (
                <TableCell 
                  key={sub.cod} 
                  align="center" 
                  sx={{ 
                    fontWeight: 800, 
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    color: 'primary.dark',
                    border: '1px solid',
                    borderColor: 'divider',
                    py: 2,
                    fontSize: '0.72rem',
                    letterSpacing: '0.02em',
                    maxWidth: 130,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}
                >
                  {sub.nombre}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {LETRAS.map((letra) => (
              <TableRow key={letra} hover sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) } }}>
                {/* Celda de la Letra */}
                <TableCell 
                  align="center" 
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider',
                    py: 1,
                    width: 80
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Chip 
                      label={letra} 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        bgcolor: '#e6fcf5', // verde agua claro
                        color: '#0ca678',   // verde turquesa oscuro
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #c3fae8',
                        '& .MuiChip-label': { px: 0 }
                      }} 
                    />
                  </Box>
                </TableCell>
                
                {/* Celdas de las Subcategorías */}
                {SUBCATEGORIAS.map((sub) => {
                  const valor = encontrarValor(letra, sub.cod, sub.nombre, sub.equivalentes);
                  const costo = valor ? valor.costo : 0;
                  const existe = !!valor;
                  const estilo = obtenerEstiloCosto(costo, existe);
                  
                  const CellContent = (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Chip
                        label={costo.toFixed(2)}
                        sx={{
                          bgcolor: estilo.bgcolor,
                          color: estilo.color,
                          fontWeight: estilo.fontWeight,
                          border: estilo.border,
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          height: 28,
                          minWidth: 64,
                          cursor: existe ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          '&:hover': existe ? {
                            transform: 'scale(1.08)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                          } : {}
                        }}
                      />
                    </Box>
                  );

                  return (
                    <TableCell 
                      key={sub.cod} 
                      align="center" 
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider',
                        py: 1
                      }}
                    >
                      {existe ? (
                        <Tooltip
                          enterDelay={200}
                          leaveDelay={200}
                          componentsProps={{
                            tooltip: {
                              sx: {
                                bgcolor: alpha(theme.palette.grey[900], 0.95),
                                boxShadow: theme.shadows[4],
                                borderRadius: 1.5,
                                p: 0.5
                              }
                            }
                          }}
                          title={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Tooltip title="Editar" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => onValorSeleccionado?.(valor)}
                                  sx={{ 
                                    bgcolor: 'white', 
                                    color: 'primary.main',
                                    p: 0.5,
                                    '&:hover': { bgcolor: '#f1f5f9', transform: 'scale(1.1)' } 
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {onEliminar && (
                                <Tooltip title="Eliminar" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      if (window.confirm('¿Está seguro de eliminar este valor unitario?')) {
                                        onEliminar(valor.id);
                                      }
                                    }}
                                    sx={{ 
                                      bgcolor: 'white', 
                                      color: 'error.main',
                                      p: 0.5,
                                      '&:hover': { bgcolor: '#f1f5f9', transform: 'scale(1.1)' } 
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          }
                        >
                          {CellContent}
                        </Tooltip>
                      ) : (
                        CellContent
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Leyenda de valores en el pie */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center', 
        mt: 4, 
        mb: 1, 
        alignItems: 'center', 
        flexWrap: 'wrap' 
      }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.85rem' }}>
          Leyenda de valores:
        </Typography>
        <Chip 
          label="< 50" 
          sx={{ 
            bgcolor: '#e6fcf5', 
            color: '#0ca678', 
            fontWeight: 700, 
            borderRadius: '6px',
            border: '1px solid #c3fae8',
            fontSize: '0.8rem',
            height: 24
          }} 
        />
        <Chip 
          label="50-100" 
          sx={{ 
            bgcolor: '#fff4e6', 
            color: '#d9480f', 
            fontWeight: 700, 
            borderRadius: '6px',
            border: '1px solid #ffe8cc',
            fontSize: '0.8rem',
            height: 24
          }} 
        />
        <Chip 
          label="> 100" 
          sx={{ 
            bgcolor: '#fff0f6', 
            color: '#c2255c', 
            fontWeight: 700, 
            borderRadius: '6px',
            border: '1px solid #ffdeeb',
            fontSize: '0.8rem',
            height: 24
          }} 
        />
      </Box>
    </Paper>
  );
};

export default ValorUnitarioList;

