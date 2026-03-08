import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Extract the 'code' from the URL returned by Google
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      // 2. Send the authorization code to your Django backend
      axios
        .post("http://localhost:8000/api/auth/google/", {
          code: code,
        })
        .then((response) => {
          // 3. Success! Extract JWT tokens
          // dj-rest-auth usually returns 'access' and 'refresh'
          const { refresh, access } = response.data;

          // Fallback in case your backend uses 'access_token' naming
          const accessToken = access || response.data.access_token;

          if (accessToken) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refresh);

            // 4. Redirect to home/dashboard
            // Using window.location.href forces a reload so AuthContext
            // can pick up the new tokens from localStorage immediately.
            window.location.href = "/";
          } else {
            console.error("No access token received from backend");
            navigate("/login?error=no_token");
          }
        })
        .catch((error) => {
          console.error(
            "Google Auth Failed:",
            error.response?.data || error.message,
          );
          navigate("/login?error=auth_failed");
        });
    } else {
      // No code found in URL
      navigate("/login");
    }
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
