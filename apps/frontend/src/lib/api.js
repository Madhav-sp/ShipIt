import axios from "axios";

// Local: VITE_API_URL=http://localhost:3000
// Production: falls back to Nginx proxy
const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/**
 * Get current user
 */
export async function fetchCurrentUser() {
  const { data } = await api.get("/me");
  return data;
}

/**
 * Get all deployments
 */
export async function fetchDeployments() {
  const { data } = await api.get("/deployments");

  if (!Array.isArray(data)) {
    console.error("Expected deployments array, got:", data);
    return [];
  }

  return data;
}

/**
 * Get deployment details
 */
export async function fetchDeployment(id) {
  const { data } = await api.get(`/deployment/${id}`);
  return data;
}

/**
 * Get deployment status
 */
export async function fetchDeploymentStatus(projectId) {
  const { data } = await api.get(`/status/${projectId}`);
  return data;
}

/**
 * Deploy repository
 */
export async function deployRepo(repoUrl) {
  const { data } = await api.post("/deploy", {
    repoUrl,
  });

  return data;
}

/**
 * Logout
 */
export async function logoutUser() {
  const { data } = await api.get("/logout");
  return data;
}

/**
 * GitHub OAuth
 */
export function redirectToGitHubAuth() {
  window.location.href = "/auth/github";
}

/**
 * Delete deployment
 */
export async function deleteDeployment(id) {
  const { data } = await api.delete(`/deployment/${id}`);
  return data;
}

export default api;