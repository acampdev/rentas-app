import type { OptionFormat } from "../../../hooks/useConstantesOptions";
import type { ParquesJardinesData } from "../../../services/parquesJardinesService";
import type { ParquesMatrix } from "./parquesJardines.types";

const fallbackOptions = (
  values: Array<string | null | undefined>,
): OptionFormat[] =>
  Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  ).map((label, index) => ({ value: index + 1, label, id: index + 1 }));

export function buildParquesMatrix(
  data: ParquesJardinesData[],
  routeOptions: OptionFormat[],
  locationOptions: OptionFormat[],
): ParquesMatrix {
  const routes = routeOptions.length
    ? routeOptions
    : fallbackOptions(data.map(({ nombreRuta }) => nombreRuta));
  const locations = locationOptions.length
    ? locationOptions
    : fallbackOptions(data.map(({ ubicacionAreaVerde }) => ubicacionAreaVerde));
  const rows = locations.map((location) => ({
    ubicacionLabel: location.label,
    codUbicacion: location.value,
    rates: Object.fromEntries(
      routes.map((route) => {
        const item = data.find((record) => {
          const locationMatches = record.codUbicacion
            ? String(record.codUbicacion) === String(location.value)
            : record.ubicacionAreaVerde?.toUpperCase() ===
              location.label.toUpperCase();
          const routeMatches = record.codRuta
            ? String(record.codRuta) === String(route.value)
            : record.nombreRuta?.toUpperCase() === route.label.toUpperCase();
          return locationMatches && routeMatches;
        });
        return [String(route.value), item?.tasaMensual ?? null];
      }),
    ),
  }));
  return { rows, routes, locations };
}
