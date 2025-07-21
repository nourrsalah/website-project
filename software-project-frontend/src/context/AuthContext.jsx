import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 new

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    document.cookie = "token=; Max-Age=0";
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        login(res.data);
      } catch (err) {
        console.warn("No active session");
      } finally {
        setLoading(false); // ✅ mark done
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

