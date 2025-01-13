import { sessionManager } from './session';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  rateLimit?: RateLimitConfig;
}

class ApiClient {
  private static instance: ApiClient;
  private rateLimiters: Map<string, { requests: number[]; config: RateLimitConfig }> = new Map();

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private checkRateLimit(endpoint: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    let limiter = this.rateLimiters.get(endpoint);

    if (!limiter) {
      limiter = {
        requests: [],
        config,
      };
      this.rateLimiters.set(endpoint, limiter);
    }

    // Remove old requests outside the window
    limiter.requests = limiter.requests.filter(
      time => now - time < config.windowMs
    );

    if (limiter.requests.length >= config.maxRequests) {
      return false;
    }

    limiter.requests.push(now);
    return true;
  }

  private async handleResponse(response: Response): Promise<any> {
    if (response.ok) {
      return response.json();
    }

    if (response.status === 401) {
      try {
        // Try to refresh the token
        const newToken = await sessionManager.refreshAccessToken();
        if (newToken) {
          // Retry the original request with the new token
          const newResponse = await fetch(response.url, {
            ...response,
            headers: {
              ...response.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
          return this.handleResponse(newResponse);
        }
      } catch (error) {
        sessionManager.clearSession();
        throw new Error('Session expired. Please login again.');
      }
    }

    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  async fetch(url: string, options: RequestOptions = {}): Promise<any> {
    const {
      skipAuth = false,
      rateLimit = { maxRequests: 100, windowMs: 60000 }, // Default: 100 requests per minute
      ...fetchOptions
    } = options;

    // Check rate limit
    if (!this.checkRateLimit(url, rateLimit)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Add authorization header if needed
    if (!skipAuth) {
      const token = sessionManager.getAccessToken();
      if (token) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    // Add default headers
    fetchOptions.headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    try {
      const response = await fetch(url, fetchOptions);
      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Convenience methods
  async get(url: string, options?: RequestOptions) {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  async post(url: string, data?: any, options?: RequestOptions) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(url: string, data?: any, options?: RequestOptions) {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(url: string, options?: RequestOptions) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance(); 