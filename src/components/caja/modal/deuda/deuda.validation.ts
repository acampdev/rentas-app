export const mapTributoNameToCode = (name: string): number => {
  const normalized = name.toLocaleLowerCase('es');
  if (normalized.includes('predial')) return 1;
  if (normalized.includes('limpieza')) return 2;
  if (normalized.includes('serenazgo')) return 3;
  if (normalized.includes('parques') || normalized.includes('jardines')) return 4;
  return 1;
};

export const parsePositiveAmount = (value: string): number | null => {
  const amount = Number(value.replace('S/.', '').trim());
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};
