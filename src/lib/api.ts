export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

const TOKEN_KEY = "portfolio-admin-token";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage may be disabled; there is nothing to clear.
  }
}

export function assetUrl(path: string | null | undefined) {
  return path ? `${API_URL}${path}` : null;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers();
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (options.auth && response.status === 401) {
      clearToken();
      window.location.href = "/admin/login";
    }
    throw new ApiError(response.status, data?.message ?? "Une erreur est survenue");
  }

  return data as T;
}
