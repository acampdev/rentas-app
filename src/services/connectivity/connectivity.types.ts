export interface ApiStatus {
  available: boolean;
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}

export interface ConnectivityConfig {
  checkInterval: number;
  timeout: number;
  retryAttempts: number;
}

export interface ConnectivityStatistics {
  online: boolean;
  totalApis: number;
  availableApis: number;
  averageResponseTime: number;
  lastCheck: Date;
}

export type ConnectivityListener = (
  isOnline: boolean,
  apiName?: string,
) => void;
