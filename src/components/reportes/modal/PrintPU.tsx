// src/components/reportes/modal/PrintPU.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import {
  Print as PrintIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

export interface PrintPUProps {
  isOpen: boolean;
  onClose: () => void;
  contribuyente: any;
  puData: any[];
}

export const PrintPU: React.FC<PrintPUProps> = ({
  isOpen,
  onClose,
  contribuyente,
  puData = [],
}) => {
  const [pageSize, setPageSize] = useState<'A4' | 'OFICIO'>('A4');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handlePrint = () => {
    window.print();
  };

  const activePu = puData[selectedIndex] || (puData.length > 0 ? puData[0] : null);

  const formatNumber = (val: any, decimals = 2) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('es-PE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const currentDate = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '92vh',
          borderRadius: 3,
        },
      }}
    >
      {/* Estilos para impresión */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-pu-document, #printable-pu-document * {
              visibility: visible !important;
            }
            #printable-pu-document {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: ${pageSize === 'A4' ? 'A4 portrait' : 'legal portrait'};
              margin: 8mm;
            }
          }
        `}
      </style>

      {/* Cabecera del Modal (No se imprime) */}
      <DialogTitle
        className="no-print"
        sx={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          color: 'white',
          py: 1.5,
          px: 3,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon />
          <Typography variant="h6" fontWeight="bold">
            Vista Previa de Impresión - Formulario PU (Predio Urbano)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Selector de tamaño de hoja */}
          <ToggleButtonGroup
            value={pageSize}
            exclusive
            onChange={(_, val) => val && setPageSize(val)}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 1.5,
              '& .MuiToggleButton-root': {
                color: 'white',
                borderColor: 'transparent',
                fontWeight: 600,
                fontSize: '0.75rem',
                px: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'white',
                  color: '#15803d',
                  '&:hover': { bgcolor: '#f0fdf4' },
                },
              },
            }}
          >
            <ToggleButton value="A4">A4</ToggleButton>
            <ToggleButton value="OFICIO">OFICIO</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              bgcolor: 'white',
              color: '#15803d',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#f0fdf4' },
            }}
          >
            Imprimir
          </Button>

          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Contenido del Modal (Documento PU) */}
      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        {/* Selector de predio si hay múltiples (No se imprime) */}
        {puData.length > 1 && (
          <Paper
            elevation={0}
            className="no-print"
            sx={{
              p: 1.5,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#e2e8f0',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Seleccionar Predio ({puData.length}):
            </Typography>
            {puData.map((item, idx) => (
              <Chip
                key={idx}
                label={`Predio: ${item.codPredio || idx + 1}`}
                onClick={() => setSelectedIndex(idx)}
                color={selectedIndex === idx ? 'success' : 'default'}
                variant={selectedIndex === idx ? 'filled' : 'outlined'}
                size="small"
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              />
            ))}
          </Paper>
        )}

        {/* DOCUMENTO PU IMPRIMIBLE (Formato verde exacto a cod/pu.png) */}
        <Box
          id="printable-pu-document"
          sx={{
            width: pageSize === 'A4' ? '210mm' : '216mm',
            minHeight: pageSize === 'A4' ? '297mm' : '356mm',
            margin: '0 auto',
            bgcolor: 'white',
            p: 2.5,
            border: '2px solid #166534',
            fontFamily: 'Arial, sans-serif',
            color: '#14532d',
            boxSizing: 'border-box',
          }}
        >
          {/* HEADER PRINCIPAL */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 180px',
              border: '2px solid #166534',
              borderRadius: '4px',
              mb: 1,
            }}
          >
            {/* Esquina Izquierda: PU + Logo */}
            <Box
              sx={{
                p: 1,
                borderRight: '2px solid #166534',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f0fdf4',
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '7px', fontWeight: 'bold' }}>
                MOTIVO DE LA DECLARACIÓN
              </Typography>
              <Box sx={{ border: '1px solid #166534', width: '90%', height: 16, mb: 0.5 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#166534', lineHeight: 1 }}>
                  PU
                </Typography>
                <Box component="img" src="/escudoMDE.png" alt="Escudo" sx={{ width: 32, height: 32, objectFit: 'contain' }} />
              </Box>
            </Box>

            {/* Centro: Títulos de la Municipalidad */}
            <Box
              sx={{
                p: 1,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#166534', fontSize: '13px', letterSpacing: 0.5 }}>
                MUNICIPALIDAD DISTRITAL DE LA ESPERANZA
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '11px', color: '#14532d' }}>
                DECLARACION JURADA DEL IMPUESTO PREDIAL
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '9px', fontStyle: 'italic', fontWeight: 'bold' }}>
                (Decreto Legislativo 776 - Artículo 14º)
              </Typography>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '10px', color: '#166534', mt: 0.5 }}>
                PREDIO URBANO
              </Typography>
            </Box>

            {/* Esquina Derecha: Formulario N° y Fecha */}
            <Box
              sx={{
                borderLeft: '2px solid #166534',
                p: 0.5,
                bgcolor: '#f0fdf4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '8px', fontWeight: 'bold' }}>FORMULARIO N°</Typography>
                <Box sx={{ border: '1px solid #166534', width: 60, height: 16, bgcolor: 'white', textAlign: 'center', fontSize: '9px', fontWeight: 'bold' }}>
                  001
                </Box>
              </Box>
              <Divider sx={{ borderColor: '#166534', my: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '8px', fontWeight: 'bold' }}>FECHA RECEPCIÓN</Typography>
                <Box sx={{ border: '1px solid #166534', width: 70, height: 16, bgcolor: 'white', textAlign: 'center', fontSize: '9px' }}>
                  {currentDate}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 1: IDENTIFICACIÓN DEL CONTRIBUYENTE */}
          <Box sx={{ border: '1.5px solid #166534', mb: 1, borderRadius: '4px' }}>
            <Box sx={{ bgcolor: '#dcfce7', px: 1, py: 0.2, borderBottom: '1px solid #166534' }}>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '9px', color: '#166534' }}>
                IDENTIFICACIÓN DEL CONTRIBUYENTE (PROPIETARIO):
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 100px 100px', fontSize: '9px' }}>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>COD. CONTRIBUYENTE</Typography>
                <Typography fontWeight="bold">{contribuyente?.codigo || '-'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>APELLIDOS Y NOMBRES O RAZON SOCIAL</Typography>
                <Typography fontWeight="bold">{contribuyente?.contribuyente || contribuyente?.nombreCompleto || '-'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>DOCUMENTO DE IDENTIDAD</Typography>
                <Typography fontWeight="bold">{contribuyente?.numDocumento || contribuyente?.dni || '-'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>CONDICIÓN DE PROPIEDAD</Typography>
                <Typography fontWeight="bold">PROPIETARIO UNICO</Typography>
              </Box>
              <Box sx={{ p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>N° DE CONDOMINIOS</Typography>
                <Typography fontWeight="bold">1</Typography>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 2: UBICACIÓN DEL PREDIO */}
          <Box sx={{ border: '1.5px solid #166534', mb: 1, borderRadius: '4px' }}>
            <Box sx={{ bgcolor: '#dcfce7', px: 1, py: 0.2, borderBottom: '1px solid #166534' }}>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '9px', color: '#166534' }}>
                UBICACIÓN DEL PREDIO
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 140px', fontSize: '9px' }}>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>CÓDIGO DEL PREDIO</Typography>
                <Typography fontWeight="bold">{activePu?.codPredio || '-'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>SECTOR, URBANIZACIÓN, AA.HH., BARRIO, ETC.</Typography>
                <Typography fontWeight="bold">{activePu?.barrio || activePu?.sector || 'LA ESPERANZA'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>AVENIDA, JIRÓN, CALLE O PASAJE, KM</Typography>
                <Typography fontWeight="bold">{activePu?.direccion || '-'}</Typography>
              </Box>
              <Box sx={{ p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>N° DOMICIL., OPTO, PISO, ETC.</Typography>
                <Typography fontWeight="bold">{activePu?.numDomicilio || 'S/N'}</Typography>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 3: DATOS RELATIVOS A LA CONSTRUCCIÓN */}
          <Box sx={{ border: '1.5px solid #166534', mb: 1, borderRadius: '4px' }}>
            <Box sx={{ bgcolor: '#dcfce7', px: 1, py: 0.2, borderBottom: '1px solid #166534' }}>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '9px', color: '#166534' }}>
                DATOS RELATIVOS A LA CONSTRUCCIÓN
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '80px 140px 140px 140px 1fr', fontSize: '9px' }}>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[3] ESTADO</Typography>
                <Typography fontWeight="bold">{activePu?.estadoPredio || 'TERMINADO'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[4] TIPO DE PREDIO</Typography>
                <Typography fontWeight="bold">{activePu?.tipoPredio || 'CASA HABITACION'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[5] USO</Typography>
                <Typography fontWeight="bold">HABITACIONAL</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #166534', p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[6] FRENTE A</Typography>
                <Typography fontWeight="bold">VIA PUBLICA</Typography>
              </Box>
              <Box sx={{ p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>% CONDOMINIO</Typography>
                <Typography fontWeight="bold">100.00 %</Typography>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 4: DETERMINACIÓN DEL AUTOAVALÚO (TABLA DE NIVELES) */}
          <Box sx={{ border: '1.5px solid #166534', mb: 1, borderRadius: '4px' }}>
            <Box sx={{ bgcolor: '#dcfce7', px: 1, py: 0.2, borderBottom: '1px solid #166534', textAlign: 'center' }}>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '9px', color: '#166534' }}>
                DETERMINACIÓN DEL AUTOAVALÚO
              </Typography>
            </Box>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px', textAlign: 'center' }}>
              <thead>
                <tr style={{ background: '#f0fdf4', borderBottom: '1.5px solid #166534' }}>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>PISO</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>FECHA CONSTR.</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>CATEGORÍAS</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>[7] VALOR UNIT. S/</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>[8] (+5%) S/</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>[12] % DEPREC.</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>[14] VAL. DEPREC. S/</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>[15] ÁREA M2</th>
                  <th style={{ border: '1px solid #166534', padding: '2px' }}>[16] VALOR CONSTR. S/</th>
                </tr>
              </thead>
              <tbody>
                {activePu ? (
                  <tr style={{ height: 22 }}>
                    <td style={{ border: '1px solid #166534' }}>1° PISO</td>
                    <td style={{ border: '1px solid #166534' }}>01/2020</td>
                    <td style={{ border: '1px solid #166534', fontWeight: 'bold' }}>B - C - D - E - C</td>
                    <td style={{ border: '1px solid #166534' }}>S/ {formatNumber(activePu.valorUnitario || 350.00)}</td>
                    <td style={{ border: '1px solid #166534' }}>S/ {formatNumber((activePu.valorUnitario || 350.00) * 0.05)}</td>
                    <td style={{ border: '1px solid #166534' }}>{activePu.depreciacion || 10}%</td>
                    <td style={{ border: '1px solid #166534' }}>S/ {formatNumber((activePu.valorUnitario || 350.00) * 0.9)}</td>
                    <td style={{ border: '1px solid #166534', fontWeight: 'bold' }}>{formatNumber(activePu.areaTerreno || 120.00)}</td>
                    <td style={{ border: '1px solid #166534', fontWeight: 'bold' }}>S/ {formatNumber(activePu.autoavaluo || 42000.00)}</td>
                  </tr>
                ) : (
                  [1, 2, 3].map((_, i) => (
                    <tr key={i} style={{ height: 20 }}>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                      <td style={{ border: '1px solid #166534' }}>-</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Box>

          {/* SECCIÓN 5: DATOS DEL TERRENO Y AUTOAVALÚO TOTAL */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 1, mb: 1 }}>
            {/* Terreno + Juramento */}
            <Box sx={{ border: '1.5px solid #166534', borderRadius: '4px', p: 0.8 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '8px', color: '#166534', display: 'block', mb: 0.5 }}>
                DATOS DEL TERRENO:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0.5, fontSize: '8px', mb: 1 }}>
                <Box sx={{ border: '1px solid #166534', p: 0.3 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>FECHA ADQUISICIÓN</Typography>
                  <Typography fontWeight="bold">01/01/2015</Typography>
                </Box>
                <Box sx={{ border: '1px solid #166534', p: 0.3 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[23] ÁREA M2</Typography>
                  <Typography fontWeight="bold">{formatNumber(activePu?.areaTerreno || 120)} M²</Typography>
                </Box>
                <Box sx={{ border: '1px solid #166534', p: 0.3 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[24] VALOR ARANCEL M2</Typography>
                  <Typography fontWeight="bold">S/ {formatNumber(activePu?.valorUnitario || 150)}</Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography sx={{ fontSize: '7.5px', fontStyle: 'italic', fontWeight: 'bold' }}>
                  DECLARO BAJO JURAMENTO QUE LOS DATOS CONSIGNADOS SON VERDADEROS
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 0.5, fontSize: '8px' }}>
                  <Typography sx={{ fontSize: '8px' }}>DE ____________________</Typography>
                  <Typography sx={{ fontSize: '8px' }}>DEL {new Date().getFullYear()}</Typography>
                </Box>
                <Box sx={{ borderBottom: '1px solid #166534', width: '70%', margin: '20px auto 2px' }} />
                <Typography sx={{ fontSize: '7.5px', fontWeight: 'bold' }}>Firma del Propietario o Representante Legal</Typography>
              </Box>
            </Box>

            {/* Resumen Totales Autoavalúo */}
            <Box sx={{ border: '1.5px solid #166534', borderRadius: '4px', p: 0.8, bgcolor: '#f0fdf4' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid #166534', fontSize: '8.5px' }}>
                <Typography sx={{ fontSize: '8.5px', fontWeight: 'bold' }}>TOTAL ÁREA CONSTRUIDA M2:</Typography>
                <Typography fontWeight="bold">{formatNumber(activePu?.areaTerreno || 120)} M²</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid #166534', fontSize: '8.5px' }}>
                <Typography sx={{ fontSize: '8.5px' }}>[19] VALOR TOTAL CONSTRUCCIÓN:</Typography>
                <Typography fontWeight="bold">S/ {formatNumber(activePu?.autoavaluo || 42000)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid #166534', fontSize: '8.5px' }}>
                <Typography sx={{ fontSize: '8.5px' }}>[20] VALOR TERRENO (23 * 24):</Typography>
                <Typography fontWeight="bold">S/ {formatNumber((activePu?.areaTerreno || 120) * (activePu?.valorUnitario || 150))}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid #166534', fontSize: '8.5px' }}>
                <Typography sx={{ fontSize: '8.5px' }}>[21] OTRAS INSTALACIONES:</Typography>
                <Typography fontWeight="bold">S/ 0.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, bgcolor: '#dcfce7', px: 0.5, borderRadius: '3px', mt: 0.5, border: '1px solid #166534' }}>
                <Typography sx={{ fontSize: '9px', fontWeight: '900', color: '#166534' }}>[22] AUTOAVALÚO TOTAL:</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: '900', color: '#166534' }}>S/ {formatNumber(activePu?.autoavaluo || 60000)}</Typography>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 6: TABLA DE VALORES DE ESTRUCTURAS Y ACABADOS (R.M. N° 414-2000-VIVIENDA) */}
          <Box sx={{ border: '1px solid #166534', borderRadius: '3px', p: 0.5, mb: 1, fontSize: '6px' }}>
            <Typography variant="caption" sx={{ fontSize: '6.5px', fontWeight: 'bold', display: 'block', mb: 0.2 }}>
              R.M. N° 414-2000-VIVIENDA - VALORES UNITARIOS OFICIALES DE EDIFICACIÓN
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '5.5px', textTransform: 'uppercase' }}>
              <thead>
                <tr style={{ background: '#dcfce7', borderBottom: '1px solid #166534' }}>
                  <th style={{ border: '0.5px solid #166534' }}>LETRA</th>
                  <th style={{ border: '0.5px solid #166534' }}>MUROS Y COLUMNAS</th>
                  <th style={{ border: '0.5px solid #166534' }}>TECHOS</th>
                  <th style={{ border: '0.5px solid #166534' }}>PISOS</th>
                  <th style={{ border: '0.5px solid #166534' }}>PUERTAS Y VENTANAS</th>
                  <th style={{ border: '0.5px solid #166534' }}>REVESTIMIENTOS</th>
                  <th style={{ border: '0.5px solid #166534' }}>BAÑOS</th>
                  <th style={{ border: '0.5px solid #166534' }}>INSTALAC. ELECT. Y SANIT.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '0.5px solid #166534', fontWeight: 'bold' }}>A</td>
                  <td style={{ border: '0.5px solid #166534' }}>Estructura armada especial</td>
                  <td style={{ border: '0.5px solid #166534' }}>Losa aligerada especial</td>
                  <td style={{ border: '0.5px solid #166534' }}>Mármol o granito fino</td>
                  <td style={{ border: '0.5px solid #166534' }}>Aluminio pesado cristal templado</td>
                  <td style={{ border: '0.5px solid #166534' }}>Mármol fino o madera fina</td>
                  <td style={{ border: '0.5px solid #166534' }}>Baños completos lujo</td>
                  <td style={{ border: '0.5px solid #166534' }}>Aire acondic. e instalaciones especiales</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #166534', fontWeight: 'bold' }}>B</td>
                  <td style={{ border: '0.5px solid #166534' }}>Concreto armado columnas</td>
                  <td style={{ border: '0.5px solid #166534' }}>Concreto aligerado comercial</td>
                  <td style={{ border: '0.5px solid #166534' }}>Parquet o cerámica fina</td>
                  <td style={{ border: '0.5px solid #166534' }}>Aluminio comercial o madera fina</td>
                  <td style={{ border: '0.5px solid #166534' }}>Tarrajeo fino o madera comercial</td>
                  <td style={{ border: '0.5px solid #166534' }}>Baños completos color nacional</td>
                  <td style={{ border: '0.5px solid #166534' }}>Agua fría/caliente trifásica</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #166534', fontWeight: 'bold' }}>C</td>
                  <td style={{ border: '0.5px solid #166534' }}>Ladrillo o similar con columnas</td>
                  <td style={{ border: '0.5px solid #166534' }}>Calamina o teja comercial</td>
                  <td style={{ border: '0.5px solid #166534' }}>Losa o vinílico comercial</td>
                  <td style={{ border: '0.5px solid #166534' }}>Madera corriente o fierro</td>
                  <td style={{ border: '0.5px solid #166534' }}>Tarrajeo frotachado con pintura</td>
                  <td style={{ border: '0.5px solid #166534' }}>Baños completos blancos</td>
                  <td style={{ border: '0.5px solid #166534' }}>Agua fría monofásica</td>
                </tr>
              </tbody>
            </table>
          </Box>

          {/* FOOTER SLOGAN */}
          <Box sx={{ textAlign: 'center', mt: 0.5, borderTop: '1.5px solid #166534', pt: 0.5 }}>
            <Typography variant="caption" fontWeight="900" sx={{ fontSize: '8.5px', color: '#166534', letterSpacing: 0.5 }}>
              ¡ CON TUS TRIBUTOS, CONSTRUIREMOS UN FUTURO MEJOR ; LA ESPERANZA AVANZA !
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer del Modal (No se imprime) */}
      <DialogActions className="no-print" sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cerrar
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<PrintIcon />}
          sx={{ bgcolor: '#15803d', '&:hover': { bgcolor: '#166534' } }}
        >
          Imprimir Reporte PU
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintPU;