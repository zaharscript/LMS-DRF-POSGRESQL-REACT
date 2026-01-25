import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh")
  );
  const [user, setUser] = useState(null);

  const isAuthenticated = !!accessToken;

  // Load user when token changes
  useEffect(() => {
    if (accessToken) {
      loadUser();
    } else {
      setUser(null);
    }
  }, [accessToken]);

  // ✅ dj-rest-auth user endpoint
  const loadUser = async () => {
    try {
      const res = await api.get("/auth/user/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user", err);
      logout();
    }
  };

  // ✅ dj-rest-auth login (EMAIL + PASSWORD)
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login/", {
        email,
        password,
      });

      const { access_token, refresh_token } = res.data;

      localStorage.setItem("access", access_token);
      localStorage.setItem("refresh", refresh_token);

      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = async () => {
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
