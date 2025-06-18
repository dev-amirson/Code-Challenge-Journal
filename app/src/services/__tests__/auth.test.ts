import { authService } from '../auth';
import { apiClient, setAuthToken, clearAuthToken } from '../../config/api';
import { AuthResponse, RegisterData, LoginData } from '../../types/auth';

// Mock the API client and storage functions
jest.mock('../../config/api', () => ({
  apiClient: {
    post: jest.fn(),
  },
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockUserData: RegisterData = {
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    };

    const mockResponse: AuthResponse = {
      access_token: 'mock-token',
      user: {
        id: '1',
        email: 'test@example.com',
        displayName: 'Test User',
      },
    };

    it('should register a user successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.register(mockUserData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/signup', mockUserData);
      expect(setAuthToken).toHaveBeenCalledWith('mock-token');
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration error', async () => {
      const errorMessage = 'Email already exists';
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(authService.register(mockUserData)).rejects.toThrow(errorMessage);
      expect(setAuthToken).not.toHaveBeenCalled();
    });

    it('should handle network error during registration', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.register(mockUserData)).rejects.toThrow('Registration failed');
      expect(setAuthToken).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockCredentials: LoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockResponse: AuthResponse = {
      access_token: 'mock-token',
      user: {
        id: '1',
        email: 'test@example.com',
        displayName: 'Test User',
      },
    };

    it('should login user successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.login(mockCredentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(setAuthToken).toHaveBeenCalledWith('mock-token');
      expect(result).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(authService.login(mockCredentials)).rejects.toThrow(errorMessage);
      expect(setAuthToken).not.toHaveBeenCalled();
    });

    it('should handle network error during login', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.login(mockCredentials)).rejects.toThrow('Login failed');
      expect(setAuthToken).not.toHaveBeenCalled();
    });

    it('should handle missing access token in response', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: { ...mockResponse, access_token: undefined },
      });

      const result = await authService.login(mockCredentials);
      expect(setAuthToken).not.toHaveBeenCalled();
      expect(result).toEqual({ ...mockResponse, access_token: undefined });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({});

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout/');
      expect(clearAuthToken).toHaveBeenCalled();
    });

    it('should clear token even if logout API call fails', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.logout()).rejects.toThrow('Network error');
      expect(clearAuthToken).toHaveBeenCalled();
    });
  });
}); 