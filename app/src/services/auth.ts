import { apiClient, setAuthToken, clearAuthToken } from '../config/api';
import { AuthResponse, RegisterData, LoginData } from '../types/auth';

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/signup',
        userData
      );

      if (response.data.access_token) {
        await setAuthToken(response.data.access_token);
        console.log('Registration successful, token stored');
      }

      return response.data;
    } catch (error: any) {
      console.error(
        'Registration error:',
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      );

      if (response.data.access_token) {
        await setAuthToken(response.data.access_token);
      } else {
        console.log('Login response missing access_token:', response.data);
      }

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await clearAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
      await clearAuthToken();
      throw error;
    }
  },
};
