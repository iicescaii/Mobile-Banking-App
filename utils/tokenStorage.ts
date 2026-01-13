// app/components/utils/tokenStorage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'zenbank_token';
const TOKEN_PRESENT_KEY = 'has_token';

// Save token
export const saveToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_PRESENT_KEY, 'true');
      console.log('Token saved to web storage');
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      console.log('Token saved to secure storage');
    }
  } catch (error) {
    console.error('Error saving token:', error);
    throw new Error('Failed to save authentication token');
  }
};

// Get token
export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      const hasToken = localStorage.getItem(TOKEN_PRESENT_KEY);
      if (!hasToken) {
        console.log('No token present in web storage');
        return null;
      }
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('Token retrieved from web storage:', token ? 'exists' : 'not found');
      return token;
    } else {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log('Token retrieved from secure storage:', token ? 'exists' : 'not found');
      return token;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Delete token
export const deleteToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_PRESENT_KEY);
      console.log('Token removed from web storage');
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      console.log('Token removed from secure storage');
    }
  } catch (error) {
    console.error('Error deleting token:', error);
    throw new Error('Failed to delete authentication token');
  }
};

// Check if token exists
export const hasToken = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_PRESENT_KEY) === 'true';
    } else {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return token !== null;
    }
  } catch (error) {
    console.error('Error checking token existence:', error);
    return false;
  }
};