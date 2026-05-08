import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://yourdomain.com', // Real URL goes here later
    headers: { 'Content-Type': 'application/json' }
});

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        // You can also dispatch a global logout action here
      } else if (status === 500) {
        console.error("Server error. Please try again later.");
      }
    }
    return Promise.reject(error);
  }
);
