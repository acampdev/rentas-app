// src/pages/predio/NuevoPredio.tsx
import { FC, memo, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Breadcrumbs,
  Link,
  Chip,
  useTheme,
  CircularProgress,
  Typography
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Domain as DomainIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { PredioFormData } from '../../models/Predio';
import PredioForm from '../../components/predio/PredioForm';
import MainLayout from '../../layout/MainLayout';
import { usePredios } from '../../hooks/usePredioAPI';
import { predioService } from '../../services/predioService';
import direccionService from '../../services/direccionService';
import { NotificationService } from '../../components/utils/Notification';
import { getAuthenticatedUserCode } from '../../config/api.unified.config';

/**
 * Página para registrar o editar un predio
 * Nuevo: POST /api/predio
 * Editar: GET /api/predio?anio=2024&codPredioBase=4
 */
const NuevoPredio: FC = memo(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { anio, codPredio } = useParams<{ anio?: string; codPredio?: string }>();

  // Determinar si estamos en modo edición
  const modoEdicion = !!(anio && codPredio);

  // Estados para modo edición
  const [predioExistente, setPredioExistente] = useState<any>(null);
  const [loadingPredio, setLoadingPredio] = useState(false);

  // Hook para gestión de predios con API integrada
  const { crearPredio, loading } = usePredios();

  // Mapeos de texto a código para los Autocomplete
  const mapCondicionPropiedad: Record<string, string> = {
    'PROPIETARIO UNICO': '2701',
    'PROPIETARIO': '2702',
    'POSEEDOR': '2703',
    'ARRENDATARIO': '2704',
    'USUFRUCTUARIO': '2705',
    'OTRO': '2706'
  };

  const mapConductor: Record<string, string> = {
    'PRIVADO': '1401',
    'ESTATAL': '1402'
  };

  const mapEstadoPredio: Record<string, string> = {
    'TERMINADO': '2501',
    'EN CONSTRUCCION': '2502',
    'EN RUINAS': '2503',
    'PARALIZADO': '2504'
  };

  // mapTipoPredio reservado para uso futuro si la API devuelve tipos de predio como texto
  // const mapTipoPredio: Record<string, string> = {
  //   'PREDIO INDEPENDIENTE': '2601',
  //   'DEPARTAMENTO EN EDIFICIO': '2602',
  //   'PREDIO EN QUINTA': '2603',
  //   'CUARTO EN CASA VECINDAD': '2604',
  //   'OTROS': '2605'
  // };

  // Función para parsear la dirección y extraer componentes
  const parsearDireccion = (direccionCompleta: string | null) => {
    if (!direccionCompleta) {
      return { direccionBase: '', numeroFinca: '', otroNumero: '' };
    }

    let direccionBase = direccionCompleta;
    let numeroFinca = '';
    let otroNumero = '';

    // Buscar "LT" o "Lote" seguido de número
    const matchLT = direccionCompleta.match(/,?\s*(?:LT|Lote)\s*(\d+)/i);
    if (matchLT) {
      numeroFinca = matchLT[1];
      // Remover la parte de LT de la dirección base
      direccionBase = direccionCompleta.replace(matchLT[0], '');
    }

    // Buscar "OTRO Nº" o "OTRO N°" o "- OTRO" seguido de número
    const matchOtro = direccionCompleta.match(/[-,]?\s*OTRO\s*(?:Nº|N°|N)?\s*(\d+)/i);
    if (matchOtro) {
      otroNumero = matchOtro[1];
      // Remover la parte de OTRO de la dirección base
      direccionBase = direccionBase.replace(matchOtro[0], '');
    }

    // Limpiar la dirección base (remover comas/guiones finales y espacios extra)
    direccionBase = direccionBase.replace(/[,\-\s]+$/, '').trim();

    console.log('📍 [NuevoPredio] Dirección parseada:', {
      original: direccionCompleta,
      direccionBase,
      numeroFinca,
      otroNumero
    });

    return { direccionBase, numeroFinca, otroNumero };
  };

  // Cargar datos del predio si estamos en modo edición
  useEffect(() => {
    const cargarPredioParaEdicion = async () => {
      if (modoEdicion && anio && codPredio) {
        try {
          setLoadingPredio(true);
          console.log('🔍 [NuevoPredio] Cargando predio para edición:', { anio, codPredio });

          // Usar buscarPrediosConFiltros del servicio
          const predios = await predioService.buscarPrediosConFiltros({
            anio: Number(anio),
            codPredioBase: codPredio,
            parametroBusqueda: ''
          });

          if (predios && predios.length > 0) {
            const predio = predios[0];
            console.log('✅ [NuevoPredio] Predio encontrado:', predio);

            // Parsear la dirección para extraer componentes
            const { direccionBase, numeroFinca, otroNumero } = parsearDireccion(predio.direccion || null);

            // Mapear valores de texto a códigos para los Autocomplete
            const condicionPropiedadKey = predio.condicionPropiedad?.toUpperCase() || '';
            const condicionPropiedadCode = predio.codCondicionPropiedad?.toString() ||
              (condicionPropiedadKey ? mapCondicionPropiedad[condicionPropiedadKey] : '') || '';

            const conductorKey = predio.conductor?.toUpperCase() || '';
            const conductorCode = predio.codListaConductor?.toString() ||
              (conductorKey ? mapConductor[conductorKey] : '') || '';

            const estadoPredioKey = predio.estadoPredio?.toUpperCase() || '';
            const estadoPredioCode = predio.estPredio?.toString() ||
              (estadoPredioKey ? mapEstadoPredio[estadoPredioKey] : '') || '';

            const tipoPredioCode = predio.codTipoPredio?.toString() || '';

            console.log('🔄 [NuevoPredio] Códigos mapeados:', {
              condicionPropiedad: `${predio.condicionPropiedad} → ${condicionPropiedadCode}`,
              conductor: `${predio.conductor} → ${conductorCode}`,
              estadoPredio: `${predio.estadoPredio} → ${estadoPredioCode}`
            });

            // Buscar la dirección en la base de datos usando direccionBase
            let direccionEncontrada = null;
            if (direccionBase) {
              console.log('🔍 [NuevoPredio] Buscando dirección:', direccionBase);
              try {
                // Extraer parte clave de la dirección para buscar (ej: "Jr. Los Olivos" o sector)
                // Intentar con múltiples términos de búsqueda
                const terminosBusqueda = [];

                // Extraer nombre de vía (Jr., Av., Calle, etc.)
                const matchVia = direccionBase.match(/(?:Jr\.|Av\.|Calle|Psje\.?|Pasaje)\s+([^,]+)/i);
                if (matchVia) {
                  terminosBusqueda.push(matchVia[1].trim());
                }

                // Extraer barrio
                const matchBarrio = direccionBase.match(/B\.º\s+([^,]+)/i);
                if (matchBarrio) {
                  terminosBusqueda.push(matchBarrio[1].trim());
                }

                // Extraer sector
                const matchSector = direccionBase.match(/SECT\.\s+([^,]+)/i);
                if (matchSector) {
                  terminosBusqueda.push(matchSector[1].trim());
                }

                console.log('🔍 [NuevoPredio] Términos de búsqueda extraídos:', terminosBusqueda);

                // Buscar con cada término hasta encontrar coincidencia
                for (const termino of terminosBusqueda) {
                  const direcciones = await direccionService.buscar({
                    parametrosBusqueda: termino,
                    codUsuario: getAuthenticatedUserCode()
                  });

                  if (direcciones && direcciones.length > 0) {
                    // Buscar la dirección que mejor coincida con la dirección base
                    const direccionMatch = direcciones.find((dir: any) => {
                      const dirCompleta = dir.direccionCompleta || dir.descripcion || '';
                      // Verificar si contiene partes clave de la dirección
                      return dirCompleta.toLowerCase().includes(termino.toLowerCase());
                    });

                    if (direccionMatch) {
                      // Usar id o codigo de la dirección encontrada
                      const dirId = direccionMatch.id || direccionMatch.codigo;
                      const dirDescripcion = direccionMatch.descripcion || direccionBase;
                      direccionEncontrada = {
                        id: dirId,
                        codigo: dirId,
                        descripcion: dirDescripcion,
                        direccionCompleta: dirDescripcion
                      };
                      console.log('✅ [NuevoPredio] Dirección encontrada:', direccionEncontrada);
                      break;
                    }
                  }
                }

                // Si no se encontró, crear objeto con la dirección parseada
                if (!direccionEncontrada) {
                  console.log('⚠️ [NuevoPredio] No se encontró dirección exacta, usando parseada');
                  direccionEncontrada = {
                    id: null,
                    codigo: null,
                    descripcion: direccionBase,
                    direccionCompleta: direccionBase
                  };
                }
              } catch (error) {
                console.error('❌ [NuevoPredio] Error buscando dirección:', error);
                direccionEncontrada = {
                  id: null,
                  codigo: null,
                  descripcion: direccionBase,
                  direccionCompleta: direccionBase
                };
              }
            }

            // Mapear datos del API al formato del formulario
            const datosFormulario = {
              anio: predio.anio,
              // Usar valores parseados de la dirección si no hay valores directos
              numeroFinca: predio.numeroFinca || numeroFinca || '',
              otroNumero: predio.otroNumero || otroNumero || '',
              areaTerreno: predio.areaTerreno,
              numeroPisos: predio.numeroPisos,
              numeroCondominos: predio.numeroCondominos,
              fechaAdquisicion: predio.fechaAdquisicion ? new Date(predio.fechaAdquisicion) : null,
              direccionId: direccionEncontrada?.id || predio.codDireccion,
              // Usar códigos mapeados para los Autocomplete
              condicionPropiedad: condicionPropiedadCode,
              tipoPredio: tipoPredioCode,
              estadoPredio: estadoPredioCode,
              clasificacionPredio: predio.codClasificacion?.toString() || '',
              conductor: conductorCode,
              usoPredio: predio.codUsoPredio?.toString() || '',
              totalAreaConstruccion: predio.totalAreaConstruccion,
              valorTerreno: predio.valorTerreno,
              valorTotalConstruccion: predio.valorTotalConstruccion,
              autoavaluo: predio.autoavaluo,
              // Datos adicionales para referencia
              codPredio: predio.codPredio,
              codPredioBase: predio.codPredioBase,
              // Usar dirección encontrada o parseada
              direccion: direccionEncontrada
            };

            console.log('📋 [NuevoPredio] Datos del formulario preparados:', datosFormulario);

            setPredioExistente(datosFormulario);
            NotificationService.info('Predio cargado para edición');
          } else {
            console.warn('⚠️ [NuevoPredio] No se encontró el predio');
            NotificationService.warning('No se encontró el predio especificado');
            navigate('/predio/consulta');
          }
        } catch (error: any) {
          console.error('❌ [NuevoPredio] Error al cargar predio:', error);
          NotificationService.error('Error al cargar los datos del predio');
          navigate('/predio/consulta');
        } finally {
          setLoadingPredio(false);
        }
      }
    };

    cargarPredioParaEdicion();
  }, [anio, codPredio, modoEdicion, navigate]);

  // Definir las migas de pan para la navegación
  const breadcrumbItems = [
    { label: 'Módulo', path: '/', icon: <HomeIcon sx={{ fontSize: 20 }} /> },
    { label: 'Predio', path: '/predio/consulta', icon: <DomainIcon sx={{ fontSize: 20 }} /> },
    { label: modoEdicion ? 'Edición de predio' : 'Registro de predio', active: true }
  ];

  // Handler para cuando se envía el formulario
  const handleSubmitPredio = async (data: any) => {
    console.log('🏠 [NuevoPredio] Datos del formulario recibidos:', data);
    console.log('🎯 [NuevoPredio] clasificacionPredio del form:', data.clasificacionPredio);

    // Preparar datos según estructura exacta del JSON del API
    const datosFormulario = {
      // Datos requeridos
      numeroFinca: data.numeroFinca || '',
      areaTerreno: Number(data.areaTerreno) || 0,
      direccionId: data.direccion?.id || data.direccionId,

      // Datos del formulario mapeados correctamente
      anio: data.anio || new Date().getFullYear(),
      otroNumero: data.otroNumero || '',
      fechaAdquisicion: data.fechaAdquisicion,

      // Mapeo correcto de códigos del formulario
      codClasificacion: data.clasificacionPredio, // Campo del form → campo del API
      estadoPredio: data.estadoPredio, // Para usarlo como estPredio en el DTO
      codTipoPredio: data.tipoPredio, // Campo del form → campo del API
      codCondicionPropiedad: data.condicionPropiedad, // Campo del form → campo del API
      codUsoPredio: data.usoPredio, // Campo del form → campo del API
      codListaConductor: data.conductor, // Campo del form → campo del API

      // Datos numéricos
      numeroPisos: Number(data.numeroPisos) || 1,
      numeroCondominos: Number(data.numeroCondominos) || 2, // Por defecto 2 según JSON ejemplo

      // Datos opcionales (pueden ser null)
      totalAreaConstruccion: data.totalAreaConstruccion ? Number(data.totalAreaConstruccion) : null,
      valorTerreno: data.valorTerreno ? Number(data.valorTerreno) : null,
      valorTotalConstruccion: data.valorTotalConstruccion ? Number(data.valorTotalConstruccion) : null,
      autoavaluo: data.autoavaluo ? Number(data.autoavaluo) : null,

      // Valores por defecto según el JSON ejemplo
      codUbicacionAreaVerde: 1,
      codEstado: "0201",
      codUsuario: getAuthenticatedUserCode()
    };

    console.log('📤 [NuevoPredio] Enviando datos al hook:', datosFormulario);
    console.log('🎯 [NuevoPredio] codClasificacion mapeado:', datosFormulario.codClasificacion);
    
    // Llamar al hook que maneja la creación con la API
    const predioCreado = await crearPredio(datosFormulario as any);
    
    if (predioCreado) {
      console.log('✅ [NuevoPredio] Predio creado exitosamente:', predioCreado);
      
      // La redirección se maneja en PredioForm después de guardar exitosamente
      // No es necesario redirigir aquí
    }
  };

  // Mostrar loading mientras se carga el predio en modo edición
  if (loadingPredio) {
    return (
      <MainLayout title="Cargando Predio">
        <Container maxWidth="xl">
          <Box sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CircularProgress size={48} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando datos del predio...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={modoEdicion ? "Edición de Predio" : "Registro de Predio"}>
      <Container maxWidth="xl">
        <Box sx={{ py: 2 }}>
          {/* Breadcrumbs */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                if (isLast || item.active) {
                  return (
                    <Chip
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                    />
                  );
                }

                return (
                  <Link
                    key={item.label}
                    component={RouterLink}
                    to={item.path || '/'}
                    underline="hover"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.primary',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {item.icon && (
                      <Box component="span" sx={{ mr: 0.5, display: 'flex' }}>
                        {item.icon}
                      </Box>
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>

          {/* Formulario de Predio con selector de contribuyente integrado */}
          <PredioForm
            onSubmit={handleSubmitPredio as any}
            loading={loading}
            predioExistente={predioExistente}
          />
        </Box>
      </Container>

    </MainLayout>
  );
});

// Nombre para DevTools
NuevoPredio.displayName = 'NuevoPredio';

export default NuevoPredio;
