export const getAuthToken = () =>
  typeof window === "undefined"
    ? null
    : window.sessionStorage.getItem("auth_token");

export const getStoredAuthUser = () =>
  typeof window === "undefined"
    ? null
    : window.sessionStorage.getItem("auth_user");

export function getAuthenticatedUserCode() {
  if (typeof window === "undefined")
    throw new Error(
      "No se puede obtener el usuario autenticado fuera del navegador.",
    );
  const storedUser = getStoredAuthUser();
  if (!storedUser)
    throw new Error(
      "No hay un usuario autenticado para registrar la operación.",
    );
  try {
    const user = JSON.parse(storedUser) as {
      id?: string | number;
      codUsuario?: string | number;
    };
    const code = Number(user.codUsuario ?? user.id);
    if (!Number.isInteger(code) || code <= 0)
      throw new Error("El usuario autenticado no tiene un código válido.");
    return code;
  } catch (error) {
    if (error instanceof Error && error.message.includes("código válido"))
      throw error;
    throw new Error("No se pudo leer la identidad del usuario autenticado.");
  }
}

export function getApiHeaders(includeAuth = true): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token = includeAuth ? getAuthToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const requiresAuth = (_method: string) => true;
