import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cachedToken: string | null = null;

const getAuthToken = async (): Promise<string | null> => {
  try {
    if (cachedToken) {
      return cachedToken;
    }

    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      cachedToken = token;
    }

    return token;
  } catch (error) {
    return null;
  }
};

const setAuthToken = async (token: string): Promise<void> => {
  try {
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    await AsyncStorage.setItem('authToken', cleanToken);
    cachedToken = cleanToken;
  } catch (error) {
    throw error;
  }
};

const clearAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
    cachedToken = null;
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_ENDPOINT || 'http://localhost:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response?.status === 401) {
      await clearAuthToken();
    }
    return Promise.reject(error);
  }
);

export { setAuthToken, clearAuthToken, getAuthToken };

export default apiClient;
