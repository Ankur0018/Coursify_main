const BASE = (import.meta.env.VITE_API_URL ?? "") + "/api/v1";

const api = {
  async request(method, path, data) {
    const res = await fetch(BASE + path, {
      method,
      credentials: "include",
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json };
  },
  get: (path) => api.request("GET", path),
  post: (path, data) => api.request("POST", path, data),
  put: (path, data) => api.request("PUT", path, data),
  del: (path) => api.request("DELETE", path),
};

export default api;
