// get authentication functions from backend

import { create } from 'zustand'; //provides functions like set()
import axios from 'axios';

const API_URL = "http://localhost:5001/api/auth"; //backend url

axios.defaults.withCredentials = true; //to allow cookies to be sent with requests

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  //signup
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null }); //start loading while signing up
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  //to fetch user data, implement a checkAuth function
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null }); //start checking auth
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  //login
  login: async( email, password ) => {
    set({ isLoading: true, error: null }); //start loading while logging in
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  //logout
  logout: async () => {
    set({ isLoading: true, error: null }); //start loading while logging out
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  }

}))

