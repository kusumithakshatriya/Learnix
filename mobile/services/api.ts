/**
 * Learnix API Client (Placeholder)
 *
 * NOTE: Phase 1 Foundation only.
 * This client defines the contract and interfaces for future backend integration.
 * It uses a configured base URL and provides mock async operations
 * without connecting to a real backend yet.
 */

// Placeholder base URL from environment or fallback
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://api.learnix.example.com/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, string[]>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Generic placeholder request method
   */
  public async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    // Simulated mock network delay (Phase 1)
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      data: undefined as unknown as T,
      message: `Placeholder request to ${endpoint} succeeded (mock)`,
      statusCode: 200,
    };
  }

  /**
   * Auth API placeholders
   */
  public auth = {
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!credentials.email || !credentials.password) {
        throw {
          message: 'Please provide both email and password.',
          statusCode: 400,
        } as ApiError;
      }

      // Simulated successful mock response
      return {
        success: true,
        data: {
          user: {
            id: 'mock-user-1',
            name: credentials.email.split('@')[0] || 'Student',
            email: credentials.email,
          },
          token: 'mock-jwt-token-learnix-phase1',
        },
        message: 'Login successful (mock)',
        statusCode: 200,
      };
    },

    signup: async (credentials: SignupCredentials): Promise<ApiResponse<AuthResponse>> => {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (!credentials.name || !credentials.email || !credentials.password) {
        throw {
          message: 'All fields are required.',
          statusCode: 400,
        } as ApiError;
      }

      // Simulated successful mock response
      return {
        success: true,
        data: {
          user: {
            id: 'mock-user-new',
            name: credentials.name,
            email: credentials.email,
          },
          token: 'mock-jwt-token-learnix-phase1',
        },
        message: 'Signup successful (mock)',
        statusCode: 201,
      };
    },

    logout: async (): Promise<ApiResponse<void>> => {
      this.token = null;
      return {
        success: true,
        message: 'Logged out successfully (mock)',
        statusCode: 200,
      };
    },
  };

  /**
   * Shorthand methods
   */
  public get = <T>(endpoint: string) => this.request<T>(endpoint, { method: 'GET' });
  public post = <T>(endpoint: string, body: any) =>
    this.request<T>(endpoint, { method: 'POST', body });
  public put = <T>(endpoint: string, body: any) =>
    this.request<T>(endpoint, { method: 'PUT', body });
  public delete = <T>(endpoint: string) =>
    this.request<T>(endpoint, { method: 'DELETE' });
}

export const api = new ApiClient(API_BASE_URL);
export default api;
