import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/"); // dashboard
    } catch (err) {
      console.log(err.response?.data);
      setError(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      console.log("GOOGLE CREDENTIAL RECEIVED:", credentialResponse.credential);
      const res = await axios.post(`${API_BASE_URL}/api/auth/google/`, {
        id_token: credentialResponse.credential,
        redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/login/callback`,
      });

      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      window.location.href = "/";
    } catch (err) {
      console.error("Google Login Error:", err.response?.data || err.message);
      setError("Google Authentication Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* ... (left side content omitted for brevity, keeping existing structure) ... */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 p-12 text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">StudyPlan</h1>
          <p className="text-lg opacity-90">
            Build meaningful learning habits and track your progress.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.error("Login Failed");
                  setError("Google Login Failed");
                }}
                useOneTap
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
