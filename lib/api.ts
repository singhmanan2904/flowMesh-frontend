const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export function apiUrl(path: string) {
  return `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export const AUTH_LOGIN_URL = apiUrl("auth/login");
export const AUTH_REGISTER_URL = apiUrl("auth/register");
export const AUTH_LOGOUT_URL = apiUrl("auth/logout");
