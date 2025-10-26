// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiUrl = (endpoint: string) => {
  // If we have a custom API URL, use it, otherwise construct from base
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/${endpoint}`;
  }
  return `${API_BASE_URL}/${endpoint}`;
};

export default apiUrl;
