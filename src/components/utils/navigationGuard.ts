import { logger } from '../../utils/logger';
// src/utils/navigationGuard.ts
// Sistema simple para manejar cambios sin guardar en formularios

import { useEffect } from 'react';

interface NavigationGuardState {
  hasUnsavedChanges: boolean;
  formId?: string;
}

// Estado global para manejar cambios sin guardar
const navigationState: NavigationGuardState = {
  hasUnsavedChanges: false,
  formId: undefined
};

// Funciones para manejar el estado
export const navigationGuard = {
  /**
   * Establece si hay cambios sin guardar
   */
  setUnsavedChanges: (hasChanges: boolean, formId?: string) => {
    navigationState.hasUnsavedChanges = hasChanges;
    navigationState.formId = formId;
    
    // Debug en desarrollo
    if (process.env.NODE_ENV === 'development') {
      logger.log('🔄 Navigation Guard State:', {
        hasChanges, 
        formId,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Verifica si hay cambios sin guardar
   */
  hasUnsavedChanges: (): boolean => {
    return navigationState.hasUnsavedChanges;
  },

  /**
   * Obtiene el ID del formulario con cambios
   */
  getFormId: (): string | undefined => {
    return navigationState.formId;
  },

  /**
   * Limpia el estado de cambios sin guardar
   */
  clearUnsavedChanges: () => {
    navigationState.hasUnsavedChanges = false;
    navigationState.formId = undefined;
    
    if (process.env.NODE_ENV === 'development') {
      logger.log('✅ Navigation Guard: Estado limpiado');
    }
  },

  /**
   * Muestra confirmación si hay cambios sin guardar
   * @returns true si se puede navegar, false si el usuario canceló
   */
  confirmNavigation: (message?: string): boolean => {
    if (!navigationState.hasUnsavedChanges) {
      return true;
    }

    const defaultMessage = '¿Estás seguro de que quieres abandonar esta página? Los cambios sin guardar se perderán.';
    const confirmMessage = message || defaultMessage;
    
    const confirmed = window.confirm(confirmMessage);
    
    if (process.env.NODE_ENV === 'development') {
      logger.log(`❓ Navigation Guard: Confirmación ${confirmed ? 'aceptada' : 'cancelada'}`);
    }
    
    return confirmed;
  },

  /**
   * Obtiene el estado completo para debugging
   */
  getState: (): NavigationGuardState => {
    return { ...navigationState };
  }
};

/**
 * Hook para usar en formularios
 * Actualiza automáticamente el estado cuando cambia isDirty
 */
export const useNavigationGuard = (formId: string, isDirty: boolean) => {
  useEffect(() => {
    navigationGuard.setUnsavedChanges(isDirty, formId);

    // Limpiar al desmontar el componente
    return () => {
      if (navigationState.formId === formId) {
        navigationGuard.clearUnsavedChanges();
      }
    };
  }, [isDirty, formId]);

  return {
    markSaved: () => navigationGuard.clearUnsavedChanges(),
    hasUnsavedChanges: navigationGuard.hasUnsavedChanges(),
    confirmNavigation: navigationGuard.confirmNavigation
  };
};

// Agregar evento beforeunload para advertir al cerrar la pestaña
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', (e) => {
    if (navigationGuard.hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = ''; // Chrome requiere que returnValue se establezca
      return '¿Estás seguro de que quieres salir? Los cambios sin guardar se perderán.';
    }
  });
}

// Exportar también como default para facilitar la importación
export default navigationGuard;
