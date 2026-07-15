/**
 * src/utils/api.ts
 *
 * Central fetch wrapper for the DOST NorMin backend API (http://localhost:4000).
 *
 * All authenticated requests automatically attach:
 *   Authorization: Bearer <token>
 * where the token is stored in localStorage under the key "api_token".
 *
 * Usage:
 *   import { api } from "./api";
 *   const { token, user } = await api.login("admin", "YourPassword123!");
 *   const { datasets }    = await api.getDatasets();
 */

export const API_BASE = "http://localhost:4000";
const TOKEN_KEY = "api_token";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/** Maps the backend role_name ("admin" | "viewer") to the frontend role shape */
function mapRole(role_name: string): "admin" | "user" {
  return role_name === "admin" ? "admin" : "user";
}

export interface ApiUser {
  id: number;
  username: string;
  email: string | null;
  full_name: string;
  department: string | null;
  system_access: string[];
  role_id: number;
  role_name: string;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

/**
 * POST /auth/login
 * Accepts username OR email as the identifier field.
 */
export async function login(
  identifier: string,
  password: string,
): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

/**
 * GET /auth/me
 * Returns the currently authenticated user from the JWT.
 */
export async function me(): Promise<{ user: ApiUser }> {
  return request<{ user: ApiUser }>("/auth/me");
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export interface ApiUserRecord {
  id: number;
  username: string;
  email: string | null;
  full_name: string;
  department: string | null;
  system_access: string[];
  status: string;
  role_id: number;
  role_name: string;
  created_at: string;
}

/** GET /users — admin only */
export async function getUsers(): Promise<{ users: ApiUserRecord[] }> {
  return request("/users");
}

/** GET /roles */
export async function getRoles(): Promise<{ roles: { id: number; name: string }[] }> {
  return request("/roles");
}

/** POST /users — admin only */
export async function createUser(data: {
  username: string;
  email?: string;
  password: string;
  full_name?: string;
  role_id: number;
  department?: string;
  system_access?: string[];
}): Promise<{ id: number }> {
  return request("/users", { method: "POST", body: JSON.stringify(data) });
}

/** PUT /users/:id — admin only */
export async function updateUserApi(
  id: number,
  data: Partial<{
    full_name: string;
    email: string;
    role_id: number;
    department: string;
    system_access: string[];
    status: string;
    password: string;
  }>,
): Promise<{ success: boolean }> {
  return request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

// ---------------------------------------------------------------------------
// Datasets (Project Database top-level records)
// ---------------------------------------------------------------------------

export interface ApiDataset {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  department: string | null;
  sector_category: string | null;
  budget: number | null;
  status: string | null;
  last_accessed: string | null;
  record_count: number;
  created_at: string;
  updated_at: string;
  created_by_username: string;
}

/** GET /datasets */
export async function getDatasets(): Promise<{ datasets: ApiDataset[] }> {
  return request("/datasets");
}

/** POST /datasets */
export async function createDataset(data: {
  name: string;
  description?: string;
  department?: string;
  sector_category?: string;
  budget?: number;
  status?: string;
}): Promise<{ id: number; slug: string }> {
  return request("/datasets", { method: "POST", body: JSON.stringify(data) });
}

/** PUT /datasets/:id */
export async function updateDataset(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    department: string;
    sector_category: string;
    budget: number;
    status: string;
  }>,
): Promise<{ success: boolean }> {
  return request(`/datasets/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

/** DELETE /datasets/:id */
export async function deleteDataset(id: number): Promise<{ success: boolean }> {
  return request(`/datasets/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Dataset Records (Detailed database view entries)
// ---------------------------------------------------------------------------

export interface ApiRecord {
  id: number;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** GET /datasets/:datasetId/records?search=&page=&limit= */
export async function getRecords(
  datasetId: number,
  params: { search?: string; page?: number; limit?: number } = {},
): Promise<{ records: ApiRecord[]; pagination: { page: number; limit: number; total: number } }> {
  const query = new URLSearchParams();
  if (params.search)                query.set("search", params.search);
  if (params.page   != null)        query.set("page",   String(params.page));
  if (params.limit  != null)        query.set("limit",  String(params.limit));
  return request(`/datasets/${datasetId}/records?${query}`);
}

/** POST /datasets/:datasetId/records */
export async function createRecord(
  datasetId: number,
  data: Record<string, unknown>,
): Promise<{ id: number }> {
  return request(`/datasets/${datasetId}/records`, {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

/** PUT /records/:id */
export async function updateRecord(
  id: number,
  data: Record<string, unknown>,
): Promise<{ success: boolean }> {
  return request(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

/** DELETE /records/:id */
export async function deleteRecord(id: number): Promise<{ success: boolean }> {
  return request(`/records/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

export interface ApiFile {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  department: string | null;
  sector_category: string | null;
  uploaded_at: string;
  dataset_id: number | null;
  uploaded_by_username: string;
}

/** GET /files?search= */
export async function getFiles(search?: string): Promise<{ files: ApiFile[] }> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`/files${q}`);
}

/**
 * POST /files — multipart upload.
 * Attaches department and sector_category as form fields alongside the binary file.
 */
export async function uploadFile(
  file: File,
  opts: { department?: string; sector_category?: string; dataset_id?: number } = {},
): Promise<{ id: number; filename: string }> {
  const form = new FormData();
  form.append("file", file);
  if (opts.department)      form.append("department",      opts.department);
  if (opts.sector_category) form.append("sector_category", opts.sector_category);
  if (opts.dataset_id)      form.append("dataset_id",      String(opts.dataset_id));
  return request("/files", { method: "POST", body: form });
}

/** GET /files/:id/download — returns a Blob for browser download */
export async function downloadFile(
  fileId: number,
  originalName: string,
): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/files/${fileId}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = originalName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** DELETE /files/:id */
export async function deleteFile(id: number): Promise<{ success: boolean }> {
  return request(`/files/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export interface DashboardSummary {
  totals: {
    datasets: number;
    records: number;
    files: number;
    active_users: number;
  };
  recent_activity: {
    id: number;
    action: string;
    entity_type: string;
    entity_id: number;
    created_at: string;
    username: string;
  }[];
  last_updated: string;
}

/** GET /dashboard */
export async function getDashboard(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/dashboard");
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

export interface AuditLogEntry {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  details: Record<string, unknown> | null;
  created_at: string;
  username: string;
}

/** GET /audit-logs */
export async function getAuditLogs(params: {
  user_id?: number;
  entity_type?: string;
  action?: string;
} = {}): Promise<{ logs: AuditLogEntry[] }> {
  const q = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null) as [string, string][]
  ).toString();
  return request(`/audit-logs${q ? `?${q}` : ""}`);
}

// ---------------------------------------------------------------------------
// Named export object for convenience
// ---------------------------------------------------------------------------
export const api = {
  login,
  me,
  saveToken,
  clearToken,
  getUsers,
  getRoles,
  createUser,
  updateUserApi,
  getDatasets,
  createDataset,
  updateDataset,
  deleteDataset,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getFiles,
  uploadFile,
  downloadFile,
  deleteFile,
  getDashboard,
  getAuditLogs,
  mapRole,
};
