
const API_BASE = import.meta.env.VITE_API_BASE || '';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to parse error response first
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status} Error` };
        }

        // FIXED: Handle 401/403 differently for login vs authenticated routes
        if (response.status === 401 || response.status === 403) {
          // For login endpoint, preserve the backend error message
          if (endpoint === '/api/auth/login') {
            throw new Error(errorData.message || 'Login failed');
          }
          
          // For protected routes, handle session expiry
          localStorage.removeItem('userInfo');
          const logoutEvent = new CustomEvent('auth-error', { 
            detail: { message: 'Session expired, please login again' } 
          });
          window.dispatchEvent(logoutEvent);
          throw new Error(errorData.message || 'Authentication failed');
        }
        
        // For other status codes, use backend message
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
