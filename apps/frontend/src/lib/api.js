import axios from "axios";

const API_BASE = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/**
 * Get the currently authenticated user.
 */
export async function fetchCurrentUser() {
  const res = await api.get("/me");
  return res.data;
}

/**
 * List all deployments for the current user.
 */
export async function fetchDeployments() {
  const res = await api.get("/deployments");
  return res.data;
}

/**
 * Get a single deployment by ID (includes logs).
 */
export async function fetchDeployment(id) {
  const res = await api.get(`/deployment/${id}`);
  return res.data;
}

/**
 * Get the status of a deployment.
 */
export async function fetchDeploymentStatus(projectId) {
  const res = await api.get(`/status/${projectId}`);
  return res.data;
}

/**
 * Deploy a repository.
 */
export async function deployRepo(repoUrl) {
  const res = await api.post("/deploy", { repoUrl });
  return res.data;
}

/**
 * Logout the current user.
 */
export async function logoutUser() {
  const res = await api.get("/logout");
  return res.data;
}

/**
 * Redirect to GitHub OAuth.
 */
export function redirectToGitHubAuth() {
  window.location.href = `${API_BASE}/auth/github`;
}

export default api;
