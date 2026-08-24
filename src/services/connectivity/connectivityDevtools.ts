import { logger } from "../../utils/logger";
import type { ConnectivityStatistics } from "./connectivity.types";

interface ConnectivityControls {
  resumeMonitoring(): void;
  stopMonitoring(): void;
  checkAllApis(): Promise<unknown>;
  getStatistics(): ConnectivityStatistics;
  setHealthCheckEndpoints(endpoints: string[]): void;
}

declare global {
  interface Window {
    connectivity?: {
      start: () => void;
      stop: () => void;
      check: () => Promise<unknown>;
      status: () => ConnectivityStatistics;
      setEndpoints: (endpoints: string[]) => void;
    };
  }
}

export function exposeConnectivityDevtools(
  service: ConnectivityControls,
): void {
  if (!import.meta.env.DEV) return;

  window.connectivity = {
    start: () => service.resumeMonitoring(),
    stop: () => service.stopMonitoring(),
    check: () => service.checkAllApis(),
    status: () => {
      const statistics = service.getStatistics();
      logger.table(statistics);
      return statistics;
    },
    setEndpoints: (endpoints) => service.setHealthCheckEndpoints(endpoints),
  };
  logger.log("🎮 Controles: connectivity.start/stop/check/status/setEndpoints");
}
