// src/components/reportes/modal/PrintHR.tsx
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
  Paper,
} from '@mui/material';
import {
  Print as PrintIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

export interface PrintHRProps {
  isOpen: boolean;
  onClose: () => void;
  contribuyente: any;
  hrData: any[];
}

export const PrintHR: React.FC<PrintHRProps> = ({
  isOpen,
  onClose,
  contribuyente,
  hrData = [],
}) => {
  const [pageSize, setPageSize] = useState<'A4' | 'OFICIO'>('A4');

  const handlePrint = () => {
    window.print();
  };

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

  const currentYear = new Date().getFullYear();

  // Cálculo de totales de Autoavalúo e Impuesto Predial
  const totalAutoavaluo = hrData.reduce(
    (acc, curr) => acc + (parseFloat(curr.autoavaluo) || 0),
    0
  );

  const totalImpuestoAnual = hrData.reduce(
    (acc, curr) => acc + (parseFloat(curr.impuestoPredial) || 0),
    0
  );

  const totalImpuestoTrimestral = hrData.reduce(
    (acc, curr) => acc + (parseFloat(curr.impuestoTrimestral) || 0),
    0
  );

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
            #printable-hr-document, #printable-hr-document * {
              visibility: visible !important;
            }
            #printable-hr-document {
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
          background: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
          color: 'white',
          py: 1.5,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon />
          <Typography variant="h6" fontWeight="bold">
            Vista Previa de Impresión - Formulario HR (Hoja de Resumen)
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
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 1.5,
              '& .MuiToggleButton-root': {
                color: 'white',
                borderColor: 'transparent',
                fontWeight: 600,
                fontSize: '0.75rem',
                px: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'white',
                  color: '#a16207',
                  '&:hover': { bgcolor: '#fefce8' },
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
              color: '#854d0e',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#fefce8' },
            }}
          >
            Imprimir
          </Button>

          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Contenido del Modal (Documento HR) */}
      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
        {/* DOCUMENTO HR IMPRIMIBLE (Formato amarillo/verde exacto a cod/hr.png) */}
        <Box
          id="printable-hr-document"
          sx={{
            width: pageSize === 'A4' ? '210mm' : '216mm',
            minHeight: pageSize === 'A4' ? '297mm' : '356mm',
            margin: '0 auto',
            bgcolor: 'white',
            p: 2.5,
            border: '2px solid #854d0e',
            fontFamily: 'Arial, sans-serif',
            color: '#422006',
            boxSizing: 'border-box',
          }}
        >
          {/* HEADER PRINCIPAL */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 180px',
              border: '2px solid #854d0e',
              borderRadius: '4px',
              mb: 1,
            }}
          >
            {/* Esquina Izquierda: HR + Escudo */}
            <Box
              sx={{
                p: 1,
                borderRight: '2px solid #854d0e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                bgcolor: '#fefce8',
              }}
            >
              <Typography variant="h3" fontWeight="900" sx={{ color: '#854d0e', lineHeight: 1 }}>
                HR
              </Typography>
              <Box component="img" src="/escudoMDE.png" alt="Escudo" sx={{ width: 34, height: 34, objectFit: 'contain' }} />
            </Box>

            {/* Centro: Títulos de la Municipalidad */}
            <Box
              sx={{
                p: 0.8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#854d0e', fontSize: '13px', letterSpacing: 0.5 }}>
                MUNICIPALIDAD DISTRITAL DE LA ESPERANZA
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '11px', color: '#713f12' }}>
                DECLARACION JURADA DE AUTOAVALUO AÑO {currentYear}
              </Typography>
              <Typography variant="caption" fontWeight="900" sx={{ fontSize: '11px', color: '#854d0e' }}>
                HOJA RESUMEN
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 'bold' }}>
                Provincia de Trujillo &nbsp;|&nbsp; Distrito de La Esperanza
              </Typography>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '8.5px', color: '#854d0e', mt: 0.3 }}>
                IMPUESTO AL VALOR DEL PATRIMONIO PREDIAL - DECRETO LEGISLATIVO 776
              </Typography>
            </Box>

            {/* Esquina Derecha: F. N° y Fecha */}
            <Box
              sx={{
                borderLeft: '2px solid #854d0e',
                p: 0.5,
                bgcolor: '#fefce8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '8px', fontWeight: 'bold' }}>F. N°</Typography>
                <Box sx={{ border: '1px solid #854d0e', width: 60, height: 16, bgcolor: 'white', textAlign: 'center', fontSize: '9px', fontWeight: 'bold' }}>
                  001
                </Box>
              </Box>
              <Divider sx={{ borderColor: '#854d0e', my: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '8px', fontWeight: 'bold' }}>FECHA RECEPCION</Typography>
                <Box sx={{ border: '1px solid #854d0e', width: 70, height: 16, bgcolor: 'white', textAlign: 'center', fontSize: '9px' }}>
                  {currentDate}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 1: IDENTIFICACIÓN DEL CONTRIBUYENTE */}
          <Box sx={{ border: '1.5px solid #854d0e', mb: 1, borderRadius: '4px' }}>
            <Box sx={{ bgcolor: '#fef08a', px: 1, py: 0.2, borderBottom: '1px solid #854d0e' }}>
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '9px', color: '#854d0e' }}>
                IDENTIFICACION DEL CONTRIBUYENTE (PROPIETARIO):
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '110px 1fr 120px 90px 110px', fontSize: '9px' }}>
              <Box sx={{ borderRight: '1px solid #854d0e', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[4] COD. CONTRIB.</Typography>
                <Typography fontWeight="bold">{contribuyente?.codigo || '-'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #854d0e', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[5] APELLIDOS Y NOMBRES O RAZÓN SOCIAL</Typography>
                <Typography fontWeight="bold">{contribuyente?.contribuyente || contribuyente?.nombreCompleto || '-'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #854d0e', p: 0.5 }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[3] R.U.C. / DNI</Typography>
                <Typography fontWeight="bold">{contribuyente?.numDocumento || contribuyente?.dni || '-'}</Typography>
              </Box>
              <Box sx={{ borderRight: '1px solid #854d0e', p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[21] CLASE PERSONA</Typography>
                <Typography fontWeight="bold">NATURAL</Typography>
              </Box>
              <Box sx={{ p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>[22] MOTIVO DECLARACIÓN</Typography>
                <Typography fontWeight="bold">ORDINARIA</Typography>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 2: DOMICILIO FISCAL + FORMULARIOS Y VALOR */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: 1, mb: 1 }}>
            {/* Domicilio Fiscal */}
            <Box sx={{ border: '1.5px solid #854d0e', borderRadius: '4px' }}>
              <Box sx={{ bgcolor: '#fef08a', px: 1, py: 0.2, borderBottom: '1px solid #854d0e' }}>
                <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '8.5px', color: '#854d0e' }}>
                  DOMICILIO FISCAL
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '8px', borderBottom: '1px solid #854d0e' }}>
                <Box sx={{ borderRight: '1px solid #854d0e', p: 0.4 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[6] DEPARTAMENTO</Typography>
                  <Typography fontWeight="bold">LA LIBERTAD</Typography>
                </Box>
                <Box sx={{ borderRight: '1px solid #854d0e', p: 0.4 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[7] PROVINCIA</Typography>
                  <Typography fontWeight="bold">TRUJILLO</Typography>
                </Box>
                <Box sx={{ p: 0.4 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[8] DISTRITO</Typography>
                  <Typography fontWeight="bold">LA ESPERANZA</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 60px', fontSize: '8px' }}>
                <Box sx={{ borderRight: '1px solid #854d0e', p: 0.4 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[9] SEC. VECIN.</Typography>
                  <Typography fontWeight="bold">SEC-01</Typography>
                </Box>
                <Box sx={{ borderRight: '1px solid #854d0e', p: 0.4 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[10] URBANIZACIÓN, LUGAR, ETC.</Typography>
                  <Typography fontWeight="bold">LA ESPERANZA</Typography>
                </Box>
                <Box sx={{ borderRight: '1px solid #854d0e', p: 0.4 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[11] AVENIDA, JIRÓN, CALLE</Typography>
                  <Typography fontWeight="bold">{contribuyente?.direccionFiscal || 'AV. CONDORCANQUI S/N'}</Typography>
                </Box>
                <Box sx={{ p: 0.4 }}>
                  <Typography sx={{ fontSize: '6.5px' }}>[17] TELÉFONO</Typography>
                  <Typography fontWeight="bold">987654321</Typography>
                </Box>
              </Box>
            </Box>

            {/* Cantidad de Formularios y Valor */}
            <Box sx={{ border: '1.5px solid #854d0e', borderRadius: '4px', bgcolor: '#fefce8' }}>
              <Box sx={{ bgcolor: '#fef08a', px: 0.5, py: 0.2, borderBottom: '1px solid #854d0e', textAlign: 'center' }}>
                <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '7.5px', color: '#854d0e' }}>
                  CANTIDAD DE FORMULARIOS Y VALOR
                </Typography>
              </Box>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.5px', textAlign: 'center' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #854d0e', background: '#fef08a' }}>
                    <th style={{ border: '0.5px solid #854d0e' }}>HR</th>
                    <th style={{ border: '0.5px solid #854d0e' }}>PU</th>
                    <th style={{ border: '0.5px solid #854d0e' }}>PR</th>
                    <th style={{ border: '0.5px solid #854d0e' }}>TOTAL</th>
                    <th style={{ border: '0.5px solid #854d0e' }}>VAL. UNIT.</th>
                    <th style={{ border: '0.5px solid #854d0e' }}>TOT. PAGAR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '0.5px solid #854d0e', fontWeight: 'bold' }}>1</td>
                    <td style={{ border: '0.5px solid #854d0e', fontWeight: 'bold' }}>{hrData.length || 1}</td>
                    <td style={{ border: '0.5px solid #854d0e' }}>0</td>
                    <td style={{ border: '0.5px solid #854d0e', fontWeight: 'bold' }}>{(hrData.length || 1) + 1}</td>
                    <td style={{ border: '0.5px solid #854d0e' }}>S/ 5.00</td>
                    <td style={{ border: '0.5px solid #854d0e', fontWeight: 'bold', color: '#854d0e' }}>
                      S/ {formatNumber(((hrData.length || 1) + 1) * 5)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Box>

          {/* SECCIÓN 3 Y 4: TABLA DE PREDIOS DECLARADOS (IZQ) Y DETERMINACIÓN DE IMPUESTO (DER) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 1, mb: 1 }}>
            {/* Tabla de Predios Declarados */}
            <Box sx={{ border: '1.5px solid #854d0e', borderRadius: '4px' }}>
              <Box sx={{ bgcolor: '#fef08a', px: 1, py: 0.2, borderBottom: '1px solid #854d0e', textAlign: 'center' }}>
                <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '8.5px', color: '#854d0e' }}>
                  VALOR DE LOS PREDIOS DECLARADOS
                </Typography>
              </Box>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5px' }}>
                <thead>
                  <tr style={{ background: '#fefce8', borderBottom: '1.5px solid #854d0e', textAlign: 'center' }}>
                    <th style={{ border: '1px solid #854d0e', width: 25 }}>N° ANEXO</th>
                    <th style={{ border: '1px solid #854d0e', width: 45 }}>COD. PREDIO</th>
                    <th style={{ border: '1px solid #854d0e', width: 35 }}>TIPO</th>
                    <th style={{ border: '1px solid #854d0e' }}>DIRECCION</th>
                    <th style={{ border: '1px solid #854d0e', width: 45 }}>% COND.</th>
                    <th style={{ border: '1px solid #854d0e', width: 65 }}>[39] AUTOAVALUO</th>
                  </tr>
                </thead>
                <tbody>
                  {hrData.length > 0 ? (
                    hrData.map((hr, idx) => (
                      <tr key={idx} style={{ height: 20 }}>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center', fontWeight: 'bold' }}>{hr.codPredio}</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center' }}>{hr.tipoPredio || 'URBANO'}</td>
                        <td style={{ border: '1px solid #854d0e', paddingLeft: 4 }}>{hr.direccionFiscal}</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center' }}>{hr.porcentajeCondomino || 100}%</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'right', paddingRight: 4, fontWeight: 'bold' }}>
                          S/ {formatNumber(hr.autoavaluo)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    [1, 2, 3, 4, 5].map((_, i) => (
                      <tr key={i} style={{ height: 18 }}>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center' }}>-</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center' }}>-</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center' }}>-</td>
                        <td style={{ border: '1px solid #854d0e' }}>-</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center' }}>-</td>
                        <td style={{ border: '1px solid #854d0e', textAlign: 'center' }}>-</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Box>

            {/* Columna Derecha: Cónyuge, Resumen de Impuesto, Juramento y Escala */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Datos del Cónyuge */}
              <Box sx={{ border: '1.5px solid #854d0e', borderRadius: '4px' }}>
                <Box sx={{ bgcolor: '#fef08a', px: 0.5, py: 0.2, borderBottom: '1px solid #854d0e', textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '7.5px', color: '#854d0e' }}>
                    DATOS DEL CONYUGE
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '80px 1fr', fontSize: '7.5px', p: 0.4 }}>
                  <Box sx={{ borderRight: '1px solid #854d0e', pr: 0.4 }}>
                    <Typography sx={{ fontSize: '6px' }}>[18] R.U.C. / DNI</Typography>
                    <Typography fontWeight="bold">-</Typography>
                  </Box>
                  <Box sx={{ pl: 0.4 }}>
                    <Typography sx={{ fontSize: '6px' }}>[19] APELLIDOS Y NOMBRES</Typography>
                    <Typography fontWeight="bold">-</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Determinación del Impuesto */}
              <Box sx={{ border: '1.5px solid #854d0e', borderRadius: '4px', bgcolor: '#fefce8', p: 0.6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid #854d0e', fontSize: '8px' }}>
                  <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>TOTAL AUTOAVALUO (Base):</Typography>
                  <Typography fontWeight="bold">S/ {formatNumber(totalAutoavaluo || 60000)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid #854d0e', fontSize: '8px' }}>
                  <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>[42] IMPUESTO ANUAL:</Typography>
                  <Typography fontWeight="bold">S/ {formatNumber(totalImpuestoAnual || 120)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, bgcolor: '#fef08a', px: 0.4, borderRadius: '3px', mt: 0.4, border: '1px solid #854d0e' }}>
                  <Typography sx={{ fontSize: '8.5px', fontWeight: '900', color: '#854d0e' }}>[43] IMPUESTO TRIMESTRAL:</Typography>
                  <Typography sx={{ fontSize: '9px', fontWeight: '900', color: '#854d0e' }}>S/ {formatNumber(totalImpuestoTrimestral || 30)}</Typography>
                </Box>
              </Box>

              {/* Declaración Jurada y Firma */}
              <Box sx={{ border: '1.5px solid #854d0e', borderRadius: '4px', p: 0.6, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '7px', fontStyle: 'italic', fontWeight: 'bold' }}>
                  DECLARO BAJO JURAMENTO QUE LOS VALORES CONSIGNADOS EN LA PRESENTE DECLARACION SON VERDADEROS
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 0.5, fontSize: '7.5px' }}>
                  <Typography sx={{ fontSize: '7.5px' }}>DE ____________________</Typography>
                  <Typography sx={{ fontSize: '7.5px' }}>DEL {currentYear}</Typography>
                </Box>
                <Box sx={{ borderBottom: '1px solid #854d0e', width: '80%', margin: '16px auto 2px' }} />
                <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>Firma del Propietario o Representante Legal</Typography>
              </Box>
            </Box>
          </Box>

          {/* SECCIÓN 5: ESCALA DEL IMPUESTO PREDIAL (LEY 24030 Y 26173) */}
          <Box sx={{ border: '1px solid #854d0e', borderRadius: '3px', p: 0.5, mb: 1, fontSize: '6px' }}>
            <Typography variant="caption" sx={{ fontSize: '7px', fontWeight: 'bold', display: 'block', mb: 0.2, color: '#854d0e' }}>
              ESCALA DEL IMPUESTO PREDIAL ANUAL (ART. 4 LEY 24030 Y 26173)
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6px', textAlign: 'center' }}>
              <thead>
                <tr style={{ background: '#fef08a', borderBottom: '1px solid #854d0e' }}>
                  <th style={{ border: '0.5px solid #854d0e', padding: '1px' }}>TRAMOS DE AUTOAVALÚO (UIT)</th>
                  <th style={{ border: '0.5px solid #854d0e', padding: '1px' }}>ALÍCUOTA / TASA</th>
                  <th style={{ border: '0.5px solid #854d0e', padding: '1px' }}>CÁLCULO DEL IMPUESTO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '0.5px solid #854d0e' }}>Hasta 15 UIT (Hasta S/ 77,250.00)</td>
                  <td style={{ border: '0.5px solid #854d0e', fontWeight: 'bold' }}>0.2 %</td>
                  <td style={{ border: '0.5px solid #854d0e' }}>0.2% del Autoavalúo de la 1ra Escala</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #854d0e' }}>Más de 15 UIT hasta 60 UIT (Hasta S/ 309,000.00)</td>
                  <td style={{ border: '0.5px solid #854d0e', fontWeight: 'bold' }}>0.6 %</td>
                  <td style={{ border: '0.5px solid #854d0e' }}>0.6% del Exceso de 15 UIT</td>
                </tr>
                <tr>
                  <td style={{ border: '0.5px solid #854d0e' }}>Más de 60 UIT (Más de S/ 309,000.00)</td>
                  <td style={{ border: '0.5px solid #854d0e', fontWeight: 'bold' }}>1.0 %</td>
                  <td style={{ border: '0.5px solid #854d0e' }}>1.0% del Exceso de 60 UIT</td>
                </tr>
              </tbody>
            </table>
          </Box>

          {/* INFORMACIÓN Y NOTAS LEGALES */}
          <Box sx={{ border: '1px solid #854d0e', borderRadius: '3px', p: 0.5, mb: 0.5, bgcolor: '#fffbeb', fontSize: '6px' }}>
            <Typography fontWeight="bold" sx={{ fontSize: '6.5px', color: '#854d0e' }}>¿Qué es el Impuesto Predial?</Typography>
            <Typography sx={{ fontSize: '6px', mb: 0.3 }}>
              Es el impuesto de carácter anual que grava el valor de los predios urbanos y rústicos, ya sean terrenos, edificaciones fijas y permanentes.
            </Typography>
            <Typography fontWeight="bold" sx={{ fontSize: '6.5px', color: '#854d0e' }}>¿Cuándo se debe presentar declaración jurada?</Typography>
            <Typography sx={{ fontSize: '6px' }}>
              a.- Anualmente, el último día hábil del mes de febrero.<br />
              b.- Cuando se efectúa cualquier transferencia de un predio.<br />
              c.- Cuando lo determine la Administración Tributaria.
            </Typography>
          </Box>

          {/* FOOTER SLOGAN */}
          <Box sx={{ textAlign: 'center', mt: 0.5, borderTop: '1.5px solid #854d0e', pt: 0.3 }}>
            <Typography variant="caption" fontWeight="900" sx={{ fontSize: '8.5px', color: '#854d0e', letterSpacing: 0.5 }}>
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
          sx={{ bgcolor: '#ca8a04', '&:hover': { bgcolor: '#a16207' }, color: 'white' }}
        >
          Imprimir Reporte HR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintHR;