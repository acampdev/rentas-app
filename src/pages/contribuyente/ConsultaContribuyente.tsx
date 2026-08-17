// src/pages/contribuyente/ConsultaContribuyente.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box,
  Typography
} from '@mui/material';
import { MainLayout } from '../../layout';
import Breadcrumb from '../../components/utils/Breadcrumb';
import ContribuyenteConsulta from '../../components/contribuyentes/ContribuyenteConsulta';
import { BreadcrumbItem } from '../../components/utils/Breadcrumb';
import { useContribuyentes } from '../../hooks/useContribuyentes';

/**
 * Página para consultar y listar contribuyentes con diseño compacto
 */
const ConsultaContribuyente: React.FC = () => {
  const _theme = useTheme();
  const navigate = useNavigate();
  
  // Hook personalizado para manejar contribuyentes
  // El hook ya carga los contribuyentes automáticamente en su useEffect
  const { 
    contribuyentes,
    loading,
    error,
    buscarContribuyentes
  } = useContribuyentes();

  // Migas de pan para la navegación
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Módulo', path: '/' },
    { label: 'Contribuyente', path: '/contribuyente' },
    { label: 'Consulta contribuyente', active: true }
  ];

  // Manejar la búsqueda de contribuyentes con nueva API general
  const handleBuscar = (filtro: any) => {
    console.log('🔍 Buscando con filtros usando API general:', filtro);

    // El componente de consulta ya construye los parámetros esperados por
    // /api/contribuyente/general. No los reduzcas a un campo inexistente
    // (`busqueda`), porque eso vacía todos los filtros antes de la llamada.
    buscarContribuyentes(filtro);
  };

  // Manejar la navegación a nuevo contribuyente
  const handleNuevo = () => {
    navigate('/contribuyente/nuevo');
  };

  // Manejar la edición de un contribuyente
  const handleEditar = (codigo: string | number) => {
    console.log('Editar contribuyente:', codigo);
    navigate(`/contribuyente/editar/${codigo}`);
  };

  return (
    <MainLayout title="Consulta de Contribuyentes">
      <Box sx={{ p: 3 }}>
        {/* Navegación de migas de pan */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumb items={breadcrumbItems} />
        </Box>

        {/* Contenedor principal centrado */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            {/* Componente consolidado que incluye filtros y lista */}
            <ContribuyenteConsulta
              contribuyentes={contribuyentes}
              onBuscar={handleBuscar}
              onNuevo={handleNuevo}
              onEditar={handleEditar}
              loading={loading}
            />

            {/* Mostrar error si existe */}
            {error && (
              <Box sx={{ p: 2, textAlign: 'center', mt: 2 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}
          </Box>
        </Box>

      </Box>
    </MainLayout>
  );
};

export default ConsultaContribuyente;
