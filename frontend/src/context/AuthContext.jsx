import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("access")
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refresh")
  );
  const [user, setUser] = useState(null);

  const isAuthenticated = !!accessToken;

  // Load user on mount or when accessToken changes
  useEffect(() => {
    if (accessToken) loadUser();
    else setUser(null);
  }, [accessToken]);

  const loadUser = async () => {
    try {
      const res = await api.get("/me/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post("/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setAccessToken(res.data.access);
      setRefreshToken(res.data.refresh);
      await loadUser();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        refreshToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
