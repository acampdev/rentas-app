// src/components/predio/pisos/RegistrosPisos.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  FormHelperText,
  useTheme,
  alpha,
  Alert,
  Tooltip,
  Autocomplete
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Domain as DomainIcon,
  Save as SaveIcon,
  Engineering as EngineeringIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { usePisos } from '../../../hooks/usePisos';
import { usePredios } from '../../../hooks/usePredioAPI';
const SelectorPredio = React.lazy(() => import('../../modal/SelectorPredio'));
import { NotificationService } from '../../utils/Notification';
import { Predio } from '../../../models/Predio';
import { useTiposMaterialPredominante } from '../../../hooks/useConstantesOptions';
// import SearchableSelect from '../../ui/SearchableSelect'; // Replaced with Autocomplete
import {
  useCategoriasValoresUnitariosOptions,
  useCategoriasValoresUnitariosHijosOptions,
  useLetraValoresUnitariosOptions,
  useEstadoConservacionOptions,
  OptionFormat
} from '../../../hooks/useConstantesOptions';
import { valorUnitarioService, ValorUnitarioData } from '../../../services/valorUnitarioService';
import { constanteService } from '../../../services/constanteService';
import { determinarNumeroPiso, extraerAnioYCodigoBase, normalizarValorAreasComunes, parseFechaConstruccion, validatePisoForm } from './registrosPisos.validation';



enum FormaRegistro {
  INDIVIDUAL = 'INDIVIDUAL',
  MASIVO = 'MASIVO'
}

// Interfaces
interface PisoFormData {
  descripcion: string;
  fechaConstruccion: Date | null;
  antiguedad: string;
  estadoConservacion: string;
  areaConstruida: string;
  materialPredominante: string;
  formaRegistro: string;
  otrasInstalaciones: string;
  anio?: number;
  areasComunes?: string;
  areaTotalConstruccion?: string;
}

// No es necesario extender ya que el modelo Predio ya tiene todas las propiedades
// codPredio, codTipoPredio y codCondicionPropiedad ya están definidas en el modelo

interface CategoriaSeleccionada {
  id: string;
  padre: OptionFormat;
  hijo: OptionFormat;
  letra: OptionFormat;
  fechaCreacion: Date;
  valor: number;
}

const RegistrosPisos: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { crearPiso, guardarPiso, loading } = usePisos();
  const { predios: prediosDisponibles, buscarPrediosConFiltros, loading: _loadingPredios } = usePredios({ enabled: false });

  // Obtener datos de edición desde navigation state
  const navigationState = location.state as any;
  const isEditMode = navigationState?.modoEdicion === 'editar';
  const editData = navigationState?.datosEdicion;

  // Procesar los datos de edición para extraer año y código base (usar useMemo para evitar re-cálculos)
  const datosExtraidos = React.useMemo(() => {
    return extraerAnioYCodigoBase(editData?.piso?.codPredio);
  }, [editData?.piso?.codPredio]);

  // Debug: Mostrar datos recibidos para edición (solo ejecutar una vez al montar)
  useEffect(() => {
    if (isEditMode && editData) {
      console.log('🎯 [RegistrosPisos] Navigation State recibido:', navigationState);
      console.log('🔄 [RegistrosPisos] Modo edición:', isEditMode);
      console.log('📋 [RegistrosPisos] Datos de edición:', editData);
      console.log('📅 [RegistrosPisos] Año extraído del codPredio:', datosExtraidos.anio);
      console.log('🏠 [RegistrosPisos] Código base del predio:', datosExtraidos.codigoBase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Estado para controlar si ya se buscó el predio en modo edición
  const [predioBuscado, setPredioBuscado] = useState(false);
  // Estado para controlar si ya se actualizó el predio
  const [predioActualizado, setPredioActualizado] = useState(false);

  // Efecto para buscar el predio automáticamente en modo edición usando el código base
  useEffect(() => {
    if (isEditMode && datosExtraidos.codigoBase && !predioBuscado) {
      console.log('🔍 [RegistrosPisos] Buscando predio para edición con código base:', datosExtraidos.codigoBase);
      console.log('🔍 [RegistrosPisos] Año para búsqueda:', datosExtraidos.anio);

      buscarPrediosConFiltros(
        datosExtraidos.anio,
        datosExtraidos.codigoBase,
        undefined
      ).then(() => {
        setPredioBuscado(true);
      }).catch((error) => {
        console.error('❌ [RegistrosPisos] Error buscando predio:', error);
        setPredioBuscado(true); // Marcar como buscado aunque haya error
      });
    }
    // Solo depender de valores primitivos para evitar bucle infinito
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, datosExtraidos.codigoBase, datosExtraidos.anio, predioBuscado]);

  // Efecto para actualizar el predio cuando se encuentran resultados de búsqueda
  useEffect(() => {
    if (isEditMode && predioBuscado && !predioActualizado && prediosDisponibles.length > 0) {
      console.log('📋 [RegistrosPisos] Predios encontrados para edición:', prediosDisponibles);

      // Buscar el predio que coincida con el código base
      const predioEncontrado = prediosDisponibles.find(p => {
        const codBase = p.codPredioBase || p.codigoPredio?.substring(4) || '';
        return codBase === datosExtraidos.codigoBase;
      });

      const codPredioOriginal = editData?.piso?.codPredio;

      if (predioEncontrado) {
        console.log('✅ [RegistrosPisos] Predio encontrado para llenar sección:', predioEncontrado);

        // Actualizar el estado del predio con los datos completos del API
        setPredio({
          ...predioEncontrado,
          // Mantener el código completo del piso (año + código base)
          codPredio: codPredioOriginal || predioEncontrado.codPredio,
          codigoPredio: codPredioOriginal || predioEncontrado.codigoPredio,
          // Datos del predio encontrado
          anio: predioEncontrado.anio || datosExtraidos.anio,
          direccion: predioEncontrado.direccion || '',
          areaTerreno: predioEncontrado.areaTerreno || 0,
          conductor: predioEncontrado.conductor || '',
          tipoPredio: predioEncontrado.tipoPredio || '',
          condicionPropiedad: predioEncontrado.condicionPropiedad || '',
          estadoPredio: predioEncontrado.estadoPredio || ''
        } as Predio);

        NotificationService.info(`Predio ${predioEncontrado.codigoPredio} cargado para edición`);
      } else if (prediosDisponibles.length > 0) {
        console.log('⚠️ [RegistrosPisos] No se encontró predio exacto, usando primer predio');
        const primerPredio = prediosDisponibles[0];
        setPredio({
          ...primerPredio,
          codPredio: codPredioOriginal || primerPredio.codPredio,
          codigoPredio: codPredioOriginal || primerPredio.codigoPredio,
        } as Predio);
      }

      // Marcar como actualizado para no volver a ejecutar
      setPredioActualizado(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, predioBuscado, predioActualizado, prediosDisponibles.length]);
  
  // Hooks para datos
  const { options: opcionesMaterialPredominante, loading: loadingMaterial, error: errorMaterial } = useTiposMaterialPredominante();
  
  // Estados - DECLARAR PRIMERO antes de usarlos
  // En modo edición, crear un predio temporal con los datos extraídos si no viene predio completo
  const [predio, setPredio] = useState<Predio | null>(() => {
    if (isEditMode && editData?.piso?.codPredio) {
      // Crear un objeto predio con los datos disponibles
      const predioFromEdit: Predio = {
        ...editData?.predio,
        // Usar el año extraído del codPredio
        anio: datosExtraidos.anio,
        // El código del predio para mostrar es el código completo
        codPredio: editData.piso.codPredio,
        codigoPredio: editData.piso.codPredio,
        // Guardar el código base para referencia
        codPredioBase: datosExtraidos.codigoBase,
        // Otros datos del predio o piso
        direccion: editData?.predio?.direccion || editData?.piso?.direccion || '',
        areaTerreno: editData?.predio?.areaTerreno || 0,
        conductor: editData?.predio?.conductor || '',
        tipoPredio: editData?.predio?.tipoPredio || '',
        condicionPropiedad: editData?.predio?.condicionPropiedad || '',
        estadoPredio: editData?.predio?.estadoPredio || ''
      } as Predio;
      console.log('🏠 [RegistrosPisos] Predio inicializado desde datos de edición:', predioFromEdit);
      return predioFromEdit;
    }
    return editData?.predio || null;
  });
  const [showSelectorPredios, setShowSelectorPredios] = useState(false);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<CategoriaSeleccionada[]>([]);
  const [categoriasCargadas, setCategoriasCargadas] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valoresUnitarios, setValoresUnitarios] = useState<ValorUnitarioData[]>([]);
  
  // Estado local para los mapeos bidireccionales dinámicos (con fallbacks estáticos iniciales)
  const [mapeosDiccionarios, setMapeosDiccionarios] = useState({
    categoriaCodigoToTexto: {
      '1001': 'ESTRUCTURAS',
      '1002': 'ACABADOS',
      '1003': 'INSTALACIONES ELECTRICAS Y SANITARIAS'
    } as Record<string, string>,
    categoriaTextoToCodigo: {
      'ESTRUCTURAS': '1001',
      'ACABADOS': '1002',
      'INSTALACIONES ELECTRICAS Y SANITARIAS': '1003'
    } as Record<string, string>,
    subcategoriaCodigoToTexto: {
      '100101': 'MUROS Y COLUMNAS',
      '100102': 'TECHOS',
      '100201': 'PISOS',
      '100202': 'PUERTAS Y VENTANAS',
      '100203': 'REVESTIMIENTOS',
      '100204': 'BAÑOS',
      '100301': 'INSTALACIONES ELECTRICAS Y SANITARIAS'
    } as Record<string, string>,
    subcategoriaTextoToCodigo: {
      'MUROS Y COLUMNAS': '100101',
      'TECHOS': '100102',
      'PISOS': '100201',
      'PUERTAS Y VENTANAS': '100202',
      'REVESTIMIENTOS': '100203',
      'BAÑOS': '100204',
      'INSTALACIONES ELECTRICAS Y SANITARIAS': '100301'
    } as Record<string, string>,
    letraCodigoToLetra: {
      '1101': 'A', '1102': 'B', '1103': 'C', '1104': 'D',
      '1105': 'E', '1106': 'F', '1107': 'G', '1108': 'H', '1109': 'I'
    } as Record<string, string>
  });

  
  // Estados para los selectores - DECLARAR ANTES de los hooks que los usan
  const [categoriaPadre, setCategoriaPadre] = useState<OptionFormat | null>(null);
  const [categoriaHija, setCategoriaHija] = useState<OptionFormat | null>(null);
  const [letraSeleccionada, setLetraSeleccionada] = useState<OptionFormat | null>(null);
  
  // Hooks para opciones - AHORA pueden usar categoriaPadre
  const { options: opcionesPadre, loading: loadingPadre, error: errorPadre } = useCategoriasValoresUnitariosOptions();
  const { options: opcionesHijas, loading: loadingHijas, error: errorHijas } = useCategoriasValoresUnitariosHijosOptions(
    categoriaPadre?.value?.toString() // Ahora sí está definido
  );
  const { options: opcionesLetras, loading: loadingLetras, error: errorLetras } = useLetraValoresUnitariosOptions();
  const { options: opcionesEstadoConservacion, loading: loadingEstado, error: errorEstado } = useEstadoConservacionOptions();
  
  // Efecto para cargar y estructurar dinámicamente los mapeos desde el API al montar el componente
  useEffect(() => {
    const cargarDiccionariosDinamicos = async () => {
      try {
        console.log('🔄 [RegistrosPisos] Cargando dinámicamente mapeos de categorías y subcategorías de valores unitarios...');
        
        // 1. Obtener categorías padres (Código 10)
        const padres = await constanteService.obtenerTiposCategoriasValoresUnitarios();
        if (!padres || padres.length === 0) {
          console.log('⚠️ [RegistrosPisos] No se obtuvieron categorías del API, se mantendrán los fallbacks estáticos.');
          return;
        }

        const catCodToTxt: Record<string, string> = {};
        const catTxtToCod: Record<string, string> = {};
        const subCodToTxt: Record<string, string> = {};
        const subTxtToCod: Record<string, string> = {};

        // 2. Procesar padres y cargar sus subcategorías hijas de forma paralela
        await Promise.all(
          padres.map(async (padre) => {
            const codPadre = String(padre.codConstante).trim();
            const nombrePadre = String(padre.nombreCategoria).trim().toUpperCase();
            
            if (codPadre && nombrePadre) {
              catCodToTxt[codPadre] = nombrePadre;
              catTxtToCod[nombrePadre] = codPadre;
              
              try {
                // Cargar los hijos directos de este padre
                const hijas = await constanteService.listarConstantesPorHijo(codPadre);
                if (hijas && hijas.length > 0) {
                  hijas.forEach((hija) => {
                    const codHijo = String(hija.codConstante).trim();
                    const nombreHijo = String(hija.nombreCategoria).trim().toUpperCase();
                    if (codHijo && nombreHijo) {
                      subCodToTxt[codHijo] = nombreHijo;
                      subTxtToCod[nombreHijo] = codHijo;
                    }
                  });
                }
              } catch (childError) {
                console.error(`❌ [RegistrosPisos] Error al obtener hijas para padre ${codPadre}:`, childError);
              }
            }
          })
        );

        // 3. Obtener letras (Código 11)
        const letCodToLet: Record<string, string> = {};
        try {
          const letras = await constanteService.obtenerTiposLetrasValoresUnitarios();
          if (letras && letras.length > 0) {
            letras.forEach((letra) => {
              const codLet = String(letra.codConstante).trim();
              const charLet = String(letra.nombreCategoria).trim().toUpperCase();
              if (codLet && charLet) {
                letCodToLet[codLet] = charLet;
              }
            });
          }
        } catch (letraError) {
          console.error('❌ [RegistrosPisos] Error al obtener letras del API:', letraError);
          // El actualizador funcional conserva el mapeo previo cuando el API falla.
        }

        // Actualizar el estado con el mapeo combinado dinámico
        setMapeosDiccionarios(prev => ({
          categoriaCodigoToTexto: { ...prev.categoriaCodigoToTexto, ...catCodToTxt },
          categoriaTextoToCodigo: { ...prev.categoriaTextoToCodigo, ...catTxtToCod },
          subcategoriaCodigoToTexto: { ...prev.subcategoriaCodigoToTexto, ...subCodToTxt },
          subcategoriaTextoToCodigo: { ...prev.subcategoriaTextoToCodigo, ...subTxtToCod },
          letraCodigoToLetra: Object.keys(letCodToLet).length > 0 ? letCodToLet : prev.letraCodigoToLetra
        }));

        console.log('✅ [RegistrosPisos] Mapeos de constantes cargados y normalizados dinámicamente:', {
          categoriasPadres: Object.keys(catCodToTxt).length,
          subcategoriasHijas: Object.keys(subCodToTxt).length,
          letras: Object.keys(letCodToLet).length
        });
      } catch (error) {
        console.error('❌ [RegistrosPisos] Error cargando diccionarios dinámicos de constantes:', error);
      }
    };

    cargarDiccionariosDinamicos();
  }, []);


  
  // Debug: Log inmediato de las opciones hijas
  useEffect(() => {
    console.log('🎯 [RegistrosPisos] CAMBIO EN OPCIONES HIJAS:');
    console.log('- Padre actual:', categoriaPadre);
    console.log('- Opciones hijas recibidas:', opcionesHijas);
    console.log('- Cantidad de hijas:', opcionesHijas.length);
    if (opcionesHijas.length > 0) {
      console.log('- Primera opción hija:', opcionesHijas[0]);
    }
  }, [opcionesHijas, categoriaPadre]);

  // Estado para controlar si ya se cargó el formulario en modo edición
  const [formDataCargado, setFormDataCargado] = useState(false);

  // Estado del formulario - Inicializar con el año correcto del piso en edición si aplica, o año actual
  const [formData, setFormData] = useState<PisoFormData>(() => {
    const defaultAnio = isEditMode && editData?.piso?.codPredio 
      ? extraerAnioYCodigoBase(editData.piso.codPredio).anio 
      : new Date().getFullYear();

    return {
      descripcion: '',
      fechaConstruccion: null,
      antiguedad: '30 años',
      estadoConservacion: '',
      areaConstruida: '',
      materialPredominante: '',
      formaRegistro: FormaRegistro.INDIVIDUAL,
      otrasInstalaciones: '0.00',
      anio: defaultAnio,
      areasComunes: '',
      areaTotalConstruccion: ''
    };
  });

  // Efecto para cargar los datos del formulario en modo edición
  // Este efecto garantiza que la fecha de construcción se parsee correctamente
  useEffect(() => {
    // Solo ejecutar si es modo edición, hay datos del piso y no se ha cargado antes
    if (isEditMode && editData?.piso && !formDataCargado) {
      console.log('🔄 [RegistrosPisos] Cargando datos del piso para edición:', editData.piso);
      console.log('📅 [RegistrosPisos] Fecha de construcción recibida:', editData.piso.fechaConstruccion);

      // Parsear la fecha de construcción correctamente
      const fechaParsed = parseFechaConstruccion(editData.piso.fechaConstruccion);
      console.log('📅 [RegistrosPisos] Fecha de construcción parseada:', fechaParsed);

      setFormData({
        descripcion: editData.piso.numeroPiso?.toString() || '',
        fechaConstruccion: fechaParsed,
        antiguedad: editData.piso.antiguedad || '30 años',
        estadoConservacion: editData.piso.codEstadoConservacion || '',
        areaConstruida: editData.piso.areaConstruida?.toString() || '',
        materialPredominante: editData.piso.codMaterialEstructural || '',
        formaRegistro: FormaRegistro.INDIVIDUAL,
        otrasInstalaciones: (editData.piso.valorOtrasInstalaciones ?? editData.piso.otrasInstalaciones)?.toString() || '0.00',
        // Usar el año extraído del codPredio
        anio: datosExtraidos.anio,
        areasComunes: (editData.piso.valorAreasComunes ?? editData.piso.areasComunes)?.toString() || '',
        areaTotalConstruccion: editData.piso.areaTotalConstruccion?.toString() || ''
      });

      // Marcar como cargado para no volver a ejecutar
      setFormDataCargado(true);
      console.log('✅ [RegistrosPisos] FormData actualizado para edición');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, formDataCargado]);

  // Efecto para pre-cargar categorías reales en modo edición cuando los datos y diccionarios estén listos
  useEffect(() => {
    if (isEditMode && editData?.piso && valoresUnitarios.length > 0 && !categoriasCargadas) {
      // Asegurarse de que los valores unitarios cargados corresponden al año correcto de la edición
      const anioValores = valoresUnitarios[0].año;
      if (Number(anioValores) !== Number(formData.anio)) {
        console.log('⏳ [RegistrosPisos] Esperando valores unitarios para el año correcto:', formData.anio, 'cargados actualmente:', anioValores);
        return;
      }

      const { categoriaCodigoToTexto, subcategoriaCodigoToTexto, letraCodigoToLetra } = mapeosDiccionarios;
      if (Object.keys(categoriaCodigoToTexto).length === 0 || Object.keys(letraCodigoToLetra).length === 0) {
        return;
      }

      console.log('🔄 [RegistrosPisos] Pre-cargando categorías reales para modo edición...', editData.piso);

      const categorizaciones = [
        { parentCode: '1001', childCode: '100101', letterField: 'codLetraMurosColumnas' },
        { parentCode: '1001', childCode: '100102', letterField: 'codLetraTechos' },
        { parentCode: '1002', childCode: '100201', letterField: 'codLetraPisos' },
        { parentCode: '1002', childCode: '100202', letterField: 'codLetraPuertasVentanas' },
        { parentCode: '1002', childCode: '100203', letterField: 'codLetraRevestimiento' },
        { parentCode: '1002', childCode: '100204', letterField: 'codLetraBanios' },
        { parentCode: '1003', childCode: '100301', letterField: 'codLetraInstalacionesElectricas' }
      ];

      const nuevasCategorias: CategoriaSeleccionada[] = [];

      categorizaciones.forEach((item, index) => {
        const letraCodeRaw = editData.piso[item.letterField];
        if (letraCodeRaw) {
          const letraCode = String(letraCodeRaw).trim();
          const letraChar = letraCodigoToLetra[letraCode];
          
          if (letraChar) {
            const padreLabel = categoriaCodigoToTexto[item.parentCode] || 'CATEGORIA';
            const hijoLabel = subcategoriaCodigoToTexto[item.childCode] || 'SUBCATEGORIA';

            const padreOpt: OptionFormat = {
              value: item.parentCode,
              label: padreLabel,
              id: item.parentCode
            };

            const hijoOpt: OptionFormat = {
              value: item.childCode,
              label: hijoLabel,
              id: item.childCode
            };

            const letraOpt: OptionFormat = {
              value: letraChar,
              label: letraChar,
              id: letraCode
            };

            const valor = buscarValorUnitario(padreOpt, hijoOpt, letraOpt);

            nuevasCategorias.push({
              id: `edit-category-${item.childCode}-${index}`,
              padre: padreOpt,
              hijo: hijoOpt,
              letra: letraOpt,
              fechaCreacion: new Date(),
              valor: valor
            });
          }
        }
      });

      if (nuevasCategorias.length > 0) {
        setCategoriasSeleccionadas(nuevasCategorias);
        setCategoriasCargadas(true);
        console.log('✅ [RegistrosPisos] Categorías reales pre-cargadas para edición:', nuevasCategorias);
      }
    }
  // La función de búsqueda se declara más adelante por el orden histórico del formulario;
  // categoriasCargadas impide que la precarga se repita.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, editData, valoresUnitarios, mapeosDiccionarios, categoriasCargadas, formData.anio]);

  // Opciones para selectores


  // Calcular antigüedad basándose en el Año seleccionado y la Fecha de Construcción
  useEffect(() => {
    if (formData.fechaConstruccion && formData.anio) {
      const fechaConstruccion = new Date(formData.fechaConstruccion);
      const anioConstruccion = fechaConstruccion.getFullYear();
      const anioSeleccionado = formData.anio;

      // Calcular la diferencia entre el año seleccionado y el año de construcción
      const antiguedad = anioSeleccionado - anioConstruccion;

      // Si la antigüedad es negativa (fecha de construcción posterior al año seleccionado), mostrar 0
      const antiguedadFinal = antiguedad >= 0 ? antiguedad : 0;

      setFormData(prev => ({ ...prev, antiguedad: `${antiguedadFinal} años` }));
    } else if (!formData.fechaConstruccion) {
      // Si no hay fecha de construcción, limpiar la antigüedad
      setFormData(prev => ({ ...prev, antiguedad: '' }));
    }
  }, [formData.fechaConstruccion, formData.anio]);

  // Cargar valores unitarios cuando cambia el año - usando el servicio directamente
  useEffect(() => {
    const cargarValoresUnitarios = async () => {
      if (formData.anio) {
        try {
          console.log('🔍 [RegistrosPisos] Cargando valores unitarios para año:', formData.anio);
          
          // Usar el servicio directamente para obtener los valores con el formato correcto
          const valores = await valorUnitarioService.consultarValoresUnitarios({
            anio: formData.anio
          });
          
          setValoresUnitarios(valores);
          console.log('✅ [RegistrosPisos] Valores unitarios cargados:', valores.length);
          
          // Mostrar algunos valores de ejemplo para debugging
          if (valores.length > 0) {
            console.log('📊 [RegistrosPisos] Ejemplos de valores cargados:', 
              valores.slice(0, 5).map(v => ({
                id: v.id,
                categoria: v.categoria,
                subcategoria: v.subcategoria,
                letra: v.letra,
                costo: v.costo,
                año: v.año
              }))
            );
          }
        } catch (error) {
          console.error('❌ [RegistrosPisos] Error cargando valores unitarios:', error);
          setValoresUnitarios([]);
        }
      }
    };

    cargarValoresUnitarios();
  }, [formData.anio]);

  // Debug: Mostrar datos cargados y formato de opciones
  useEffect(() => {
    console.log('🔍 [RegistrosPisos] Estado de carga de datos:');
    console.log('Padre:', { opciones: opcionesPadre.length, loading: loadingPadre, error: errorPadre });
    console.log('Hijas:', { opciones: opcionesHijas.length, loading: loadingHijas, error: errorHijas });
    console.log('Letras:', { opciones: opcionesLetras.length, loading: loadingLetras, error: errorLetras });
    console.log('Estado Conservación:', { opciones: opcionesEstadoConservacion.length, loading: loadingEstado, error: errorEstado });
    console.log('Valores Unitarios:', { cantidad: valoresUnitarios.length });
    
    // Mostrar formato exacto de las opciones para debugging
    if (opcionesPadre.length > 0) {
      console.log('📋 [RegistrosPisos] Formato Opciones Padre (primeras 2):', 
        opcionesPadre.slice(0, 2).map(op => ({ value: op.value, label: op.label, id: op.id }))
      );
    }
    if (opcionesHijas.length > 0) {
      console.log('📋 [RegistrosPisos] Formato Opciones Hijas (primeras 2):', 
        opcionesHijas.slice(0, 2).map(op => ({ value: op.value, label: op.label, id: op.id }))
      );
    }
    if (opcionesLetras.length > 0) {
      console.log('📋 [RegistrosPisos] Formato Opciones Letras (primeras 3):', 
        opcionesLetras.slice(0, 3).map(op => ({ value: op.value, label: op.label, id: op.id }))
      );
    }
    if (valoresUnitarios.length > 0) {
      console.log('📋 [RegistrosPisos] Formato Valores Unitarios (primeros 3):', 
        valoresUnitarios.slice(0, 3).map(v => ({
          categoria: v.categoria,
          subcategoria: v.subcategoria, 
          letra: v.letra,
          costo: v.costo
        }))
      );
    }
  }, [opcionesPadre, opcionesHijas, opcionesLetras, opcionesEstadoConservacion, valoresUnitarios, loadingPadre, loadingHijas, loadingLetras, loadingEstado, errorPadre, errorHijas, errorLetras, errorEstado]);

  // Limpiar selecciones dependientes cuando cambia el padre
  useEffect(() => {
    console.log('🔍 [RegistrosPisos] categoriaPadre cambió:', categoriaPadre);
    
    // Limpiar hijo y letra cuando cambia el padre
    if (categoriaPadre !== null) {
      console.log(`🔄 [RegistrosPisos] Padre cambió a: ${categoriaPadre?.value} (${categoriaPadre?.label}), limpiando selecciones dependientes`);
      setCategoriaHija(null);
      setLetraSeleccionada(null);
    }
  }, [categoriaPadre]);

  // Limpiar letra cuando cambia el hijo
  useEffect(() => {
    if (categoriaHija !== null) {
      console.log(`🔄 [RegistrosPisos] Hijo cambió a: ${categoriaHija?.value} (${categoriaHija?.label}), limpiando letra`);
      setLetraSeleccionada(null);
    }
  }, [categoriaHija]);

  // Función para buscar valor unitario por categoria, subcategoria y letra
  const buscarValorUnitario = (categoria: OptionFormat, subcategoria: OptionFormat, letra: OptionFormat): number => {
    console.log('🔍 [RegistrosPisos] Buscando valor unitario para:', {
      categoriaValue: categoria.value,
      categoriaLabel: categoria.label,
      subcategoriaValue: subcategoria.value,
      subcategoriaLabel: subcategoria.label,
      letraValue: letra.value,
      letraLabel: letra.label,
      letraId: letra.id,
      año: formData.anio
    });

    if (valoresUnitarios.length === 0) {
      console.log('⚠️ [RegistrosPisos] No hay valores unitarios cargados');
      return 0;
    }

    // Mostrar algunos valores unitarios para debugging
    if (valoresUnitarios.length > 0) {
      console.log('📊 [RegistrosPisos] Primeros 3 valores unitarios disponibles:',
        valoresUnitarios.slice(0, 3).map(v => ({
          categoria: v.categoria,
          subcategoria: v.subcategoria,
          letra: v.letra,
          costo: v.costo,
          año: v.año
        }))
      );
    }

    // ===== MAPEO BIDIRECCIONAL: código <-> texto =====
    // El API puede devolver TEXTO o CÓDIGO dependiendo del año/configuración
    const {
      categoriaCodigoToTexto,
      subcategoriaCodigoToTexto,
      letraCodigoToLetra
    } = mapeosDiccionarios;

    const normalizarComparacion = (valor: unknown): string => String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();


    // Obtener valores de búsqueda (el value del select es el código: 1001, 100101, etc.)
    const categoriaCodigo = String(categoria.value).trim();
    const subcategoriaCodigo = String(subcategoria.value).trim();
    // Para letra, el value es la letra (A, B, C...) y el id es el código (1101, 1102...)
    const letraValor = String(letra.value).trim(); // "A", "B", etc.
    const letraId = String(letra.id || '').trim();

    // Convertir código a texto para búsqueda
    const categoriaTexto = categoriaCodigoToTexto[categoriaCodigo] || categoriaCodigo;
    const subcategoriaTexto = subcategoriaCodigoToTexto[subcategoriaCodigo] || subcategoriaCodigo;
    const categoriaTextoNormalizado = normalizarComparacion(categoriaTexto);
    const subcategoriaTextoNormalizado = normalizarComparacion(subcategoriaTexto);

    console.log('🔄 [RegistrosPisos] Valores para búsqueda:', {
      categoriaCodigo,
      categoriaTexto,
      subcategoriaCodigo,
      subcategoriaTexto,
      letraValor,
      letraId,
      año: formData.anio
    });

    // ===== BÚSQUEDA FLEXIBLE: acepta código O texto =====
    const valorEncontrado = valoresUnitarios.find(valor => {
      const valorCat = String(valor.categoria).trim().toUpperCase();
      const valorSub = String(valor.subcategoria).trim().toUpperCase();
      const valorLetra = String(valor.letra).trim().toUpperCase();
      const valorCatNormalizado = normalizarComparacion(valor.categoria);
      const valorSubNormalizado = normalizarComparacion(valor.subcategoria);
      const valorLetraNormalizado = normalizarComparacion(valor.letra);

      // Comparar categoría: acepta código o texto
      const categoriaMatch =
        valorCat === categoriaCodigo ||
        valorCatNormalizado === categoriaTextoNormalizado;

      // Comparar subcategoría: acepta código o texto
      const subcategoriaMatch =
        valorSub === subcategoriaCodigo ||
        valorSubNormalizado === subcategoriaTextoNormalizado;

      // Comparar letra: acepta letra directa o código de letra
      const letraMatch =
        valorLetraNormalizado === normalizarComparacion(letraValor) ||
        normalizarComparacion(letraCodigoToLetra[valorLetra]) === normalizarComparacion(letraValor) ||
        valorLetra === letraId;

      // Comparar año (asegurar que ambos sean números)
      const añoMatch = Number(valor.año) === Number(formData.anio);

      const esMatch = categoriaMatch && subcategoriaMatch && letraMatch && añoMatch;

      // Log detallado solo para los primeros 5 valores para debugging
      if (valoresUnitarios.indexOf(valor) < 5) {
        console.log(`🔎 [RegistrosPisos] Comparando valor ${valoresUnitarios.indexOf(valor) + 1}:`, {
          valorAPI: {
            cat: valor.categoria,
            sub: valor.subcategoria,
            letra: valor.letra,
            año: valor.año,
            costo: valor.costo
          },
          buscando: {
            catTexto: categoriaTexto,
            catCodigo: categoriaCodigo,
            subTexto: subcategoriaTexto,
            subCodigo: subcategoriaCodigo,
            letra: letraValor,
            año: formData.anio
          },
          matches: {
            cat: categoriaMatch,
            sub: subcategoriaMatch,
            letra: letraMatch,
            año: añoMatch,
            final: esMatch
          }
        });
      }

      return esMatch;
    });

    if (valorEncontrado) {
      console.log('✅ [RegistrosPisos] ¡VALOR ENCONTRADO!', {
        costo: valorEncontrado.costo,
        categoria: valorEncontrado.categoria,
        subcategoria: valorEncontrado.subcategoria,
        letra: valorEncontrado.letra,
        año: valorEncontrado.año
      });
      return valorEncontrado.costo;
    } else {
      console.log('❌ [RegistrosPisos] NO SE ENCONTRÓ VALOR para:', {
        categoriaTexto,
        categoriaCodigo,
        subcategoriaTexto,
        subcategoriaCodigo,
        letraValor,
        año: formData.anio
      });

      // Debug: mostrar valores que tienen el año correcto
      const valoresDelAnio = valoresUnitarios.filter(v => Number(v.año) === Number(formData.anio));

      if (valoresDelAnio.length > 0) {
        console.log(`🔍 [RegistrosPisos] ${valoresDelAnio.length} valores encontrados para el año ${formData.anio}:`);
        console.log('📊 Primeros 10 valores:',
          valoresDelAnio.slice(0, 10).map(v => ({
            cat: v.categoria,
            sub: v.subcategoria,
            letra: v.letra,
            costo: v.costo
          }))
        );
      } else {
        console.log(`⚠️ [RegistrosPisos] NO hay valores unitarios para el año ${formData.anio}`);
        console.log('📊 Años disponibles en valores cargados:',
          [...new Set(valoresUnitarios.map(v => v.año))].sort()
        );
      }

      return 0;
    }
  };

  // Calcular suma total de valores unitarios
  const calcularSumaValores = useCallback((): number => {
    const suma = categoriasSeleccionadas.reduce((total, categoria) => total + categoria.valor, 0);
    console.log('🔢 [RegistrosPisos] Suma total de valores:', suma);
    return suma;
  }, [categoriasSeleccionadas]);

  // Actualizar el campo "Otras instalaciones" con la suma
  useEffect(() => {
    const sumaTotal = calcularSumaValores();
    setFormData(prev => ({ ...prev, otrasInstalaciones: sumaTotal.toFixed(2) }));
  }, [categoriasSeleccionadas, calcularSumaValores]);

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof PisoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Agregar nueva categoría seleccionada
  const agregarCategoria = () => {
    if (!categoriaPadre || !categoriaHija || !letraSeleccionada) {
      NotificationService.warning('Debe seleccionar padre, hijo y letra');
      return;
    }
    
    // Logging detallado de las selecciones
    console.log('🎯 [RegistrosPisos] AGREGANDO CATEGORÍA CON:');
    console.log('  - Padre:', { value: categoriaPadre.value, label: categoriaPadre.label, id: categoriaPadre.id });
    console.log('  - Hijo:', { value: categoriaHija.value, label: categoriaHija.label, id: categoriaHija.id });
    console.log('  - Letra:', { value: letraSeleccionada.value, label: letraSeleccionada.label, id: letraSeleccionada.id });
    console.log('  - Año:', formData.anio);
    console.log('  - Valores unitarios disponibles:', valoresUnitarios.length);
    
    // Validar duplicidad: no permitir misma letra con mismo hijo
    const existeDuplicado = categoriasSeleccionadas.some(cat => 
      cat.hijo.value === categoriaHija.value && cat.letra.value === letraSeleccionada.value
    );
    
    if (existeDuplicado) {
      NotificationService.error(`Ya existe la letra ${letraSeleccionada.label} para ${categoriaHija.label}`);
      return;
    }
    
    // Buscar el valor unitario correspondiente
    const valorUnitario = buscarValorUnitario(categoriaPadre, categoriaHija, letraSeleccionada);
    
    if (valorUnitario === 0) {
      console.log('⚠️ [RegistrosPisos] No se encontró valor, mostrando algunos valores disponibles como referencia:');
      const muestraValores = valoresUnitarios.slice(0, 10).map(v => ({
        cat: v.categoria,
        sub: v.subcategoria,
        letra: v.letra,
        costo: v.costo
      }));
      console.table(muestraValores);
      
      NotificationService.warning(`No se encontró valor unitario para ${categoriaPadre.label}/${categoriaHija.label}/${letraSeleccionada.label} en el año ${formData.anio}`);
    }
    
    const nuevaCategoria: CategoriaSeleccionada = {
      id: `${Date.now()}-${Math.random()}`,
      padre: categoriaPadre,
      hijo: categoriaHija,
      letra: letraSeleccionada,
      fechaCreacion: new Date(),
      valor: valorUnitario
    };
    
    setCategoriasSeleccionadas(prev => [...prev, nuevaCategoria]);
    
    // Limpiar selecciones
    setCategoriaHija(null);
    setLetraSeleccionada(null);
    
    NotificationService.success(`Categoría agregada correctamente. Valor: S/ ${valorUnitario.toFixed(2)}`);
  };
  
  // Eliminar categoría seleccionada
  const eliminarCategoria = (id: string) => {
    setCategoriasSeleccionadas(prev => prev.filter(cat => cat.id !== id));
    NotificationService.info('Categoría eliminada');
  };
  
  // Limpiar todas las categorías
  const limpiarCategorias = () => {
    setCategoriasSeleccionadas([]);
    setCategoriaPadre(null);
    setCategoriaHija(null);
    setLetraSeleccionada(null);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors = validatePisoForm(formData, Boolean(predio));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Determinar el número de piso basado en la descripción
  // Guardar piso usando la nueva API POST o PUT para edición
  const handleSubmit = async () => {
    console.log('🚀 [RegistrosPisos] handleSubmit iniciado');
    console.log('📋 [RegistrosPisos] Estado del formulario:', {
      formData,
      predio: predio ? { codigo: predio.codigoPredio, id: predio.codPredio } : null,
      categoriasSeleccionadas: categoriasSeleccionadas.length,
      isEditMode,
      loading
    });

    const validationResult = validateForm();
    console.log('✅ [RegistrosPisos] Resultado de validación:', validationResult);
    console.log('❌ [RegistrosPisos] Errores de validación:', errors);
    
    if (!validationResult) {
      NotificationService.error('Por favor complete todos los campos requeridos');
      return;
    }

    if (!predio) {
      console.log('❌ [RegistrosPisos] Error: No hay predio seleccionado');
      NotificationService.error('Debe seleccionar un predio');
      return;
    }

    if (categoriasSeleccionadas.length === 0) {
      console.log('❌ [RegistrosPisos] Error: No hay categorías seleccionadas');
      NotificationService.error('Debe seleccionar al menos una categoría');
      return;
    }

    console.log('✅ [RegistrosPisos] Todas las validaciones pasaron, procediendo con la creación/actualización');

    try {
      const action = isEditMode ? 'actualización' : 'creación';
      console.log(`🏗️ [RegistrosPisos] Iniciando ${action} de piso con API ${isEditMode ? 'PUT' : 'POST'}`);
      
      // Preparar datos para el API - incluir codPiso para edición
      const datosParaOperacion = {
        // Incluir codPiso si es edición
        ...(isEditMode && editData?.piso?.codPiso && { 
          codPiso: editData.piso.codPiso 
        }),
        // Datos básicos requeridos
        anio: formData.anio || new Date().getFullYear(),
        codPredio: String(predio.codigoPredio).trim(),
        numeroPiso: determinarNumeroPiso(formData.descripcion),
        areaConstruida: String(formData.areaConstruida || '0'),
        valorAreasComunes: normalizarValorAreasComunes(formData.areasComunes),
        
        // Fecha de construcción
        fechaConstruccion: formData.fechaConstruccion 
          ? formData.fechaConstruccion.toISOString().split('T')[0]
          : '1990-01-01',
        
        // Datos de categorías seleccionadas - buscar cada categoría específica
        ...(categoriasSeleccionadas.length > 0 && {
          // Buscar los códigos de letra específicos para cada categoría (usar .id no .value)
          codLetraMurosColumnas: String(
            categoriasSeleccionadas.find(cat => cat.hijo.value === '100101')?.letra.id || 
            categoriasSeleccionadas[0]?.letra.id || 
            '1101'
          ).trim(),
          murosColumnas: '100101',
          
          codLetraTechos: String(
            categoriasSeleccionadas.find(cat => cat.hijo.value === '100102')?.letra.id || 
            categoriasSeleccionadas[0]?.letra.id || 
            '1101'
          ).trim(),
          techos: '100102',
          
          codLetraPisos: String(
            categoriasSeleccionadas.find(cat => cat.hijo.value === '100201')?.letra.id || 
            categoriasSeleccionadas[0]?.letra.id || 
            '1101'
          ).trim(),
          pisos: '100201',
          
          codLetraPuertasVentanas: String(
            categoriasSeleccionadas.find(cat => cat.hijo.value === '100202')?.letra.id || 
            categoriasSeleccionadas[0]?.letra.id || 
            '1101'
          ).trim(),
          puertasVentanas: '100202',
          
          codLetraRevestimiento: String(
            categoriasSeleccionadas.find(cat => cat.hijo.value === '100203')?.letra.id || 
            categoriasSeleccionadas[0]?.letra.id || 
            '1101'
          ).trim(),
          revestimiento: '100203',
          
          codLetraBanios: String(
            categoriasSeleccionadas.find(cat => cat.hijo.value === '100204')?.letra.id || 
            categoriasSeleccionadas[0]?.letra.id || 
            '1101'
          ).trim(),
          banios: '100204',
          
          codLetraInstalacionesElectricas: String(
            categoriasSeleccionadas.find(cat => cat.hijo.value === '100301')?.letra.id || 
            categoriasSeleccionadas[0]?.letra.id || 
            '1101'
          ).trim(),
          instalacionesElectricas: '100301'
        }),
        
        // Estado de conservación del formulario (recortado, sin espacios)
        codEstadoConservacion: String(formData.estadoConservacion || '9402').trim(),
        // Material Estructural (recortado, sin espacios)
        codMaterialEstructural: String(formData.materialPredominante || '0701').trim()
      };
      
      // Obtener el código de predio base corto (ej: "5")
      const predioBaseCodigo = String(predio?.codPredioBase || predio?.codigoPredio || predio?.codPredio || '').trim();
      // Usar el año del predio seleccionado (ej: 2025) para formar la clave correcta
      const anioPredio = predio?.anio || formData.anio || new Date().getFullYear();
      const codigoPredioFinal = predioBaseCodigo.startsWith(String(anioPredio))
        ? predioBaseCodigo
        : `${anioPredio}${predioBaseCodigo}`;

      console.log('🏠 [RegistrosPisos] Códigos de predio calculados para envío:', {
        'predioBaseCodigo': predioBaseCodigo,
        'anioPredio': anioPredio,
        'codigoPredioFinal': codigoPredioFinal
      });
      
      // Actualizar el dato con el código correcto
      datosParaOperacion.codPredio = codigoPredioFinal;
      
      console.log(`📤 [RegistrosPisos] Datos finales para ${action}:`, datosParaOperacion);
      
      // Verificar que tenemos todos los datos requeridos
      console.log('🔍 [RegistrosPisos] Verificación de datos requeridos:');
      console.log('  - codPredio:', datosParaOperacion.codPredio);
      console.log('  - numeroPiso:', datosParaOperacion.numeroPiso);
      console.log('  - areaConstruida:', datosParaOperacion.areaConstruida);
      console.log('  - anio:', datosParaOperacion.anio);
      console.log('  - isEditMode:', isEditMode);
      
      // Validaciones adicionales para evitar errores de datos
      if (!datosParaOperacion.codPredio || datosParaOperacion.codPredio === 'undefined') {
        throw new Error('Código de predio inválido');
      }
      
      if (isNaN(datosParaOperacion.numeroPiso) || datosParaOperacion.numeroPiso < 0) {
        throw new Error('Número de piso inválido');
      }
      
      if (isNaN(datosParaOperacion.areaConstruida) || datosParaOperacion.areaConstruida <= 0) {
        throw new Error('Área construida inválida');
      }
      
      // Llamar al hook apropiado según el modo
      console.log(`🚀 [RegistrosPisos] Llamando a ${isEditMode ? 'guardarPiso' : 'crearPiso'}...`);
      const pisoResultado = isEditMode 
        ? await guardarPiso(datosParaOperacion) // Usar método de actualización
        : await crearPiso(datosParaOperacion);
      
      console.log('📥 [RegistrosPisos] Resultado de la operación:', pisoResultado);
      
      if (pisoResultado) {
        const accionCompleta = isEditMode ? 'actualizado' : 'creado';
        console.log(`✅ [RegistrosPisos] Piso ${accionCompleta} exitosamente:`, pisoResultado);
        const consultaAnio = Number(datosParaOperacion.anio || anioPredio);
        const consultaCodigoPredio = String(datosParaOperacion.codPredio).trim();
        const predioParaConsulta = {
          ...predio,
          anio: consultaAnio,
          codPredio: consultaCodigoPredio,
          codigoPredio: consultaCodigoPredio
        };
        
        // Limpiar formulario después del éxito solo si es creación
        if (!isEditMode) {
          setFormData({
            descripcion: '',
            fechaConstruccion: null,
            antiguedad: '30 años',
            estadoConservacion: '',
            areaConstruida: '',
            materialPredominante: '',
            formaRegistro: FormaRegistro.INDIVIDUAL,
            otrasInstalaciones: '0.00',
            anio: new Date().getFullYear(),
            areasComunes: '',
            areaTotalConstruccion: ''
          });
          limpiarCategorias();
          setPredio(null);
        }
        
        const numeroPiso = pisoResultado.numeroPiso || editData?.piso?.numeroPiso || formData.descripcion;
        NotificationService.success(`Piso ${numeroPiso} ${accionCompleta} exitosamente`);
        
        // Redireccionar a la página de consulta después del registro exitoso
        setTimeout(() => {
          navigate('/predio/pisos/consulta', {
            state: {
              anio: consultaAnio,
              codPredio: consultaCodigoPredio,
              codigoPredio: consultaCodigoPredio,
              predio: predioParaConsulta
            }
          });
        }, 1500);
      } else {
        const errorMsg = isEditMode ? 'No se pudo actualizar el piso' : 'No se pudo crear el piso';
        throw new Error(errorMsg);
      }
      
    } catch (error: any) {
      const errorAction = isEditMode ? 'actualizar' : 'crear';
      console.error(`❌ [RegistrosPisos] Error al ${errorAction} piso:`, error);
      NotificationService.error(error.message || `Error al ${errorAction} el piso`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        
        {/* Header mejorado */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main'
              }}
            >
              <EngineeringIcon fontSize="medium" />
            </Box>
            {/* Titulo y descripcion */}
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {isEditMode ? 'Editar Piso' : 'Registro de Pisos'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditMode 
                  ? `Editando piso ${editData?.piso?.numeroPiso || ''} del predio ${editData?.predio?.codigoPredio || ''}` 
                  : 'Registre y gestione los pisos de los predios en el sistema'}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Sección: Seleccionar predio */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <DomainIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Seleccionar predio
              </Typography>
            </Stack>
            
            <Stack spacing={2}>
              {/* Primera fila */}
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Box sx={{ flex: '0 0 150px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setShowSelectorPredios(true)}
                      startIcon={<SearchIcon />}
                      disabled={isEditMode}
                      sx={{ height: '35px', minHeight:'35px' }}
                    >
                      {isEditMode ? 'Predio seleccionado' : 'Seleccionar predio'}
                    </Button>
                    {errors.predio && (
                      <FormHelperText error>{errors.predio}</FormHelperText>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ flex: '0 0 100px' }}>
                  <TextField
                    fullWidth
                    label="Código de predio"
                    value={predio?.codPredio || predio?.codigoPredio || ''}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                  
                {predio &&( 
                  <Box sx={{ flex: '0 0 100px' }}>
                  <TextField
                    fullWidth
                    label="Área terreno"
                    value={predio.areaTerreno ? `${predio.areaTerreno.toFixed(2)} m²` : 'No disponible'}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Box>
                 )}
                 {predio &&( 
                  <Box sx={{ flex: '0 0 60px' }}>
                    <TextField
                      fullWidth
                      label="Año"
                      value={predio.anio || 'No disponible'}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Box>
                  )}
                  {predio &&( 
                  <Box sx={{ flex: '0 0 100px' }}>
                  <TextField
                    fullWidth
                    label="Conductor"
                    value={predio.conductor || (predio as any).conductor || 'Sin asignar'}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Box>
                 )}
                 {predio && predio.condicionPropiedad && (
                  <Box sx={{ flex: '0 0 150px' }}>
                    <TextField
                      fullWidth
                      label="Condición Propiedad"
                      value={predio.condicionPropiedad || 'Sin especificar'}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Box>
                 )}
                 {predio && predio.estadoPredio && (
                  <Box sx={{ flex: '0 0 120px' }}>
                    <TextField
                      fullWidth
                      label="Estado Predio"
                      value={predio.estadoPredio || 'Sin estado'}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Box>
                 )}
              </Box>
           
              {/* Segunda fila de información del predio */}
              {predio && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                 <Box sx={{ flex: '0 0 700px' }}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={predio?.direccion || ''}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
     
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Sección: Datos del piso */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <EngineeringIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Datos del piso
              </Typography>
            </Stack>
            
            <Stack spacing={3}>
              {/* Primera fila */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Selector Año */}
                <Box sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '0 0 120px' },
                  minWidth: { xs: '100%', md: '120px' }
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Año"
                    type="number"
                    value={formData.anio || ''}
                    onChange={(e) => handleInputChange('anio', parseInt(e.target.value) || null)}
                    InputProps={{
                      inputProps: { 
                        min: 1900, 
                        max: new Date().getFullYear() 
                      }
                    }}
                  />
                </Box>
                {/* N piso */}
                <Box sx={{ flex: '0 0 120px' }}>
                  <TextField
                    label="N° piso"
                    type="number"
                    value={formData.descripcion || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === undefined) {
                        handleInputChange('descripcion', '');
                      } else {
                        const numValue = parseInt(value);
                        handleInputChange('descripcion', numValue >= 0 ? value : '');
                      }
                    }}
                    fullWidth
                    size="small"
                    required
                    error={!!errors.descripcion}
                    helperText={errors.descripcion}
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        height: '33px' 
                      },
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none',
                        WebkitAppearance: 'none',
                        margin: 0
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      }
                    }}
                  />
                </Box>
                {/* Fecha de Construccion */} 
                <Box sx={{ flex: '0 0 180px', maxWidth:'170px' }}>
                  <DatePicker
                    label="Fecha construcción"
                    value={formData.fechaConstruccion}
                    onChange={(date) => handleInputChange('fechaConstruccion', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!errors.fechaConstruccion,
                        helperText: errors.fechaConstruccion,
                        sx: { 
                          '& .MuiInputBase-root': { 
                            height: '33px' 
                          }
                        }
                      }
                    }}
                  />
                </Box>
                {/* Antiguedad */}
                <Box sx={{ flex: '0 0 100px' }}>
                  <TextField
                    disabled
                    fullWidth
                    size="small"
                    label="Antigüedad"
                    value={formData.antiguedad}
                    InputProps={{ readOnly: true }}
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        height: '33px' 
                      }
                    }}
                  />
                </Box>
                {/* Estado Conservacion */} 
                <Box sx={{ flex: '0 0 180px' }}>
                  <Autocomplete
                    options={opcionesEstadoConservacion}
                    getOptionLabel={(option) => option?.label || ''}
                    value={opcionesEstadoConservacion.find(opt => opt.value === formData.estadoConservacion) || null}
                    onChange={(_, newValue) => handleInputChange('estadoConservacion', newValue?.value || '')}
                    disabled={loadingEstado}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Estado Conservación"
                        placeholder="Seleccione Estado"
                        required
                        error={!!errors.estadoConservacion}
                        helperText={errors.estadoConservacion}
                        sx={{ 
                          '& .MuiInputBase-root': { 
                            height: '33px' 
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingEstado ? <div>Loading...</div> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
                {/* Area Construccion */} 
                <Box sx={{ flex: '0 0 150px' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Área construida"
                    value={formData.areaConstruida || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === undefined) {
                        handleInputChange('areaConstruida', '');
                      } else {
                        const numValue = parseFloat(value);
                        handleInputChange('areaConstruida', numValue >= 0 ? value : '');
                      }
                    }}
                    error={!!errors.areaConstruida}
                    helperText={errors.areaConstruida}
                    InputProps={{
                      inputProps: { min: 0, step: 0.01 },
                      endAdornment: <InputAdornment position="end">m²</InputAdornment>
                    }}
                    type="number"
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        height: '33px' 
                      },
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none',
                        WebkitAppearance: 'none',
                        margin: 0
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      }
                    }}
                  />
                </Box>
                {/* Material Predominante */}
                <Box sx={{ flex: '0 0 180px' }}>
                  <Autocomplete
                    options={opcionesMaterialPredominante}
                    getOptionLabel={(option) => option?.label || ''}
                    value={opcionesMaterialPredominante.find(opt => String(opt.value) === String(formData.materialPredominante)) || null}
                    onChange={(_, newValue) => {
                      console.log('🔄 [RegistrosPisos] Material seleccionado:', newValue);
                      handleInputChange('materialPredominante', newValue?.value || '');
                    }}
                    isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                    disabled={loadingMaterial}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Material predominante"
                        placeholder="Seleccione"
                        required
                        error={!!errors.materialPredominante || !!errorMaterial}
                        helperText={errors.materialPredominante || errorMaterial}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '33px'
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingMaterial ? <div>Loading...</div> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              {/* vALOR UNITARIO */} 
                <Box sx={{ flex: '0 0 100px' }}>
                  <TextField
                    disabled
                    fullWidth
                    size="small"
                    label="Valor Unitario"
                    value={formData.otrasInstalaciones}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">S/</InputAdornment>
                    }}
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        height: '33px',
                        bgcolor: alpha(theme.palette.grey[100], 0.5)
                      }
                    }}
                    helperText=""
                  />
                </Box>
                
                {/* Áreas Comunes */}
                <Box sx={{ flex: '0 0 150px' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Áreas comunes"
                    type="number"
                    value={formData.areasComunes || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || Number(value) >= 0) {
                        handleInputChange('areasComunes', value);
                      }
                    }}
                    InputProps={{
                      inputProps: { min: 0, step: 0.01 },
                      endAdornment: <InputAdornment position="start">S/</InputAdornment>
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '33px'
                      },
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none',
                        WebkitAppearance: 'none',
                        margin: 0
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      }
                    }}
                  />
                </Box>

                {/* Área Total Construida - Solo visible en modo edición y bloqueado */}
                {isEditMode && (
                  <Box sx={{ flex: '0 0 170px' }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Área Total Construida"
                      type="number"
                      value={formData.areaTotalConstruccion || ''}
                      InputProps={{
                        readOnly: true,
                        endAdornment: <InputAdornment position="end">m²</InputAdornment>
                      }}
                      disabled
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '33px',
                          bgcolor: alpha(theme.palette.grey[100], 0.5)
                        }
                      }}
                    />
                  </Box>
                )}

              </Box>

              {/* Segunda fila */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              </Box>
            </Stack>

            {/* Sección de categorías de valores unitarios */}
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <CategoryIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Categorías de Valores Unitarios
                </Typography>
              </Stack>
              
              {/* Alertas de errores */}
              {(errorPadre || errorHijas || errorLetras || errorEstado) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Errores al cargar datos:
                    {errorPadre && <div>• Categorías Padre: {errorPadre}</div>}
                    {errorHijas && <div>• Categorías Hijas: {errorHijas}</div>}
                    {errorLetras && <div>• Letras: {errorLetras}</div>}
                    {errorEstado && <div>• Estado Conservación: {errorEstado}</div>}
                  </Typography>
                </Alert>
              )}
              
              {/* Estado de carga */}
              {(loadingPadre || loadingHijas || loadingLetras) && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Cargando datos del servidor...
                  {loadingPadre && ' Categorías Padre'}
                  {loadingHijas && ' Categorías Hijas'}
                  {loadingLetras && ' Letras'}
                </Alert>
              )}


              {/* Selectores de categorías */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2, alignItems: 'flex-start' }}>
                {/* Selector de categorías padre */}
                <Box sx={{ flex: '0 0 260px' }}>
                  <Autocomplete
                    options={opcionesPadre}
                    getOptionLabel={(option) => option?.label || ''}
                    value={categoriaPadre}
                    onChange={(_, newValue) => {
                      console.log('📝 [Autocomplete Padre] onChange recibido:', newValue);
                      setCategoriaPadre(newValue);
                    }}
                    disabled={loadingPadre}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categoría Padre"
                        placeholder="Seleccione..."
                        required
                        error={!!errorPadre}
                        helperText={errorPadre || `${opcionesPadre.length} opciones`}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '32px',
                            fontSize: '0.813rem'
                          },
                          '& .MuiFormLabel-root': {
                            fontSize: '0.813rem'
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.688rem',
                            marginTop: '2px'
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingPadre ? <div>Loading...</div> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
                {/* Selector de categorías hija */}
                <Box sx={{ flex: '0 0 260px' }}>
                  <Autocomplete
                    options={opcionesHijas}
                    getOptionLabel={(option) => option?.label || ''}
                    value={categoriaHija}
                    onChange={(_, newValue) => {
                      console.log('📝 [Autocomplete Hijo] onChange recibido:', newValue);
                      setCategoriaHija(newValue);
                    }}
                    disabled={!categoriaPadre || loadingHijas}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categoría Hija"
                        placeholder={categoriaPadre ? "Seleccione..." : "Primero padre"}
                        required
                        error={!!errorHijas}
                        helperText={
                          errorHijas || 
                          (!categoriaPadre ? 'Seleccione padre' : 
                            `${opcionesHijas.length} opciones`
                          )
                        }
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '32px',
                            fontSize: '0.813rem'
                          },
                          '& .MuiFormLabel-root': {
                            fontSize: '0.813rem'
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.688rem',
                            marginTop: '2px'
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingHijas ? <div>Loading...</div> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
                {/* Letra  de Categoria */}
                <Box sx={{ flex: '0 0 70px' }}>
                  <Autocomplete
                    options={opcionesLetras}
                    getOptionLabel={(option) => option?.label || ''}
                    value={letraSeleccionada}
                    onChange={(_, newValue) => {
                      console.log('📝 [Autocomplete Letra] onChange recibido:', newValue);
                      setLetraSeleccionada(newValue);
                    }}
                    disabled={!categoriaHija || loadingLetras}
                    size="small"
                    renderOption={(props, option) => {
                      const { key, ...otherProps } = props;
                      return (
                        <li key={key} {...otherProps} className={`${otherProps.className || ''} notranslate`} translate="no">
                          {option.label}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Letra"
                        placeholder="A-I"
                        required
                        error={!!errorLetras}
                        helperText={
                          errorLetras || 
                          (!categoriaHija ? 'Sel. hijo' : 
                            `${opcionesLetras.length} letras`
                          )
                        }
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '32px',
                            fontSize: '0.813rem'
                          },
                          '& .MuiFormLabel-root': {
                            fontSize: '0.813rem'
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.688rem',
                            marginTop: '2px'
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingLetras ? <div>Loading...</div> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        inputProps={{
                          ...params.inputProps,
                          className: `${params.inputProps.className || ''} notranslate`,
                          translate: 'no'
                        }}
                      />
                    )}
                  />
                </Box>
                
                <Box sx={{ 
                  flex: '0 0 auto', 
                  display: 'flex', 
                  alignItems: 'center',
                  marginTop: '0px'
                }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    {/* Botón para agregar categoría */}
                    <Button
                      variant="contained"
                      onClick={agregarCategoria}
                      startIcon={<AddIcon sx={{ fontSize: '0.875rem' }} />}
                      disabled={!categoriaPadre || !categoriaHija || !letraSeleccionada}
                      sx={{ 
                        height: '33px', 
                        minHeight: '32px',
                        maxHeight: '40px',
                        fontSize: '0.75rem',
                        px: 1.5,
                        lineHeight: 1,
                        bgcolor: '#3b82f6 !important', // Azul premium siempre visible
                        color: 'white !important',
                        '& .MuiButton-startIcon': {
                          marginRight: '4px'
                        },
                        '&.Mui-disabled': {
                          bgcolor: `${alpha('#3b82f6', 0.5)} !important`,
                          color: 'rgba(255, 255, 255, 0.7) !important'
                        }
                      }}
                      size="small"
                    >
                      Agregar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={limpiarCategorias}
                      color="warning"
                      sx={{ 
                        height: '33px', 
                        minHeight: '32px',
                        maxHeight: '33px',
                        fontSize: '0.75rem',
                        px: 1.5,
                        lineHeight: 1
                      }}
                      size="small"
                    >
                      Limpiar
                    </Button>
                  </Stack>
                </Box>
              </Box>
              
              {/* Lista de categorías seleccionadas */}
              {categoriasSeleccionadas.length > 0 && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Categorías seleccionadas ({categoriasSeleccionadas.length})
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>CATEGORIA</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>SUBCATEGORIA</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>LETRA</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>VALOR (S/)</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>ACCIONES</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categoriasSeleccionadas.map((categoria, index) => (
                          <TableRow key={categoria.id} hover>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Chip
                                label={categoria.padre.label}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={categoria.hijo.label}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={categoria.letra.label}
                                size="small"
                                color="success"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={categoria.valor.toFixed(2)}
                                size="small"
                                color={categoria.valor > 0 ? "success" : "warning"}
                                variant="filled"
                                sx={{ 
                                  fontWeight: 'bold',
                                  minWidth: '60px'
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="Ver detalles">
                                  <IconButton size="small" color="info">
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => eliminarCategoria(categoria.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Información de resumen */}
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2">
                        No se permite duplicar letras para la misma categoría hijo. 
                        Total de combinaciones: {categoriasSeleccionadas.length}
                        {predio && (
                          <Box component="span" sx={{ mx: 2, fontWeight: 'bold' }}>
                            | Predio: {predio.codigoPredio}
                          </Box>
                        )}
                      </Typography>
                      <Chip
                        label={`Suma total: S/ ${calcularSumaValores().toFixed(2)}`}
                        color="primary"
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Alert>
                </>
              )}
              
              {categoriasSeleccionadas.length === 0 && (
                <Alert severity="warning">
                  No hay categorías seleccionadas. Agregue al menos una combinación.
                </Alert>
              )}
            </Box>

            {/* Botones de Limpiar y Registrar */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setFormData({
                    descripcion: '',
                    fechaConstruccion: null,
                    antiguedad: '30 años',
                    estadoConservacion: '',
                    areaConstruida: '',
                    materialPredominante: '',
                    formaRegistro: FormaRegistro.INDIVIDUAL,
                    otrasInstalaciones: '0.00',
                    anio: new Date().getFullYear(),
                    areasComunes: '',
                    areaTotalConstruccion: ''
                  });
                  limpiarCategorias();
                  setPredio(null);
                  // Limpiar el estado de navegación para salir del modo edición y cambiar el título
                  navigate(location.pathname, { replace: true, state: null });
                }}
                disabled={loading}
              >
                Limpiar Formulario
              </Button>
              {/* Botón Registrar  */}
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading || !predio || categoriasSeleccionadas.length === 0}
                sx={{
                  bgcolor: '#10b981 !important', // Esmeralda premium siempre visible
                  color: 'white !important',
                  fontSize: '0.813rem',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  '&.Mui-disabled': {
                    bgcolor: `${alpha('#10b981', 0.5)} !important`,
                    color: 'rgba(255, 255, 255, 0.7) !important'
      }
                }}
              >
                {loading 
                  ? (isEditMode ? 'Actualizando...' : 'Registrando...') 
                  : (isEditMode ? 'Actualizar' : 'Registrar')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Modal de selección de predios */}
        <SelectorPredio
          isOpen={showSelectorPredios}
          onClose={() => setShowSelectorPredios(false)}
          onSelectPredio={(predioSeleccionado) => {
            // El predio ya tiene todas las propiedades necesarias del modelo
            setPredio(predioSeleccionado);
            console.log('📋 [RegistrosPisos] Predio seleccionado:', predioSeleccionado);
            // Sincronizar el año del formulario con el año del predio seleccionado
            if (predioSeleccionado.anio) {
              setFormData(prev => ({
                ...prev,
                anio: Number(predioSeleccionado.anio)
              }));
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default RegistrosPisos;
