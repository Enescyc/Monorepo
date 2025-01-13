const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const API_ROUTES = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    refreshToken: `${API_BASE_URL}/auth/refresh-token`,
  },
} as const; 