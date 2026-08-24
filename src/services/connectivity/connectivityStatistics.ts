import type { ApiStatus, ConnectivityStatistics } from "./connectivity.types";

export function calculateConnectivityStatistics(
  online: boolean,
  apiStatus: Map<string, ApiStatus>,
): ConnectivityStatistics {
  const statuses = Array.from(apiStatus.values());
  const responseTimes = statuses.flatMap(({ responseTime }) =>
    responseTime === undefined ? [] : [responseTime],
  );
  const lastCheckTime = statuses.reduce(
    (latest, status) => Math.max(latest, status.lastCheck.getTime()),
    0,
  );

  return {
    online,
    totalApis: apiStatus.size,
    availableApis: statuses.filter(({ available }) => available).length,
    averageResponseTime: responseTimes.length
      ? Math.round(
          responseTimes.reduce((total, value) => total + value, 0) /
            responseTimes.length,
        )
      : 0,
    lastCheck: lastCheckTime ? new Date(lastCheckTime) : new Date(),
  };
}
