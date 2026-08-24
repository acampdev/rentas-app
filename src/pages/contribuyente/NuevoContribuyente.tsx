import { logger } from '../../utils/logger';
// src/pages/contribuyente/NuevoContribuyente.tsx - Versión con Material-UI
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Alert,
  Collapse,
  LinearProgress
} from '@mui/material';
import { MainLayout } from '../../layout';
import Breadcrumb from '../../components/utils/Breadcrumb';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import ContribuyenteFormMUI from '../../components/contribuyentes/ContribuyenteForm';
import { useContribuyentes } from '../../hooks/useContribuyentes';
import { NotificationService } from '../../components/utils/Notification';
import { ContribuyenteFormData } from '../../types/formTypes';

/**
 * Página para crear o editar un contribuyente con Material-UI
 */
const NuevoContribuyente: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Hook para obtener datos del contribuyente en modo edición
  const { obtenerContribuyenteDetalle } = useContribuyentes();

  const [loading, _setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [loadingContribuyente, setLoadingContribuyente] = useState(false);

  // Cargar datos del contribuyente en modo edición
  useEffect(() => {
    const cargarContribuyente = async () => {
      if (isEditMode && id) {
        try {
          setLoadingContribuyente(true);
          logger.log('📝 [NuevoContribuyente] Cargando contribuyente para edición, ID:', id);

          // Enviar codigoContribuyente y codPersona como string vacío (no null)
          logger.log('🚀 [NuevoContribuyente] Llamando a obtenerContribuyenteDetalle con codigoContribuyente:', id, 'codPersona: ""');
          const detalle = await obtenerContribuyenteDetalle(id, "");

          logger.log('📥 [NuevoContribuyente] Respuesta de obtenerContribuyenteDetalle:', detalle);
          logger.log('📥 [NuevoContribuyente] Tipo de detalle:', typeof detalle);
          logger.log('📥 [NuevoContribuyente] Es null?:', detalle === null);
          logger.log('📥 [NuevoContribuyente] Es array?:', Array.isArray(detalle));

          // Si es un array, extraer el primer elemento
          let detalleObj = detalle;
          if (Array.isArray(detalle)) {
            logger.log('⚠️ [NuevoContribuyente] detalle es un ARRAY, extrayendo primer elemento');
            detalleObj = detalle.length > 0 ? detalle[0] : null;
            logger.log('📥 [NuevoContribuyente] Primer elemento extraído:', detalleObj);
          }

          if (detalleObj) {
            logger.log('✅ [NuevoContribuyente] ========== PROCESANDO DATOS ==========');
            logger.log('✅ [NuevoContribuyente] Datos del contribuyente cargados:', detalleObj);
            logger.log('🔍 [NuevoContribuyente] Campos disponibles:', Object.keys(detalleObj));

            // Convertir fecha de nacimiento (puede venir como string "1979-12-31" o timestamp)
            let fechaNac = null;
            if (detalleObj.fechanacimiento || detalleObj.fechaNacimientoStr) {
              const fechaStr = detalleObj.fechaNacimientoStr || detalleObj.fechanacimiento;
              if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
                // Formato string "1979-12-31"
                fechaNac = new Date(fechaStr + 'T00:00:00');
              } else if (typeof fechaStr === 'number') {
                fechaNac = new Date(fechaStr);
              }
              logger.log('📅 [NuevoContribuyente] Fecha convertida:', fechaNac);
            }

            // Función para convertir codTipoDocumento del API (1, 2) al formato del formulario (4101, 4102)
            const convertirTipoDocumento = (codApi: string | null): string => {
              if (!codApi) return '4101';
              const codigo = codApi.toString().trim();
              switch (codigo) {
                case '1': return '4101'; // DNI
                case '2': return '4102'; // RUC
                case '3': return '4103'; // CE
                default: return codigo.length === 4 ? codigo : '4101';
              }
            };

            // Función para convertir codsexo del API (1, 2) al formato del formulario (2001, 2002)
            const convertirSexo = (codApi: string | null): string => {
              if (!codApi) return '2001';
              const codigo = codApi.toString().trim();
              switch (codigo) {
                case '1': return '2001'; // Masculino
                case '2': return '2002'; // Femenino
                default: return codigo.length === 4 ? codigo : '2001';
              }
            };

            // Función para convertir codestadocivil del API (1, 2, 3, 4) al formato del formulario (1801, 1802, 1803, 1804)
            const convertirEstadoCivil = (codApi: string | null): string => {
              if (!codApi) return '1801';
              const codigo = codApi.toString().trim();
              switch (codigo) {
                case '1': return '1801'; // Soltero
                case '2': return '1802'; // Casado
                case '3': return '1803'; // Viudo
                case '4': return '1804'; // Divorciado
                default: return codigo.length === 4 ? codigo : '1801';
              }
            };

            const convertirBandera = (valor: unknown): boolean => {
              if (valor === true || valor === 1) return true;
              const normalizado = String(valor ?? '').trim().toLowerCase();
              return normalizado === '1' || normalizado === 'true' || normalizado === 'si' || normalizado === 'sí';
            };

            // Función para extraer el lote de la dirección
            // Ejemplo: "URB. Manuel Arevalo II  Mz. 03 Lt. 45" -> { direccion: "URB. Manuel Arevalo II  Mz. 03", lote: "45" }
            const extraerLoteDeDireccion = (direccionCompleta: string): { direccion: string; lote: string } => {
              if (!direccionCompleta) return { direccion: '', lote: '' };

              logger.log('🔍 [extraerLoteDeDireccion] Procesando:', direccionCompleta);

              // Buscar patrón "Lt." o "Lote" seguido de número (más flexible)
              const regexLote = /\s*(Lt\.?|Lote\.?)\s*(\d+)\s*$/i;
              const match = direccionCompleta.match(regexLote);

              logger.log('🔍 [extraerLoteDeDireccion] Match resultado:', match);

              if (match) {
                const lote = match[2]; // El número del lote (grupo 2)
                const direccionSinLote = direccionCompleta.replace(regexLote, '').trim();
                logger.log('📍 [extraerLoteDeDireccion] Lote extraído:', lote);
                logger.log('📍 [extraerLoteDeDireccion] Dirección sin lote:', direccionSinLote);
                return { direccion: direccionSinLote, lote };
              }

              logger.log('⚠️ [extraerLoteDeDireccion] No se encontró patrón Lt./Lote');
              return { direccion: direccionCompleta.trim(), lote: '' };
            };

            // Extraer lote de la dirección si existe
            const direccionOriginal = detalleObj.direccion?.trim() || '';
            logger.log('📍 [NuevoContribuyente] ========== PROCESANDO DIRECCIÓN ==========');
            logger.log('📍 [NuevoContribuyente] Dirección original del API:', direccionOriginal);

            const { direccion: direccionLimpia, lote: loteExtraido } = extraerLoteDeDireccion(direccionOriginal);

            // Usar el lote del API si existe, sino usar el extraído de la dirección
            const nFincaFinal = detalleObj.lote?.trim() || loteExtraido || '';

            logger.log('📍 [NuevoContribuyente] Dirección limpia (sin lote):', direccionLimpia);
            logger.log('📍 [NuevoContribuyente] N Finca final:', nFincaFinal);

            // Crear objeto de dirección para el formulario
            const direccionObj = direccionLimpia ? {
              id: detalleObj.codDireccion || null,
              codigo: detalleObj.codDireccion || null,
              descripcion: direccionLimpia
            } : null;

            // Mapear los datos del API al formato del formulario
            const datosFormulario = {
              tipoDocumento: convertirTipoDocumento(detalleObj.codTipoDocumento),
              numeroDocumento: detalleObj.numerodocumento?.trim() || '',
              nombres: detalleObj.nombres?.trim() || '',
              apellidoPaterno: detalleObj.apellidopaterno?.trim() || '',
              apellidoMaterno: detalleObj.apellidomaterno?.trim() || '',
              telefono: detalleObj.telefono?.trim() || '',
              sexo: convertirSexo(detalleObj.codsexo),
              estadoCivil: convertirEstadoCivil(detalleObj.codestadocivil),
              fechaNacimiento: fechaNac,
              razonSocial: detalleObj.codTipopersona === '0302' ? detalleObj.nombres?.trim() : '',
              esPersonaJuridica: detalleObj.codTipopersona === '0302',
              codContribuyente: detalleObj.codContribuyente,
              codPersona: detalleObj.codPersona,
              nFinca: nFincaFinal,
              otroNumero: detalleObj.otros?.trim() || '',
              direccion: direccionObj,
              codDireccion: detalleObj.codDireccion,
              esExonerado: convertirBandera(detalleObj.esExonerado),
              esPensionista: convertirBandera(detalleObj.esPensionista)
            };

            logger.log('📋 [NuevoContribuyente] ========== DATOS MAPEADOS ==========');
            logger.log('📋 [NuevoContribuyente] Datos mapeados para formulario:', datosFormulario);
            logger.log('📋 [NuevoContribuyente] numeroDocumento:', datosFormulario.numeroDocumento);
            logger.log('📋 [NuevoContribuyente] nombres:', datosFormulario.nombres);
            logger.log('📋 [NuevoContribuyente] apellidoPaterno:', datosFormulario.apellidoPaterno);
            logger.log('📋 [NuevoContribuyente] Llamando setInitialData...');
            setInitialData(datosFormulario);
            logger.log('✅ [NuevoContribuyente] setInitialData ejecutado correctamente');
          } else {
            logger.log('❌ [NuevoContribuyente] detalle es null o undefined');
            setError('No se encontró el contribuyente');
            NotificationService.error('No se encontró el contribuyente');
          }
        } catch (err: any) {
          logger.error('❌ [NuevoContribuyente] Error al cargar contribuyente:', err);
          setError(err.message || 'Error al cargar los datos del contribuyente');
          NotificationService.error('Error al cargar los datos del contribuyente');
        } finally {
          setLoadingContribuyente(false);
        }
      }
    };

    cargarContribuyente();
  }, [id, isEditMode, obtenerContribuyenteDetalle]);

  // Definir las migas de pan para la navegación
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Contribuyente', path: '/contribuyente' },
    { label: isEditMode ? 'Editar contribuyente' : 'Nuevo contribuyente', active: true }
  ];

  // Función para mostrar mensaje temporal
  const showMessage = (message: string, type: 'success' | 'error' = 'success', duration = 5000) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setError(null);
    } else {
      setError(message);
      setSuccessMessage(null);
    }
    
    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, duration);
  };

  // Manejar el resultado del guardado del contribuyente
  const handleSubmit = useCallback(async (resultado: ContribuyenteFormData) => {
    try {
      logger.log('✅ [NuevoContribuyente] Contribuyente guardado exitosamente:', resultado);
      
      // Invalidar cache de React Query para que la consulta se actualice de inmediato
      queryClient.invalidateQueries({ queryKey: ['contribuyentes'] });
      
      // Redirigir de forma inmediata
      navigate('/contribuyente/consulta');
      
    } catch (error: any) {
      logger.error('❌ [NuevoContribuyente] Error:', error);
      showMessage(`❌ Error: ${error.message || 'Error desconocido'}`, 'error');
    }
  }, [navigate, queryClient]);

  // Manejar edición (por implementar)
  const handleEdit = useCallback(() => {
    NotificationService.info('Función de edición en desarrollo');
  }, []);

  // Manejar nuevo (limpiar formulario)
  const handleNew = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    NotificationService.info('Formulario limpiado');
  }, []);

  return (
    <MainLayout title={isEditMode ? 'Editar Contribuyente' : 'Nuevo Contribuyente'}>
      <Box sx={{ p: 3 }}>
        {/* Navegación de migas de pan */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumb items={breadcrumbItems} />
        </Box>

        {/* Progress bar */}
        {(loading || loadingContribuyente) && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {/* Mensaje de éxito */}
        <Collapse in={!!successMessage}>
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        </Collapse>

        {/* Mensaje de error */}
        <Collapse in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Collapse>

        {/* Formulario de contribuyente */}
        {(!isEditMode || (isEditMode && initialData)) && (
          <ContribuyenteFormMUI
            key={initialData ? `edit-${initialData.codContribuyente}` : 'new'}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            onNew={handleNew}
            initialData={initialData}
            loading={loadingContribuyente}
          />
        )}
        
      </Box>
    </MainLayout>
  );
};

export default NuevoContribuyente;
