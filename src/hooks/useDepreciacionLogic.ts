import { useState, useMemo } from 'react';
import { useTheme } from '@mui/material';
import { Depreciacion } from '../models/Depreciacion';
import { 
  useClasificacionPredio,
  useTipoNivelAntiguedad,
  useMaterialPredominante 
} from './useConstantesOptions';

interface EstadoConservacion {
  nombre: string;
  field: keyof Pick<Depreciacion, 'porcMuyBueno' | 'porcBueno' | 'porcRegular' | 'porcMalo'>;
  icon: string;
  color: string;
  value: number;
}

export const useDepreciacionLogic = (
  anioSeleccionado: number | null,
  tipoCasaSeleccionado: string | null,
  depreciaciones: Depreciacion[],
  onAnioChange: (anio: number | null) => void,
  onTipoCasaChange: (tipoCasa: string | null) => void,
  onRegistrar: (datos?: any) => void,
  onBuscar: () => void
) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [nivelAntiguedadSeleccionado, setNivelAntiguedadSeleccionado] = useState<string | null>(null);
  const [materialEstructuralSeleccionado, setMaterialEstructuralSeleccionado] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalCodDepreciacion, setOriginalCodDepreciacion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { options: tiposCasa } = useClasificacionPredio();
  const { options: nivelesAntiguedad } = useTipoNivelAntiguedad();
  const { options: materialesEstructurales } = useMaterialPredominante();

  const [estadosConservacion, setEstadosConservacion] = useState<EstadoConservacion[]>([
    { nombre: 'Muy bueno', field: 'porcMuyBueno', icon: 'check', color: theme.palette.success.main, value: 0 },
    { nombre: 'Bueno', field: 'porcBueno', icon: 'check', color: theme.palette.info.main, value: 0 },
    { nombre: 'Regular', field: 'porcRegular', icon: 'warning', color: theme.palette.warning.main, value: 0 },
    { nombre: 'Malo', field: 'porcMalo', icon: 'error', color: theme.palette.error.main, value: 0 }
  ]);

  const handleConservacionChange = (index: number, value: string) => {
    const nuevos = [...estadosConservacion];
    nuevos[index].value = parseFloat(value) || 0;
    setEstadosConservacion(nuevos);
  };

  const handleRegistrar = async () => {
    const anioStr = String(anioSeleccionado || '');
    const tipoCasaStr = String(tipoCasaSeleccionado || '');
    const nivelAntiguedadStr = String(nivelAntiguedadSeleccionado || '');
    const materialEstructuralStr = String(materialEstructuralSeleccionado || '');

    // Generar el código nuevo combinando los campos clave
    const nuevoCodDepreciacion = `${anioStr}${tipoCasaStr}${nivelAntiguedadStr}${materialEstructuralStr}`;

    const datos = {
      isEditMode,
      codDepreciacion: isEditMode ? nuevoCodDepreciacion : null,
      codDepreciacionAnterior: isEditMode ? originalCodDepreciacion : null,
      anio: anioStr,
      codTipoCasa: tipoCasaStr,
      codNivelAntiguedad: nivelAntiguedadStr,
      codMaterialEstructural: materialEstructuralStr,
      muyBueno: estadosConservacion.find(e => e.field === 'porcMuyBueno')?.value || 0,
      bueno: estadosConservacion.find(e => e.field === 'porcBueno')?.value || 0,
      regular: estadosConservacion.find(e => e.field === 'porcRegular')?.value || 0,
      malo: estadosConservacion.find(e => e.field === 'porcMalo')?.value || 0,
      nivelAntiguedad: null,
      materialEstructural: null
    };

    await onRegistrar(datos);
    
    // Limpiar todos los campos locales tras guardar
    setEstadosConservacion(prev => prev.map(e => ({ ...e, value: 0 })));
    setNivelAntiguedadSeleccionado(null);
    setMaterialEstructuralSeleccionado(null);
    setOriginalCodDepreciacion(null);
    setIsEditMode(false);
    setTabValue(0);
    setTimeout(() => { onBuscar(); setHasSearched(true); }, 100);
  };

  const handleEditarDepreciacion = (dep: Depreciacion) => {
    setOriginalCodDepreciacion(String(dep.id));
    onAnioChange(dep.anio);
    const tc = tiposCasa.find(t => t.label === dep.tipoCasa || t.value === dep.tipoCasa);
    if (tc) onTipoCasaChange(tc.value.toString());
    const na = nivelesAntiguedad.find(n => n.label === dep.antiguedad || n.value === dep.antiguedad);
    if (na) setNivelAntiguedadSeleccionado(na.value.toString());
    const me = materialesEstructurales.find(m => m.label === dep.material || m.value === dep.material);
    if (me) setMaterialEstructuralSeleccionado(me.value.toString());
    setEstadosConservacion(prev => prev.map(e => ({ ...e, value: (dep as any)[e.field] })));
    setIsEditMode(true);
    setTabValue(1);
  };

  const handleNuevo = () => {
    onAnioChange(null);
    onTipoCasaChange(null);
    setNivelAntiguedadSeleccionado(null);
    setMaterialEstructuralSeleccionado(null);
    setEstadosConservacion(prev => prev.map(e => ({ ...e, value: 0 })));
    setOriginalCodDepreciacion(null);
    setIsEditMode(false);
  };

  const filteredDepreciaciones = useMemo(() => {
    return depreciaciones.filter(dep => 
      dep.anio.toString().includes(searchTerm) ||
      dep.tipoCasa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.material.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [depreciaciones, searchTerm]);

  return {
    tabValue, setTabValue,
    nivelAntiguedadSeleccionado, setNivelAntiguedadSeleccionado,
    materialEstructuralSeleccionado, setMaterialEstructuralSeleccionado,
    isEditMode, searchTerm, setSearchTerm, hasSearched, setHasSearched,
    tiposCasa, nivelesAntiguedad, materialesEstructurales,
    estadosConservacion, handleConservacionChange,
    handleRegistrar, handleEditarDepreciacion,
    handleNuevo,
    filteredDepreciaciones,
    loading: false
  };
};
