import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const useAxiosSecureInstance = () => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use((config) => {
      const token = user?.accessToken;
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          console.log("Unauthorized - logging out user");
          signOutUser().then(() => {
            navigate("/login");
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, signOutUser, navigate]);

  return instance;
};

export default useAxiosSecureInstance;
