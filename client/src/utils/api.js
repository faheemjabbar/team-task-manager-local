// File: src/utils/api.js
const API_BASE = import.meta.env.VITE_API_URL;

const defaultOptions = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

async function handleResponse(res) {
  if (!res.ok) {
    let error = 'Something went wrong';
    try {
      const json = await res.json();
      error = json.error || error;
    } catch {}
    throw new Error(error);
  }
  return res.json();
}

function apiFetch(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;

  return fetch(`${base}/${cleanEndpoint}`, {
    ...defaultOptions,
    ...options,
  }).then(handleResponse);
}



// Auth
export const registerUser = (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const loginUser = (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const logoutUser = () => apiFetch('/auth/logout', { method: 'POST' });
export const fetchDashboardUser = () => apiFetch('/auth/dashboard');
export const getAllUsers = () => apiFetch('/auth/users');

// Tasks
export const getTasks = () => apiFetch('/tasks');
export const createTask = (data) => apiFetch('/tasks', { method: 'POST', body: JSON.stringify(data) });
export const updateTask = (id, data) => apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTask = (id) => apiFetch(`/tasks/${id}`, { method: 'DELETE' });

// Teams
export const getTeams = () => apiFetch('/teams');
export const createTeam = (data) => apiFetch('/teams', { method: 'POST', body: JSON.stringify(data) });
export const deleteTeam = (id) => apiFetch(`/teams/${id}`, { method: 'DELETE' });

// Memberships
export const getTeamMembers = (teamId) => apiFetch(`/memberships/${teamId}`);
export const addUserToTeam = (data) => apiFetch('/memberships', { method: 'POST', body: JSON.stringify(data) });
