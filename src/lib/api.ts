// API configuration and types
import axios from "axios";

import { getSession } from "next-auth/react";

// import { config } from "process";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

//create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});
//add request interceptor to access token form next-auth session

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `${session.accessToken}`;
    } else {
      console.warn("no token in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);


