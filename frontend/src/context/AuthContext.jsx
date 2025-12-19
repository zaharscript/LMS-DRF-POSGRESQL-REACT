import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    if (token) loadUser();
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get("/me/");
      setUser(res.data);
    } catch {
      logout();
    }
  };

  const login = async (username, password) => {
    const res = await api.post("/token/", { username, password });
    localStorage.setItem("accessToken", res.data.access);
    setToken(res.data.access);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
