import axios from "axios";
import {create} from "zustand";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set)=>({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: false,

    signup: async(email, password, name)=>{
        set({isLoading:true, error: null});
        try {
            const response = await axios.post(`${API_URL}/signup`, {email, password, name});
            set({user: response.data.user, isAuthenticated: true, isLoading:false});
            return response.data;
        } catch (error) {
            set({error: error.message || "error signing up", isLoading:false});
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({isLoading:true, error:null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`, {code});
            set({user: response.data.user, isAuthenticated: true, isLoading:false});
            return response.data
        } catch (error) {
            set({error: error.message || "error signing up", isLoading:false});
            throw error;
        }
    },

    login: async (email, password) => {
        set({isLoading:true, error:null});
        console.log(import.meta.env.MODE)
        try {
            const response = await axios.post(`${API_URL}/login`, {email, password});
            set({user: response.data.user, isAuthenticated: true, isLoading:false});
            return response.data
        } catch (error) {
            set({error: error.message || "error logging in", isLoading:false});
            throw error;
        }
       
    },

    logout: async () => {
        set({isCheckingAuth:true, error: null});
        try {
            const response = await axios.post(`${API_URL}/logout`);
            set({user: response.data.user, isAuthenticated: false, isCheckingAuth:false});
        } catch (error) {
            set({error: null, isAuthenticated: false, isCheckingAuth:false});
            throw error;
        }
    },

    forgotPassword: async(email)=>{
        set({isLoading:true, error: null});
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {email});
            set({user: response.data.user, isAuthenticated: true, isLoading:false});
            return response.data;
        } catch (error) {
            set({error: error.message || "error signing up", isLoading:false});
            throw error;
        }
    },

    checkAuth: async () => {
        set({isCheckingAuth: true, error: null});
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
        } catch (error) {
            set({error: null, isAuthenticated:false, isCheckingAuth:false});
        }
    },

}))