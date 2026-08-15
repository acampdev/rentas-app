import { useEffect, useRef } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { NotificationService } from '../utils/Notification';

const TOKEN_CHECK_INTERVAL_MS = 60 * 1000;
const RENEWAL_THRESHOLD_MINUTES = 2;

/**
 * Monitor único de la sesión. Las notificaciones se muestran mediante el
 * contenedor global; este componente no renderiza un segundo sistema visual.
 */
const AuthHandler: React.FC = () => {
  const { isAuthenticated, renewToken, logout } = useAuthContext();
  const renewalInProgress = useRef(false);
  const renewalWarningShown = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      renewalWarningShown.current = false;
      return;
    }

    const checkTokenValidity = async () => {
      if (authService.isTokenExpired()) {
        NotificationService.error('Su sesión ha expirado. Inicie sesión nuevamente.');
        void logout();
        return;
      }

      const remainingMinutes = authService.getTokenRemainingTime();
      if (
        !authService.needsTokenRenewal() ||
        remainingMinutes > RENEWAL_THRESHOLD_MINUTES ||
        renewalInProgress.current
      ) {
        return;
      }

      renewalInProgress.current = true;
      const renewed = await renewToken();
      renewalInProgress.current = false;

      if (renewed) {
        renewalWarningShown.current = false;
        NotificationService.info('La sesión se renovó automáticamente.');
      } else if (!renewalWarningShown.current) {
        renewalWarningShown.current = true;
        NotificationService.warning('La sesión expirará pronto. Guarde su trabajo.');
      }
    };

    void checkTokenValidity();
    const interval = window.setInterval(checkTokenValidity, TOKEN_CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [isAuthenticated, logout, renewToken]);

  return null;
};

export default AuthHandler;
