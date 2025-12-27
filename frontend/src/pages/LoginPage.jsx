import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/"); // go to dashboard
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* LEFT IMAGE / BRAND */}
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

      {/* MOBILE HERO IMAGE */}
      <div
        className="md:hidden w-full h-56 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1498079022511-d15614cb1c02)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 p-6 text-white">
          <h1 className="text-3xl font-bold">StudyPlan</h1>
          <p className="text-sm opacity-90">
            Learn smarter. Track your progress. Stay consistent.
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>

          <p className="text-gray-500 mb-6">
            Don’t have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Create one
            </span>
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          </form>

          <div className="text-sm text-center mt-6 text-gray-500 hover:underline cursor-pointer">
            Recover password
          </div>
        </div>
      </div>
    </div>
  );
}
