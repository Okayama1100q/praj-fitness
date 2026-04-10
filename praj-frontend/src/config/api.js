import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://praj-fitness.onrender.com";

console.log("Centralized API Configuration Initialized:", API_BASE_URL);

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 40000 // 40 seconds to account for Render cold start
});

/**
 * Helper to perform API requests with retry logic for Render's cold start.
 */
export const request = async (config, retries = 3) => {
  try {
    console.log(`[API] Executing: ${config.method} ${config.url}`);
    return await axiosInstance(config);
  } catch (error) {
    if (retries > 0 && (!error.response || error.response.status >= 500)) {
      console.warn(`[API] Link unstable. Retrying in 2s... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return request(config, retries - 1);
    }
    throw error;
  }
};

export default API_BASE_URL;
