export const validateProductionBrowserApiUrl = (mode: string, apiUrl: string): void => {
  if (mode === 'production' && /^http:\/\//i.test(apiUrl)) {
    throw new Error(
      'VITE_API_URL no puede usar HTTP en producción. Configure una API HTTPS ' +
      'o deje la variable vacía para usar un proxy inverso del mismo origen.'
    )
  }
}
