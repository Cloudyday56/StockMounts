// get authentication functions from backend

import { create } from "zustand"; //provides functions like set()
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true; //to allow cookies to be sent with requests

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  message: null,

  //signup
  signup: async (email, password, fullName) => {
    set({ isLoading: true, error: null }); //start loading while signing up
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        fullName,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
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
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  //login
  login: async (email, password) => {
    set({ isLoading: true, error: null }); //start loading while logging in
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data.user);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
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
      toast.success("Logged out successfully");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true }); //set loading state
    try {
      const response = await axios.put(`${API_URL}/update-profile`, data); //send the profile update request
      set({
        user: response.data.user,
        isAuthenticated: true,
        isUpdatingProfile: false,
        error: null,
      }); //update user state with new profile data
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false }); //reset loading state
    }
  },

  // delete user account
  deleteAccount: async () => {
    try {
      await axios.delete(`${API_URL}/delete-account`); //send request to backend endpoint
      set({ user: null, isAuthenticated: false, error: null }); // Reset auth user state
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Error deleting account. Please try again.");
    }
  },
}));
