import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialized = useRef(false);

  useEffect(() => {
    // 1. Extract the 'code' from the URL returned by Google
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (!code) {
      // No code found in URL
      navigate("/login");
      return;
    }

    // Safety: ensure the backend call runs exactly once per mount.
    if (initialized.current) return;
    initialized.current = true;

    // 2. Send the authorization code to your Django backend
    console.log("SENDING CODE TO BACKEND:", code);
    axios
      .post(`${API_BASE_URL}/api/auth/google/`, { code })
      .then((response) => {
        // 3. Success! Extract JWT tokens
        // dj-rest-auth usually returns 'access' and 'refresh'
        const refresh = response.data.refresh || response.data.refresh_token;
        const access =
          response.data.access || response.data.access_token;

        if (!access || !refresh) {
          console.error("Missing tokens received from backend", response.data);
          navigate("/login?error=no_token");
          return;
        }

        // 4. Save tokens for your AuthProvider (expects access/refresh)
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        // Also store alternative keys in case other parts of the app expect them.
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        // Force reload so AuthContext picks up updated localStorage immediately.
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(
          "Google Auth Failed:",
          error.response?.status,
          error.response?.data || error.message,
        );
        navigate("/login?error=auth_failed");
      });
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">
        Verifying Google account...
      </h2>
      <p className="text-gray-500">
        Please wait while we complete your sign-in.
      </p>
    </div>
  );
};

export default GoogleCallback;
