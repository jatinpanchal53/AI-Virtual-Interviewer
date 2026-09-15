const API_BASE = '/api';

/**
 * Universal API request wrapper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('interview_ai_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const json = await response.json();

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.code = json.error?.code || 'API_ERROR';
    err.status = response.status;
    throw err;
  }

  return json.data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getMe: () => request('/auth/me'),

  // Roles
  getRoles: () => request('/roles'),

  // GitHub
  analyzeRepo: (repoUrl) => request('/github/analyze', { method: 'POST', body: { repoUrl } }),

  // Interviews
  createInterview: (payload) => request('/interviews', { method: 'POST', body: payload }),
  getUserInterviews: () => request('/interviews'),
  getInterviewById: (id) => request(`/interviews/${id}`),
  startInterview: (id) => request(`/interviews/${id}/start`, { method: 'POST' }),
  getCurrentQuestion: (id) => request(`/interviews/${id}/current-question`),
  submitAnswer: (id, payload) => request(`/interviews/${id}/answers`, { method: 'POST', body: payload }),
  getResults: (id) => request(`/interviews/${id}/results`)
};
