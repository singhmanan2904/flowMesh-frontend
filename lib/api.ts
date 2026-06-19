const API_BASE = "/api/proxy";

export function apiUrl(path: string) {
  return `${API_BASE}/${path.replace(/^\//, "")}`;
}

export const AUTH_LOGIN_URL = "/api/auth/login";
export const AUTH_REGISTER_URL = "/api/auth/register";
export const AUTH_LOGOUT_URL = "/api/auth/logout";
