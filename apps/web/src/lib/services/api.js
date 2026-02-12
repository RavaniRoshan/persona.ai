// API Service Layer for PersonaMirror
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(
      error.error || error.message || 'Request failed',
      response.status,
      error
    );
  }
  
  return response.json();
}

// Persona API
export const personaApi = {
  async extract(posts, llmConfig) {
    return fetchWithAuth('/api/personas/extract', {
      method: 'POST',
      body: JSON.stringify({ posts, llmConfig })
    });
  },
  
  async list() {
    return fetchWithAuth('/api/personas');
  },
  
  async get(id) {
    return fetchWithAuth(`/api/personas/${id}`);
  },
  
  async update(id, data) {
    return fetchWithAuth(`/api/personas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async delete(id) {
    return fetchWithAuth(`/api/personas/${id}`, {
      method: 'DELETE'
    });
  }
};

// Content API
export const contentApi = {
  async generate(data) {
    return fetchWithAuth('/api/content/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async validate(content, platform) {
    return fetchWithAuth('/api/content/validate', {
      method: 'POST',
      body: JSON.stringify({ content, platform })
    });
  }
};

// Queue API
export const queueApi = {
  async list(status = null) {
    const params = status ? `?status=${status}` : '';
    return fetchWithAuth(`/api/queue${params}`);
  },
  
  async get(id) {
    return fetchWithAuth(`/api/queue/${id}`);
  },
  
  async update(id, data) {
    return fetchWithAuth(`/api/queue/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async approve(id) {
    return fetchWithAuth(`/api/queue/${id}/approve`, {
      method: 'POST'
    });
  },
  
  async delete(id) {
    return fetchWithAuth(`/api/queue/${id}`, {
      method: 'DELETE'
    });
  },
  
  async stats() {
    return fetchWithAuth('/api/queue/stats/overview');
  }
};

// User/Settings API
export const userApi = {
  async getProfile() {
    return fetchWithAuth('/api/user/profile');
  },
  
  async updateProfile(data) {
    return fetchWithAuth('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async getSettings() {
    return fetchWithAuth('/api/user/settings');
  },
  
  async updateSettings(data) {
    return fetchWithAuth('/api/user/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async saveApiKey(provider, key) {
    return fetchWithAuth('/api/user/api-keys', {
      method: 'POST',
      body: JSON.stringify({ provider, key })
    });
  },
  
  async deleteApiKey(provider) {
    return fetchWithAuth(`/api/user/api-keys/${provider}`, {
      method: 'DELETE'
    });
  }
};

// Health check
export const healthApi = {
  async check() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
};

export { ApiError };
export default {
  persona: personaApi,
  content: contentApi,
  queue: queueApi,
  user: userApi,
  health: healthApi
};
